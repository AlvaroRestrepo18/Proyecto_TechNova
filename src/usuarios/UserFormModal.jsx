import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "../app.css"; // Usamos app.css centralizado

const UserFormModal = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
  mode = "create", // 'create' | 'edit' | 'view'
}) => {
  const [errors, setErrors] = useState({});
  const isViewMode = mode === "view";

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.tipoDocumento) newErrors.tipoDocumento = "Requerido";
    if (!formData.documento || formData.documento.length < 5)
      newErrors.documento = "Debe tener al menos 5 caracteres";
    if (!formData.nombre || formData.nombre.length < 3)
      newErrors.nombre = "Debe tener al menos 3 caracteres";
    if (!formData.telefono || formData.telefono.length < 7)
      newErrors.telefono = "Debe tener al menos 7 caracteres";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email inválido";
    if (!formData.direccion || formData.direccion.length < 5)
      newErrors.direccion = "Debe tener al menos 5 caracteres";
    if (mode === "create" && (!formData.contrasena || formData.contrasena.length < 6))
      newErrors.contrasena = "Debe tener al menos 6 caracteres";
    if (!formData.rol) newErrors.rol = "Requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(e);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {mode === "create"
              ? "Crear Usuario"
              : mode === "edit"
              ? "Editar Usuario"
              : "Detalles del Usuario"}
          </h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form className="form-body" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group inline-group">
              <label>Tipo de Documento: <span className="required-asterisk">*</span></label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={onChange}
                disabled={isViewMode}
              >
                <option value="">Seleccione...</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Cédula">Cédula</option>
                <option value="RUC">RUC</option>
              </select>
              {errors.tipoDocumento && <small className="error">{errors.tipoDocumento}</small>}
            </div>

            <div className="form-group inline-group">
              <label>Número de Documento: <span className="required-asterisk">*</span></label>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={onChange}
                placeholder="12345678"
                disabled={isViewMode}
              />
              {errors.documento && <small className="error">{errors.documento}</small>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group inline-group">
              <label>Nombre Completo: <span className="required-asterisk">*</span></label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={onChange}
                placeholder="Nombre del usuario"
                disabled={isViewMode}
              />
              {errors.nombre && <small className="error">{errors.nombre}</small>}
            </div>

            <div className="form-group inline-group">
              <label>Teléfono: <span className="required-asterisk">*</span></label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={onChange}
                placeholder="+1234567890"
                disabled={isViewMode}
              />
              {errors.telefono && <small className="error">{errors.telefono}</small>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group inline-group">
              <label>Email: <span className="required-asterisk">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="usuario@example.com"
                disabled={isViewMode}
              />
              {errors.email && <small className="error">{errors.email}</small>}
            </div>

            <div className="form-group inline-group">
              <label>Dirección: <span className="required-asterisk">*</span></label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={onChange}
                placeholder="Dirección completa"
                disabled={isViewMode}
              />
              {errors.direccion && <small className="error">{errors.direccion}</small>}
            </div>
          </div>

          {mode === "create" && (
            <div className="form-row">
              <div className="form-group inline-group">
                <label>Contraseña: <span className="required-asterisk">*</span></label>
                <input
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={onChange}
                  placeholder="********"
                />
                {errors.contrasena && (
                  <small className="error">{errors.contrasena}</small>
                )}
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group inline-group">
              <label>Rol: <span className="required-asterisk">*</span></label>
              <select
                name="rol"
                value={formData.rol}
                onChange={onChange}
                disabled={isViewMode}
              >
                <option value="">Seleccione...</option>
                <option value="administrador">Administrador</option>
                <option value="tecnico">Técnico</option>
                <option value="usuario">Usuario</option>
              </select>
              {errors.rol && <small className="error">{errors.rol}</small>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              {isViewMode ? "Cerrar" : "Cancelar"}
            </button>
            {!isViewMode && (
              <button type="submit" className="submit-button">
                {mode === "create" ? "Crear" : "Guardar"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
