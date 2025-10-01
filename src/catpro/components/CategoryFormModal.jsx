import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const CategoryFormModal = ({ currentView, currentCategory, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    tipoCategoria: 'Producto',
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    if (currentCategory) {
      setFormData({
        tipoCategoria: currentCategory.tipoCategoria || 'Producto',
        nombre: currentCategory.nombre || '',
        descripcion: currentCategory.descripcion || ''
      });
    } else {
      setFormData({
        tipoCategoria: 'Producto',
        nombre: '',
        descripcion: ''
      });
    }
  }, [currentCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación simple
    if (!formData.nombre || !formData.tipoCategoria) {
      alert("Debe completar el nombre y el tipo de categoría");
      return;
    }

    // ✅ Aseguramos mandar el ID si estamos en edición
    const payload = {
      id: currentCategory?.id || 0,
      tipoCategoria: formData.tipoCategoria,
      nombre: formData.nombre,
      descripcion: formData.descripcion
    };

    onSave(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {currentView === 'create' && 'Crear Nueva Categoría'}
            {currentView === 'edit' && 'Editar Categoría'}
            {currentView === 'view' && 'Detalles de Categoría'}
          </h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="form-body">
          {currentView === 'view' ? (
            <div className="view-mode">
              <div className="detail-group">
                <label>Tipo:</label>
                <p>
                  <span className={`badge ${currentCategory?.tipoCategoria === 'Producto' ? 'badge-producto' : 'badge-servicio'}`}>
                    {currentCategory?.tipoCategoria}
                  </span>
                </p>
              </div>
              <div className="detail-group">
                <label>Nombre:</label>
                <p>{currentCategory?.nombre}</p>
              </div>
              <div className="detail-group">
                <label>Descripción:</label>
                <p>{currentCategory?.descripcion}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tipo de Categoría: <span className="required">*</span></label>
                <div className="tipo-selector">
                  <button
                    type="button"
                    className={`tipo-option ${formData.tipoCategoria === 'Producto' ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, tipoCategoria: 'Producto' })}
                  >
                    <div className="tipo-circle"></div>
                    <span>Producto</span>
                  </button>
                  <button
                    type="button"
                    className={`tipo-option ${formData.tipoCategoria === 'Servicio' ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, tipoCategoria: 'Servicio' })}
                  >
                    <div className="tipo-circle"></div>
                    <span>Servicio</span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Nombre de la Categoría: <span className="required">*</span></label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre de la categoría"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción: <span className="required">*</span></label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Ingrese la descripción de la categoría"
                  required
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button">
                  {currentView === 'create' ? 'Crear' : 'Guardar'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFormModal;
