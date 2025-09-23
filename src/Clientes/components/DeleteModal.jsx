import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle, faTrash } from '@fortawesome/free-solid-svg-icons';

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName, itemType = "cliente" }) => {
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

        <div className="delete-modal-body">
          <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
          <p>¿Estás seguro de eliminar este {itemType}?</p>
          <p>Esta acción no se puede deshacer.</p>
        </div>

        <div className="form-actions">
          <button 
            className="cancel-button" 
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
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

export default DeleteModal;