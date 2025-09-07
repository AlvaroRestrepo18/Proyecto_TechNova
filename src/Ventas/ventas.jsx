import React, { useState } from 'react';
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
  const [modalVenta, setModalVenta] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isNuevaVentaOpen, setIsNuevaVentaOpen] = useState(false);

  // Datos de ejemplo de ventas
  const [ventasData, setVentasData] = useState([
    { 
      id: '120-45-67', 
      nombre: 'Alejo', 
      fecha: '08/04/2025', 
      metodo: 'Efectivo', 
      estado: 'Activo',
      productos: [
        { id: 1, nombre: 'Mouse Gamer', cantidad: 1, precio: 50 }
      ],
      servicios: [],
      equipos: [],
      subtotal: 50,
      total: 50
    },
    { 
      id: '234-56-78', 
      nombre: 'Samuel', 
      fecha: '09/04/2025', 
      metodo: 'Efectivo', 
      estado: 'Inactivo',
      productos: [
        { id: 2, nombre: 'Teclado Mecánico', cantidad: 1, precio: 120 }
      ],
      servicios: [],
      equipos: [],
      subtotal: 120,
      total: 120
    },
    { 
      id: '345-67-89', 
      nombre: 'Camilo', 
      fecha: '10/04/2025', 
      metodo: 'Efectivo', 
      estado: 'Activo',
      productos: [],
      servicios: [
        { id: 1, nombre: 'Mantenimiento PC', precio: 30 }
      ],
      equipos: [],
      subtotal: 30,
      total: 30
    }
  ]);

  // Filtros de ventas
  const filteredActivas = ventasData.filter(venta => 
    (venta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    venta.estado === 'Activo'
  );

  const filteredInactivas = ventasData.filter(venta => 
    (venta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    venta.estado === 'Inactivo'
  );

  // Handlers
  const toggleEstado = (id) => {
    setVentasData(ventasData.map(venta => 
      venta.id === id && venta.estado === 'Activo'
        ? { ...venta, estado: 'Inactivo' }
        : venta
    ));
  };

  // Modal de visualización
  const openViewModal = (venta) => {
    setModalVenta(venta);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setModalVenta(null);
  };

  const openPdfModal = (venta) => {
    setModalVenta(venta);
    setIsPdfModalOpen(true);
  };

  const closePdfModal = () => {
    setIsPdfModalOpen(false);
    setModalVenta(null);
  };

  const openNuevaVenta = () => {
    setIsNuevaVentaOpen(true);
  };

  const closeNuevaVenta = () => {
    setIsNuevaVentaOpen(false);
  };

  const handleSaveVenta = (nuevaVenta) => {
    // Generar ID único para la nueva venta
    const nuevoId = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}-${Math.floor(10 + Math.random() * 90)}`;
    
    // Obtener fecha actual
    const fechaActual = new Date();
    const fechaFormateada = `${fechaActual.getDate().toString().padStart(2, '0')}/${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}/${fechaActual.getFullYear()}`;
    
    // Crear objeto de venta
    const ventaCompleta = {
      ...nuevaVenta,
      id: nuevoId,
      fecha: fechaFormateada,
      estado: 'Activo'
    };
    
    // Agregar a los datos
    setVentasData([...ventasData, ventaCompleta]);
    setIsNuevaVentaOpen(false);
  };

  return (
    <div className="ventas-container">
      <h1>Cyber360 - Ventas</h1>
      
      <div className="section-divider"></div>
      
      {/* Pestañas */}
      <div className="items-buttons">
        <button
          className={`tab-button productos${activeTab === "activas" ? " active" : ""}`}
          onClick={() => setActiveTab("activas")}
        >
          Ventas Activas
        </button>
        <button
          className={`tab-button servicios${activeTab === "inactivas" ? " active" : ""}`}
          onClick={() => setActiveTab("inactivas")}
        >
          Ventas Inactivas
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder={activeTab === "activas" ? "Buscar ventas activas" : "Buscar ventas inactivas"}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {activeTab === "activas" && (
          <button className="create-button" onClick={openNuevaVenta}>
            <FontAwesomeIcon icon={faPlus} /> Crear
          </button>
        )}
      </div>
      
      <div className="table-container">
        {activeTab === "activas" ? (
          <TablaVentas 
            ventas={filteredActivas} 
            toggleEstado={toggleEstado}
            openViewModal={openViewModal}
            openPdfModal={openPdfModal}
          />
        ) : (
          <TablaVentas 
            ventas={filteredInactivas} 
            toggleEstado={toggleEstado}
            openViewModal={openViewModal}
            openPdfModal={openPdfModal}
          />
        )}
      </div>

      {/* Modal de visualización */}
      {isViewModalOpen && (
        <ViewModal venta={modalVenta} onClose={closeViewModal} />
      )}

      {/* Modal de PDF */}
      {isPdfModalOpen && (
        <PdfModal venta={modalVenta} onClose={closePdfModal} />
      )}

      {/* Modal de Nueva Venta */}
      {isNuevaVentaOpen && (
        <NuevaVenta onClose={closeNuevaVenta} onSave={handleSaveVenta} />
      )}
    </div>
  );
};

export default Ventas;