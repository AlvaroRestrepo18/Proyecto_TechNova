import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { jsPDF } from "jspdf";

const PdfModal = ({ venta, onClose }) => {
  if (!venta) return null;

  const generatePDF = () => {
    const doc = new jsPDF();

    // 🔹 Encabezado
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text("TechNova - Comprobante de Venta", 105, 20, { align: "center" });

    // 🔹 Información general
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`ID Venta: ${venta.id}`, 20, 35);
    doc.text(`Cliente: ${venta.cliente?.nombreCompleto || "No especificado"}`, 20, 45);
    doc.text(`Fecha: ${new Date(venta.fecha).toLocaleDateString("es-CO")}`, 20, 55);
    doc.text(`Estado: ${venta.estado ? "Activo" : "Inactivo"}`, 20, 65);

    let y = 80;

    // 🔹 Tabla de productos
    if (venta.productos?.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Productos:", 20, y);
      y += 10;
      doc.text("Descripción", 20, y);
      doc.text("Cantidad", 100, y);
      doc.text("Precio", 130, y);
      doc.text("Subtotal", 170, y, { align: "right" });

      doc.setFont("helvetica", "normal");
      y += 10;

      venta.productos.forEach((item) => {
        const nombre = item.nombreProducto || item.producto?.nombre || `Producto #${item.productoId}`;
        doc.text(nombre, 20, y);
        doc.text(item.cantidad.toString(), 100, y);
        doc.text(`$${item.valorUnitario?.toLocaleString("es-CO")}`, 130, y);
        doc.text(`$${item.valorTotal?.toLocaleString("es-CO")}`, 170, y, { align: "right" });
        y += 10;
      });
    }

    // 🔹 Tabla de servicios
    if (venta.servicios?.length > 0) {
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("Servicios:", 20, y);
      y += 10;
      doc.text("Descripción", 20, y);
      doc.text("Cantidad", 100, y);
      doc.text("Precio", 130, y);
      doc.text("Subtotal", 170, y, { align: "right" });

      doc.setFont("helvetica", "normal");
      y += 10;

      venta.servicios.forEach((serv) => {
        const nombre = serv.detalles || `Servicio #${serv.fkServicio}`;
        doc.text(nombre, 20, y);
        doc.text("1", 100, y); // Cantidad siempre 1
        doc.text(`$${serv.precio?.toLocaleString("es-CO")}`, 130, y);
        doc.text(`$${serv.valorTotal?.toLocaleString("es-CO")}`, 170, y, { align: "right" });
        y += 10;
      });
    }

    // 🔹 Total
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL:", 130, y);
    doc.text(
      `$${venta.total?.toLocaleString("es-CO", { minimumFractionDigits: 2 })}`,
      170,
      y,
      { align: "right" }
    );

    // 🔹 Guardar PDF
    doc.save(`venta_${venta.id}.pdf`);
  };

  return (
    <div className="nueva-venta-overlay" onClick={onClose}>
      <div
        className="nueva-venta-container grande"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="nueva-venta-header"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <h2>🧾 Vista Previa de Comprobante</h2>
          <button className="cancel-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="nueva-venta-content">
          <div className="seleccion-panel">
            <h3>Información del Cliente</h3>
            <p><strong>Cliente:</strong> {venta.cliente?.nombreCompleto || "N/A"}</p>
            <p><strong>Documento:</strong> {venta.cliente?.documento || "No disponible"}</p>
            <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString("es-CO")}</p>
            <p><strong>Estado:</strong> {venta.estado ? "Activo" : "Inactivo"}</p>
          </div>

          <div className="items-panel">
            <h3>Productos ({venta.productos?.length || 0})</h3>
            {venta.productos?.length > 0 ? (
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {venta.productos.map((prod, i) => (
                    <tr key={i}>
                      <td>{prod.nombreProducto || prod.producto?.nombre || `Producto #${prod.productoId}`}</td>
                      <td>{prod.cantidad}</td>
                      <td>${prod.valorUnitario?.toLocaleString("es-CO")}</td>
                      <td>${prod.valorTotal?.toLocaleString("es-CO")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-items">No hay productos en esta venta</p>
            )}

            <h3>Servicios ({venta.servicios?.length || 0})</h3>
            {venta.servicios?.length > 0 ? (
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {venta.servicios.map((serv, i) => (
                    <tr key={i}>
                      <td>{serv.detalles || `Servicio #${serv.fkServicio}`}</td>
                      <td>1</td>
                      <td>${serv.precio?.toLocaleString("es-CO")}</td>
                      <td>${serv.valorTotal?.toLocaleString("es-CO")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-items">No hay servicios en esta venta</p>
            )}

            <div className="totals-section">
              <div className="total-row grand-total">
                <span>Total Venta:</span>
                <span>${venta.total?.toLocaleString("es-CO", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="form-actions" style={{ justifyContent: "center" }}>
              <button
                className="submit-button"
                onClick={(e) => { e.preventDefault(); generatePDF(); }}
              >
                <FontAwesomeIcon icon={faFilePdf} /> Descargar PDF
              </button>
              <button className="cancel-button" onClick={onClose}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfModal;
