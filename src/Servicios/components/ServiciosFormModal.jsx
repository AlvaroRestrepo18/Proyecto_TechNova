import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ServiciosFormModal = ({ servicio, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: servicio?.id || 0,
    nombre: servicio?.nombre || "",
    detalles: servicio?.detalles || "",
    precio: servicio?.precio || "",
    categoriaId: servicio?.categoriaId || "",
  });

  const [categorias, setCategorias] = useState([]);

  // 🔹 Cargar solo categorías de tipo "servicio"
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get("https://localhost:7228/api/Categorias");
        const categoriasServicios = res.data.filter(
          (cat) =>
            cat.tipoCategoria &&
            cat.tipoCategoria.toLowerCase() === "servicio" &&
            cat.activo
        );
        setCategorias(categoriasServicios);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  // 🔹 Actualizar datos si cambias de servicio (editar)
  useEffect(() => {
    if (servicio) {
      setFormData({
        id: servicio.id || 0,
        nombre: servicio.nombre || "",
        detalles: servicio.detalles || "",
        precio: servicio.precio || "",
        categoriaId: servicio.categoriaId || "",
      });
    } else {
      setFormData({
        id: 0,
        nombre: "",
        detalles: "",
        precio: "",
        categoriaId: "",
      });
    }
  }, [servicio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "precio" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === "function") {
      onSubmit(formData);
    } else {
      console.error("❌ onSubmit no es una función");
    }
  };

  if (!onClose) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 🔹 Encabezado del modal */}
        <div className="modal-header">
          <h2>{servicio ? "Editar Servicio" : "Crear Servicio"}</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* 🔹 Cuerpo del formulario */}
        <form className="form-body" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre del servicio</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Detalles</label>
              <textarea
                name="detalles"
                value={formData.detalles}
                onChange={handleChange}
                rows="3"
                placeholder="Describe brevemente el servicio..."
              ></textarea>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 🔹 Botones de acción */}
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              {servicio ? "Guardar Cambios" : "Crear Servicio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiciosFormModal;
