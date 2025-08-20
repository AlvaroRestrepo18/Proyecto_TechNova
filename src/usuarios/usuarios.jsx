import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import UserFormModal from "./components/UserFormModal.jsx";
import DeleteConfirmationModal from "./components/DeleteModal.jsx.jsx";
import UserTable from "./components/usertable.jsx";
import "../app.css";
import "./usuarios.css";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [activeTab, setActiveTab] = useState("activos"); // activos | inactivos

  const [userData, setUserData] = useState([
    { id: "U001", name: "Juan Pérez", email: "juan@example.com", role: "Administrador", tipoDocumento: "DNI", documento: "12345678", direccion: "Calle Falsa 123", estado: "activo", telefono: "+51987654321" },
    { id: "U002", name: "María García", email: "maria@example.com", role: "Técnico", tipoDocumento: "Pasaporte", documento: "AB123456", direccion: "Avenida Siempreviva 742", estado: "activo", telefono: "+51987654322" },
    { id: "U003", name: "Carlos López", email: "carlos@example.com", role: "Usuario", tipoDocumento: "DNI", documento: "87654321", direccion: "Boulevard Los Olivos 456", estado: "inactivo", telefono: "+51987654323" },
    { id: "U004", name: "Carlos López", email: "carlos@example.com", role: "Usuario", tipoDocumento: "DNI", documento: "87654321", direccion: "Boulevard Los Olivos 456", estado: "inactivo", telefono: "+51987654323" },
    { id: "U005", name: "Carlos López", email: "carlos@example.com", role: "Usuario", tipoDocumento: "DNI", documento: "87654321", direccion: "Boulevard Los Olivos 456", estado: "inactivo", telefono: "+51987654323" },
    { id: "U006", name: "Carlos López", email: "carlos@example.com", role: "Usuario", tipoDocumento: "DNI", documento: "87654321", direccion: "Boulevard Los Olivos 456", estado: "inactivo", telefono: "+51987654323" },
    { id: "U007", name: "Carlos López", email: "carlos@example.com", role: "Usuario", tipoDocumento: "DNI", documento: "87654321", direccion: "Boulevard Los Olivos 456", estado: "inactivo", telefono: "+51987654323" },
    { id: "U008", name: "Carlos López", email: "carlos@example.com", role: "Usuario", tipoDocumento: "DNI", documento: "87654321", direccion: "Boulevard Los Olivos 456", estado: "inactivo", telefono: "+51987654323" },
    { id: "U009", name: "Carlos López", email: "carlos@example.com", role: "Usuario", tipoDocumento: "DNI", documento: "87654321", direccion: "Boulevard Los Olivos 456", estado: "inactivo", telefono: "+51987654323" },
    { id: "U010", name: "Carlos López", email: "carlos@example.com", role: "Usuario", tipoDocumento: "DNI", documento: "87654321", direccion: "Boulevard Los Olivos 456", estado: "inactivo", telefono: "+51987654323" },
    { id: "U011", name: "Carlos López", email: "carlos@example.com", role: "Usuario", tipoDocumento: "DNI", documento: "87654321", direccion: "Boulevard Los Olivos 456", estado: "inactivo", telefono: "+51987654323" },
  ]);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    tipoDocumento: "DNI",
    documento: "",
    direccion: "",
    rol: "usuario",
  });

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

  const openCreateForm = () => {
    setFormMode("create");
    setIsFormOpen(true);
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      tipoDocumento: "DNI",
      documento: "",
      direccion: "",
      rol: "usuario",
    });
  };

  const openEditForm = (userId) => {
    const u = userData.find((u) => u.id === userId);
    if (!u) return;
    setFormMode("edit");
    setCurrentUserId(userId);
    setIsFormOpen(true);
    setFormData({
      nombre: u.name,
      email: u.email,
      telefono: u.telefono || "",
      tipoDocumento: u.tipoDocumento,
      documento: u.documento,
      direccion: u.direccion,
      rol: u.role.toLowerCase(),
    });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentUserId(null);
    setIsViewMode(false);
  };

  const openDeleteModal = (userId) => {
    const u = userData.find((u) => u.id === userId);
    if (u) {
      setUserToDelete(u);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
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
      setIsViewMode(true);
      setFormData({
        nombre: u.name,
        email: u.email,
        telefono: u.telefono || "",
        tipoDocumento: u.tipoDocumento,
        documento: u.documento,
        direccion: u.direccion,
        rol: u.role.toLowerCase(),
      });
    }
  };

  const toggleUserEstado = (id) => {
    setUserData(
      userData.map((u) =>
        u.id === id
          ? { ...u, estado: u.estado === "activo" ? "inactivo" : "activo" }
          : u
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formMode === "create") {
      const newId = "U" + (userData.length + 1).toString().padStart(3, "0");
      const newUser = {
        id: newId,
        name: formData.nombre,
        email: formData.email,
        role: formData.rol.charAt(0).toUpperCase() + formData.rol.slice(1),
        tipoDocumento: formData.tipoDocumento,
        documento: formData.documento,
        direccion: formData.direccion,
        telefono: formData.telefono,
        estado: "activo",
      };
      setUserData([...userData, newUser]);
    } else {
      setUserData(
        userData.map((u) =>
          u.id === currentUserId
            ? {
                ...u,
                name: formData.nombre,
                email: formData.email,
                role: formData.rol.charAt(0).toUpperCase() + formData.rol.slice(1),
                tipoDocumento: formData.tipoDocumento,
                documento: formData.documento,
                direccion: formData.direccion,
                telefono: formData.telefono,
              }
            : u
        )
      );
    }
    closeForm();
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
          className={`tab-button ${activeTab === "activos" ? "active-tab" : ""}`}
          onClick={() => {
            setActiveTab("activos");
            setCurrentPage(1);
          }}
        >
          Usuarios Activos
        </button>
        <button
          className={`tab-button ${activeTab === "inactivos" ? "active-tab" : ""}`}
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
        onToggleEstado={toggleUserEstado}
        estadoActual={activeTab}
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
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            &gt;
          </button>
        </div>
      )}

      <UserFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        formData={formData}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        onSubmit={handleSubmit}
        mode={formMode}
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
