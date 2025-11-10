import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "../app.css";
import "./servicios.css";

// Componentes
import ServiciosTable from "./components/ServiciosTable";
import ServiciosFormModal from "./components/ServiciosFormModal";
import ServiciosViewModal from "./components/ServiciosViewModal";
import DeleteModal from "./components/DeleteModal";
import ConfirmationModal from "./components/ConfirmationModal";

// API
import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio,
} from "./services/servicios";

const Servicios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [currentService, setCurrentService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [servicesData, setServicesData] = useState([]);

  // 🔹 Cargar servicios al iniciar
  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const data = await getServicios();
      setServicesData(data);
    } catch (error) {
      console.error("❌ Error al obtener servicios:", error);
    }
  };

  // --- Handlers ---
  const openForm = () => {
    setIsFormOpen(true);
    setIsEditing(false);
    setCurrentService(null);
  };

  const closeForm = () => setIsFormOpen(false);

  const openEditForm = (service) => {
    setCurrentService(service);
    setIsFormOpen(true);
    setIsEditing(true);
  };

  const showServiceDetails = (service) => {
    setCurrentService(service);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setCurrentService(null);
  };

  const confirmDelete = (id) => {
    setServiceToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteConfirmation(false);
    setServiceToDelete(null);
  };

  const executeDelete = async () => {
    try {
      await deleteServicio(serviceToDelete);
      setServicesData(servicesData.filter((s) => s.id !== serviceToDelete));

      // 🔄 Recargar lista después de eliminar
      await fetchServicios(); // 👈 AGREGADO
      closeDeleteModal();
    } catch (error) {
      console.error("❌ Error al eliminar servicio:", error);
    }
  };

  // --- Crear/Editar servicio ---
  const handleCreateService = (serviceData) => {
    console.log("📩 Datos recibidos del modal:", serviceData);
    setCurrentService(serviceData);
    setShowConfirmation(true);
  };

  const handleSubmitConfirmation = () => {
    setShowConfirmation(false);
    handleSubmit(currentService);
  };

  const handleSubmit = async (serviceData) => {
    if (!serviceData) return;

    // 🔹 Normalizar datos para que coincidan con el backend
    const payload = {
      id: serviceData.id || null, // No enviar id si es nuevo
      nombre: serviceData.nombre || serviceData.name,
      detalles: serviceData.detalles || "",
      precio: Number(serviceData.precio || serviceData.price),
      categoriaId: Number(serviceData.categoriaId),
    };

    console.log("🚀 Payload enviado al backend:", payload);

    try {
      if (isEditing && currentService?.id) {
        const updated = await updateServicio(currentService.id, payload);
        setServicesData(
          servicesData.map((s) => (s.id === updated.id ? updated : s))
        );
        console.log("✅ Servicio actualizado:", updated);

        // 🔄 Recargar lista desde el backend después de editar
        await fetchServicios(); // 👈 AGREGADO

      } else {
        const created = await createServicio(payload);
        setServicesData([...servicesData, created]);
        console.log("✅ Servicio creado:", created);

        // 🔄 Recargar lista desde el backend después de crear
        await fetchServicios(); // 👈 AGREGADO
      }
    } catch (error) {
      console.error("❌ Error al guardar servicio:", error.response?.data || error);
    }

    closeForm();
  };

  // --- Buscar servicios ---
  const filteredServices = servicesData.filter(
    (servicio) =>
      servicio.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.id.toString().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Servicios</h1>

      <div className="section-divider"></div>

      <div className="top-bar">
        <input
          type="text"
          placeholder="Buscar Servicios"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="create-button" onClick={openForm}>
          <FontAwesomeIcon icon={faPlus} /> Crear Servicio
        </button>
      </div>

      <div className="table-container">
        <ServiciosTable
          servicios={filteredServices}
          onEdit={openEditForm}
          onDelete={confirmDelete}
          onView={showServiceDetails}
        />
      </div>

      {/* Modal de Formulario */}
      {isFormOpen && (
        <ServiciosFormModal
          servicio={currentService}
          isEditing={isEditing}
          onClose={closeForm}
          onSubmit={handleCreateService}
        />
      )}

      {/* Confirmación creación/edición */}
      {showConfirmation && (
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleSubmitConfirmation}
          isEditing={isEditing}
        />
      )}

      {/* Confirmación eliminación */}
      {showDeleteConfirmation && (
        <DeleteModal
          isOpen={showDeleteConfirmation}
          onClose={closeDeleteModal}
          onConfirm={executeDelete}
          itemName={servicesData.find((s) => s.id === serviceToDelete)?.nombre}
          itemType="servicio"
        />
      )}

      {/* Modal de Detalles */}
      {showDetailsModal && (
        <ServiciosViewModal
          servicio={currentService}
          onClose={closeDetailsModal}
        />
      )}
    </div>
  );
};

export default Servicios;
