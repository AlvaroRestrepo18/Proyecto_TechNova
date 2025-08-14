import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPen,
  faTrash,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import "../../App.css";

const RoleTable = ({ roles, onView, onEdit, onDelete, onToggleEstado }) => {
  const getEstadoClass = (estado) => (estado ? "active" : "inactive");
  const getEstadoText = (estado) => (estado ? " Activo" : " Inactivo");

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            {/* Puedes quitar "Permisos" si no usas ese campo */}
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((rol) => (
            <tr key={rol.id}>
              <td>{rol.nombre}</td>
              <td>{rol.descripcion}</td>
              {/* <td>{rol.permisos || "-"}</td> Si quieres mostrar permisos, ajusta aquí */}
              <td>
                <button
                  className={`status-toggle ${getEstadoClass(rol.activo)}`}
                  onClick={() => onToggleEstado(rol.id, rol.activo)}
                  title={rol.activo ? "Desactivar" : "Activar"}
                >
                  <FontAwesomeIcon icon={faPowerOff} />
                  <span>{getEstadoText(rol.activo)}</span>
                </button>
              </td>
              <td>
                <button
                  className="icon-button"
                  title="Ver"
                  // Todos pueden ver, no se deshabilita
                  onClick={() => onView(rol.id)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>

                <button
                  className="icon-button"
                  title="Editar"
                  // Solo se puede editar si está activo
                  disabled={!rol.activo}
                  onClick={() => onEdit(rol.id)}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>

                <button
                  className="icon-button"
                  title="Eliminar"
                  // Solo se puede eliminar si está inactivo
                  disabled={rol.activo}
                  onClick={() => onDelete(rol.id)}
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

export default RoleTable;
