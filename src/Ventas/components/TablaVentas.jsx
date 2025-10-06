import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const TablaVentas = ({ ventas = [], toggleEstado, openViewModal, openPdfModal }) => {
  if (!ventas || ventas.length === 0) {
    return <div className="no-data">No hay ventas registradas</div>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Fecha</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {ventas.map((venta, index) => (
          <tr key={venta.id || index}>

            {/* 👤 Cliente */}
            <td>
              {venta.cliente.nombre && venta.cliente?.apellido
                ? `${venta.cliente.nombre} ${venta.cliente.apellido}`
                : venta.cliente?.nombre || `Cliente #${venta.clienteId || 'N/A'}`}
            </td>

            {/* 📅 Fecha */}
            <td>
              {venta.fecha
                ? new Date(venta.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                : 'Sin fecha'}
            </td>

            {/* 💰 Total */}
            <td>${Number(venta.total || 0).toFixed(2)}</td>

            {/* ⚙️ Estado */}
            <td>
              <button
                className={`status-toggle ${venta.estado ? 'active' : 'inactive'}`}
                onClick={() => toggleEstado?.(venta.id, venta.estado)}
              >
                {venta.estado ? 'Activo' : 'Inactivo'}
              </button>
            </td>

            {/* 🧰 Acciones */}
            <td>
              <div className="action-buttons">
                <button
                  className="icon-button view"
                  title="Ver detalles"
                  onClick={() => openViewModal?.(venta.id)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>

                <button
                  className="icon-button pdf"
                  title="Generar PDF"
                  onClick={() => openPdfModal?.(venta.id)}
                >
                  <FontAwesomeIcon icon={faFilePdf} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaVentas;
