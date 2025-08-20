import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import RoleFormModal from "./components/RoleFormModal.jsx";
import DeleteConfirmationModal from "./components/DeleteModal.jsx";
import RoleTable from "./components/RoleTable.jsx";

import "../App.jsx";
import "./roles.css";

import {
  getRoles,
  deleteRole,
  changeRoleStatus,
} from "./services/roles.js";

const Roles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("activos");

  const itemsPerPage = 7;
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, [activeTab]);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const roles = await getRoles();
      const filteredRoles = roles.filter((r) =>
        activeTab === "activos" ? r.activo : !r.activo
      );
      setRolesData(filteredRoles);
      setCurrentPage(1);
    } catch (err) {
      setError("Error al cargar roles.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = rolesData.filter((rol) =>
    (rol.nombre ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rol.id?.toString() || "").includes(searchTerm) ||
    (rol.descripcion ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Abrir formulario para crear nuevo rol
  const openCreateForm = () => {
    setFormMode("create");
    setCurrentRoleId(null);
    setIsFormOpen(true);
  };

  // Abrir formulario para editar rol
  const openEditForm = (roleId) => {
    setFormMode("edit");
    setCurrentRoleId(roleId);
    setIsFormOpen(true);
  };

  // Abrir formulario en modo view
  const openViewForm = (roleId) => {
    setFormMode("view");
    setCurrentRoleId(roleId);
    setIsFormOpen(true);
  };

  const openDeleteModal = (roleId) => {
    setCurrentRoleId(roleId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRole(currentRoleId);
      await fetchRoles();
      setIsDeleteModalOpen(false);
      setIsFormOpen(false);
      setCurrentRoleId(null);
    } catch (err) {
      alert("Error al eliminar el rol.");
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentRoleId(null);
  };

  const toggleRolEstado = async (id, currentEstado) => {
  try {
    // ⚠️ Evitamos desactivar el rol administrador (id === 1)
    if (id === 1 && currentEstado === true) {
      window.mostrarAlerta("El rol Administrador no puede ser inactivado.");
      return;
    }

    await changeRoleStatus(id, !currentEstado);
    await fetchRoles();
  } catch (err) {
    window.mostrarAlerta("Error al cambiar estado del rol.");
  }
};

  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  


  if (loading) return <p>Cargando roles...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container">
      <h1>Cyber360 - Roles</h1>
      <div className="section-divider"></div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar rol"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
        <button className="create-button" onClick={openCreateForm}>
          <FontAwesomeIcon icon={faPlus} /> Crear
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "activos" ? "active-tab" : ""}`}
          onClick={() => {
            setActiveTab("activos");
            setCurrentPage(1);
          }}
        >
          Roles Activos
        </button>
        <button
          className={`tab-button ${activeTab === "inactivos" ? "active-tab" : ""}`}
          onClick={() => {
            setActiveTab("inactivos");
            setCurrentPage(1);
          }}
        >
          Roles Inactivos
        </button>
      </div>

      <RoleTable
        roles={paginatedRoles}
        onView={openViewForm}
        onEdit={openEditForm}
        onDelete={openDeleteModal}
        onToggleEstado={toggleRolEstado}
      />

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

      <RoleFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        roleId={currentRoleId}       // <-- Pasar el id aquí
        mode={formMode}              // create, edit, view
        onSaved={fetchRoles}         // refrescar lista después de guardar
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={rolesData.find((r) => r.id === currentRoleId)?.nombre || "este rol"}
      />
    </div>
  );
};

export default Roles;
