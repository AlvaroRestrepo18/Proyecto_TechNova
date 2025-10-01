import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTrash,
  faPen,
  faUser,
  faCity,
  faPhone,
  faEnvelope,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";

const ProveedorTable = ({ proveedores, onView, onEdit, onDelete }) => {
  // 🔹 Diccionario para abreviar tipo documento
  const docLabels = {
    CC: "C.C.",
    NIT: "NIT",
    CE: "C.E.",
    PAS: "PAS",
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Nombre / Razón Social</th>
          <th>Documento</th>
          <th>Contacto</th>
          <th className="Action">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {proveedores.map((proveedor) => (
          <tr key={proveedor.id}>
            {/* Nombre o Razón Social */}
            <td>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: "500" }}>
                  {proveedor.tipoPersona === "Natural"
                    ? `${proveedor.nombres} ${proveedor.apellidos}`
                    : proveedor.razonSocial}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#7f8c8d",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FontAwesomeIcon
                    icon={proveedor.tipoPersona === "Natural" ? faUser : faCity}
                    size="xs"
                  />
                  {proveedor.tipoPersona === "Natural"
                    ? "Persona Natural"
                    : "Persona Jurídica"}
                </span>
                {proveedor.tieneCompras && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      backgroundColor: "#e67e22",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      marginTop: "4px",
                      display: "inline-block",
                      width: "fit-content",
                    }}
                  >
                    Con compras
                  </span>
                )}
              </div>
            </td>

            {/* Documento */}
            <td>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FontAwesomeIcon icon={faIdCard} size="sm" />
                {docLabels[proveedor.tipoDocumento] || proveedor.tipoDocumento}{" "}
                {proveedor.numeroDocumento}
              </span>
            </td>

            {/* Contacto */}
            <td>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {proveedor.telefono && (
                  <span
                    style={{ display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <FontAwesomeIcon icon={faPhone} size="sm" />{" "}
                    {proveedor.telefono}
                  </span>
                )}
                {proveedor.correo && (
                  <span
                    style={{ display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <FontAwesomeIcon icon={faEnvelope} size="sm" />{" "}
                    {proveedor.correo}
                  </span>
                )}
              </div>
            </td>

            {/* Acciones */}
            <td className="Action">
              <button
                className="icon-button"
                onClick={() => onView(proveedor)}
                title="Ver"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button
                className="icon-button"
                onClick={() => onEdit(proveedor)}
                title="Editar"
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button
                className="icon-button"
                onClick={() => onDelete(proveedor.id)}
                title="Eliminar"
                style={{ color: "#e74c3c" }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProveedorTable;
