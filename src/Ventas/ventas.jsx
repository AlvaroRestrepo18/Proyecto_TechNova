import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import TablaVentas from './components/TablaVentas';
import NuevaVenta from './components/NuevaVenta';
import ViewModal from './components/ViewModal';
import PdfModal from './components/PdfModal';
import { getVentas, getVentaById, cambiarEstadoVenta } from './services/ventas'; // ✅ agregado cambiarEstadoVenta

const Ventas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('activas');
  const [ventasData, setVentasData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isNuevaVentaOpen, setIsNuevaVentaOpen] = useState(false);
  const [viewVentaId, setViewVentaId] = useState(null);
  const [pdfVenta, setPdfVenta] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 7;

  // 🔹 Cargar ventas desde la API
  const fetchVentas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getVentas();
      if (!Array.isArray(data)) {
        console.error('❌ La respuesta del backend no es un array:', data);
        setVentasData([]);
        return;
      }

      // ✅ Manejo flexible del campo estado
      const filteredData = data.filter(v => {
        const estadoActivo =
          v.estado === true ||
          v.estado === 1 ||
          v.estado === 'Activo' ||
          v.estado === 'activo';
        return activeTab === 'activas' ? estadoActivo : !estadoActivo;
      });

      setVentasData(filteredData);
      setCurrentPage(1);
    } catch (err) {
      console.error('❌ Error cargando ventas:', err);
      setError('Error al cargar ventas.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  // 🔹 Filtrar por cliente o ID
  const filteredVentas = ventasData.filter(venta => {
    const nombreCliente = venta.cliente?.nombre
      ? venta.cliente.nombre.toLowerCase()
      : '';
    return (
      nombreCliente.includes(searchTerm.toLowerCase()) ||
      venta.id?.toString().includes(searchTerm.toLowerCase())
    );
  });

  // 🔹 Paginación
  const totalPages = Math.max(1, Math.ceil(filteredVentas.length / itemsPerPage));
  const paginatedVentas = filteredVentas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔹 Modal Nueva Venta
  const openNuevaVenta = () => setIsNuevaVentaOpen(true);
  const closeNuevaVenta = () => setIsNuevaVentaOpen(false);
  const handleSaveVenta = () => {
    fetchVentas();
    closeNuevaVenta();
  };

  // 🔹 Cambiar estado (✅ versión funcional)
  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = !estadoActual; // Cambiar de activo a inactivo o viceversa
      console.log(`🌀 Cambiando estado venta ${id} → ${nuevoEstado}`);

      await cambiarEstadoVenta(id, nuevoEstado); // Llamar al backend
      await fetchVentas(); // Refrescar lista

      console.log('✅ Estado actualizado correctamente');
    } catch (error) {
      console.error('❌ Error cambiando estado:', error);
      alert('Error al cambiar el estado de la venta.');
    }
  };

  // 🔹 Ver detalles
  const openViewModal = (id) => {
    setViewVentaId(id);
  };

  // 🔹 Abrir modal PDF (funcional)
  const openPdfModal = async (id) => {
    try {
      setLoading(true);
      const data = await getVentaById(id);
      if (!data) {
        alert('No se pudo obtener la información de la venta.');
        return;
      }
      setPdfVenta(data);
      setIsPdfModalOpen(true);
    } catch (error) {
      console.error('❌ Error al cargar venta para PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cerrar modal PDF
  const closePdfModal = () => {
    setPdfVenta(null);
    setIsPdfModalOpen(false);
  };

  return (
    <div className="container">
      <h1>Ventas</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'activas' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('activas')}
        >
          Ventas Activas
        </button>
        <button
          className={`tab-button ${activeTab === 'inactivas' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('inactivas')}
        >
          Ventas Inactivas
        </button>
      </div>

      {/* Buscar / Crear */}
      <div className="search-container">
        <input
          type="text"
          placeholder={`Buscar ventas ${activeTab}`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
        {activeTab === 'activas' && (
          <button className="create-button" onClick={openNuevaVenta}>
            <FontAwesomeIcon icon={faPlus} /> Crear
          </button>
        )}
      </div>

      {loading && <p>⏳ Cargando ventas...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="table-container">
          {paginatedVentas.length > 0 ? (
            <TablaVentas
              ventas={paginatedVentas}
              toggleEstado={toggleEstado}
              openViewModal={openViewModal}
              openPdfModal={openPdfModal}
            />
          ) : (
            <p>No hay ventas para mostrar.</p>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? 'active-page' : ''}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      )}

      {/* Modales */}
      {isNuevaVentaOpen && (
        <NuevaVenta onClose={closeNuevaVenta} onSave={handleSaveVenta} />
      )}

      {viewVentaId && (
        <ViewModal ventaId={viewVentaId} onClose={() => setViewVentaId(null)} />
      )}

      {isPdfModalOpen && pdfVenta && (
        <PdfModal venta={pdfVenta} onClose={closePdfModal} />
      )}
    </div>
  );
};

export default Ventas;
