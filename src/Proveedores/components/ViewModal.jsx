import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const ViewModal = ({ proveedor, onClose }) => {
  if (!proveedor) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles del Proveedor</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="user-details-container">
          <div className="user-details-row">
            <span className="detail-label">Tipo Persona:</span>
            <span className="detail-value">
              {proveedor.tipoPersona === 'Natural' ? 'Persona Natural' : 'Persona Jurídica'}
            </span>
          </div>
          
          <div className="user-details-row">
            <span className="detail-label">Tipo Documento:</span>
            <span className="detail-value">
              {proveedor.tipoDocumento === 'CC' ? 'Cédula de Ciudadanía' : 
               proveedor.tipoDocumento === 'NIT' ? 'NIT' : 
               proveedor.tipoDocumento === 'CE' ? 'Cédula de Extranjería' : 'Pasaporte'}
            </span>
          </div>
          
          <div className="user-details-row">
            <span className="detail-label">N° Documento:</span>
            <span className="detail-value">{proveedor.numeroDocumento}</span>
          </div>
          
          {proveedor.tipoPersona === 'Natural' ? (
            <>
              <div className="user-details-row">
                <span className="detail-label">Nombres:</span>
                <span className="detail-value">{proveedor.nombres}</span>
              </div>
              
              <div className="user-details-row">
                <span className="detail-label">Apellidos:</span>
                <span className="detail-value">{proveedor.apellidos}</span>
              </div>
            </>
          ) : (
            <div className="user-details-row">
              <span className="detail-label">Razón Social:</span>
              <span className="detail-value">{proveedor.razonSocial}</span>
            </div>
          )}
          
          <div className="user-details-row">
            <span className="detail-label">Estado:</span>
            <span className={`detail-value ${proveedor.estado === 'Activo' ? 'status-active' : 'status-inactive'}`}>
              {proveedor.estado}
            </span>
          </div>
          
          <div className="user-details-row">
            <span className="detail-label">Teléfono:</span>
            <span className="detail-value">{proveedor.telefono || 'N/A'}</span>
          </div>
          
          <div className="user-details-row">
            <span className="detail-label">Correo:</span>
            <span className="detail-value">{proveedor.correo || 'N/A'}</span>
          </div>
          
          <div className="user-details-row">
            <span className="detail-label">Dirección:</span>
            <span className="detail-value">{proveedor.direccion || 'N/A'}</span>
          </div>
          
          {proveedor.tieneCompras && (
            <div className="user-details-row">
              <span className="detail-label"></span>
              <span className="detail-value" style={{color: '#e67e22', fontWeight: 'bold'}}>
                <FontAwesomeIcon icon={faExclamationTriangle} /> Este proveedor tiene compras asociadas
              </span>
            </div>
          )}
          
          <div className="form-actions">
            <button type="button" className="close-details-button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;