import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Roles.css";

const RoleDetailsModal = ({ 
  isOpen, 
  onClose, 
  role,
  menuSections 
}) => {
  if (!isOpen || !role) return null;

  // Función para obtener los nombres de los módulos seleccionados
  const getSelectedModulesNames = () => {
    return role.modules.map(modulePath => {
      const [sectionName, path] = modulePath.split('-');
      const section = menuSections.find(s => s.title.toLowerCase() === sectionName);
      if (section) {
        const item = section.items.find(i => i.path === path);
        return item ? `${section.title} > ${item.name}` : null;
      }
      return null;
    }).filter(Boolean);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles del Rol</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="role-details-container">
          <div className="role-details-row">
            <span className="detail-label">ID:</span>
            <span className="detail-value">{role.id}</span>
          </div>
          <div className="role-details-row">
            <span className="detail-label">Nombre:</span>
            <span className="detail-value">{role.nombre}</span>
          </div>
          <div className="role-details-row">
            <span className="detail-label">Descripción:</span>
            <span className="detail-value">{role.descripcion}</span>
          </div>
          <div className="role-details-row">
            <span className="detail-label">Estado:</span>
            <span className={`detail-value status-${role.activo ? 'active' : 'inactive'}`}>
              {role.activo ? "Activo" : "Inactivo"}
            </span>
          </div>
          <div className="role-details-row">
            <span className="detail-label">Número de Permisos:</span>
            <span className="detail-value">{role.permisos}</span>
          </div>
          
          <div className="modules-details-section">
            <h3>Módulos Accesibles</h3>
            {role.modules && role.modules.length > 0 ? (
              <ul className="modules-list">
                {getSelectedModulesNames().map((moduleName, index) => (
                  <li key={index} className="module-item">
                    {moduleName}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-modules">No hay módulos asignados</p>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="close-details-button"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleDetailsModal;