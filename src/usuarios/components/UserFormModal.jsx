import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../../app.css";

const UserFormModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  mode = "create",
  onSaved,
}) => {
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const isViewMode = mode === "view";

  // Cargar roles
  useEffect(() => {
    if (isOpen) {
      setLoadingRoles(true);
      axios
        .get("https://localhost:7228/api/Roles")
        .then((res) => setRoles(res.data))
        .catch((err) => console.error("Error al cargar roles:", err))
        .finally(() => setLoadingRoles(false));
    }
  }, [isOpen]);

  // Reset errores
  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  // Sincronizar datos al abrir modal
  useEffect(() => {
    if (isOpen && formData) {
      setFormData((prev) => ({
        ...prev,
        tipoDocumento: prev?.tipoDocumento || prev?.tipoDoc || "",
        rolId: prev?.rolId || prev?.fkRol || "",
      }));
    }
  }, [isOpen]);

  // Validaciones
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
    if (!formData.rolId) newErrors.rol = "Requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoadingSubmit(true);

    // 🔹 Payload directo, nombres exactos del modelo C#
    const payload = {
      IdUsuario: formData.idUsuario || formData.id || 0,
      FkRol: parseInt(formData.rolId),
      Nombre: formData.nombre,
      Email: formData.email,
      Contrasena: formData.contrasena || "123456",
      Estado: formData.estado === "activo" || formData.estado === true,
      TipoDoc: formData.tipoDocumento,
      Documento: formData.documento,
      Direccion: formData.direccion,
      Celular: formData.telefono,
    };

    console.log("Payload enviado:", payload);

    try {
      if (mode === "edit") {
        const userId = payload.IdUsuario;
        if (!userId) throw new Error("No se encontró el ID del usuario para editar");

        await axios.put(`https://localhost:7228/api/Usuarios/${userId}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        window.mostrarAlerta("✅ Usuario actualizado con éxito");
      } else {
        await axios.post("https://localhost:7228/api/Usuarios", payload, {
          headers: { "Content-Type": "application/json" },
        });
        window.mostrarAlerta("✅ Usuario creado con éxito");
      }

      if (onSaved) await onSaved();
      onClose();
    } catch (err) {
      console.error("Error en submit:", err.response?.data || err.message);
      alert(
        "❌ Error del servidor:\n" +
          JSON.stringify(err.response?.data, null, 2)
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (!isOpen) return null;

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
          {/* Tipo Documento + Documento */}
          <div className="form-row">
            <div className="form-group inline-group">
              <label>
                Tipo de Documento: <span className="required-asterisk">*</span>
              </label>
              <select
                name="tipoDocumento"
                value={(formData.tipoDocumento || "").toUpperCase()}
                onChange={(e) =>
                  setFormData({ ...formData, tipoDocumento: e.target.value })
                }
                disabled={isViewMode}
              >
                <option value="">Seleccione...</option>
                <option value="CC">C.C.</option>
                <option value="TI">T.I.</option>
                <option value="CE">C.E.</option>
                <option value="RUC">R.U.C.</option>
                <option value="DNI">D.N.I.</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
              {errors.tipoDocumento && (
                <small className="error">{errors.tipoDocumento}</small>
              )}
            </div>

            <div className="form-group inline-group">
              <label>
                Número de Documento: <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                name="documento"
                value={formData.documento || ""}
                onChange={(e) =>
                  setFormData({ ...formData, documento: e.target.value })
                }
                placeholder="12345678"
                disabled={isViewMode}
              />
              {errors.documento && (
                <small className="error">{errors.documento}</small>
              )}
            </div>
          </div>

          {/* Nombre + Teléfono */}
          <div className="form-row">
            <div className="form-group inline-group">
              <label>
                Nombre Completo: <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Nombre del usuario"
                disabled={isViewMode}
              />
              {errors.nombre && <small className="error">{errors.nombre}</small>}
            </div>

            <div className="form-group inline-group">
              <label>
                Teléfono: <span className="required-asterisk">*</span>
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono || ""}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                placeholder="+1234567890"
                disabled={isViewMode}
              />
              {errors.telefono && (
                <small className="error">{errors.telefono}</small>
              )}
            </div>
          </div>

          {/* Email + Dirección */}
          <div className="form-row">
            <div className="form-group inline-group">
              <label>
                Email: <span className="required-asterisk">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="usuario@example.com"
                disabled={isViewMode}
              />
              {errors.email && <small className="error">{errors.email}</small>}
            </div>

            <div className="form-group inline-group">
              <label>
                Dirección: <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion || ""}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
                placeholder="Dirección completa"
                disabled={isViewMode}
              />
              {errors.direccion && (
                <small className="error">{errors.direccion}</small>
              )}
            </div>
          </div>

          {/* Contraseña solo create */}
          {mode === "create" && (
            <div className="form-row">
              <div className="form-group inline-group">
                <label>
                  Contraseña: <span className="required-asterisk">*</span>
                </label>
                <input
                  type="password"
                  name="contrasena"
                  value={formData.contrasena || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contrasena: e.target.value })
                  }
                  placeholder="********"
                  disabled={loadingSubmit}
                />
                {errors.contrasena && (
                  <small className="error">{errors.contrasena}</small>
                )}
              </div>
            </div>
          )}

          {/* Roles */}
          <div className="form-row">
            <div className="form-group inline-group">
              <label>
                Rol: <span className="required-asterisk">*</span>
              </label>
              {isViewMode ? (
                <input
                  type="text"
                  value={
                    roles.find((r) => r.idRol === formData.rolId)?.nombreRol ||
                    formData.rol ||
                    ""
                  }
                  readOnly
                  disabled
                />
              ) : (
                <select
                  name="rolId"
                  value={formData.rolId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, rolId: parseInt(e.target.value) })
                  }
                  disabled={loadingRoles}
                >
                  <option value="">
                    {loadingRoles ? "Cargando roles..." : "Seleccione..."}
                  </option>
                  {roles.map((rol) => (
                    <option key={rol.idRol} value={rol.idRol}>
                      {rol.nombreRol}
                    </option>
                  ))}
                </select>
              )}
              {errors.rol && <small className="error">{errors.rol}</small>}
            </div>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={loadingSubmit}
            >
              {isViewMode ? "Cerrar" : "Cancelar"}
            </button>
            {!isViewMode && (
              <button
                type="submit"
                className="submit-button"
                disabled={loadingSubmit}
              >
                {loadingSubmit
                  ? mode === "create"
                    ? "Creando..."
                    : "Guardando..."
                  : mode === "create"
                  ? "Crear"
                  : "Guardar"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
