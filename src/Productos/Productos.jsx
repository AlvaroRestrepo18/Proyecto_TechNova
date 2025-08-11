import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faEye, faPen, faTrash, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import './productos.css';

const Productos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Datos de ejemplo con estado inicial
  const [equipmentData, setEquipmentData] = useState([
    { id: '2023-10-01', name: 'Producto 1', value: '100', active: true },
    { id: '2023-10-02', name: 'Producto 2', value: '150', active: true },
    { id: '2023-10-03', name: 'Producto 3', value: '200', active: true },
  ]);

  // Estado del formulario editable
  const [formData, setFormData] = useState({
    fecha: '',
    nombre: '',
    cantidad: '',
    estado: 'activo'
  });

  const filteredEquipment = equipmentData.filter(producto => 
    producto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openForm = () => {
    setIsFormOpen(true);
    // Resetear formulario al abrir
    setFormData({
      fecha: '',
      nombre: '',
      cantidad: '',
      estado: 'activo'
    });
  };

  const closeForm = () => setIsFormOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: formData.fecha,
      name: formData.nombre,
      value: formData.cantidad,
      active: formData.estado === 'activo'
    };
    
    setEquipmentData([...equipmentData, newProduct]);
    closeForm();
  };

  const toggleEquipmentStatus = (id) => {
    setEquipmentData(equipmentData.map(producto => 
      producto.id === id ? { ...producto, active: !producto.active } : producto
    ));
  };

  return (
    <div className="equipment-container">
      <h1>Cyber360 - Productos</h1>
      
      <div className="section-divider"></div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar Productos"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="equipment-id-section">
        <h3>Fecha de producto</h3>
        <p>Nombre Producto</p>
      </div>

      <div className="create-header">
        <button className="create-button" onClick={openForm}>
          <FontAwesomeIcon icon={faPlus} /> Crear
        </button>
      </div>
      
      <div className="table-container">
        <table className="equipment-table">
          <thead>
            <tr>
              <th>Fecha del producto</th>
              <th>Nombre del producto</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th className='Action'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipment.map((producto, index) => (
              <tr key={index}>
                <td>{producto.id}</td>
                <td>{producto.name}</td>
                <td>{producto.value}</td>
                <td>
                  <button 
                    className={`status-toggle ${producto.active ? 'active' : 'inactive'}`}
                    onClick={() => toggleEquipmentStatus(producto.id)}
                    title={producto.active ? 'Desactivar' : 'Activar'}
                  >
                    <FontAwesomeIcon icon={faPowerOff} />
                    <span>{producto.active ? ' En stock' : ' Sin stock'}</span>
                  </button>
                </td>
                <td>
                  <button 
                    className={`icon-button ${!producto.active ? 'disabled' : ''}`} 
                    title="Ver"
                    disabled={!producto.active}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button 
                    className={`icon-button ${!producto.active ? 'disabled' : ''}`} 
                    title="Editar"
                    disabled={!producto.active}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button 
                    className={`icon-button ${!producto.active ? 'disabled' : ''}`} 
                    title="Eliminar"
                    disabled={!producto.active}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de formulario */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Crear Nuevo Producto</h2>
              <button className="close-button" onClick={closeForm}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form className="form-body" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Fecha del Producto:</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del producto"
                  required
                />
              </div>

              <div className="form-group">
                <label>Cantidad:</label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  placeholder="Cantidad disponible"
                  required
                />
              </div>

              <div className="form-group">
                <label>Estado:</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                  <option value="activo">En stock</option>
                  <option value="inactivo">Sin stock</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={closeForm}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button">
                  Crear Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;