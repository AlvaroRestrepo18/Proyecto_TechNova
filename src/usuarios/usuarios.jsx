// src/usuarios/usuarios.jsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import UserFormModal from "./components/UserFormModal.jsx";
import DeleteConfirmationModal from "./components/DeleteModal.jsx";
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
    idRol: null,
    rol: "",
    contrasena: "",
    estado: true,
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // 🔹 Función central para obtener todos los usuarios
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
        estado: formData.estado ? "activo" : "inactivo",
      };

      if (formMode === "create") {
        await createUsuario(payload);
      } else {
        await updateUsuario(currentUserId, payload);
      }

      // ✅ Recargar automáticamente después de guardar
      await fetchUsuarios();
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
      await deleteUsuario(userToDelete.idUsuario);
      await fetchUsuarios();
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  // ✅ Mantiene sincronizado el estado cuando se activa/inactiva un usuario
  const handleToggleEstado = async (id, estado) => {
    try {
      if (!id) {
        console.error("ID de usuario es undefined");
        return;
      }

      await toggleUsuarioEstado(id, estado);
      await fetchUsuarios();
    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };

  // 🔎 Filtros de búsqueda y pestañas
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

  // 👁️ Visualizar
  const openViewForm = (user) => {
    if (!user) return;
    setFormMode("view");
    setCurrentUserId(user.idUsuario);
    setIsFormOpen(true);

    setFormData({
      id: user.idUsuario,
      nombre: user.nombre,
      email: user.email,
      telefono: user.celular || user.telefono || "",
      tipoDocumento: user.tipoDoc || user.tipoDocumento || "CC",
      documento: user.documento,
      direccion: user.direccion,
      idRol: user.fkRol || user.idRol,
      rol: user.fkRolNavigation?.nombreRol || user.rol || "No asignado",
      contrasena: "",
      estado: user.estado,
    });
  };

  // ➕ Crear
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
      rol: "",
      contrasena: "",
      estado: true,
    });
  };

  // ✏️ Editar
  const openEditForm = (userId) => {
    const u = userData.find((u) => u.idUsuario === userId);
    if (!u) return;

    setFormMode("edit");
    setCurrentUserId(userId);
    setIsFormOpen(true);

    setFormData({
      id: userId,
      nombre: u.nombre,
      email: u.email,
      telefono: u.celular || u.telefono || "",
      tipoDocumento: u.tipoDoc || u.tipoDocumento || "CC",
      documento: u.documento,
      direccion: u.direccion,
      idRol: u.fkRol || u.idRol,
      rol: u.fkRolNavigation?.nombreRol || u.rol || "No asignado",
      contrasena: "",
      estado: u.estado,
    });
  };

  // 🗑️ Eliminar
  const openDeleteModal = (userId) => {
    const u = userData.find((u) => u.idUsuario === userId);
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
        onView={openViewForm}
        onEdit={openEditForm}
        onDelete={openDeleteModal}
        onToggleEstado={handleToggleEstado}
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

      {/* ✅ Modal con actualización automática al guardar */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        formData={formData}
        setFormData={setFormData}
        mode={formMode}
        loading={loading}
        onSubmit={handleSubmit}
        onSaved={fetchUsuarios} // 🔹 Esto permite actualizar sin recargar la página
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
