import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ProductosViewModal = ({ producto, onClose }) => {
  if (!producto) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles del Producto</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="details-container">
          <div className="detail-row">
            <span className="detail-label">Código:</span>
            <span className="detail-value">{producto.codigo}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Nombre:</span>
            <span className="detail-value">{producto.nombre}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Categoría:</span>
            <span className="detail-value">{producto.categoria}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Precio:</span>
            <span className="detail-value">${producto.precio.toFixed(2)}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Stock Actual:</span>
            <span className="detail-value">{producto.stock} unidades</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Stock Mínimo:</span>
            <span className="detail-value">{producto.stockMinimo} unidades</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Estado:</span>
            <span className={`detail-value status-${producto.estado.toLowerCase()}`}>
              {producto.estado}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Descripción:</span>
            <span className="detail-value">{producto.descripcion || 'Sin descripción'}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Alerta Stock:</span>
            <span className="detail-value">
              {producto.stock <= producto.stockMinimo ? (
                <span className="stock-alert low">⚠️ Stock bajo</span>
              ) : (
                <span className="stock-alert ok">✅ Stock suficiente</span>
              )}
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