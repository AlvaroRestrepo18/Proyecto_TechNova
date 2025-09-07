import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const TablaVentas = ({ ventas, toggleEstado, openViewModal, openPdfModal }) => (
  <table className="table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Fecha venta</th>
        <th>Método pago</th>
        <th>Total</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {ventas.map((venta, index) => (
        <tr key={venta.id || index}>
          <td>{venta.nombre}</td>
          <td>{venta.fecha}</td>
          <td>{venta.metodo}</td>
          <td>${venta.total.toFixed(2)}</td>
          <td>
            <button
              className={`status-toggle ${venta.estado === 'Activo' ? 'active' : 'inactive'}`}
              onClick={() => toggleEstado(venta.id)}
            >
              {venta.estado}
            </button>
          </td>
          <td>
            <button className="icon-button" title="Ver" onClick={() => openViewModal(venta)}>
              <FontAwesomeIcon icon={faEye} />
            </button>
            <button
              className="icon-button"
              title="PDF"
              onClick={() => openPdfModal(venta)}
            >
              <FontAwesomeIcon icon={faFilePdf} />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default TablaVentas;