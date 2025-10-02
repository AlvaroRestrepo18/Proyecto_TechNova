import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faSpinner, faPlus } from '@fortawesome/free-solid-svg-icons';
import './NuevaVenta.css';

const API_VENTAS_URL = "https://localhost:7228/api/Ventas";
const API_CLIENTES_URL = "https://localhost:7228/api/Clientes";
const API_PRODUCTOS_URL = "https://localhost:7228/api/Productos/lista-simple";
const API_SERVICIOS_URL = "https://localhost:7228/api/Servicios/lista-simple";

const NuevaVenta = ({ onClose, onSave }) => {
  // 📌 Estado principal
  const [clientes, setClientes] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);

  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);

  // Estados auxiliares para selects
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState(1);
  const [servicioSeleccionado, setServicioSeleccionado] = useState('');

  // Totales
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ⚡ Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clientesRes, productosRes, serviciosRes] = await Promise.all([
          axios.get(API_CLIENTES_URL),
          axios.get(API_PRODUCTOS_URL),
          axios.get(API_SERVICIOS_URL),
        ]);
        setClientes(clientesRes.data);
        setProductosDisponibles(productosRes.data);
        setServiciosDisponibles(serviciosRes.data);
      } catch (err) {
        console.error("❌ Error cargando datos iniciales:", err);
        setError("Error cargando clientes, productos o servicios.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 📌 Recalcular totales cuando cambian items
  useEffect(() => {
    const subtotalProductos = productosSeleccionados.reduce(
      (sum, p) => sum + p.cantidad * p.precioUnitario,
      0
    );
    const subtotalServicios = serviciosSeleccionados.reduce(
      (sum, s) => sum + s.precioUnitario,
      0
    );

    const nuevoSubtotal = subtotalProductos + subtotalServicios;
    const nuevoIva = nuevoSubtotal * 0.19; // 19%
    const nuevoTotal = nuevoSubtotal + nuevoIva - descuento;

    setSubtotal(nuevoSubtotal);
    setIva(nuevoIva);
    setTotal(nuevoTotal);
  }, [productosSeleccionados, serviciosSeleccionados, descuento]);

  // 📌 Agregar producto
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
          id: producto.id,
          nombre: producto.nombre,
          cantidad: cantidadProducto,
          precioUnitario: producto.precio,
        },
      ]);
    }

    setProductoSeleccionado('');
    setCantidadProducto(1);
  };

  // 📌 Agregar servicio
  const agregarServicio = () => {
    if (!servicioSeleccionado) return;
    const servicio = serviciosDisponibles.find(s => s.id === parseInt(servicioSeleccionado));
    if (!servicio) return;

    if (!serviciosSeleccionados.find(s => s.id === servicio.id)) {
      setServiciosSeleccionados([
        ...serviciosSeleccionados,
        {
          id: servicio.id,
          nombre: servicio.nombre,
          precioUnitario: servicio.precio,
          detalles: servicio.descripcion || `Servicio: ${servicio.nombre}`,
        },
      ]);
    }

    setServicioSeleccionado('');
  };

  // 📌 Quitar item
  const quitarItem = (id, tipo) => {
    if (tipo === 'producto') {
      setProductosSeleccionados(productosSeleccionados.filter(p => p.id !== id));
    } else {
      setServiciosSeleccionados(serviciosSeleccionados.filter(s => s.id !== id));
    }
  };

  // 📌 Actualizar cantidad producto
  const actualizarCantidad = (id, cantidad) => {
    if (cantidad < 1) return;
    setProductosSeleccionados(
      productosSeleccionados.map(p =>
        p.id === id ? { ...p, cantidad } : p
      )
    );
  };

  // 📌 Guardar venta en backend
  const handleGuardar = async () => {
    if (!clienteSeleccionado) {
      alert("Seleccione un cliente");
      return;
    }
    if (productosSeleccionados.length === 0 && serviciosSeleccionados.length === 0) {
      alert("Agregue al menos un producto o servicio");
      return;
    }

    const payload = {
      fkCliente: parseInt(clienteSeleccionado),
      fecha: new Date().toISOString().split("T")[0],
      subtotal: parseFloat(subtotal.toFixed(2)),
      iva: parseFloat(iva.toFixed(2)),
      descuento: parseFloat(descuento.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      estado: true,
      productoxventa: productosSeleccionados.map(p => ({
        fkProducto: p.id,
        cantidad: p.cantidad,
        valorUnitario: p.precioUnitario,
        valorTotal: p.cantidad * p.precioUnitario,
      })),
      servicioxventa: serviciosSeleccionados.map(s => ({
        fkServicio: s.id,
        precio: s.precioUnitario,
        detalles: s.detalles,
        valorTotal: s.precioUnitario,
      })),
    };

    console.log("🚀 Payload enviado:", payload);

    try {
      setLoading(true);
      const res = await axios.post(API_VENTAS_URL, payload);
      onSave(res.data);

      // reset
      setClienteSeleccionado('');
      setProductosSeleccionados([]);
      setServiciosSeleccionados([]);
      setSubtotal(0);
      setIva(0);
      setTotal(0);

      onClose();
    } catch (err) {
      console.error("❌ Error guardando venta:", err);
      alert("Error al guardar la venta");
    } finally {
      setLoading(false);
    }
  };

  // 📌 UI
  const todosLosItems = [
    ...productosSeleccionados.map(p => ({ ...p, tipo: 'producto' })),
    ...serviciosSeleccionados.map(s => ({ ...s, tipo: 'servicio', cantidad: 1 })),
  ];

  return (
    <div className="modal-overlay nueva-venta-overlay" onClick={onClose}>
      <div className="modal-content nueva-venta-container grande" onClick={(e) => e.stopPropagation()}>
        <div className="nueva-venta-header">
          <h2>Nueva Venta</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label>Cliente:</label>
          <select
            value={clienteSeleccionado}
            onChange={(e) => setClienteSeleccionado(e.target.value)}
          >
            <option value="">-- Seleccione un cliente --</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre} {c.apellido || ''} - {c.documento || ''}
              </option>
            ))}
          </select>
        </div>

        <div className="tabs-header">
          <button className="tab active">Productos</button>
        </div>

        <div className="tab-panel">
          <h3>Agregar Producto</h3>
          <div className="select-group">
            <select
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(e.target.value)}
            >
              <option value="">-- Seleccione un producto --</option>
              {productosDisponibles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre} - ${p.precio}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={cantidadProducto}
              onChange={(e) => setCantidadProducto(parseInt(e.target.value))}
            />
            <button onClick={agregarProducto}>
              <FontAwesomeIcon icon={faPlus} /> Agregar
            </button>
          </div>
        </div>

        <div className="tab-panel">
          <h3>Agregar Servicio</h3>
          <div className="select-group">
            <select
              value={servicioSeleccionado}
              onChange={(e) => setServicioSeleccionado(e.target.value)}
            >
              <option value="">-- Seleccione un servicio --</option>
              {serviciosDisponibles.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nombre} - ${s.precio}
                </option>
              ))}
            </select>
            <button onClick={agregarServicio}>
              <FontAwesomeIcon icon={faPlus} /> Agregar
            </button>
          </div>
        </div>

        <h3>Items Agregados</h3>
        {todosLosItems.length === 0 ? (
          <p>No hay items agregados</p>
        ) : (
          <table className="items-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {todosLosItems.map((item, index) => (
                <tr key={`${item.tipo}-${item.id}-${index}`}>
                  <td>{item.tipo}</td>
                  <td>{item.nombre}</td>
                  <td>
                    {item.tipo === 'producto' ? (
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => actualizarCantidad(item.id, parseInt(e.target.value))}
                      />
                    ) : (
                      1
                    )}
                  </td>
                  <td>${item.precioUnitario}</td>
                  <td>${(item.precioUnitario * item.cantidad).toFixed(2)}</td>
                  <td>
                    <button onClick={() => quitarItem(item.id, item.tipo)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="totals">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>IVA (19%): ${iva.toFixed(2)}</p>
          <p>Descuento: ${descuento.toFixed(2)}</p>
          <h3>Total: ${total.toFixed(2)}</h3>
        </div>

        <div className="form-actions">
          <button className="cancel-button" onClick={onClose}>Cancelar</button>
          <button className="submit-button" onClick={handleGuardar} disabled={loading}>
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Guardar Venta"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuevaVenta;
