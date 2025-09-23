import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './clientes.css';

// Componentes
import ClientesTable from './components/ClientesTable';
import ClientesFormModal from './components/ClientesFormModal';
import ClientesViewModal from './components/ClientesViewModal';
import DeleteModal from './components/DeleteModal';

const Clientes = () => {
  // Estados principales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [currentId, setCurrentId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Datos iniciales
  const [clientesData, setClientesData] = useState([
    { 
      id: '1', 
      nombre: 'Juan', 
      apellido: 'Pérez', 
      tipoDoc: 'CC', 
      documento: 123456789, 
      fechaNac: '1990-05-15',
      celular: 3001234567, 
      correo: 'juan@example.com', 
      direccion: 'Calle 123', 
      activo: true 
    },
    { 
      id: '2', 
      nombre: 'María', 
      apellido: 'Gómez', 
      tipoDoc: 'CE', 
      documento: 987654321, 
      fechaNac: '1985-10-20',
      celular: 3109876543, 
      correo: 'maria@example.com', 
      direccion: 'Carrera 45', 
      activo: true 
    },
  ]);

  // Handlers
  const openForm = () => {
    setIsFormOpen(true);
    setIsEditMode(false);
    setSelectedCliente(null);
  };

  const closeForm = () => setIsFormOpen(false);

  const openViewModal = (cliente) => {
    setSelectedCliente(cliente);
    setShowDetails(true);
  };

  const closeViewModal = () => {
    setShowDetails(false);
    setSelectedCliente(null);
  };

  const openEditForm = (cliente) => {
    setSelectedCliente(cliente);
    setIsFormOpen(true);
    setIsEditMode(true);
    setCurrentId(cliente.id);
  };

  const openDeleteModal = (cliente) => {
    setDeleteId(cliente.id);
    setShowConfirmation(true);
  };

  const closeDeleteModal = () => {
    setShowConfirmation(false);
    setDeleteId(null);
  };

  const toggleClienteStatus = (id) => {
    setClientesData(clientesData.map(cliente => 
      cliente.id === id ? { ...cliente, activo: !cliente.activo } : cliente
    ));
  };

  const confirmDelete = () => {
    setClientesData(clientesData.filter(cliente => cliente.id !== deleteId));
    closeDeleteModal();
  };

  const handleCreateCliente = (nuevoCliente) => {
    if (isEditMode) {
      setClientesData(clientesData.map(cliente => 
        cliente.id === currentId ? nuevoCliente : cliente
      ));
    } else {
      setClientesData([...clientesData, nuevoCliente]);
    }
    closeForm();
  };

  return (
    <div className="clientes-container">
      <h1>Gestión de Clientes</h1>
      
      <div className="section-divider"></div>
      
      <div className="create-header">
        <button className="create-button" onClick={openForm}>
          <FontAwesomeIcon icon={faPlus} /> Nuevo Cliente
        </button>
      </div>
      
      <div className="table-container">
        <ClientesTable 
          clientes={clientesData}
          onToggleStatus={toggleClienteStatus}
          onEdit={openEditForm}
          onDelete={openDeleteModal}
          onView={openViewModal}
        />
      </div>

      {/* Modal de Formulario */}
      {isFormOpen && (
        <ClientesFormModal
          cliente={selectedCliente}
          isEditMode={isEditMode}
          onClose={closeForm}
          onSubmit={handleCreateCliente}
        />
      )}

      {/* Modal de Detalles */}
      {showDetails && (
        <ClientesViewModal 
          cliente={selectedCliente}
          onClose={closeViewModal}
        />
      )}

      {/* Modal de Confirmación */}
      {showConfirmation && (
        <DeleteModal
          isOpen={showConfirmation}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          itemName={clientesData.find(c => c.id === deleteId)?.nombre}
          itemType="cliente"
        />
      )}
    </div>
  );
};

export default Clientes;