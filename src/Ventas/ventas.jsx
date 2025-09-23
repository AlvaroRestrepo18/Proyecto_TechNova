import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ViewModal from './components/ViewModal';
import PdfModal from './components/PdfModal';
import TablaVentas from './components/TablaVentas';
import NuevaVenta from './components/NuevaVenta';

const Ventas = () => {
  // Estados principales
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState("activas");
  const [currentVentaId, setCurrentVentaId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isNuevaVentaOpen, setIsNuevaVentaOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ventasData, setVentasData] = useState([]);

  const itemsPerPage = 7;

  // Datos mockeados (simulan la API)
  const ventasMock = [
    { id: 1, cliente: { nombre: "Juan Pérez" }, estado: "Activo" },
    { id: 2, cliente: { nombre: "María López" }, estado: "Activo" },
    { id: 3, cliente: { nombre: "Carlos Gómez" }, estado: "Inactivo" },
    { id: 4, cliente: { nombre: "Ana Torres" }, estado: "Activo" },
    { id: 5, cliente: { nombre: "Luis Fernández" }, estado: "Inactivo" },
  ];

  useEffect(() => {
    fetchVentas();
  }, [activeTab]);

  const fetchVentas = () => {
    const filteredVentas = ventasMock.filter(venta =>
      activeTab === "activas" ? venta.estado === 'Activo' : venta.estado === 'Inactivo'
    );
    setVentasData(filteredVentas);
    setCurrentPage(1);
  };

  // Filtros de ventas
  const filteredVentas = ventasData.filter(venta => 
    (venta.cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredVentas.length / itemsPerPage);
  const paginatedVentas = filteredVentas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const toggleEstado = (id, currentEstado) => {
    setVentasData(prev =>
      prev.map(venta =>
        venta.id === id
          ? { ...venta, estado: currentEstado === "Activo" ? "Inactivo" : "Activo" }
          : venta
      )
    );
  };

  // Modal de visualización
  const openViewModal = (ventaId) => {
    setCurrentVentaId(ventaId);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentVentaId(null);
  };

  const openPdfModal = (ventaId) => {
    setCurrentVentaId(ventaId);
    setIsPdfModalOpen(true);
  };

  const closePdfModal = () => {
    setIsPdfModalOpen(false);
    setCurrentVentaId(null);
  };

  const openNuevaVenta = () => {
    setIsNuevaVentaOpen(true);
  };

  const closeNuevaVenta = () => {
    setIsNuevaVentaOpen(false);
  };

  const handleSaveVenta = (nuevaVenta) => {
    setVentasData(prev => [...prev, { ...nuevaVenta, id: prev.length + 1, estado: "Activo" }]);
    setIsNuevaVentaOpen(false);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="container">
      <h1>Ventas</h1>
      
      <div className="section-divider"></div>
      
      {/* Pestañas */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "activas" ? "active-tab" : ""}`}
          onClick={() => {
            setActiveTab("activas");
            setCurrentPage(1);
          }}
        >
          Ventas Activas
        </button>
        <button
          className={`tab-button ${activeTab === "inactivas" ? "active-tab" : ""}`}
          onClick={() => {
            setActiveTab("inactivas");
            setCurrentPage(1);
          }}
        >
          Ventas Inactivas
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder={activeTab === "activas" ? "Buscar ventas activas" : "Buscar ventas inactivas"}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
        {activeTab === "activas" && (
          <button className="create-button" onClick={openNuevaVenta}>
            <FontAwesomeIcon icon={faPlus} /> Crear
          </button>
        )}
      </div>
      
      <div className="table-container">
        <TablaVentas 
          ventas={paginatedVentas} 
          toggleEstado={toggleEstado}
          openViewModal={openViewModal}
          openPdfModal={openPdfModal}
        />
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active-page" : ""}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}

      {/* Modal de visualización */}
      {isViewModalOpen && (
        <ViewModal 
          ventaId={currentVentaId} 
          onClose={closeViewModal} 
        />
      )}

      {/* Modal de PDF */}
      {isPdfModalOpen && (
        <PdfModal 
          ventaId={currentVentaId} 
          onClose={closePdfModal} 
        />
      )}

      {/* Modal de Nueva Venta */}
      {isNuevaVentaOpen && (
        <NuevaVenta onClose={closeNuevaVenta} onSave={handleSaveVenta} />
      )}
    </div>
  );
};

export default Ventas;
