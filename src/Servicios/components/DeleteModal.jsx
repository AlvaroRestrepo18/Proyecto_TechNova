import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./ConfirmationModal.css"; // 🔹 Usa el mismo CSS que el modal de confirmación

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName, itemType = "servicio" }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro
      >
        {/* Header */}
        <div className="confirm-header" style={{ color: "#dc3545" }}>
          <FontAwesomeIcon icon={faExclamationTriangle} color="#dc3545" size="lg" />
          <span>Confirmar eliminación</span>
        </div>

        {/* Body */}
        <div className="confirm-body" style={{ flexDirection: "column", textAlign: "center" }}>
          <p>
            ¿Estás seguro que deseas eliminar este {itemType}{" "}
            <strong>"{itemName}"</strong>?
          </p>
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            Esta acción no se puede deshacer.
          </p>
        </div>

        {/* Footer */}
        <div className="confirm-footer" style={{ gap: "10px" }}>
          <button
            className="confirm-button"
            onClick={onClose}
            style={{ backgroundColor: "#6c757d" }}
          >
            Cancelar
          </button>
          <button
            className="confirm-button"
            onClick={onConfirm}
            style={{ backgroundColor: "#dc3545" }}
          >
            <FontAwesomeIcon icon={faTrash} style={{ marginRight: "5px" }} />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
