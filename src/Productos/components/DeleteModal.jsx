import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName, itemType = "producto" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Confirmar Eliminación</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="delete-content">
          <div className="delete-warning">
            <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
            <h3>¿Estás seguro de eliminar este {itemType}?</h3>
          </div>
          
          <div className="delete-details">
            <p><strong>Item:</strong> {itemName}</p>
            <p className="warning-text">
              Esta acción no se puede deshacer. El {itemType} será eliminado permanentemente.
            </p>
          </div>

          <div className="delete-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button 
              type="button" 
              className="delete-button"
              onClick={onConfirm}
            >
              Sí, Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;