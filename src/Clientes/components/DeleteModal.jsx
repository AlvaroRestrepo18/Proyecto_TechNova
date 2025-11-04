import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faExclamationTriangle, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./ConfirmationModal.css";

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName = "", itemType = "registro" }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-overlay" onClick={onClose}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* 🔹 Encabezado */}
        <div className="delete-header">
          <FontAwesomeIcon icon={faExclamationTriangle} className="delete-icon-alert" />
          <span>Eliminar {itemType}</span>
          <button className="delete-close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* 🔹 Cuerpo */}
        <div className="delete-body">
          <FontAwesomeIcon icon={faTrash} className="delete-icon" />
          <div className="delete-text">
            <h3>
              ¿Estás seguro de eliminar{" "}
              <strong>{itemName || `este ${itemType}`}</strong>?
            </h3>
            <p>Esta acción no se puede deshacer.</p>
          </div>
        </div>

        {/* 🔹 Pie */}
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
