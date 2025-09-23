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
          <th>Celular</th>
          <th>Estado</th>
          <th className='Action'>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map(cliente => (
          <tr key={cliente.id}>
            <td>{cliente.nombre}</td>
            <td>{cliente.apellido}</td>
            <td>{cliente.tipoDoc}</td>
            <td>{cliente.documento}</td>
            <td>{cliente.celular || '-'}</td>
            <td>
              <button 
                className={`status-toggle ${cliente.activo ? 'active' : 'inactive'}`}
                onClick={() => onToggleStatus(cliente.id)}
              >
                <FontAwesomeIcon icon={faPowerOff} />
                {cliente.activo ? ' Activo' : ' Inactivo'}
              </button>
            </td>
            <td>
              <button 
                className="icon-button" 
                onClick={() => onView(cliente)}
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button 
                className="icon-button" 
                onClick={() => onEdit(cliente)}
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button 
                className="icon-button" 
                onClick={() => onDelete(cliente)}
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