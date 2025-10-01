import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const CategoryTable = ({ categorias, searchTerm, onEdit, onView, onDelete }) => {
  const filteredCategorias = categorias.filter(cat =>
    (cat.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) || // 👈 corregido
    (cat.descripcion || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.tipoCategoria || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Nombre de la Categoría</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategorias.map((cat, index) => (
            <tr key={cat.id || index}>
              <td>
                <span
                  className={`badge ${
                    cat.tipoCategoria === 'Producto' ? 'badge-producto' : 'badge-servicio'
                  }`}
                >
                  {cat.tipoCategoria}
                </span>
              </td>
              <td>{cat.nombre}</td> {/* 👈 corregido */}
              <td>{cat.descripcion}</td>
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
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button
                  className="icon-button"
                  title="Eliminar"
                  onClick={() => onDelete(cat.id)}
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
