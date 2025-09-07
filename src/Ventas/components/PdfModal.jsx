import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from 'jspdf';

const PdfModal = ({ venta, onClose }) => {
  if (!venta) return null;

  const generatePDF = () => {
    const doc = new jsPDF();
    // Configuración inicial
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text("Cyber360 - Comprobante de Venta", 105, 20, { align: "center" });
    // Información de la venta
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`ID Venta: ${venta.id}`, 20, 35);
    doc.text(`Cliente: ${venta.nombre}`, 20, 45);
    doc.text(`Fecha: ${venta.fecha}`, 20, 55);
    doc.text(`Método de Pago: ${venta.metodo}`, 20, 65);
    // Tabla de items
    doc.setFont("helvetica", "bold");
    doc.text("Descripción", 20, 80);
    doc.text("Cantidad", 80, 80);
    doc.text("Precio", 120, 80);
    doc.text("Subtotal", 160, 80);
    doc.setFont("helvetica", "normal");
    let yPosition = 90;
    // Productos
    venta.productos.forEach(item => {
      doc.text(item.nombre, 20, yPosition);
      doc.text(item.cantidad.toString(), 80, yPosition);
      doc.text(`$${item.precio.toFixed(2)}`, 120, yPosition);
      doc.text(`$${(item.precio * item.cantidad).toFixed(2)}`, 160, yPosition);
      yPosition += 10;
    });
    // Servicios
    venta.servicios.forEach(item => {
      doc.text(item.nombre, 20, yPosition);
      doc.text("1", 80, yPosition);
      doc.text(`$${item.precio.toFixed(2)}`, 120, yPosition);
      doc.text(`$${item.precio.toFixed(2)}`, 160, yPosition);
      yPosition += 10;
    });
    // Equipos
    venta.equipos && venta.equipos.forEach(item => {
      doc.text(item.nombre, 20, yPosition);
      doc.text(`${item.horas} hora${item.horas > 1 ? 's' : ''}`, 80, yPosition);
      doc.text(`$${item.precioHora.toFixed(2)}/h`, 120, yPosition);
      doc.text(`$${(item.precioHora * item.horas).toFixed(2)}`, 160, yPosition);
      yPosition += 10;
    });
    // Total
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 140, yPosition + 10);
    doc.text(`$${venta.total.toFixed(2)}`, 160, yPosition + 10);
    // Guardar el PDF
    doc.save(`venta_${venta.id}.pdf`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content view-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Vista Previa PDF</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="view-modal-body">
          <div className="venta-info">
            <div className="info-row">
              <span className="info-label">ID Venta:</span>
              <span className="info-value">{venta.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Cliente:</span>
              <span className="info-value">{venta.nombre}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Fecha:</span>
              <span className="info-value">{venta.fecha}</span>
            </div>
          </div>

          <div className="section-divider"></div>

          <h3>Productos/Servicios</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cantidad/Horas</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {venta.productos.map((item, index) => (
                <tr key={`prod-${index}`}>
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>${item.precio.toFixed(2)}</td>
                  <td>${(item.precio * item.cantidad).toFixed(2)}</td>
                </tr>
              ))}
              {venta.servicios.map((item, index) => (
                <tr key={`serv-${index}`}>
                  <td>{item.nombre}</td>
                  <td>1</td>
                  <td>${item.precio.toFixed(2)}</td>
                  <td>${item.precio.toFixed(2)}</td>
                </tr>
              ))}
              {venta.equipos && venta.equipos.map((item, index) => (
                <tr key={`equi-${index}`}>
                  <td>{item.nombre}</td>
                  <td>{item.horas} hora{item.horas > 1 ? 's' : ''}</td>
                  <td>${item.precioHora.toFixed(2)}/h</td>
                  <td>${(item.precioHora * item.horas).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="section-divider"></div>

          <div className="totals-section">
            <div className="total-row">
              <span>Total:</span>
              <span>${venta.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              className="pdf-button"
              onClick={(e) => {
                e.preventDefault();
                generatePDF();
              }}
            >
              <FontAwesomeIcon icon={faFilePdf} /> Descargar PDF
            </button>
            <button className="close-modal-button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfModal;