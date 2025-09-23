import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ClientesViewModal = ({ cliente, onClose }) => {
  if (!cliente) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles del Cliente</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="user-details-container">
          <div className="user-details-row">
            <span className="detail-label">Nombre:</span>
            <span className="detail-value">{cliente.nombre}</span>
          </div>
          <div className="user-details-row">
            <span className="detail-label">Apellido:</span>
            <span className="detail-value">{cliente.apellido}</span>
          </div>
          <div className="user-details-row">
            <span className="detail-label">Tipo Documento:</span>
            <span className="detail-value">{cliente.tipoDoc}</span>
          </div>
          <div className="user-details-row">
            <span className="detail-label">Documento:</span>
            <span className="detail-value">{cliente.documento}</span>
          </div>
          <div className="user-details-row">
            <span className="detail-label">Fecha Nacimiento:</span>
            <span className="detail-value">{cliente.fechaNac}</span>
          </div>
          <div className="user-details-row">
            <span className="detail-label">Celular:</span>
            <span className="detail-value">{cliente.celular || '-'}</span>
          </div>
          <div className="user-details-row">
            <span className="detail-label">Correo:</span>
            <span className="detail-value">{cliente.correo || '-'}</span>
          </div>
          <div className="user-details-row">
            <span className="detail-label">Dirección:</span>
            <span className="detail-value">{cliente.direccion || '-'}</span>
          </div>
          <div className="user-details-row">
            <span className="detail-label">Estado:</span>
            <span className={`detail-value ${cliente.activo ? 'active' : 'inactive'}`}>
              {cliente.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        <div className="form-actions">
          <button 
            className="close-details-button" 
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientesViewModal;