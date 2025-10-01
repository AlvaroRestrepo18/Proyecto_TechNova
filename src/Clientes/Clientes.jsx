import React, { useEffect, useState } from "react";
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
import "../App.css"; // 🔹 estilos globales

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [activeTab, setActiveTab] = useState("activos");

  // 🔹 Cargar clientes desde el backend
  const fetchClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error("❌ Error al obtener clientes:", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // 🔹 Abrir modal para agregar
  const handleAdd = () => {
    setSelectedCliente(null);
    setShowForm(true);
  };

  // 🔹 Abrir modal para editar
  const handleEdit = (cliente) => {
    setSelectedCliente(cliente);
    setShowForm(true);
  };

  // 🔹 Guardar cliente (crear o actualizar)
  const handleSave = async (cliente) => {
    try {
      if (cliente.id) {
        await updateCliente(cliente.id, cliente);
      } else {
        await createCliente(cliente);
      }
      await fetchClientes();
      setShowForm(false);
    } catch (error) {
      console.error("❌ Error al guardar cliente:", error);
    }
  };

  // 🔹 Abrir modal para confirmar eliminación
  const handleDelete = (cliente) => {
    setSelectedCliente(cliente);
    setShowDelete(true);
  };

  // 🔹 Confirmar eliminación
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

  // 🔹 Abrir modal de vista
  const handleView = (cliente) => {
    setSelectedCliente(cliente);
    setShowView(true);
  };

  // 🔹 Cambiar estado activo/inactivo
  const handleToggleStatus = async (id) => {
    try {
      const cliente = clientes.find((c) => c.id === id);
      if (!cliente) return;

      await updateCliente(cliente.id, {
        ...cliente,
        activo: !cliente.activo, // ✅ alterna estado
      });

      await fetchClientes();
    } catch (error) {
      console.error("❌ Error al cambiar estado:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Gestión de Clientes</h2>

      {/* 🔹 Botón agregar */}
      <button className="btn-primary" onClick={handleAdd}>
        ➕ Agregar Cliente
      </button>

      {/* 🔹 Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "activos" ? "tab active" : "tab"}
          onClick={() => setActiveTab("activos")}
        >
          Clientes Activos
        </button>
        <button
          className={activeTab === "inactivos" ? "tab active" : "tab"}
          onClick={() => setActiveTab("inactivos")}
        >
          Clientes Inactivos
        </button>
      </div>

      {/* 🔹 Contenido de tabs */}
      {activeTab === "activos" && (
        <ClientesTable
          clientes={clientes.filter((c) => c.activo)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {activeTab === "inactivos" && (
        <ClientesTable
          clientes={clientes.filter((c) => !c.activo)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* 🔹 Modales */}
      {showForm && (
        <ClientesFormModal
          show={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          cliente={selectedCliente}
          isEditMode={!!selectedCliente} // ✅ diferencia entre crear y editar
        />
      )}

      {showView && (
        <ClientesViewModal
          show={showView}
          onClose={() => setShowView(false)}
          cliente={selectedCliente}
        />
      )}

      {showDelete && (
        <DeleteModal
          show={showDelete}
          onClose={() => setShowDelete(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default Clientes;
