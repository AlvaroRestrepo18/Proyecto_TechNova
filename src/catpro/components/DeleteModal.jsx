import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const DeleteModal = ({ onClose, onConfirm, title, message }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="form-body">
          <p>{message}</p>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="delete-button" onClick={onConfirm}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;