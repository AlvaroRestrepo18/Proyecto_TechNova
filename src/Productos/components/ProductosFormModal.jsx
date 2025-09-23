import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ProductosFormModal = ({ producto, categoriasDisponibles, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    codigo: producto?.codigo || `PROD-${Date.now().toString().slice(-3)}`,
    nombre: producto?.nombre || '',
    categoria: producto?.categoria || '',
    precio: producto?.precio || '',
    stock: producto?.stock || '',
    stockMinimo: producto?.stockMinimo || '1',
    descripcion: producto?.descripcion || '',
    estado: producto?.estado || 'Activo'
  });

  const [formErrors, setFormErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const nuevoProducto = {
      id: producto?.id,
      codigo: formData.codigo,
      nombre: formData.nombre,
      categoria: formData.categoria,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      stockMinimo: parseInt(formData.stockMinimo),
      descripcion: formData.descripcion,
      estado: 'Activo'
    };
    
    onSubmit(nuevoProducto);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{producto ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form className="form-body" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Información Básica</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Código *</label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  className={formErrors.codigo ? 'input-error' : ''}
                  required
                />
                {formErrors.codigo && <span className="error-message">{formErrors.codigo}</span>}
              </div>

              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={formErrors.nombre ? 'input-error' : ''}
                  required
                />
                {formErrors.nombre && <span className="error-message">{formErrors.nombre}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Categoría *</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className={formErrors.categoria ? 'input-error' : ''}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categoriasDisponibles.map((categoria, index) => (
                    <option key={index} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
                {formErrors.categoria && <span className="error-message">{formErrors.categoria}</span>}
              </div>

              <div className="form-group">
                <label>Precio *</label>
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
                {formErrors.precio && <span className="error-message">{formErrors.precio}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Inventario</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Stock Actual *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className={formErrors.stock ? 'input-error' : ''}
                  min="0"
                  required
                />
                {formErrors.stock && <span className="error-message">{formErrors.stock}</span>}
              </div>

              <div className="form-group">
                <label>Stock Mínimo *</label>
                <input
                  type="number"
                  name="stockMinimo"
                  value={formData.stockMinimo}
                  onChange={handleChange}
                  className={formErrors.stockMinimo ? 'input-error' : ''}
                  min="0"
                  required
                />
                {formErrors.stockMinimo && <span className="error-message">{formErrors.stockMinimo}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                placeholder="Descripción del producto..."
                className="description-textarea"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              {producto ? "Actualizar" : "Crear"} Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductosFormModal;