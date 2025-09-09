import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faQuestionCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const DeleteModal = ({ type, proveedor, onConfirm, onCancel, onClose }) => {
  if (type === 'confirm') {
    return (
      <div className="modal-overlay">
        <div className="modal-content delete-modal">
          <div className="modal-header">
            <h2>Confirmar eliminación</h2>
            <button className="close-button" onClick={onCancel}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="delete-modal-body">
            <FontAwesomeIcon icon={faQuestionCircle} className="delete-warning-icon" size="3x" />
            <p>¿Estás seguro que deseas eliminar al proveedor <strong>
              {proveedor?.tipoPersona === 'Natural' 
                ? `${proveedor?.nombres} ${proveedor?.apellidos}`
                : proveedor?.razonSocial}
            </strong>?</p>
            <p>Esta acción no se puede deshacer.</p>
          </div>
          <div className="form-actions">
            <button className="cancel-button" onClick={onCancel}>
              Cancelar
            </button>
            <button className="delete-confirm-button" onClick={onConfirm}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'alert') {
    return (
      <div className="modal-overlay">
        <div className="modal-content delete-modal">
          <div className="modal-header">
            <h2>No se puede eliminar</h2>
            <button className="close-button" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="delete-modal-body">
            <FontAwesomeIcon icon={faExclamationTriangle} className="delete-warning-icon" size="3x" />
            <p>Este proveedor está asociado a una o más compras y no puede ser eliminado.</p>
            <p>Puedes cambiar su estado a "Anulado" si deseas desactivarlo.</p>
          </div>
          <div className="form-actions">
            <button className="close-details-button" onClick={onClose}>
              Entendido
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DeleteModal;