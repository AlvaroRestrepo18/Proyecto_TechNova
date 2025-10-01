import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ModulePermissions from "./ModulePermissions";
import {
  createRole,
  updateRole,
  getRoleById,
  assignPermissionsToRole,
} from "../services/roles";
import "../roles.css";

const RoleFormModal = ({ isOpen, onClose, roleId, mode = "create", onSaved }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    permissions: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // ⏳ indicador de carga
  const isViewMode = mode === "view";

  // 🔹 Cargar datos cuando se abre el modal
  useEffect(() => {
    if (!isOpen) return;

    const fetchRole = async () => {
      if ((mode === "edit" || mode === "view") && roleId) {
        try {
          setLoading(true);
          const role = await getRoleById(roleId);

          setFormData({
            nombre: role.nombre || "",
            descripcion: role.descripcion || "",
            permissions: Array.isArray(role.permissions) ? role.permissions : [],
          });
        } catch (error) {
          console.error("Error cargando rol:", error);
          window.mostrarAlerta("Error cargando el rol", "error");
        } finally {
          setLoading(false);
        }
      } else if (mode === "create") {
        setFormData({ nombre: "", descripcion: "", permissions: [] });
        setErrors({});
      }
    };

    fetchRole();
  }, [isOpen, mode, roleId]);

  // 🔹 Manejar cambios de input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  // 🔹 Agregar o quitar permisos
  const handlePermissionToggle = (permissionId) => {
    if (isViewMode) return;
    setFormData((prev) => {
      const exists = prev.permissions.includes(permissionId);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permissionId)
          : [...prev.permissions, permissionId],
      };
    });
  };

  // 🔹 Validaciones básicas
  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim() || formData.nombre.trim().length < 3) {
      newErrors.nombre = "Debe tener al menos 3 caracteres";
    }
    if (!formData.descripcion.trim() || formData.descripcion.trim().length < 5) {
      newErrors.descripcion = "Debe tener al menos 5 caracteres";
    }
    if (!formData.permissions.length) {
      newErrors.permissions = "Debe seleccionar al menos un permiso";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Guardar cambios
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      let savedRole;
      if (mode === "create") {
        savedRole = await createRole({
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim(),
          activo: true,
        });
      } else if (mode === "edit" && roleId) {
        await updateRole(roleId, {
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim(),
          activo: true,
        });
        savedRole = { id: roleId };
      }

      const rolId = savedRole?.id || roleId;
      await assignPermissionsToRole(rolId, formData.permissions);

      if (onSaved) onSaved();
      window.mostrarAlerta("✅ Rol y permisos guardados correctamente", "success");

      onClose();
    } catch (error) {
      console.error("❌ Error al guardar rol:", error);
      const mensaje =
        error.response?.data ||
        "Error al guardar el rol. Verifique los datos e intente de nuevo.";
      window.mostrarAlerta(mensaje, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {mode === "create"
              ? "Crear Rol"
              : mode === "edit"
              ? "Editar Rol"
              : "Detalles del Rol"}
          </h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="form-body">
          {loading ? (
            <p>⏳ Cargando datos...</p>
          ) : (
            <>
              <div className="form-group">
                <label>
                  Nombre del Rol: <span className="required-asterisk">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del rol"
                  disabled={isViewMode}
                />
                {errors.nombre && <small className="error">{errors.nombre}</small>}
              </div>

              <div className="form-group">
                <label>
                  Descripción: <span className="required-asterisk">*</span>
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción del rol"
                  disabled={isViewMode}
                />
                {errors.descripcion && <small className="error">{errors.descripcion}</small>}
              </div>

              <label>
                Permisos: <span className="required-asterisk">*</span>
              </label>
              <ModulePermissions
                selectedPermissions={formData.permissions}
                onPermissionToggle={handlePermissionToggle}
                isDisabled={isViewMode}
              />
              {errors.permissions && <small className="error">{errors.permissions}</small>}

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={onClose}>
                  {isViewMode ? "Cerrar" : "Cancelar"}
                </button>
                {!isViewMode && (
                  <button
                    type="button"
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Guardando..." : mode === "create" ? "Crear" : "Guardar"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleFormModal;
