import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ServiciosFormModal = ({ servicio, isEditing, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    details: '',
    estado: 'activo'
  });

  useEffect(() => {
    if (servicio) {
      setFormData({
        id: servicio.id || '',
        name: servicio.name || '',
        price: servicio.price || '',
        details: servicio.details || '',
        estado: servicio.active ? 'activo' : 'inactivo'
      });
    } else {
      setFormData({
        id: '',
        name: '',
        price: '',
        details: '',
        estado: 'activo'
      });
    }
  }, [servicio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.details) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const serviceData = {
      id: formData.id,
      name: formData.name,
      price: formData.price,
      details: formData.details,
      active: formData.estado === 'activo'
    };

    onSubmit(serviceData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ backgroundColor: '#1e3c72' }}>
          <h2>{isEditing ? 'Editar Servicio' : 'Crear Servicio'}</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form className="form-body" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Precio</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Detalles</label>
              <textarea 
                name="details" 
                value={formData.details} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Estado</label>
              <select 
                name="estado" 
                value={formData.estado} 
                onChange={handleChange}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              {isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiciosFormModal;
