import { useState, useEffect } from "react";
import "./ModalAlerta.css"; // Asegúrate de que la ruta sea correcta

export default function ModalAlerta() {
  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    window.mostrarAlerta = (texto) => {
      setMensaje(texto);
      setOpen(true);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="alert-modal-overlay">
      <div className="alert-modal-content">
        <h3 className="alert-modal-title">⚠️ Alerta</h3>
        <p className="alert-modal-message">{mensaje}</p>
        <div style={{ textAlign: "right" }}>
          <button className="alert-modal-button" onClick={() => setOpen(false)}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
