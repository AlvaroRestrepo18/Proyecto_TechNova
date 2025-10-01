import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const ProductosTable = ({ productos, onEdit, onDelete, onView }) => {
  if (!productos || productos.length === 0) {
    return <div className="no-data">No hay productos registrados</div>;
  }

  return (
    <table className="productos-table">
      <thead>
        <tr>
          {/* ❌ Eliminado ID */}
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Fecha Creación</th>
          <th className="actions-column">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((producto, index) => (
          <tr key={index}>
            {/* ❌ Eliminado producto.id */}
            <td>{producto.nombre}</td>
            <td>{producto.categoria?.nombre || "Sin categoría"}</td>
            <td>{producto.cantidad ?? 0}</td>
            <td>${producto.precio?.toFixed(2) ?? "0.00"}</td>
            <td>
              {producto.fechaCreacion
                ? new Date(producto.fechaCreacion).toLocaleDateString()
                : "N/A"}
            </td>
            <td className="actions-column">
              <div className="actions-container">
                <button
                  className="action-button view-button"
                  title="Ver"
                  onClick={() => onView(producto)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button
                  className="action-button edit-button"
                  title="Editar"
                  onClick={() => onEdit(producto)}
                >
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
