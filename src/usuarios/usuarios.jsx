import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import UserFormModal from "./components/UserFormModal.jsx";
import DeleteConfirmationModal from "./components/DeleteModal.jsx.jsx";
import UserTable from "./components/usertable.jsx";
import "../app.css";
import "./usuarios.css";

// ❌ Quitamos servicios reales
// import { getUsuarios, createUsuario, updateUsuario, deleteUsuario, toggleUsuarioEstado } from "./services/usuarios.js";

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
  const [loading, setLoading] = useState(false);

  // 🔹 Simulación con datos de prueba
  useEffect(() => {
    const fakeUsers = [
      {
        id: 1,
        name: "Juan Pérez",
        email: "juan@example.com",
        telefono: "3001234567",
        tipoDocumento: "DNI",
        documento: "12345678",
        direccion: "Calle 123",
        role: "Admin",
        rolId: 1,
        estado: "activo",
      },
      {
        id: 2,
        name: "Ana López",
        email: "ana@example.com",
        telefono: "3017654321",
        tipoDocumento: "DNI",
        documento: "87654321",
        direccion: "Carrera 45",
        role: "Usuario",
        rolId: 2,
        estado: "inactivo",
      },
    ];
    setUserData(fakeUsers);
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
      rolId: null,
    });
  };

  const openEditForm = (userId) => {
    const u = userData.find((u) => u.id === userId);
    if (!u) return;

    setFormMode("edit");
    setCurrentUserId(userId);
    setIsFormOpen(true);

    setFormData({
      id: u.id,
      nombre: u.name,
      email: u.email,
      telefono: u.telefono || "",
      tipoDocumento: u.tipoDocumento,
      documento: u.documento,
      direccion: u.direccion,
      rol: u.role?.toLowerCase() || "",
      rolId: u.rolId || null,
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
      setUserData(userData.filter((u) => u.id !== userToDelete.id));
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
        rol: u.role?.toLowerCase() || "",
        rolId: u.rolId || null,
      });
    }
  };

  // Cambiar estado (activar/inactivar) en mock
  const toggleUserEstado = (id, estadoActual) => {
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
  };

  // 🔹 Crear o Editar usuario en mock
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formMode === "create") {
        const newUser = {
          ...formData,
          id: Date.now(),
          estado: "activo",
        };
        setUserData([...userData, newUser]);
      } else {
        setUserData(
          userData.map((u) =>
            u.id === currentUserId ? { ...u, ...formData } : u
          )
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
        onSaved={() => {}} // ya no necesita llamar API
        onSubmit={handleSubmit}
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
