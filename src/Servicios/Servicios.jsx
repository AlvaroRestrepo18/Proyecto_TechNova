import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import '../app.css';
import './servicios.css';

// Componentes
import ServiciosTable from './components/ServiciosTable';
import ServiciosFormModal from './components/ServiciosFormModal';
import ServiciosViewModal from './components/ServiciosViewModal';
import DeleteModal from './components/DeleteModal';
import ConfirmationModal from './components/ConfirmationModal';

const Servicios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [currentService, setCurrentService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [servicesData, setServicesData] = useState([
    {
      id: '1',
      name: 'Impresiones',
      price: 100,
      details: 'Impresion a blanco y negro : 100 \nImpresion a color: 200',
      image: 'https://imprentalascondes.cl/wp-content/uploads/2020/02/COPIAS-EN-BLANCO-Y-NEGRO.jpg',
      active: true
    },
    {
      id: '2',
      name: 'Fomi',
      price: 150,
      details: 'Fomi : 500',
      image: 'https://lagarza.com.co/rails/active_storage/representations/proxy/.../unnamed.png?locale=es',
      active: true
    },
  ]);

  // Handlers
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

  const toggleServiceStatus = (id) => {
    setServicesData(servicesData.map(servicio =>
      servicio.id === id ? { ...servicio, active: !servicio.active } : servicio
    ));
  };

  const confirmDelete = (id) => {
    setServiceToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteConfirmation(false);
    setServiceToDelete(null);
  };

  const executeDelete = () => {
    setServicesData(servicesData.filter(servicio => servicio.id !== serviceToDelete));
    closeDeleteModal();
  };

  const handleSubmitConfirmation = () => {
    setShowConfirmation(false);
    handleSubmit();
  };

  const handleSubmit = () => {
    if (!currentService) return;

    if (isEditing) {
      setServicesData(servicesData.map(servicio =>
        servicio.id === currentService.id ? currentService : servicio
      ));
    } else {
      const newService = {
        id: Date.now().toString(),
        name: currentService.name,
        price: currentService.price,
        details: currentService.details,
        image: currentService.image || 'https://via.placeholder.com/150',
        active: currentService.active
      };
      setServicesData([...servicesData, newService]);
    }
    closeForm();
  };

  const handleCreateService = (serviceData) => {
    setCurrentService(serviceData);
    setShowConfirmation(true);
  };

  const filteredServices = servicesData.filter(servicio =>
    servicio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicio.id.toLowerCase().includes(searchTerm.toLowerCase())
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
          onToggleStatus={toggleServiceStatus}
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
          itemName={servicesData.find(s => s.id === serviceToDelete)?.name}
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