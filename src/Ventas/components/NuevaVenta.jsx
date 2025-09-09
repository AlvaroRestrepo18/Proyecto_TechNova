import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './NuevaVenta.css';

// Importar servicios
import { 
  getProductos, 
  getServicios, 
  getClientes,
  createVenta,
  addProductoToVenta,
  addServicioToVenta
} from '../services/ventas';

const NuevaVenta = ({ onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState("productos");
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState(1);
  const [servicioSeleccionado, setServicioSeleccionado] = useState('');
  
  // Estados para datos de la API
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [clientesDisponibles, setClientesDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    fetchDatosIniciales();
  }, []);

  const fetchDatosIniciales = async () => {
    setLoading(true);
    try {
      const [productosData, serviciosData, clientesData] = await Promise.all([
        getProductos(),
        getServicios(),
        getClientes()
      ]);
      
      setProductosDisponibles(productosData);
      setServiciosDisponibles(serviciosData);
      setClientesDisponibles(clientesData);
    } catch (err) {
      setError("Error al cargar los datos iniciales");
      console.error("Error fetching initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  const agregarProducto = () => {
    if (!productoSeleccionado) return;
    
    const producto = productosDisponibles.find(p => p.id === parseInt(productoSeleccionado));
    if (!producto) return;
    
    const existente = productosSeleccionados.find(p => p.id === producto.id);
    
    if (existente) {
      setProductosSeleccionados(
        productosSeleccionados.map(p => 
          p.id === producto.id 
            ? { ...p, cantidad: p.cantidad + cantidadProducto } 
            : p
        )
      );
    } else {
      setProductosSeleccionados([
        ...productosSeleccionados, 
        { 
          ...producto, 
          cantidad: cantidadProducto,
          precioUnitario: producto.precio,
          valorUnitario: producto.precio
        }
      ]);
    }
    
    // Resetear selección
    setProductoSeleccionado('');
    setCantidadProducto(1);
  };

  const agregarServicio = () => {
    if (!servicioSeleccionado) return;
    
    const servicio = serviciosDisponibles.find(s => s.id === parseInt(servicioSeleccionado));
    if (!servicio) return;
    
    if (!serviciosSeleccionados.find(s => s.id === servicio.id)) {
      setServiciosSeleccionados([
        ...serviciosSeleccionados, 
        { 
          ...servicio, 
          precioUnitario: servicio.precio,
          valorUnitario: servicio.precio,
          cantidad: 1,
          detalles: servicio.descripcion || `Servicio: ${servicio.nombre}`
        }
      ]);
    }
    
    // Resetear selección
    setServicioSeleccionado('');
  };

  const quitarItem = (id, tipo) => {
    if (tipo === 'producto') {
      setProductosSeleccionados(productosSeleccionados.filter(p => p.id !== id));
    } else {
      setServiciosSeleccionados(serviciosSeleccionados.filter(s => s.id !== id));
    }
  };

  const actualizarCantidad = (id, cantidad) => {
    if (cantidad < 1) return;
    setProductosSeleccionados(
      productosSeleccionados.map(p => 
        p.id === id ? { ...p, cantidad } : p
      )
    );
  };

  const calcularTotal = () => {
    const totalProductos = productosSeleccionados.reduce((sum, p) => sum + (p.precioUnitario * p.cantidad), 0);
    const totalServicios = serviciosSeleccionados.reduce((sum, s) => sum + s.precioUnitario, 0);
    return totalProductos + totalServicios;
  };

  const handleGuardar = async () => {
    if (!clienteId) {
      alert('Por favor seleccione un cliente');
      return;
    }

    if (productosSeleccionados.length === 0 && serviciosSeleccionados.length === 0) {
      alert('Por favor agregue al menos un producto o servicio');
      return;
    }

    setLoading(true);
    try {
      // Crear objeto de venta para la API
      const ventaData = {
        clienteId: parseInt(clienteId),
        fecha: new Date().toISOString().split('T')[0],
        total: calcularTotal(),
        metodoPago: metodoPago
      };

      // 1. Crear la venta principal
      const nuevaVenta = await createVenta(ventaData);
      
      // 2. Agregar productos a la venta
      for (const producto of productosSeleccionados) {
        const productoData = {
          productoId: producto.id,
          cantidad: producto.cantidad,
          valorUnitario: producto.precioUnitario,
          valorTotal: producto.precioUnitario * producto.cantidad
        };
        await addProductoToVenta(nuevaVenta.id, productoData);
      }

     // 3. Agregar servicios a la venta - FORMATO CORREGIDO
for (const servicio of serviciosSeleccionados) {
  // Crear el objeto en el formato que espera la API (sin la propiedad servicioxventum)
  const servicioData = {
    servicioId: servicio.id,
    cantidad: 1,
    valorUnitario: servicio.precioUnitario,
    valorTotal: servicio.precioUnitario,
    detalles: servicio.detalles || `Servicio: ${servicio.nombre}`
  };
  
  await addServicioToVenta(nuevaVenta.id, servicioData);
}

      // Notificar al componente padre
      onSave(nuevaVenta);
      
    } catch (err) {
      setError("Error al guardar la venta");
      console.error("Error saving venta:", err);
      
      // Mostrar detalles del error específico
      if (err.response && err.response.data) {
        console.error("Detalles del error:", err.response.data);
        alert(`Error: ${JSON.stringify(err.response.data.errors || err.response.data)}`);
      } else {
        alert("Error al guardar la venta. Por favor intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Combinar todos los items para mostrar en la tabla
  const todosLosItems = [
    ...productosSeleccionados.map(p => ({ ...p, tipo: 'producto' })),
    ...serviciosSeleccionados.map(s => ({ ...s, tipo: 'servicio', cantidad: 1 }))
  ];

  if (loading && !productosDisponibles.length) {
    return (
      <div className="modal-overlay nueva-venta-overlay" onClick={onClose}>
        <div className="modal-content nueva-venta-container grande" onClick={e => e.stopPropagation()}>
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin /> Cargando datos...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay nueva-venta-overlay" onClick={onClose}>
      <div className="modal-content nueva-venta-container grande" onClick={e => e.stopPropagation()}>
        <div className="nueva-venta-header">
          <h2>Crear Nueva Venta</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="nueva-venta-body">
          {error && (
            <div className="error-message">
              {error}
              <button onClick={fetchDatosIniciales}>Reintentar</button>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Cliente:</label>
              <select 
                value={clienteId} 
                onChange={(e) => setClienteId(e.target.value)}
                className="cliente-select"
                required
              >
                <option value="">-- Seleccione un cliente --</option>
                {clientesDisponibles.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellido || ''} - {cliente.documento || ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Método de Pago:</label>
              <select 
                value={metodoPago} 
                onChange={(e) => setMetodoPago(e.target.value)}
                className="pago-select"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>
          </div>

          <div className="nueva-venta-content">
            {/* Panel izquierdo para seleccionar items */}
            <div className="seleccion-panel">
              <div className="tabs-header">
                <button 
                  className={`tab ${activeTab === 'productos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('productos')}
                >
                  Productos
                </button>
                <button 
                  className={`tab ${activeTab === 'servicios' ? 'active' : ''}`}
                  onClick={() => setActiveTab('servicios')}
                >
                  Servicios
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'productos' && (
                  <div className="tab-panel">
                    <h3>Agregar Producto</h3>
                    <div className="select-group">
                      <label>Seleccionar Producto:</label>
                      <select 
                        value={productoSeleccionado} 
                        onChange={(e) => setProductoSeleccionado(e.target.value)}
                        className="item-select"
                      >
                        <option value="">-- Seleccione un producto --</option>
                        {productosDisponibles.map(producto => (
                          <option key={producto.id} value={producto.id}>
                            {producto.nombre} - ${producto.precio}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="select-group">
                      <label>Cantidad:</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={cantidadProducto}
                        onChange={(e) => setCantidadProducto(parseInt(e.target.value) || 1)}
                        className="cantidad-input"
                      />
                    </div>

                    <button 
                      className="add-item-button"
                      onClick={agregarProducto}
                      disabled={!productoSeleccionado}
                    >
                      Agregar Producto
                    </button>
                  </div>
                )}

                {activeTab === 'servicios' && (
                  <div className="tab-panel">
                    <h3>Agregar Servicio</h3>
                    <div className="select-group">
                      <label>Seleccionar Servicio:</label>
                      <select 
                        value={servicioSeleccionado} 
                        onChange={(e) => setServicioSeleccionado(e.target.value)}
                        className="item-select"
                      >
                        <option value="">-- Seleccione un servicio --</option>
                        {serviciosDisponibles.map(servicio => (
                          <option key={servicio.id} value={servicio.id}>
                            {servicio.nombre} - ${servicio.precio}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button 
                      className="add-item-button"
                      onClick={agregarServicio}
                      disabled={!servicioSeleccionado}
                    >
                      Agregar Servicio
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Panel derecho para mostrar items agregados */}
            <div className="items-panel">
              <h3>Items Agregados</h3>
              
              {todosLosItems.length === 0 ? (
                <p className="no-items">No hay items agregados</p>
              ) : (
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todosLosItems.map((item, index) => (
                      <tr key={`${item.tipo}-${item.id}-${index}`}>
                        <td>{item.tipo === 'producto' ? 'Producto' : 'Servicio'}</td>
                        <td>{item.nombre}</td>
                        <td>
                          {item.tipo === 'producto' ? (
                            <input 
                              type="number" 
                              min="1" 
                              value={item.cantidad}
                              onChange={(e) => actualizarCantidad(item.id, parseInt(e.target.value))}
                              className="cantidad-input-table"
                            />
                          ) : (
                            <span>1</span>
                          )}
                        </td>
                        <td>${item.precioUnitario?.toFixed(2) || '0.00'}</td>
                        <td>${((item.precioUnitario || 0) * item.cantidad).toFixed(2)}</td>
                        <td>
                          <button 
                            className="remove-item-button"
                            onClick={() => quitarItem(item.id, item.tipo)}
                            title="Eliminar"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="totals-section">
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>${calcularTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="cancel-button" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button 
              className="submit-button" 
              onClick={handleGuardar}
              disabled={loading || !clienteId || todosLosItems.length === 0}
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Guardar Venta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevaVenta;