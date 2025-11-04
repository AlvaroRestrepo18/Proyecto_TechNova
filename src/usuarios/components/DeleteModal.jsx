import React from "react";
import "./DeleteModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h2 className="delete-modal-title">¿Eliminar elemento?</h2>
        <p className="delete-modal-message">
          Estás a punto de eliminar <strong>{itemName}</strong>.  
          Esta acción no se puede deshacer.
        </p>

        <div className="delete-modal-actions">
          <button className="delete-cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="delete-confirm-btn" onClick={onConfirm}>
            <FontAwesomeIcon icon={faTrash} className="delete-icon" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

