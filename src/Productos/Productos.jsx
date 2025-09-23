import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faToggleOn, faToggleOff, faTimes, faEye } from '@fortawesome/free-solid-svg-icons';
import './productos.css';

const Productos = () => {
  // Estados principales
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("activos");
  const [modalProducto, setModalProducto] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Datos de ejemplo de productos
  const [productosData, setProductosData] = useState([
    { 
      id: 1, 
      codigo: 'PROD-001',
      nombre: "Laptop Gamer", 
      categoria: "Tecnología", 
      precio: 5000, 
      stock: 10, 
      stockMinimo: 5,
      descripcion: 'Laptop para gaming de alto rendimiento',
      estado: "Activo" 
    },
    { 
      id: 2, 
      codigo: 'PROD-002',
      nombre: "Escritorio", 
      categoria: "Muebles", 
      precio: 1200, 
      stock: 5, 
      stockMinimo: 2,
      descripcion: 'Escritorio de oficina ergonómico',
      estado: "Anulado" 
    },
    { 
      id: 3, 
      codigo: 'PROD-003',
      nombre: "Monitor 24 pulgadas", 
      categoria: "Tecnología", 
      precio: 800, 
      stock: 15, 
      stockMinimo: 3,
      descripcion: 'Monitor Full HD para trabajo y entretenimiento',
      estado: "Activo" 
    }
  ]);

  // Categorías disponibles
  const categoriasDisponibles = [
    'Tecnología',
    'Muebles',
    'Electrodomésticos',
    'Oficina',
    'Hogar',
    'Deportes',
    'Ropa',
    'Alimentos'
  ];

  // Estado del formulario
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    stockMinimo: '1',
    descripcion: '',
    estado: 'Activo'
  });

  // Filtros de productos
  const filteredActivos = productosData.filter(producto => 
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
    producto.estado === 'Activo'
  );

  const filteredAnulados = productosData.filter(producto => 
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
    producto.estado === 'Anulado'
  );

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.codigo.trim()) errors.codigo = 'El código es requerido';
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!formData.categoria) errors.categoria = 'Seleccione una categoría';
    if (!formData.precio || formData.precio <= 0) errors.precio = 'Precio válido requerido';
    if (!formData.stock || formData.stock < 0) errors.stock = 'Stock válido requerido';
    if (!formData.stockMinimo || formData.stockMinimo < 0) errors.stockMinimo = 'Stock mínimo válido requerido';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const toggleEstado = (id) => {
    setProductosData(productosData.map(producto => 
      producto.id === id 
        ? { ...producto, estado: producto.estado === 'Activo' ? 'Anulado' : 'Activo' }
        : producto
    ));
  };

  const eliminarProducto = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      setProductosData(productosData.filter(producto => producto.id !== id));
    }
  };

  const openForm = () => {
    setIsFormOpen(true);
    setFormData({
      codigo: `PROD-${Date.now().toString().slice(-3)}`,
      nombre: '',
      categoria: '',
      precio: '',
      stock: '',
      stockMinimo: '1',
      descripcion: '',
      estado: 'Activo'
    });
    setFormErrors({});
  };

  const closeForm = () => setIsFormOpen(false);

  // Modal de visualización
  const openViewModal = (producto) => {
    setModalProducto(producto);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setModalProducto(null);
  };

  const openEditForm = (producto) => {
    setIsFormOpen(true);
    setFormData({ ...producto });
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  // Submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const nuevoProducto = {
      id: formData.id || Math.max(...productosData.map(p => p.id), 0) + 1,
      codigo: formData.codigo,
      nombre: formData.nombre,
      categoria: formData.categoria,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      stockMinimo: parseInt(formData.stockMinimo),
      descripcion: formData.descripcion,
      estado: 'Activo'
    };
    
    if (formData.id) {
      // Editar producto existente
      setProductosData(productosData.map(p => 
        p.id === formData.id ? nuevoProducto : p
      ));
    } else {
      // Nuevo producto
      setProductosData([...productosData, nuevoProducto]);
    }
    
    closeForm();
  };

  // Componente para el modal de visualización
  const ViewModal = ({ producto, onClose }) => {
    if (!producto) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Detalles del Producto</h2>
            <button className="close-button" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="user-details-container">
            <div className="user-details-row">
              <span className="detail-label">Código:</span>
              <span className="detail-value">{producto.codigo}</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Nombre:</span>
              <span className="detail-value">{producto.nombre}</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Categoría:</span>
              <span className="detail-value">{producto.categoria}</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Precio:</span>
              <span className="detail-value">${producto.precio.toFixed(2)}</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Stock Actual:</span>
              <span className="detail-value">{producto.stock} unidades</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Stock Mínimo:</span>
              <span className="detail-value">{producto.stockMinimo} unidades</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Estado:</span>
              <span className={`detail-value ${producto.estado === 'Activo' ? 'status-active' : 'status-inactive'}`}>
                {producto.estado}
              </span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Descripción:</span>
              <span className="detail-value">{producto.descripcion || 'Sin descripción'}</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Alerta Stock:</span>
              <span className="detail-value">
                {producto.stock <= producto.stockMinimo ? (
                  <span style={{color: '#e74c3c', fontWeight: 'bold'}}>⚠️ Stock bajo</span>
                ) : (
                  <span style={{color: '#27ae60'}}>✅ Stock suficiente</span>
                )}
              </span>
            </div>
            
            <div className="form-actions">
              <button type="button" className="close-details-button" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente para la tabla de productos
  const TablaProductos = ({ productos }) => (
    <table className="table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Estado</th>
          <th className='Action'>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((producto, index) => (
          <tr key={producto.id}>
            <td>{producto.codigo}</td>
            <td>{producto.nombre}</td>
            <td>{producto.categoria}</td>
            <td>${producto.precio.toFixed(2)}</td>
            <td>
              <span className={producto.stock <= producto.stockMinimo ? 'status-inactive' : 'status-active'}>
                {producto.stock} {producto.stock <= producto.stockMinimo && '⚠️'}
              </span>
            </td>
            <td>
              <button 
                className={`status-toggle ${producto.estado === 'Activo' ? 'active' : 'inactive'}`}
                onClick={() => toggleEstado(producto.id)}
              >
                {producto.estado}
              </button>
            </td>
            <td className='Action'>
              <button className="icon-button" title="Ver" onClick={() => openViewModal(producto)}>
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className="icon-button" title="Editar" onClick={() => openEditForm(producto)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button 
                className="icon-button" 
                title="Eliminar" 
                onClick={() => eliminarProducto(producto.id)}
                style={{color: '#e74c3c'}}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <h1>Productos</h1>
      
      <div className="section-divider"></div>
      
      {/* Pestañas */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "activos" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("activos")}
        >
          Productos Activos ({filteredActivos.length})
        </button>
        <button
          className={`tab-button ${activeTab === "anulados" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("anulados")}
        >
          Productos Anulados ({filteredAnulados.length})
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder={activeTab === "activos" ? "Buscar productos activos" : "Buscar productos anulados"}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {activeTab === "activos" && (
          <div className="create-header">
            <button className="create-button" onClick={openForm}>
              <FontAwesomeIcon icon={faPlus} /> Nuevo Producto
            </button>
          </div>
        )}
      </div>
      
      <div className="table-container">
        {activeTab === "activos" ? (
          <TablaProductos productos={filteredActivos} />
        ) : (
          <TablaProductos productos={filteredAnulados} />
        )}
        
        {(activeTab === "activos" ? filteredActivos : filteredAnulados).length === 0 && (
          <div className="no-results">No hay productos {activeTab}</div>
        )}
      </div>

      {/* Modal de formulario */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{formData.id ? "Editar Producto" : "Nuevo Producto"}</h2>
              <button className="close-button" onClick={closeForm}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form className="form-body" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="inline-group">
                  <div className="form-group">
                    <label>Código <span className="required-asterisk">*</span></label>
                    <input
                      type="text"
                      name="codigo"
                      value={formData.codigo}
                      onChange={handleChange}
                      className={formErrors.codigo ? 'input-error' : ''}
                      required
                    />
                    {formErrors.codigo && <span className="error">{formErrors.codigo}</span>}
                  </div>
                </div>

                <div className="inline-group">
                  <div className="form-group">
                    <label>Nombre <span className="required-asterisk">*</span></label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className={formErrors.nombre ? 'input-error' : ''}
                      required
                    />
                    {formErrors.nombre && <span className="error">{formErrors.nombre}</span>}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="inline-group">
                  <div className="form-group">
                    <label>Categoría <span className="required-asterisk">*</span></label>
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      className={formErrors.categoria ? 'input-error' : ''}
                      required
                    >
                      <option value="">Seleccione una categoría...</option>
                      {categoriasDisponibles.map((categoria, index) => (
                        <option key={index} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                    {formErrors.categoria && <span className="error">{formErrors.categoria}</span>}
                  </div>
                </div>

                <div className="inline-group">
                  <div className="form-group">
                    <label>Precio <span className="required-asterisk">*</span></label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      className={formErrors.precio ? 'input-error' : ''}
                      min="0"
                      step="0.01"
                      required
                    />
                    {formErrors.precio && <span className="error">{formErrors.precio}</span>}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="inline-group">
                  <div className="form-group">
                    <label>Stock Actual <span className="required-asterisk">*</span></label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className={formErrors.stock ? 'input-error' : ''}
                      min="0"
                      required
                    />
                    {formErrors.stock && <span className="error">{formErrors.stock}</span>}
                  </div>
                </div>

                <div className="inline-group">
                  <div className="form-group">
                    <label>Stock Mínimo <span className="required-asterisk">*</span></label>
                    <input
                      type="number"
                      name="stockMinimo"
                      value={formData.stockMinimo}
                      onChange={handleChange}
                      className={formErrors.stockMinimo ? 'input-error' : ''}
                      min="0"
                      required
                    />
                    {formErrors.stockMinimo && <span className="error">{formErrors.stockMinimo}</span>}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Descripción del producto..."
                  style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical'}}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={closeForm}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button">
                  {formData.id ? "Actualizar" : "Crear"} Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de visualización */}
      {isViewModalOpen && (
        <ViewModal producto={modalProducto} onClose={closeViewModal} />
      )}
    </div>
  );
};

export default Productos;