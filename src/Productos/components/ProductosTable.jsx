import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ProductosTable = ({ productos, onToggleEstado, onEdit, onDelete, onView }) => {
  if (productos.length === 0) {
    return <div className="no-data">No hay productos registrados</div>;
  }

  return (
    <table className="productos-table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Estado</th>
          <th className='actions-column'>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((producto) => (
          <tr key={producto.id}>
            <td>{producto.codigo}</td>
            <td>{producto.nombre}</td>
            <td>{producto.categoria}</td>
            <td>${producto.precio.toFixed(2)}</td>
            <td>
              <span className={producto.stock <= producto.stockMinimo ? 'stock-low' : 'stock-ok'}>
                {producto.stock} {producto.stock <= producto.stockMinimo && '⚠️'}
              </span>
            </td>
            <td>
              <button 
                className={`status-toggle ${producto.estado === 'Activo' ? 'active' : 'inactive'}`}
                onClick={() => onToggleEstado(producto.id)}
              >
                {producto.estado}
              </button>
            </td>
            <td className='actions-column'>
              <div className="actions-container">
                <button className="action-button view-button" title="Ver" onClick={() => onView(producto)}>
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button className="action-button edit-button" title="Editar" onClick={() => onEdit(producto)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button 
                  className="action-button delete-button" 
                  title="Eliminar" 
                  onClick={() => onDelete(producto)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductosTable;