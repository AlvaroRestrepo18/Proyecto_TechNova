import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ProductosViewModal = ({ producto, onClose }) => {
  if (!producto) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles del Producto</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="details-container">
          <div className="detail-row">
            <span className="detail-label">ID:</span>
            <span className="detail-value">{producto.id}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Nombre:</span>
            <span className="detail-value">{producto.nombre}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Categoría:</span>
            <span className="detail-value">
              {producto.categoria?.nombre || 'Sin categoría'}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Cantidad:</span>
            <span className="detail-value">{producto.cantidad ?? 0} unidades</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Precio:</span>
            <span className="detail-value">
              ${producto.precio?.toFixed(2) ?? '0.00'}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Fecha de Creación:</span>
            <span className="detail-value">
              {producto.fechaCreacion
                ? new Date(producto.fechaCreacion).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>

          <div className="modal-actions">
            <button type="button" className="close-button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductosViewModal;
