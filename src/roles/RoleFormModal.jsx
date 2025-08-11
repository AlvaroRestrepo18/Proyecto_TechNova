import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ModulePermissions from "./ModulePermissions";
import { createRole, updateRole, getRoleById, assignPermissionsToRole } from "../api/roles";
import "./Roles.css";

const RoleFormModal = ({
  isOpen,
  onClose,
  roleId,
  mode = "create",
  onSaved,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    permissions: [],
  });
  const [errors, setErrors] = useState({});
  const isViewMode = mode === "view";

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && roleId) {
      async function fetchData() {
        try {
          const role = await getRoleById(roleId);
          // Asegurar que permissions sea un array de ids
          const permisosIds = Array.isArray(role.permissions)
            ? role.permissions.map((p) => {
                if (typeof p === "object" && p !== null) {
                  return p.id ?? p.id_permiso ?? p.idRolPermiso ?? null;
                }
                return p;
              }).filter(Boolean)
            : [];
          setFormData({
            nombre: role.nombre || "",
            descripcion: role.descripcion || "",
            permissions: permisosIds,
          });
        } catch (error) {
          console.error("Error cargando rol y permisos:", error);
        }
      }
      fetchData();
    } else if (mode === "create") {
      setFormData({
        nombre: "",
        descripcion: "",
        permissions: [],
      });
      setErrors({});
    }
  }, [mode, roleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handlePermissionToggle = (permissionId) => {
    if (isViewMode) return;

    const currentPermissions = formData.permissions || [];
    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter((p) => p !== permissionId)
      : [...currentPermissions, permissionId];

    setFormData((f) => ({ ...f, permissions: newPermissions }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre || formData.nombre.trim().length < 3) {
      newErrors.nombre = "Debe tener al menos 3 caracteres";
    }
    if (!formData.descripcion || formData.descripcion.trim().length < 5) {
      newErrors.descripcion = "Debe tener al menos 5 caracteres";
    }
    if (!Array.isArray(formData.permissions) || formData.permissions.length === 0) {
      newErrors.permissions = "Debe seleccionar al menos un permiso";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      let savedRole;
      if (mode === "create") {
        savedRole = await createRole({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          activo: true,
        });
      } else if (mode === "edit" && roleId) {
        await updateRole(roleId, {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          activo: true,
        });
        savedRole = { id: roleId };
      }

      const rolId = savedRole?.id || roleId;

      await assignPermissionsToRole(rolId, formData.permissions);

      if (onSaved) onSaved();
      onClose();
    } catch (error) {
      console.error("Error al guardar rol y permisos:", error);
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
              >
                {mode === "create" ? "Crear" : "Guardar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleFormModal;
