import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ProductosFormModal = ({ formData, setFormData, categorias, onSave, onClose }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      categoriaId: parseInt(formData.categoriaId),
      cantidad: parseInt(formData.cantidad),
      precio: parseFloat(formData.precio),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{formData.id ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button className="close-button" onClick={onClose}><FontAwesomeIcon icon={faTimes} /></button>
        </div>

        <form className="form-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select name="categoriaId" value={formData.categoriaId} onChange={handleChange} required>
              <option value="">Seleccione...</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Precio</label>
            <input type="number" name="precio" min="0" step="0.01" value={formData.precio} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Cantidad</label>
            <input type="number" name="cantidad" min="0" value={formData.cantidad} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Fecha de Creación</label>
            <input type="date" name="fechaCreacion" value={formData.fechaCreacion} onChange={handleChange} required />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">{formData.id ? "Actualizar" : "Crear"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductosFormModal;
