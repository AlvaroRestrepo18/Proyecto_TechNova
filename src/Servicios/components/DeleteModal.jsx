import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName, itemType = "servicio" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal">
        <div className="modal-header" style={{ backgroundColor: '#1e3c72' }}>
          <h2>Confirmar Eliminación</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="form-body">
          <p>¿Estás seguro que deseas eliminar este {itemType} "{itemName}"?</p>
          <div className="form-actions">
            <button className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button className="delete-confirm-button" onClick={onConfirm}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;