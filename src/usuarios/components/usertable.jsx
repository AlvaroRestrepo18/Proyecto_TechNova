import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faTrash, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import "../../app.css";
import '../usuarios.css';

const UserTable = ({ users, onView, onEdit, onDelete, onToggleEstado }) => {
  const getEstadoClass = (estado) => (estado === "activo" ? "active" : "inactive");
  const getEstadoText = (estado) => (estado === "activo" ? "Activo" : "Inactivo");

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Estado</th>
            <th className="Action">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.name || "-"}</td>
              <td>{usuario.email || "-"}</td>
              <td>{usuario.telefono || "-"}</td>
              <td>{usuario.role || "-"}</td>
              <td>
                <button
                  className={`status-toggle ${getEstadoClass(usuario.estado)}`}
                  onClick={() => onToggleEstado(usuario.id, usuario.estado)}
                  title={`Cambiar estado (actual: ${getEstadoText(usuario.estado)})`}
                >
                  <FontAwesomeIcon icon={faPowerOff} />
                  <span>{getEstadoText(usuario.estado)}</span>
                </button>
              </td>
              <td>
                <button
                  className="icon-button"
                  title="Ver"
                  onClick={() => onView(usuario.id)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>

                <button
                  className="icon-button"
                  title="Editar"
                  disabled={usuario.estado !== "activo"}
                  onClick={() => onEdit(usuario.id)}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>

                <button
                  className="icon-button"
                  title="Eliminar"
                  disabled={usuario.estado === "activo"}
                  onClick={() => onDelete(usuario.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                No hay usuarios para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
