import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import './Ventas.css';

const Ventas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Datos de ejemplo de ventas
  const [ventasData, setVentasData] = useState([
    { id: '120-45-67', nombre: 'Alejo', fecha: '08/04/2025', metodo: 'Efectivo' },
    { id: '234-56-78', nombre: 'Samuel', fecha: '09/04/2025', metodo: 'Efectivo' },
    { id: '345-67-89', nombre: 'Camilo', fecha: '10/04/2025', metodo: 'Efectivo' }
  ]);

  // Estado del formulario editable
  const [formData, setFormData] = useState({
    numeroVenta: '',
    nombre: '',
    fechaVenta: '',
    metodoPago: 'Efectivo',
    productos: [
      { nombre: 'Pacho de veste', gestion: 1, poder: 299 },
      { nombre: 'Jambos de sette', gestion: 0, poder: 199 },
      { nombre: 'Jambos del setete', gestion: 1, poder: 299 },
      { nombre: 'Micho de 50 gps', gestion: 0, poder: 199 }
    ],
    subtotal: 1400,
    iva: 0,
    total: 1400
  });

  const filteredVentas = ventasData.filter(venta => 
    venta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openForm = () => {
    setIsFormOpen(true);
    // Resetear formulario al abrir
    setFormData({
      numeroVenta: '',
      nombre: '',
      fechaVenta: '',
      metodoPago: 'Efectivo',
      productos: [
        { nombre: '', gestion: 0, poder: 0 }
      ],
      subtotal: 0,
      iva: 0,
      total: 0
    });
  };

  const closeForm = () => setIsFormOpen(false);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    
    if (index !== null) {
      // Cambio en un producto
      const nuevosProductos = [...formData.productos];
      nuevosProductos[index][name] = value;
      
      // Calcular nuevos totales
      const subtotal = nuevosProductos.reduce((sum, prod) => sum + (parseInt(prod.poder) || 0), 0);
      const total = subtotal + (subtotal * (formData.iva / 100));
      
      setFormData({
        ...formData,
        productos: nuevosProductos,
        subtotal,
        total
      });
    } else if (name === 'iva') {
      // Cambio en el IVA
      const total = formData.subtotal + (formData.subtotal * (parseInt(value) || 0) / 100);
      setFormData({...formData, iva: value, total});
    } else {
      // Cambio en otros campos
      setFormData({...formData, [name]: value});
    }
  };

  const addProducto = () => {
    setFormData({
      ...formData,
      productos: [...formData.productos, { nombre: '', gestion: 0, poder: 0 }]
    });
  };

  const removeProducto = (index) => {
    const nuevosProductos = formData.productos.filter((_, i) => i !== index);
    const subtotal = nuevosProductos.reduce((sum, prod) => sum + (parseInt(prod.poder) || 0), 0);
    const total = subtotal + (subtotal * (formData.iva / 100));
    
    setFormData({
      ...formData,
      productos: nuevosProductos,
      subtotal,
      total
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaVenta = {
      id: formData.numeroVenta,
      nombre: formData.nombre,
      fecha: formData.fechaVenta,
      metodo: formData.metodoPago,
      productos: formData.productos,
      total: formData.total
    };
    
    setVentasData([...ventasData, nuevaVenta]);
    closeForm();
  };

  return (
    <div className="ventas-container">
      <h1>Cyber360 - Ventas</h1>
      
      <div className="section-divider"></div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar ventas"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="ventas-id-section">
        <h3>Número de venta</h3>
        <p>Nombre del cliente</p>
      </div>

      <div className="create-header">
        <button className="create-button" onClick={openForm}>
          <FontAwesomeIcon icon={faPlus} /> Crear
        </button>
      </div>
      
      <div className="table-container">
        <table className="ventas-table">
          <thead>
            <tr>
              <th>Número venta</th>
              <th>Nombre</th>
              <th>Fecha venta</th>
              <th>Método pago</th>
              <th className='Action'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredVentas.map((venta, index) => (
              <tr key={index}>
                <td>{venta.id}</td>
                <td>{venta.nombre}</td>
                <td>{venta.fecha}</td>
                <td>{venta.metodo}</td>
                <td>
                  <button className="icon-button" title="Ver">
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button className="icon-button" title="Editar">
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className="icon-button" title="Eliminar">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de formulario para crear nueva venta */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Crear</h2>
              <button className="close-button" onClick={closeForm}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form className="form-body" onSubmit={handleSubmit}>
              {/* Sección de datos básicos */}
              <div className="form-row">
                <div className="form-group">
                  <label>Número de Venta:</label>
                  <input
                    type="text"
                    name="numeroVenta"
                    value={formData.numeroVenta}
                    onChange={handleChange}
                    placeholder="Ej: 120-45-67"
                    required
                    pattern="[0-9]{3}-[0-9]{2}-[0-9]{2}"
                    title="Formato: 123-45-67"
                  />
                </div>

                <div className="form-group">
                  <label>Nombre del Cliente:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Venta:</label>
                  <input
                    type="text"
                    name="fechaVenta"
                    value={formData.fechaVenta}
                    onChange={handleChange}
                    placeholder="DD/MM/AAAA"
                    required
                    pattern="\d{2}/\d{2}/\d{4}"
                    title="Formato: DD/MM/AAAA"
                  />
                </div>

                <div className="form-group">
                  <label>Método de Pago:</label>
                  <select
                    name="metodoPago"
                    value={formData.metodoPago}
                    onChange={handleChange}
                    required
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Trombere">Trombere</option>
                  </select>
                </div>
              </div>

              {/* Lista de productos */}
              <div className="products-section">
                {formData.productos.map((prod, index) => (
                  <div key={index} className="product-item">
                    <h3>{prod.nombre || `Producto ${index + 1}`}</h3>
                  </div>
                ))}
              </div>

              <div className="section-divider"></div>

              {/* Tabla de productos/servicios */}
              <h3>Productions | Servicios</h3>
              
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Gestión</th>
                    <th>Poder</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.productos.map((prod, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          name="nombre"
                          value={prod.nombre}
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Nombre producto"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="gestion"
                          value={prod.gestion}
                          onChange={(e) => handleChange(e, index)}
                          min="0"
                          max="1"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="poder"
                          value={prod.poder}
                          onChange={(e) => handleChange(e, index)}
                          min="0"
                          required
                        />
                      </td>
                      <td>
                        <button 
                          type="button" 
                          className="icon-button"
                          onClick={() => removeProducto(index)}
                          title="Eliminar"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button 
                type="button" 
                className="add-product-button"
                onClick={addProducto}
              >
                <FontAwesomeIcon icon={faPlus} /> Agregar Producto
              </button>

              {/* Totales */}
              <div className="totals-section">
                <div className="total-row">
                  <span>SubTotal:</span>
                  <span>{formData.subtotal}</span>
                </div>
                <div className="total-row">
                  <span>IVA (%):</span>
                  <input
                    type="number"
                    name="iva"
                    value={formData.iva}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="total-row">
                  <span>Total:</span>
                  <span>{formData.total}</span>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={closeForm}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button">
                  Registrar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;