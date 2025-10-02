import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import TablaVentas from './components/TablaVentas';
import NuevaVenta from './components/NuevaVenta';
import axios from 'axios';

const API_VENTAS_URL = "https://localhost:7228/api/Ventas";

const Ventas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState("activas");
  const [ventasData, setVentasData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isNuevaVentaOpen, setIsNuevaVentaOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 7;

  // 🔹 Cargar ventas según pestaña
  useEffect(() => {
    fetchVentas();
  }, [activeTab]);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(API_VENTAS_URL);
      let data = response.data || [];

      // Filtrar por pestaña
      data = data.filter(v =>
        activeTab === "activas" ? v.estado === true : v.estado === false
      );

      setVentasData(data);
      setCurrentPage(1);
    } catch (err) {
      console.error("❌ Error cargando ventas:", err);
      setError("Error al cargar ventas.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filtrado (por cliente o ID)
  const filteredVentas = ventasData.filter(venta =>
    (venta.cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.id?.toString().includes(searchTerm.toLowerCase()))
  );

  // 🔹 Paginación
  const totalPages = Math.max(1, Math.ceil(filteredVentas.length / itemsPerPage));
  const paginatedVentas = filteredVentas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔹 Abrir / cerrar modal
  const openNuevaVenta = () => setIsNuevaVentaOpen(true);
  const closeNuevaVenta = () => setIsNuevaVentaOpen(false);

  // ✅ Guardar nueva venta y recargar lista
  const handleSaveVenta = async (nuevaVenta) => {
    try {
      setLoading(true);

      // 👀 Debug: Ver qué llega desde NuevaVenta
      console.log("📦 Payload final que se enviará a la API:", nuevaVenta);

      // Enviar directo el payload completo
      const response = await axios.post(API_VENTAS_URL, nuevaVenta);
      const ventaGuardada = response.data;

      // Insertar al inicio de la lista
      setVentasData(prev => [ventaGuardada, ...prev]);
      setIsNuevaVentaOpen(false);

      // Refrescar lista desde backend
      await fetchVentas();
    } catch (err) {
      console.error("❌ Error guardando la venta:", err.response?.data || err.message);
      alert("Error al guardar la venta. Revisa los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Ventas</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "activas" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("activas")}
        >
          Ventas Activas
        </button>
        <button
          className={`tab-button ${activeTab === "inactivas" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("inactivas")}
        >
          Ventas Inactivas
        </button>
      </div>

      {/* Buscador + Crear */}
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
        {activeTab === "activas" && (
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
            <TablaVentas ventas={paginatedVentas} />
          ) : (
            <p>No hay ventas para mostrar.</p>
          )}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active-page" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
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
