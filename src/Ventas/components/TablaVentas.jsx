import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFilePdf } from '@fortawesome/free-solid-svg-icons';

// Importación CORREGIDA - con V mayúscula
import { getVentas } from '../services/ventas';

const TablaVentas = ({ ventas, toggleEstado, openViewModal, openPdfModal }) => (
  <table className="table">
    <thead>
      <tr>
        <th>Cliente</th>
        <th>Fecha venta</th>
        <th>Método pago</th>
        <th>Total</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {ventas.length > 0 ? (
        ventas.map((venta, index) => (
          <tr key={venta.id || index}>
            <td>
              {venta.cliente?.nombre && venta.cliente?.apellido 
                ? `${venta.cliente.nombre} ${venta.cliente.apellido}`
                : venta.cliente?.nombre || venta.nombre || 'N/A'
              }
            </td>
            <td>{venta.fecha}</td>
            <td>{venta.metodo || 'N/A'}</td>
            <td>${venta.total?.toFixed(2) || '0.00'}</td>
            <td>
              <button
                className={`status-toggle ${venta.estado === 'Activo' ? 'active' : 'inactive'}`}
                onClick={() => toggleEstado(venta.id, venta.estado)}
              >
                {venta.estado || 'Activo'}
              </button>
            </td>
            <td>
              <div className="action-buttons">
                <button 
                  className="icon-button view" 
                  title="Ver detalles" 
                  onClick={() => openViewModal(venta.id)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button
                  className="icon-button pdf"
                  title="Generar PDF"
                  onClick={() => openPdfModal(venta.id)}
                >
                  <FontAwesomeIcon icon={faFilePdf} />
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="no-data">
            No hay ventas para mostrar
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default TablaVentas;