import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrash, faPowerOff } from '@fortawesome/free-solid-svg-icons';

const CategoryTable = ({ categorias, searchTerm, onEdit, onView, onDelete }) => {
  const filteredCategorias = categorias.filter(cat =>
    cat.nombreCategoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.tipoCategoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCategoriaEstado = (id) => {
    // Esta función debería manejarse en el componente principal
    console.log('Toggle estado:', id);
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Nombre de la Categoría</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategorias.map((cat, index) => (
            <tr key={index}>
              <td>
                <span className={`badge ${cat.tipoCategoria === 'Producto' ? 'badge-producto' : 'badge-servicio'}`}>
                  {cat.tipoCategoria}
                </span>
              </td>
              <td>{cat.nombreCategoria}</td>
              <td>
                <button
                  className={`status-toggle ${cat.activo ? 'active' : 'inactive'}`}
                  onClick={() => toggleCategoriaEstado(cat.id)}
                  title={cat.activo ? 'Desactivar' : 'Activar'}
                >
                  <FontAwesomeIcon icon={faPowerOff} />
                  <span>{cat.activo ? ' Activo' : ' Inactivo'}</span>
                </button>
              </td>
              <td>
                <button 
                  className="icon-button" 
                  title="Ver" 
                  onClick={() => onView(cat)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button 
                  className="icon-button" 
                  title="Editar" 
                  onClick={() => onEdit(cat)}
                  disabled={!cat.activo}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button 
                  className="icon-button" 
                  title="Eliminar" 
                  onClick={() => onDelete(cat.id)}
                  disabled={!cat.activo}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;