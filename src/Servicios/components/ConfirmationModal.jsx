import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import "./ConfirmationModal.css"; // 🔹 Se conecta al CSS que me pasaste

const ConfirmationModal = ({ isOpen, onClose, onConfirm, isEditing }) => {
  if (!isOpen) return null;

  const icon = isEditing ? faCheckCircle : faQuestionCircle;
  const title = isEditing ? "Confirmar actualización" : "Confirmar creación";
  const message = isEditing
    ? "¿Deseas guardar los cambios realizados?"
    : "¿Deseas crear este nuevo servicio?";

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer click dentro
      >
        {/* Header */}
        <div className="confirm-header">
          <FontAwesomeIcon
            icon={icon}
            color={isEditing ? "#28a745" : "#0d6efd"}
            size="lg"
          />
          <span>{title}</span>
        </div>

        {/* Body */}
        <div className="confirm-body">
          <p>{message}</p>
        </div>

        {/* Footer */}
        <div className="confirm-footer">
          <button
            className="confirm-button"
            onClick={onConfirm}
            style={{
              backgroundColor: isEditing ? "#28a745" : "#0d6efd",
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
