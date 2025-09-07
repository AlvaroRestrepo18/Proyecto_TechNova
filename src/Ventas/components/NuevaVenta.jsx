import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import './NuevaVenta.css';

const NuevaVenta = ({ onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState("productos");
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [cliente, setCliente] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState(1);
  const [servicioSeleccionado, setServicioSeleccionado] = useState('');

  // Datos de ejemplo
  const productosDisponibles = [
    { id: 1, nombre: 'Mouse Gamer', precio: 50 },
    { id: 2, nombre: 'Teclado Mecánico', precio: 120 },
    { id: 3, nombre: 'Monitor 24"', precio: 200 },
    { id: 4, nombre: 'Auriculares', precio: 80 },
    { id: 5, nombre: 'Mousepad', precio: 15 }
  ];

  const serviciosDisponibles = [
    { id: 1, nombre: 'Mantenimiento PC', precio: 30 },
    { id: 2, nombre: 'Instalación Software', precio: 20 },
    { id: 3, nombre: 'Limpieza Interna', precio: 25 },
    { id: 4, nombre: 'Actualización Sistema', precio: 40 },
    { id: 5, nombre: 'Recuperación Datos', precio: 50 }
  ];

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
          cantidad: cantidadProducto 
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
      setServiciosSeleccionados([...serviciosSeleccionados, servicio]);
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
    const totalProductos = productosSeleccionados.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    const totalServicios = serviciosSeleccionados.reduce((sum, s) => sum + s.precio, 0);
    return totalProductos + totalServicios;
  };

  const handleGuardar = () => {
    if (!cliente) {
      alert('Por favor ingrese el nombre del cliente');
      return;
    }

    if (productosSeleccionados.length === 0 && serviciosSeleccionados.length === 0) {
      alert('Por favor agregue al menos un producto o servicio');
      return;
    }

    const nuevaVenta = {
      nombre: cliente,
      metodo: metodoPago,
      productos: productosSeleccionados,
      servicios: serviciosSeleccionados,
      equipos: [],
      subtotal: calcularTotal(),
      total: calcularTotal()
    };

    onSave(nuevaVenta);
  };

  // Combinar todos los items para mostrar en la tabla
  const todosLosItems = [
    ...productosSeleccionados.map(p => ({ ...p, tipo: 'producto' })),
    ...serviciosSeleccionados.map(s => ({ ...s, tipo: 'servicio', cantidad: 1 }))
  ];

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
          <div className="form-row">
            <div className="form-group">
              <label>Nombre del Cliente:</label>
              <input 
                type="text" 
                placeholder="Nombre completo del cliente" 
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className="cliente-input"
              />
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
                        <td>${item.precio.toFixed(2)}</td>
                        <td>${(item.precio * item.cantidad).toFixed(2)}</td>
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
            <button className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button className="submit-button" onClick={handleGuardar}>
              Guardar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevaVenta;