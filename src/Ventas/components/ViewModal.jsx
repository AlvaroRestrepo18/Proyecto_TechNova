import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ViewModal = ({ venta, onClose }) => {
  if (!venta) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content view-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles de Venta</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="view-modal-body">
          <div className="venta-info">
            <div className="info-row">
              <span className="info-label">ID Venta:</span>
              <span className="info-value">{venta.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Cliente:</span>
              <span className="info-value">{venta.nombre}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Fecha:</span>
              <span className="info-value">{venta.fecha}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Método Pago:</span>
              <span className="info-value">{venta.metodo}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Estado:</span>
              <span className={`info-value estado-${venta.estado.toLowerCase()}`}>
                {venta.estado}
              </span>
            </div>
          </div>

          <div className="section-divider"></div>

          <h3>Productos/Servicios</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Cantidad/Horas</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {venta.productos.map((item, index) => (
                <tr key={`prod-${index}`}>
                  <td>Producto</td>
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>${item.precio.toFixed(2)}</td>
                  <td>${(item.precio * item.cantidad).toFixed(2)}</td>
                </tr>
              ))}
              {venta.servicios.map((item, index) => (
                <tr key={`serv-${index}`}>
                  <td>Servicio</td>
                  <td>{item.nombre}</td>
                  <td>1</td>
                  <td>${item.precio.toFixed(2)}</td>
                  <td>${item.precio.toFixed(2)}</td>
                </tr>
              ))}
              {venta.equipos && venta.equipos.map((item, index) => (
                <tr key={`equi-${index}`}>
                  <td>Equipo</td>
                  <td>{item.nombre}</td>
                  <td>{item.horas} hora{item.horas > 1 ? 's' : ''}</td>
                  <td>${item.precioHora.toFixed(2)}/h</td>
                  <td>${(item.precioHora * item.horas).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="section-divider"></div>

          <div className="totals-section">
            <div className="total-row">
              <span>SubTotal:</span>
              <span>${venta.subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>${venta.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button className="close-modal-button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;