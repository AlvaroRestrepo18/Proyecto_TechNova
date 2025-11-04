import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import "./ConfirmationModal.css";

const DeleteModal = ({ producto, onConfirm, onClose }) => {
  if (!producto) return null;

  return (
    <div className="delete-overlay" onClick={onClose}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="delete-header">
          <FontAwesomeIcon icon={faExclamationTriangle} className="delete-icon-alert" />
          <span>Eliminar producto</span>
        </div>

        {/* Body */}
        <div className="delete-body">
          <FontAwesomeIcon icon={faTrash} className="delete-icon" />
          <div className="delete-text">
            <h3>
              ¿Estás seguro de eliminar <strong>{producto.nombre}</strong>?
            </h3>
            <p>Esta acción no se puede deshacer.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="delete-footer">
          <button className="delete-cancel-btn" onClick={onClose}>
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
};

export default DeleteModal;
