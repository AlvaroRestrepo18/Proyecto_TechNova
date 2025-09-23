import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const ComprasTable = ({ compras, onToggleEstado, onView, onPdf }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Proveedor</th>
          <th>Fecha compra</th>
          <th>Fecha registro</th>
          <th>Método pago</th>
          <th>Total</th>
          <th>Estado</th>
          <th className='Action'>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {compras.map((compra, index) => (
          <tr key={index}>
            <td>{compra.proveedor}</td>
            <td>{new Date(compra.fecha).toLocaleDateString()}</td>
            <td>{new Date(compra.fechaRegistro).toLocaleDateString()}</td>
            <td>{compra.metodo}</td>
            <td>${compra.total.toFixed(2)}</td>
            <td>
              <button 
                className={`status-toggle ${compra.estado === 'Activo' ? 'active' : 'inactive'}`}
                onClick={() => onToggleEstado(compra.id)}
              >
                {compra.estado}
              </button>
            </td>
            <td className='Action'>
              <button className="icon-button" title="Ver" onClick={() => onView(compra)}>
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button 
                className="icon-button" 
                title="PDF" 
                onClick={() => onPdf(compra)}
                style={{color: '#e74c3c'}}
              >
                <FontAwesomeIcon icon={faFilePdf} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ComprasTable;