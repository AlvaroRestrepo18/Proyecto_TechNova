import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import TablaVentas from './components/TablaVentas';
import NuevaVenta from './components/NuevaVenta';
import { getVentas } from './services/ventas';

const Ventas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('activas');
  const [ventasData, setVentasData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isNuevaVentaOpen, setIsNuevaVentaOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 7;

  // 🔹 Cargar ventas desde la API
  const fetchVentas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getVentas();

      console.log('📦 Ventas cargadas desde backend:', data);

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

      console.log('✅ Ventas filtradas para tab:', activeTab, filteredData);
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
    fetchVentas(); // 🔄 Recarga al guardar nueva venta
    closeNuevaVenta();
  };

  // 🔹 Funciones para acciones
  const toggleEstado = (id, estadoActual) => {
    console.log(`Cambiar estado de venta ${id}:`, estadoActual);
  };

  const openViewModal = (id) => {
    console.log(`Abrir modal de detalles para venta ${id}`);
  };

  const openPdfModal = (id) => {
    console.log(`Generar PDF para venta ${id}`);
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

      {/* Estado de carga / error */}
      {loading && <p>⏳ Cargando ventas...</p>}
      {error && <p className="error">{error}</p>}

      {/* Tabla */}
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

      {/* Paginación */}
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

      {/* Modal Nueva Venta */}
      {isNuevaVentaOpen && (
        <NuevaVenta onClose={closeNuevaVenta} onSave={handleSaveVenta} />
      )}
    </div>
  );
};

export default Ventas;
