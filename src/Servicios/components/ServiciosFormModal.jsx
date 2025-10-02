import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ServiciosViewModal = ({ servicio, onClose }) => {
  if (!servicio) return null; // 🔹 Evita renderizar si no hay servicio

  // 🔹 Normalizar detalles: aseguramos que sea string
  const detalles =
    typeof servicio.detalles === "string" && servicio.detalles.trim() !== ""
      ? servicio.detalles.split(/\r?\n|,/) // soporta comas o saltos de línea
      : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2>Detalles del Servicio</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body */}
        <div className="details-body">
          <div className="details-row">
            <strong>Nombre:</strong>
            <span>{servicio.nombre || "—"}</span>
          </div>

          <div className="details-row">
            <strong>Precio:</strong>
            <span>
              {servicio.precio
                ? `$${Number(servicio.precio).toLocaleString("es-CO")}`
                : "—"}
            </span>
          </div>

          <div className="details-row">
            <strong>Detalles:</strong>
            <span>
              {detalles.length > 0
                ? detalles.map((d, i) => <div key={i}>{d.trim()}</div>)
                : "Sin detalles"}
            </span>
          </div>

          <div className="details-row">
            <strong>Categoría:</strong>
            <span>{servicio.categoria?.nombre || "Sin categoría"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiciosViewModal;
