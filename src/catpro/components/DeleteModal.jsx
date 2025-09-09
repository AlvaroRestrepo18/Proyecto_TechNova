import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

const DeleteModal = ({ 
  onClose, 
  onConfirm, 
  title, 
  message, 
  isLoading = false 
}) => {
  
  // 🚀 Cerrar con tecla "Esc"
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isLoading, onClose]);

  // 🚀 Cerrar clicando fuera del modal
  const handleOverlayClick = () => {
    if (!isLoading) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div 
        className="modal-content confirm-modal" 
        onClick={(e) => e.stopPropagation()} // evita cerrar clicando dentro
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button 
            className="close-button" 
            onClick={onClose} 
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="form-body">
          <p>{message}</p>
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose} 
              disabled={isLoading}
            >
              Cancelar
            </button>

            <button 
              type="button" 
              className="delete-button" 
              onClick={onConfirm} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
