import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./ProductosFormModal.css";

const ProductosFormModal = ({ formData, setFormData, categorias, onSave, onClose }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productoData = {
      id: formData.id || 0,
      nombre: formData.nombre?.trim() || "",
      categoriaId: formData.categoriaId ? parseInt(formData.categoriaId) : 0,
      cantidad: formData.cantidad ? parseInt(formData.cantidad) : 0,
      precio: formData.precio ? parseFloat(formData.precio) : 0,
      fechaCreacion:
        formData.fechaCreacion && formData.fechaCreacion !== ""
          ? formData.fechaCreacion
          : new Date().toISOString().split("T")[0],
    };

    onSave(productoData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{formData.id ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form className="form-body" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre:</label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Categoría:</label>
              <select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Precio:</label>
              <input
                type="number"
                name="precio"
                min="0"
                step="0.01"
                value={formData.precio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Cantidad:</label>
              <input
                type="number"
                name="cantidad"
                min="0"
                value={formData.cantidad}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group form-full">
              <label>Fecha de creación:</label>
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
            <button type="button" className="cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save">
              {formData.id ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductosFormModal;
