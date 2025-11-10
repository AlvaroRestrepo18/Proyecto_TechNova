import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrash, faPowerOff } from '@fortawesome/free-solid-svg-icons';

const ClientesTable = ({ clientes, onToggleStatus, onEdit, onDelete, onView }) => {
  return (
    <table className="clientes-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Tipo Doc</th>
          <th>Documento</th>
          <th>Estado</th>
          <th className="action-column">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map((cliente) => (
          <tr key={cliente.id}>
            <td>{cliente.nombre}</td>
            <td>{cliente.apellido}</td>
            <td>{cliente.tipoDoc}</td>
            <td>{cliente.documento}</td>
            <td>
              <button
                className={`status-toggle ${cliente.activo ? 'active' : 'inactive'}`}
                onClick={() => onToggleStatus(cliente)}  
                title={cliente.activo ? 'Desactivar cliente' : 'Activar cliente'}
              >
                <FontAwesomeIcon icon={faPowerOff} />
                {cliente.activo ? ' Activo' : ' Inactivo'}
              </button>
            </td>
            <td className="actions">
              <button
                className="icon-button view"
                onClick={() => onView(cliente)}
                title="Ver cliente"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button
                className="icon-button edit"
                onClick={() => onEdit(cliente)}
                title="Editar cliente"
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button
                className="icon-button delete"
                onClick={() => onDelete(cliente)}
                title="Eliminar cliente"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClientesTable;
