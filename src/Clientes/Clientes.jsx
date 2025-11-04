import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./clientes.css";

import ClientesTable from "./components/ClientesTable";
import ClientesFormModal from "./components/ClientesFormModal";
import ClientesViewModal from "./components/ClientesViewModal";
import DeleteModal from "./components/DeleteModal";

import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "./service/Clientes";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("activos"); // "activos" o "inactivos"

  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedCliente, setSelectedCliente] = useState(null);

  // Cargar clientes al montar
  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error("❌ Error al obtener clientes:", error);
    }
  };

  const handleAdd = () => {
    setSelectedCliente(null);
    setShowForm(true);
  };

  const handleEdit = (cliente) => {
    setSelectedCliente(cliente);
    setShowForm(true);
  };

  const handleView = (cliente) => {
    setSelectedCliente(cliente);
    setShowView(true);
  };

  const handleDelete = (cliente) => {
    setSelectedCliente(cliente);
    setShowDelete(true);
  };

  const handleSave = async (clienteData) => {
    try {
      if (clienteData.id) {
        await updateCliente(clienteData.id, clienteData);
      } else {
        await createCliente(clienteData);
      }
      await fetchClientes();
      setShowForm(false);
    } catch (error) {
      console.error("❌ Error al guardar cliente:", error);
    }
  };

  const confirmDelete = async () => {
    try {
      if (!selectedCliente) return;
      await deleteCliente(selectedCliente.id);
      await fetchClientes();
      setShowDelete(false);
    } catch (error) {
      console.error("❌ Error al eliminar cliente:", error);
    }
  };

  const handleToggleStatus = async (cliente) => {
    try {
      await updateCliente(cliente.id, { ...cliente, activo: !cliente.activo });
      await fetchClientes();
    } catch (error) {
      console.error("❌ Error al cambiar estado:", error);
    }
  };

  // Filtrar según tabs y búsqueda
  const filteredClientes = clientes
    .filter((c) => (activeTab === "activos" ? c.activo : !c.activo))
    .filter((c) =>
      c.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container">
      <h2 className="title">Gestión de Clientes</h2>

      <div className="top-bar">
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="create-button" onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} /> Agregar Cliente
        </button>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "activos" ? "tab active" : "tab"}
          onClick={() => setActiveTab("activos")}
        >
          Activos
        </button>
        <button
          className={activeTab === "inactivos" ? "tab active" : "tab"}
          onClick={() => setActiveTab("inactivos")}
        >
          Inactivos
        </button>
      </div>

      <div className="table-container">
        <ClientesTable
          clientes={filteredClientes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      {showForm && (
        <ClientesFormModal
          cliente={selectedCliente}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          isEditMode={!!selectedCliente}
        />
      )}

      {showView && (
        <ClientesViewModal
          cliente={selectedCliente}
          onClose={() => setShowView(false)}
        />
      )}

      {showDelete && (
        <DeleteModal
          isOpen={showDelete}
          onClose={() => setShowDelete(false)}
          onConfirm={confirmDelete}
          itemName={selectedCliente?.nombre || "este cliente"}
        />
      )}
    </div>
  );
};

export default Clientes;
