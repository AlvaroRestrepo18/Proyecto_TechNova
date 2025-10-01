import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const placeholders = {
  CC: "1234567890",
  NIT: "123456789-1",
  CE: "ABC123456",
  PAS: "AB123456",
};

const ProveedorFormModal = ({
  formData,
  errors,
  currentProveedorId,
  onClose,
  onChange,
  onTipoPersonaChange,
  onTipoDocumentoChange,
  onSubmit,
}) => {
  // 🔹 Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // 🔹 Generar el campo nombre oculto
  const nombreGenerado =
    formData.tipoPersona === "Natural"
      ? `${formData.nombres} ${formData.apellidos}`.trim()
      : formData.razonSocial;

  // 🔹 Helper para inputs con error
  const getInputClass = (field) => (errors[field] ? "input-error" : "");

  return (
    <div className="modal-overlay" onClick={onClose} tabIndex={-1}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{currentProveedorId ? "Editar Proveedor" : "Nuevo Proveedor"}</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form className="form-body" onSubmit={onSubmit}>
          {/* Tipo Persona y Documento */}
          <div className="form-row">
            <div className="inline-group">
              <div className="form-group">
                <label>Tipo Persona *</label>
                <select
                  name="tipoPersona"
                  value={formData.tipoPersona}
                  onChange={onTipoPersonaChange}
                  className={getInputClass("tipoPersona")}
                  disabled={!!currentProveedorId}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Natural">Persona Natural</option>
                  <option value="Jurídica">Persona Jurídica</option>
                </select>
                {errors.tipoPersona && (
                  <span className="error">{errors.tipoPersona}</span>
                )}
              </div>
            </div>

            <div className="inline-group">
              <div className="form-group">
                <label>Tipo Documento *</label>
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={onTipoDocumentoChange}
                  className={getInputClass("tipoDocumento")}
                  disabled={!!currentProveedorId}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="NIT">NIT</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PAS">Pasaporte</option>
                </select>
                {errors.tipoDocumento && (
                  <span className="error">{errors.tipoDocumento}</span>
                )}
              </div>
            </div>

            <div className="inline-group">
              <div className="form-group">
                <label>N° Documento *</label>
                <input
                  type="text"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={onChange}
                  className={getInputClass("numeroDocumento")}
                  disabled={!!currentProveedorId}
                  required
                  placeholder={
                    placeholders[formData.tipoDocumento] || "Ingrese documento"
                  }
                  aria-invalid={!!errors.numeroDocumento}
                  autoFocus
                />
                {errors.numeroDocumento && (
                  <span className="error">{errors.numeroDocumento}</span>
                )}
              </div>
            </div>
          </div>

          {/* Natural o Jurídica */}
          {formData.tipoPersona === "Natural" ? (
            <div className="form-row">
              <div className="inline-group">
                <div className="form-group">
                  <label>Nombres *</label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={onChange}
                    className={getInputClass("nombres")}
                    required
                    placeholder="Ej: Juan Carlos"
                  />
                  {errors.nombres && (
                    <span className="error">{errors.nombres}</span>
                  )}
                </div>
              </div>

              <div className="inline-group">
                <div className="form-group">
                  <label>Apellidos *</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={onChange}
                    className={getInputClass("apellidos")}
                    required
                    placeholder="Ej: Pérez García"
                  />
                  {errors.apellidos && (
                    <span className="error">{errors.apellidos}</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="form-row">
              <div className="inline-group full-width">
                <div className="form-group">
                  <label>Razón Social *</label>
                  <input
                    type="text"
                    name="razonSocial"
                    value={formData.razonSocial}
                    onChange={onChange}
                    className={getInputClass("razonSocial")}
                    required
                    placeholder="Ej: Tecnologías Avanzadas SAS"
                  />
                  {errors.razonSocial && (
                    <span className="error">{errors.razonSocial}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Campo oculto nombre */}
          <input type="hidden" name="nombre" value={nombreGenerado} />

          {/* Teléfono, Correo y Dirección */}
          <div className="form-row">
            <div className="inline-group">
              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={onChange}
                  className={getInputClass("telefono")}
                  placeholder="Ej: 3001234567 o 6012345678"
                />
                {errors.telefono && (
                  <span className="error">{errors.telefono}</span>
                )}
              </div>
            </div>

            <div className="inline-group">
              <div className="form-group">
                <label>Correo Electrónico *</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={onChange}
                  className={getInputClass("correo")}
                  placeholder="Ej: contacto@proveedor.com"
                />
                {errors.correo && (
                  <span className="error">{errors.correo}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="inline-group full-width">
              <div className="form-group">
                <label>Dirección *</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={onChange}
                  className={getInputClass("direccion")}
                  placeholder="Dirección completa"
                />
                {errors.direccion && (
                  <span className="error">{errors.direccion}</span>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              {currentProveedorId ? "Actualizar Proveedor" : "Crear Proveedor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProveedorFormModal;
