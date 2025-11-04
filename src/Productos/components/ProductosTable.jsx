import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ProductosTable = ({ productos, categorias, onView, onEdit, onDelete }) => (
  <table className="table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Categoría</th>
        <th>Precio</th>
        <th>Cantidad</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {productos.map((producto) => (
        <tr key={producto.id}>
          <td>{producto.nombre}</td>
          <td>{categorias.find(c => c.id === producto.categoriaId)?.nombre || "Sin categoría"}</td>
          <td>${producto.precio?.toFixed(2)}</td>
          <td>{producto.cantidad}</td>
          <td>
            <button className="icon-button" onClick={() => onView(producto)}><FontAwesomeIcon icon={faEye} /></button>
            <button className="icon-button" onClick={() => onEdit(producto)}><FontAwesomeIcon icon={faEdit} /></button>
            <button className="icon-button" onClick={() => onDelete(producto)} style={{ color: '#e74c3c' }}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ProductosTable;
