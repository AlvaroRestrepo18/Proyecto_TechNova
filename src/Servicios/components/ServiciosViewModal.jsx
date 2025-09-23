import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ServiciosViewModal = ({ servicio, onClose }) => {
  if (!servicio) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ backgroundColor: '#1e3c72' }}>
          <h2>Detalles del Servicio</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="details-body">
          <div className="details-row">
            <strong>ID:</strong> {servicio.id}
          </div>
          <div className="details-row">
            <strong>Nombre:</strong> {servicio.name}
          </div>
          <div className="details-row">
            <strong>Precio:</strong> ${servicio.price}
          </div>
          <div className="details-row">
            <strong>Estado:</strong> 
            <span className={`details-value ${servicio.active ? 'active' : 'inactive'}`}>
              {servicio.active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div className="details-row">
            <strong>Detalles:</strong>
            <div>
              {servicio.details.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
          <div className="details-row">
            <strong>Imagen:</strong>
            <img 
              src={servicio.image} 
              alt="Servicio" 
              style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="submit-button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiciosViewModal;