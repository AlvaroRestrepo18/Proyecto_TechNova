import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './NuevaVenta.css';

import {
  getProductos,
  getServicios,
  getClientes,
  createVenta,
  addProductoToVenta,
  addServicioToVenta
} from '../services/ventas';

const NuevaVenta = ({ onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('productos');
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState(1);
  const [servicioSeleccionado, setServicioSeleccionado] = useState('');
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [clientesDisponibles, setClientesDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const makeLocalId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productos, servicios, clientes] = await Promise.all([
          getProductos(),
          getServicios(),
          getClientes()
        ]);

        setProductosDisponibles(productos || []);
        setServiciosDisponibles(servicios || []);
        setClientesDisponibles(clientes || []);
      } catch (err) {
        console.error('❌ Error al cargar datos:', err);
        setError('Error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const agregarProducto = () => {
    if (!productoSeleccionado) {
      alert('❌ Seleccione un producto.');
      return;
    }

    const producto = productosDisponibles.find(p => p.id === Number(productoSeleccionado));
    if (!producto) {
      alert('❌ Producto no encontrado.');
      return;
    }

    const cantidad = Math.max(1, Number(cantidadProducto));
    const precio = producto.precioUnitario || producto.precio || producto.valorUnitario || 0;

    setProductosSeleccionados(prev => {
      const existente = prev.find(p => p.productoId === producto.id);
      if (existente) {
        return prev.map(p =>
          p.productoId === producto.id
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p
        );
      }
      return [
        ...prev,
        {
          localId: makeLocalId(),
          productoId: producto.id,
          nombre: producto.nombre,
          cantidad,
          valorUnitario: precio
        }
      ];
    });

    setProductoSeleccionado('');
    setCantidadProducto(1);
  };

  const agregarServicio = () => {
    if (!servicioSeleccionado) {
      alert('❌ Seleccione un servicio.');
      return;
    }

    const servicio = serviciosDisponibles.find(s => s.id === Number(servicioSeleccionado));
    if (!servicio) {
      alert('❌ Servicio no encontrado.');
      return;
    }

    const precio = servicio.precioUnitario || servicio.precio || servicio.valorUnitario || 0;

    setServiciosSeleccionados(prev => {
      const existente = prev.find(s => s.fkServicio === servicio.id);
      if (existente) {
        return prev.map(s =>
          s.fkServicio === servicio.id
            ? { ...s, cantidad: s.cantidad + 1 }
            : s
        );
      }
      return [
        ...prev,
        {
          localId: makeLocalId(),
          fkServicio: servicio.id,
          nombre: servicio.nombre,
          cantidad: 1,
          precio: precio
        }
      ];
    });

    setServicioSeleccionado('');
  };

  const quitarItem = (localId, tipo) => {
    if (tipo === 'producto') {
      setProductosSeleccionados(prev => prev.filter(p => p.localId !== localId));
    } else {
      setServiciosSeleccionados(prev => prev.filter(s => s.localId !== localId));
    }
  };

  const actualizarCantidad = (localId, cantidad) => {
    const nuevaCantidad = Math.max(1, Number(cantidad));
    setProductosSeleccionados(prev =>
      prev.map(p =>
        p.localId === localId ? { ...p, cantidad: nuevaCantidad } : p
      )
    );
  };

  const calcularTotal = () => {
    const totalProductos = productosSeleccionados.reduce(
      (acc, p) => acc + p.cantidad * p.valorUnitario,
      0
    );
    const totalServicios = serviciosSeleccionados.reduce(
      (acc, s) => acc + s.cantidad * s.precio,
      0
    );
    return (totalProductos + totalServicios).toFixed(2);
  };

  const handleGuardar = async () => {
    console.log('🔍 Cliente seleccionado ID:', clienteId);

    if (!clienteId || clienteId === "" || clienteId === "0") {
      alert('❌ Debe seleccionar un cliente.');
      return;
    }

    if (productosSeleccionados.length === 0 && serviciosSeleccionados.length === 0) {
      alert('❌ Agregue al menos un producto o servicio.');
      return;
    }

    try {
      setGuardando(true);

      // ✅ PASO 1: Crear VENTA BASE
      const ventaData = {
        id: 0,
        ClienteId: Number(clienteId),
        fecha: new Date().toISOString().split('T')[0],
        total: Number(calcularTotal()),
        estado: true
      };

      console.log('📤 Creando venta...', ventaData);
      const ventaCreada = await createVenta(ventaData);
      console.log('✅ Venta creada COMPLETA:', ventaCreada);
      
      const ventaId = ventaCreada?.Id || ventaCreada?.id;
      console.log('🔍 Venta ID encontrado:', ventaId);

      if (!ventaId) {
        console.error('❌ No se pudo encontrar el ID en:', ventaCreada);
        throw new Error("No se pudo obtener el ID de la venta creada");
      }

      console.log('🔍 Usando Venta ID:', ventaId);

      // ✅ PASO 2: Agregar PRODUCTOS
      if (productosSeleccionados.length > 0) {
        console.log('📤 Agregando productos a venta ID:', ventaId);
        for (const producto of productosSeleccionados) {
          const productoData = {
            ProductoId: producto.productoId,
            VentaId: ventaId,
            Cantidad: producto.cantidad,
            ValorUnitario: producto.valorUnitario,
            ValorTotal: producto.cantidad * producto.valorUnitario
          };
          console.log('🚀 ENVIANDO PRODUCTO:', productoData);
          await addProductoToVenta(ventaId, productoData);
        }
      }

      // ✅ PASO 3: Agregar SERVICIOS
      if (serviciosSeleccionados.length > 0) {
        console.log('📤 Agregando servicios a venta ID:', ventaId);
        for (const servicio of serviciosSeleccionados) {
          const servicioData = {
            FkServicio: servicio.fkServicio,
            FkVenta: ventaId,
            Precio: servicio.precio,
            Detalles: `Servicio: ${servicio.nombre}`,
            ValorTotal: servicio.cantidad * servicio.precio
          };
          console.log('🚀 ENVIANDO SERVICIO:', servicioData);
          await addServicioToVenta(ventaId, servicioData);
        }
      }

      alert('🎉 ¡Venta creada CORRECTAMENTE!');
      
      if (onSave) onSave();
      if (onClose) onClose();
      
    } catch (err) {
      console.error('❌ Error completo en handleGuardar:', err);
      
      if (err.response?.data?.errors) {
        const errores = err.response.data.errors;
        let mensajeError = '❌ ERRORES DE VALIDACIÓN:\n\n';
        for (const [campo, mensajes] of Object.entries(errores)) {
          mensajeError += `🔸 ${campo}: ${mensajes.join(', ')}\n`;
        }
        alert(mensajeError);
        console.log('📋 ERRORES COMPLETOS:', errores);
      } 
      else if (err.response?.data) {
        console.log('📋 RESPUESTA COMPLETA DEL ERROR:', err.response.data);
        alert(`❌ Error: ${JSON.stringify(err.response.data)}`);
      }
      else {
        alert(`❌ Error: ${err.message}`);
      }
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay nueva-venta-overlay">
        <div className="modal-content nueva-venta-container grande">
          <p className="loading">
            <FontAwesomeIcon icon={faSpinner} spin /> Cargando...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay nueva-venta-overlay">
        <div className="modal-content nueva-venta-container grande">
          <p className="error">{error}</p>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay nueva-venta-overlay" onClick={() => !loading && onClose?.()}>
      <div className="modal-content nueva-venta-container grande" onClick={e => e.stopPropagation()}>
        <div className="nueva-venta-header">
          <h2>Nueva Venta</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="nueva-venta-body nueva-venta-content">
          {/* PANEL IZQUIERDO: Selección */}
          <div className="seleccion-panel">
            {/* Cliente */}
            <div className="select-group">
              <label>Cliente: *</label>
              <select
                className="cliente-input"
                value={clienteId}
                onChange={e => setClienteId(e.target.value)}
              >
                <option value="">-- Seleccione cliente --</option>
                {clientesDisponibles.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} {c.apellido} ({c.documento})
                  </option>
                ))}
              </select>
            </div>

            {/* Tabs */}
            <div className="tabs-header">
              <button className={`tab ${activeTab === 'productos' ? 'active' : ''}`} onClick={() => setActiveTab('productos')}>
                Productos
              </button>
              <button className={`tab ${activeTab === 'servicios' ? 'active' : ''}`} onClick={() => setActiveTab('servicios')}>
                Servicios
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'productos' && (
                <div className="tab-panel">
                  <h3>Agregar Producto</h3>
                  <div className="add-item-controls">
                    <select className="item-select" value={productoSeleccionado} onChange={e => setProductoSeleccionado(e.target.value)}>
                      <option value="">-- Seleccione producto --</option>
                      {productosDisponibles.map(p => {
                        const precio = p.precioUnitario || p.precio || 0;
                        return (
                          <option key={p.id} value={p.id}>
                            {p.nombre} - ${precio.toFixed(2)}
                          </option>
                        );
                      })}
                    </select>
                    <input className="cantidad-input" type="number" min="1" value={cantidadProducto} onChange={e => setCantidadProducto(e.target.value)} />
                    <button className="add-item-button" onClick={agregarProducto}>Agregar</button>
                  </div>
                </div>
              )}

              {activeTab === 'servicios' && (
                <div className="tab-panel">
                  <h3>Agregar Servicio</h3>
                  <div className="add-item-controls">
                    <select className="item-select" value={servicioSeleccionado} onChange={e => setServicioSeleccionado(e.target.value)}>
                      <option value="">-- Seleccione servicio --</option>
                      {serviciosDisponibles.map(s => {
                        const precio = s.precioUnitario || s.precio || 0;
                        return (
                          <option key={s.id} value={s.id}>
                            {s.nombre} - ${precio.toFixed(2)}
                          </option>
                        );
                      })}
                    </select>
                    <button className="add-item-button" onClick={agregarServicio}>Agregar</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PANEL DERECHO: Items agregados */}
          <div className="items-panel">
            <h3>Items Agregados</h3>
            {(productosSeleccionados.length === 0 && serviciosSeleccionados.length === 0) ? (
              <p className="no-items">No hay items.</p>
            ) : (
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {productosSeleccionados.map(p => (
                    <tr key={p.localId}>
                      <td>Producto</td>
                      <td>{p.nombre}</td>
                      <td>
                        <input className="cantidad-input-table" type="number" min="1" value={p.cantidad} onChange={e => actualizarCantidad(p.localId, e.target.value)} />
                      </td>
                      <td>${p.valorUnitario.toFixed(2)}</td>
                      <td>${(p.cantidad * p.valorUnitario).toFixed(2)}</td>
                      <td>
                        <button className="remove-item-button" onClick={() => quitarItem(p.localId, 'producto')}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {serviciosSeleccionados.map(s => (
                    <tr key={s.localId}>
                      <td>Servicio</td>
                      <td>{s.nombre}</td>
                      <td>{s.cantidad}</td>
                      <td>${s.precio.toFixed(2)}</td>
                      <td>${(s.precio * s.cantidad).toFixed(2)}</td>
                      <td>
                        <button className="remove-item-button" onClick={() => quitarItem(s.localId, 'servicio')}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Totales */}
            <div className="totals-section">
              <div className="total-row">
                <span>Total:</span>
                <span className="grand-total">${calcularTotal()}</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="form-actions">
              <button className="cancel-button" onClick={onClose}>Cancelar</button>
              <button className="submit-button" onClick={handleGuardar} disabled={guardando || !clienteId}>
                {guardando ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Guardar Venta'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevaVenta;
