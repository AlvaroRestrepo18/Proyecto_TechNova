// src/components/usuarios/UserTable.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faTrash, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import "../../app.css";
import "../usuarios.css";

const UserTable = ({ users, onView, onEdit, onDelete, onToggleEstado }) => {
  const getEstadoClass = (estado) => {
    return estado === "activo" ? "active" : "inactive";
  };

  const getEstadoText = (estado) => {
    return estado === "activo" ? "Activo" : "Inactivo";
  };

  const getRolName = (usuario) => {
    return usuario.fkRolNavigation?.nombreRol || usuario.rol || "No asignado";
  };

  const getTelefono = (usuario) => {
    return usuario.celular || usuario.telefono || "-";
  };

  const handleViewClick = (usuario) => {
    if (usuario.estado === "activo") {
      onView(usuario);
    }
  };

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
          {users.map((usuario, index) => (
            <tr key={usuario.idUsuario || index}>
              <td>{usuario.nombre || "-"}</td>
              <td>{usuario.email || "-"}</td>
              <td>{getTelefono(usuario)}</td>
              <td>{getRolName(usuario)}</td>
              <td>
                <button
                  className={`status-toggle ${getEstadoClass(usuario.estado)}`}
                  onClick={() => onToggleEstado(usuario.idUsuario, usuario.estado)} // ✅ CORREGIDO: Pasar idUsuario y estado
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
                  disabled={usuario.estado !== "activo"}
                  onClick={() => handleViewClick(usuario)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>

                <button
                  className="icon-button"
                  title="Editar"
                  disabled={usuario.estado !== "activo"}
                  onClick={() => onEdit(usuario.idUsuario)}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>

                <button
                  className="icon-button"
                  title="Eliminar"
                  disabled={usuario.estado === "activo"}
                  onClick={() => onDelete(usuario.idUsuario)}
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