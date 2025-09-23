import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const ServiciosTable = ({ servicios, onToggleStatus, onEdit, onDelete, onView }) => {
  return (
    <table className="pedidos-table servicios-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Estado</th>
          <th className="actions-header">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {servicios.map((servicio) => {
          const isInactive = !servicio.active;
          return (
            <tr key={servicio.id} className={isInactive ? 'anulado-row' : ''}>
              <td>{servicio.name}</td>
              <td>${servicio.price}</td>
              <td>
                <button
                  className={`status-toggle ${servicio.active ? 'active' : 'anulado'}`}
                  onClick={() => onToggleStatus(servicio.id)}
                  disabled={isInactive}
                  title={servicio.active ? 'Desactivar' : 'Inactivo'}
                >
                  {servicio.active ? 'Activo' : 'Inactivo'}
                </button>
              </td>
              <td>
                <button
                  className="icon-button"
                  title="Ver detalles"
                  onClick={() => onView(servicio)}
                  disabled={isInactive}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button
                  className="icon-button"
                  title="Editar"
                  onClick={() => onEdit(servicio)}
                  disabled={isInactive}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button
                  className={`icon-button ${isInactive ? 'anulado' : 'delete'}`}
                  title={isInactive ? 'Inactivo' : 'Eliminar'}
                  onClick={() => onDelete(servicio.id)}
                  disabled={isInactive}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ServiciosTable;
