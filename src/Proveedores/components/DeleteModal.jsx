import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faQuestionCircle, faExclamationTriangle, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./ConfirmationModal.css";

const DeleteModal = ({ type, proveedor, onConfirm, onCancel, onClose }) => {
  if (!type) return null;

  // Obtener nombre del proveedor (natural o jurídico)
  const nombreProveedor =
    proveedor?.tipoPersona === "Natural"
      ? `${proveedor?.nombres} ${proveedor?.apellidos}`
      : proveedor?.razonSocial;

  // Tipo: Confirmación de eliminación
  if (type === "confirm") {
    return (
      <div className="delete-overlay" onClick={onCancel}>
        <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="delete-header">
            <FontAwesomeIcon icon={faQuestionCircle} className="delete-icon-alert" />
            <span>Confirmar eliminación</span>
            <button className="close-button" onClick={onCancel}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Body */}
          <div className="delete-body">
            <FontAwesomeIcon icon={faTrash} className="delete-icon" />
            <div className="delete-text">
              <h3>
                ¿Estás seguro de eliminar al proveedor{" "}
                <strong>{nombreProveedor}</strong>?
              </h3>
              <p>Esta acción no se puede deshacer.</p>
            </div>
          </div>

          {/* Footer */}
          <div className="delete-footer">
            <button className="delete-cancel-btn" onClick={onCancel}>
              Cancelar
            </button>
            <button className="delete-confirm-btn" onClick={onConfirm}>
              <FontAwesomeIcon icon={faTrash} />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tipo: Alerta (no se puede eliminar)
  if (type === "alert") {
    return (
      <div className="delete-overlay" onClick={onClose}>
        <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="delete-header">
            <FontAwesomeIcon icon={faExclamationTriangle} className="delete-icon-alert" />
            <span>No se puede eliminar</span>
            <button className="close-button" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Body */}
          <div className="delete-body">
            <div className="delete-text">
              <p>
                Este proveedor está asociado a una o más compras y no puede ser eliminado.
              </p>
              <p>
                Puedes cambiar su estado a <strong>"Anulado"</strong> si deseas desactivarlo.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="delete-footer">
            <button className="delete-confirm-btn" onClick={onClose}>
              Entendido
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DeleteModal;
