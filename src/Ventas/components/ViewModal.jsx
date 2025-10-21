import React, { useEffect, useState } from "react";
import { getVentaById } from "../services/ventas";

const ViewModal = ({ ventaId, onClose }) => {
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenta = async () => {
      try {
        setLoading(true);
        const data = await getVentaById(ventaId);
        setVenta(data);
      } catch (err) {
        console.error("❌ Error al cargar la venta:", err);
        setError("Error cargando la venta.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenta();
  }, [ventaId]);

  if (loading) return <p>⏳ Cargando venta...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!venta) return <p>No se encontró la venta.</p>;

  return (
    <div className="nueva-venta-overlay">
      <div className="nueva-venta-container grande">
        <div className="nueva-venta-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>🧾 Detalles de Venta #{venta.id}</h2>
          <button className="cancel-button" onClick={onClose}>✖ Cerrar</button>
        </div>

        <div className="nueva-venta-content">
          <div className="seleccion-panel">
            <h3>Información del Cliente</h3>
            <p><strong>Cliente:</strong> {venta.cliente?.nombre || "N/A"} {venta.cliente?.apellido || ""}</p>
            <p><strong>Documento:</strong> {venta.cliente?.documento || "No disponible"}</p>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(venta.fecha).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p><strong>Estado:</strong> {venta.estado}</p>
          </div>

          <div className="items-panel">
            <h3>Productos ({venta.productos?.length || 0})</h3>
            {venta.productos?.length > 0 ? (
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Valor Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {venta.productos.map((prod) => (
                    <tr key={prod.id}>
                      <td>{prod.nombreProducto || `Producto ${prod.productoId}`}</td>
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
                    <th>Servicio</th>
                    <th>Cantidad</th>
                    <th>Valor Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {venta.servicios.map((serv) => (
                    <tr key={serv.id}>
                      <td>{serv.detalles || `Servicio ${serv.fkServicio}`}</td>
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
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${venta.total?.toLocaleString("es-CO", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total Venta:</span>
                <span>${venta.total?.toLocaleString("es-CO", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions" style={{ justifyContent: "center" }}>
          <button className="submit-button" onClick={onClose}>Cerrar Detalles</button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
