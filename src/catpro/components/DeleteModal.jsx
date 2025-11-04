import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./ConfirmationModal.css";

const DeleteModal = ({
  onClose,
  onConfirm,
  title = "Confirmar eliminación",
  message = "¿Estás seguro de que deseas eliminar este elemento?",
  isLoading = false,
}) => {
  // 🚀 Cerrar con tecla "Esc"
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isLoading, onClose]);

  // 🚀 Cerrar clicando fuera del modal
  const handleOverlayClick = () => {
    if (!isLoading) onClose();
  };

  return (
    <div className="delete-overlay" onClick={handleOverlayClick}>
      <div
        className="delete-modal"
        onClick={(e) => e.stopPropagation()} // evita cierre interno
      >
        {/* Header */}
        <div className="delete-header">
          <FontAwesomeIcon icon={faTrash} className="delete-icon" />
          <span>{title}</span>
          <button
            className="close-button"
            onClick={onClose}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body */}
        <div className="delete-body">
          <p>{message}</p>
        </div>

        {/* Footer */}
        <div className="delete-footer">
          <button
            type="button"
            className="delete-cancel-btn"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="delete-confirm-btn"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Eliminando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faTrash} /> Eliminar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
