import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ProductosViewModal = ({ producto, categorias, onClose }) => {
  if (!producto) return null;
  const categoria = categorias.find(c => c.id === producto.categoriaId)?.nombre || "Sin categoría";
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles del Producto</h2>
          <button className="close-button" onClick={onClose}><FontAwesomeIcon icon={faTimes} /></button>
        </div>
        <div className="user-details-container">
          <p><b>Nombre:</b> {producto.nombre}</p>
          <p><b>Categoría:</b> {categoria}</p>
          <p><b>Precio:</b> ${producto.precio?.toFixed(2)}</p>
          <p><b>Cantidad:</b> {producto.cantidad}</p>
          <p><b>Fecha de Creación:</b> {new Date(producto.fechaCreacion).toLocaleDateString()}</p>
          <div className="form-actions">
            <button type="button" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductosViewModal;
