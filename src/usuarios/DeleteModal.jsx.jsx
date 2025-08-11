import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import "../app.css"; // Asegúrate que lo tienes apuntando a app.css

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  itemName 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Confirmar Eliminación</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="delete-modal-body">
          <div className="delete-warning-icon">
            <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
          </div>
          <p>
            ¿Estás seguro que deseas eliminar al usuario <strong>{itemName}</strong>?
          </p>
          <p>Esta acción no se puede deshacer.</p>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            type="button" 
            className="delete-confirm-button"
            onClick={onConfirm}
          >
            <FontAwesomeIcon icon={faTrash} /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
