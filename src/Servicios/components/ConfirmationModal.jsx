import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, isEditing }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content confirmation-modal">
        <h3>¿Confirmar {isEditing ? 'actualización' : 'creación'}?</h3>
        <div className="form-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancelar
          </button>
          <button className="submit-button" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;