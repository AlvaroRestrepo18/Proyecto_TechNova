import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const ServiciosTable = ({ servicios, onEdit, onDelete, onView }) => {
  return (
    <table className="servicios-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Detalles</th>
          <th className="actions-header">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {servicios.length > 0 ? (
          servicios.map((servicio) => (
            <tr key={servicio.id}>
              <td>{servicio.nombre}</td>
              <td>
                {servicio.precio
                  ? `$${servicio.precio.toLocaleString("es-CO")}`
                  : "—"}
              </td>
              <td>{servicio.detalles?.trim() || "—"}</td>
              <td className="actions-cell">
                <button
                  className="icon-button view"
                  title="Ver detalles"
                  onClick={() => onView(servicio)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button
                  className="icon-button edit"
                  title="Editar"
                  onClick={() => onEdit(servicio)}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button
                  className="icon-button delete"
                  title="Eliminar"
                  onClick={() => onDelete(servicio.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="no-data">
              No hay servicios registrados.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ServiciosTable;
