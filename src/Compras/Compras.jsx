// src/Compras/Compras.jsx
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./compras.css";

import ComprasTable from "./components/ComprasTable";
import ComprasFormModal from "./components/ComprasFormModal";

import {
  getCompras,
  createCompra,
  changeCompraStatus,
  getProveedores,
} from "./services/compras";

import { getProductos } from "../Productos/services/producto"; // ✅ importa productos

const Compras = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("activas");
  const [modalCompra, setModalCompra] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const [comprasData, setComprasData] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]); // ✅ nuevo estado
  const [loading, setLoading] = useState(true);

  // scroll ref
  const modalContentRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

 useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [comprasResp, proveedoresResp, productosResp] = await Promise.all([
        getCompras(),
        getProveedores(),
        getProductos(),
      ]);
      
      console.log("✅ PROVEEDORES:", proveedoresResp); // Verifica que los proveedores se están cargando correctamente.

      setProveedores(proveedoresResp || []);
      setProductos(productosResp || []);
      
      // El resto de tu lógica de procesamiento de compras...
    } catch (error) {
      console.error("❌ Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  // ✅ función auxiliar para mostrar nombre de producto
  const getNombreProducto = (productoId, productoObj) => {
    if (productoObj?.nombre) return productoObj.nombre;
    const prod = productos.find((p) => String(p.id) === String(productoId));
    return prod ? prod.nombre : "Producto";
  };

  // filtros
  const filteredActivas = comprasData.filter(
    (compra) =>
      (compra.proveedorNombre || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) && compra.estado === true
  );

  const filteredAnuladas = comprasData.filter(
    (compra) =>
      (compra.proveedorNombre || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) && compra.estado === false
  );

  const handleBeforeChange = () => {
    if (modalContentRef.current) {
      setScrollPosition(modalContentRef.current.scrollTop);
    }
  };

  useEffect(() => {
    if (modalContentRef.current && scrollPosition > 0) {
      modalContentRef.current.scrollTop = scrollPosition;
    }
  }, [modalCompra?.detallesCompra, scrollPosition]);

  const toggleEstado = async (id, estadoActual) => {
    try {
      const actualizado = await changeCompraStatus(id, !estadoActual);

      const prov = proveedores.find(
        (p) => String(p.id) === String(actualizado.proveedorId)
      );

      const actualizadoConNombre = {
        ...actualizado,
        proveedorNombre: prov ? prov.nombre || prov.razonSocial : "Desconocido",
      };

      setComprasData((prev) =>
        prev.map((c) => (c.id === id ? actualizadoConNombre : c))
      );
    } catch (error) {
      console.error("❌ Error cambiando estado:", error);
    }
  };

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const openViewModal = (compra) => {
    setModalCompra(compra);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setModalCompra(null);
  };

  const openPdfModal = (compra) => {
    setModalCompra(compra);
    setIsPdfModalOpen(true);
  };
  const closePdfModal = () => {
    setIsPdfModalOpen(false);
    setModalCompra(null);
  };

  const generarPdfCompra = (compra) => {
    const input = document.getElementById("pdf-content");
    if (!input) return;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Compra_${compra.id}.pdf`);
    });
  };

  const handleCreateCompra = async (nuevaCompra) => {
  try {
    // Verificar el payload que llega del modal
    console.log("📤 Payload que llega del modal:", nuevaCompra);

    // Crear la compra
    const creada = await createCompra({
      ...nuevaCompra,
      estado: true,
    });

    // Verificar la respuesta de la compra creada
    console.log("✅ Compra creada:", creada);

    // Buscar el proveedor de la compra recién creada
    const prov = proveedores.find(
      (p) => String(p.id) === String(creada.proveedorId) // Comparar los ids correctamente
    );

    // Verificar si se encuentra el proveedor
    console.log("✅ Proveedor encontrado:", prov);

    // Enriquecer la compra con el nombre del proveedor
    const creadaConNombre = {
      ...creada,
      proveedorNombre: prov ? prov.nombre || prov.razonSocial : "Desconocido",
    };

    // Verificar el objeto de la compra enriquecida
    console.log("✅ Compra enriquecida con nombre del proveedor:", creadaConNombre);

    // Agregar la compra a los datos de compras
    setComprasData((prev) => [...prev, creadaConNombre]);

    // Cerrar el formulario después de crear la compra
    closeForm();
  } catch (error) {
    // Verificar si ocurre un error y mostrar el mensaje
    console.error("❌ Error creando compra:", error);
  }
};


  return (
    <div>
      <h1>Compras</h1>
      <div className="section-divider"></div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "activas" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("activas")}
        >
          Compras Activas
        </button>
        <button
          className={`tab-button ${activeTab === "anuladas" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("anuladas")}
        >
          Compras Anuladas
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder={
            activeTab === "activas"
              ? "Buscar compras activas"
              : "Buscar compras anuladas"
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {activeTab === "activas" && (
          <div className="create-header">
            <button className="create-button" onClick={openForm}>
              <FontAwesomeIcon icon={faPlus} /> Crear
            </button>
          </div>
        )}
      </div>

      <div className="table-container">
        {loading ? (
          <p>Cargando compras...</p>
        ) : (
          <ComprasTable
            compras={activeTab === "activas" ? filteredActivas : filteredAnuladas}
            onToggleEstado={toggleEstado}
            onView={openViewModal}
            onPdf={openPdfModal}
          />
        )}
      </div>

      {/* Modal Formulario */}
      {isFormOpen && (
        <ComprasFormModal
          onClose={closeForm}
          onSubmit={handleCreateCompra}
          modalContentRef={modalContentRef}
          onBeforeChange={handleBeforeChange}
          proveedoresDisponibles={proveedores}
          productosDisponibles={productos}
        />
      )}

      {/* Modal Vista */}
      {isViewModalOpen && modalCompra && (
        <div className="modal-overlay" onClick={closeViewModal}>
          <div
            className="modal-content details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Detalles de Compra</h2>
              <button className="close-button" onClick={closeViewModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="user-details-container" ref={modalContentRef}>
              <div className="user-details-row">
                <span className="detail-label">Proveedor:</span>
                <span className="detail-value">
                  {modalCompra.proveedorNombre}
                </span>
              </div>

              <h3>Productos</h3>
              {modalCompra.detallesCompra?.map((detalle) => (
                <div key={detalle.id} className="user-details-row">
                  <span className="detail-label">
                    {getNombreProducto(detalle.productoId, detalle.producto)}
                  </span>
                  <span className="detail-value">
                    Cant: {detalle.cantidad} | Precio: {detalle.precioUnitario}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal PDF */}
      {isPdfModalOpen && modalCompra && (
        <div className="modal-overlay" onClick={closePdfModal}>
          <div
            className="modal-content details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Vista Previa PDF</h2>
              <button className="close-button" onClick={closePdfModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div
              className="user-details-container"
              ref={modalContentRef}
              id="pdf-content"
            >
              <div className="user-details-row">
                <span className="detail-label">Proveedor:</span>
                <span className="detail-value">
                  {modalCompra.proveedorNombre}
                </span>
              </div>

              <h3>Productos</h3>
              {modalCompra.detallesCompra?.map((detalle) => (
                <div key={detalle.id} className="user-details-row">
                  <span className="detail-label">
                    {getNombreProducto(detalle.productoId, detalle.producto)}
                  </span>
                  <span className="detail-value">
                    Cant: {detalle.cantidad} | Precio: {detalle.precioUnitario}
                  </span>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button
                className="primary-button"
                onClick={(e) => {
                  e.preventDefault();
                  generarPdfCompra(modalCompra);
                }}
                style={{ backgroundColor: "#e74c3c" }}
              >
                <FontAwesomeIcon icon={faFilePdf} /> Descargar PDF
              </button>
              <button
                type="button"
                className="close-details-button"
                onClick={closePdfModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compras;
