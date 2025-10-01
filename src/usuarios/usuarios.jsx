// src/usuarios/usuarios.jsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import UserFormModal from "./components/UserFormModal.jsx";
import DeleteConfirmationModal from "./components/DeleteModal.jsx.jsx";
import UserTable from "./components/usertable.jsx";
import "../app.css";
import "./usuarios.css";

import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  toggleUsuarioEstado,
} from "./services/usuarios.js";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [activeTab, setActiveTab] = useState("activos");
  const [userData, setUserData] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    tipoDocumento: "CC",
    documento: "",
    direccion: "",
    idRol: null, // ✅ ahora usamos idRol (igual al backend)
    contrasena: "",
    estado: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await getUsuarios();
      setUserData(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        estado: formData.estado ? "activo" : "inactivo", // 👈 ajusta según tu backend
      };

      if (formMode === "create") {
        await createUsuario(payload);
      } else {
        await updateUsuario(currentUserId, payload);
      }

      fetchUsuarios();
      closeForm();
    } catch (error) {
      console.error("Error guardando usuario:", error);
      alert("Error al guardar usuario. Revisa los datos.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteUsuario(userToDelete.id);
      fetchUsuarios();
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  const handleToggleEstado = async (id, estado) => {
    try {
      await toggleUsuarioEstado(id, estado);
      fetchUsuarios();
    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };

  const filteredUsers = userData.filter(
    (u) =>
      u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.documento?.includes(searchTerm)
  );

  const filteredByEstado = filteredUsers.filter(
    (u) => u.estado === (activeTab === "activos" ? "activo" : "inactivo")
  );

  const totalPages = Math.ceil(filteredByEstado.length / itemsPerPage);
  const paginatedUsers = filteredByEstado.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openCreateForm = () => {
    setFormMode("create");
    setIsFormOpen(true);
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      tipoDocumento: "CC",
      documento: "",
      direccion: "",
      idRol: null,
      contrasena: "",
      estado: true,
    });
  };

  const openEditForm = (userId) => {
    const u = userData.find((u) => u.id === userId);
    if (!u) return;

    setFormMode("edit");
    setCurrentUserId(userId);
    setIsFormOpen(true);

    setFormData({
      id: userId,
      nombre: u.nombre,
      email: u.email,
      telefono: u.telefono || "",
      tipoDocumento: u.tipoDocumento || "CC",
      documento: u.documento,
      direccion: u.direccion,
      idRol: u.idRol, // ✅ siempre mandamos idRol
      contrasena: "",
      estado: u.estado === "activo",
    });
  };

  const openDeleteModal = (userId) => {
    const u = userData.find((u) => u.id === userId);
    if (u) {
      setUserToDelete(u);
      setIsDeleteModalOpen(true);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentUserId(null);
  };

  return (
    <div className="container">
      <h1>Usuarios</h1>
      <div className="section-divider" />

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar usuario (nombre, email o documento)"
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
          className={`tab-button ${
            activeTab === "activos" ? "active-tab" : ""
          }`}
          onClick={() => {
            setActiveTab("activos");
            setCurrentPage(1);
          }}
        >
          Usuarios Activos
        </button>
        <button
          className={`tab-button ${
            activeTab === "inactivos" ? "active-tab" : ""
          }`}
          onClick={() => {
            setActiveTab("inactivos");
            setCurrentPage(1);
          }}
        >
          Usuarios Inactivos
        </button>
      </div>

      <UserTable
        users={paginatedUsers}
        onView={() => {}}
        onEdit={openEditForm}
        onDelete={openDeleteModal}
        onToggleEstado={(id) => {
          const u = userData.find((x) => x.id === id);
          handleToggleEstado(id, u.estado);
        }}
      />

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
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

      <UserFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        formData={formData}
        setFormData={setFormData}
        mode={formMode}
        loading={loading}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={userToDelete?.nombre || ""}
      />
    </div>
  );
};

export default Users;
