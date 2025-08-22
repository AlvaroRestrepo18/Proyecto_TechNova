import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import UserFormModal from "./components/UserFormModal.jsx";
import DeleteConfirmationModal from "./components/DeleteModal.jsx.jsx";
import UserTable from "./components/usertable.jsx";
import "../app.css";
import "./usuarios.css";

// Importar servicios API
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
    tipoDocumento: "DNI",
    documento: "",
    direccion: "",
    rol: "usuario",
  });
  const [loading, setLoading] = useState(false); // 🔹 Loading global

  // 🔹 Obtener usuarios del backend
  const fetchUsuarios = async () => {
    try {
      const usuarios = await getUsuarios();
      setUserData(usuarios);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // 🔹 Filtrar y paginar
  const filteredUsers = userData.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.documento.includes(searchTerm)
  );

  const filteredByEstado = filteredUsers.filter(
    (u) => u.estado === (activeTab === "activos" ? "activo" : "inactivo")
  );

  const totalPages = Math.ceil(filteredByEstado.length / itemsPerPage);
  const paginatedUsers = filteredByEstado.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔹 Abrir modales
  const openCreateForm = () => {
    setFormMode("create");
    setIsFormOpen(true);
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      tipoDocumento: "",
      documento: "",
      direccion: "",
      rol: "usuario",
      rolId: null, // opcional
    });
  };

  const openEditForm = (userId) => {
    const u = userData.find((u) => u.id === userId);
    if (!u) return;
    setFormMode("edit");
    setCurrentUserId(userId);
    setIsFormOpen(true);
    setFormData({
      id: u.id, // 🔹 agregar id
      nombre: u.name,
      email: u.email,
      telefono: u.telefono || "",
      tipoDocumento: u.tipoDocumento,
      documento: u.documento,
      direccion: u.direccion,
      rol: u.role.toLowerCase(),
      rolId: u.rolId, // necesario para enviar al backend
    });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentUserId(null);
  };

  const openDeleteModal = (userId) => {
    const u = userData.find((u) => u.id === userId);
    if (u) {
      setUserToDelete(u);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUsuario(userToDelete.id);
        setUserData(userData.filter((u) => u.id !== userToDelete.id));
      } catch (error) {
        console.error("Error eliminando usuario:", error);
      }
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const openDetailsModal = (userId) => {
    const u = userData.find((u) => u.id === userId);
    if (u) {
      setFormMode("view");
      setIsFormOpen(true);
      setFormData({
        nombre: u.name,
        email: u.email,
        telefono: u.telefono || "",
        tipoDocumento: u.tipoDocumento,
        documento: u.documento,
        direccion: u.direccion,
        rol: u.role.toLowerCase(),
        rolId: u.rolId,
      });
    }
  };

  // Cambiar estado (activar/inactivar)
  const toggleUserEstado = async (id, estadoActual) => {
    try {
      await toggleUsuarioEstado(id, estadoActual); // usa el servicio ya hecho

      // Actualizar estado en frontend
      setUserData(
        userData.map((u) =>
          u.id === id
            ? {
                ...u,
                estado: estadoActual === "activo" ? "inactivo" : "activo",
              }
            : u
        )
      );
    } catch (error) {
      console.error(`Error cambiando estado del usuario ${id}:`, error);
    }
  };

  // 🔹 Crear o Editar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formMode === "create") {
        const newUser = await createUsuario(formData);
        setUserData([...userData, newUser]); // 🔹 actualizar tabla en tiempo real
      } else {
        const updatedUser = await updateUsuario(currentUserId, formData);
        setUserData(
          userData.map((u) => (u.id === currentUserId ? updatedUser : u))
        );
      }
      closeForm();
    } catch (error) {
      console.error("Error guardando usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="container">
      <h1>Cyber360 - Usuarios</h1>
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
        onView={openDetailsModal}
        onEdit={openEditForm}
        onDelete={openDeleteModal}
        onToggleEstado={(id) => {
          const u = userData.find((user) => user.id === id);
          toggleUserEstado(id, u.estado);
        }}
      />

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
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

      <UserFormModal
  isOpen={isFormOpen}
  onClose={closeForm}
  formData={formData}
  setFormData={setFormData}
  mode={formMode}
  loading={loading}
  onSaved={fetchUsuarios}   // 🔹 NUEVO: refresca lista al guardar
/>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={userToDelete?.name || ""}
      />
    </div>
  );
};

export default Users;
