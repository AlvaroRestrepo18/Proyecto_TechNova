import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ProductosFormModal = ({ producto, categoriasDisponibles, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || "",
    categoriaId: producto?.categoriaId || "",
    cantidad: producto?.cantidad || "",
    precio: producto?.precio || "",
    fechaCreacion: producto?.fechaCreacion
      ? producto.fechaCreacion.split("T")[0] // si viene del back en formato ISO
      : new Date().toISOString().split("T")[0] // default: hoy
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) errors.nombre = "El nombre es requerido";
    if (!formData.categoriaId) errors.categoriaId = "Seleccione una categoría";
    if (!formData.cantidad || formData.cantidad < 0) errors.cantidad = "Cantidad válida requerida";
    if (!formData.precio || formData.precio <= 0) errors.precio = "Precio válido requerido";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const nuevoProducto = {
      id: producto?.id, // si existe (modo edición)
      nombre: formData.nombre,
      categoriaId: parseInt(formData.categoriaId),
      cantidad: parseInt(formData.cantidad),
      precio: parseFloat(formData.precio),
      fechaCreacion: new Date(formData.fechaCreacion).toISOString() // backend espera DateTime
    };

    onSubmit(nuevoProducto);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{producto ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form className="form-body" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Información del Producto</h3>

            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={formErrors.nombre ? "input-error" : ""}
                required
              />
              {formErrors.nombre && <span className="error-message">{formErrors.nombre}</span>}
            </div>

            <div className="form-group">
              <label>Categoría *</label>
              <select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                className={formErrors.categoriaId ? "input-error" : ""}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categoriasDisponibles.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              {formErrors.categoriaId && (
                <span className="error-message">{formErrors.categoriaId}</span>
              )}
            </div>

            <div className="form-group">
              <label>Cantidad *</label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                className={formErrors.cantidad ? "input-error" : ""}
                min="0"
                required
              />
              {formErrors.cantidad && (
                <span className="error-message">{formErrors.cantidad}</span>
              )}
            </div>

            <div className="form-group">
              <label>Precio *</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className={formErrors.precio ? "input-error" : ""}
                min="0"
                step="0.01"
                required
              />
              {formErrors.precio && (
                <span className="error-message">{formErrors.precio}</span>
              )}
            </div>

            <div className="form-group">
              <label>Fecha de Creación</label>
              <input
                type="date"
                name="fechaCreacion"
                value={formData.fechaCreacion}
                onChange={handleChange}
                required
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
