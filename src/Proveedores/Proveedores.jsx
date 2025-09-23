import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ProveedorTable from './components/ProveedorTable';
import ProveedorFormModal from './components/ProveedorFormModal';
import ViewModal from './components/ViewModal';
import DeleteModal from './components/DeleteModal';
import './proveedores.css';

const Proveedores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("activos");
  const [modalProveedor, setModalProveedor] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentProveedorId, setCurrentProveedorId] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const [proveedoresData, setProveedoresData] = useState([]);

  const [formData, setFormData] = useState({
    tipoPersona: 'Natural',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    razonSocial: '',
    correo: '',
    telefono: '',
    direccion: '',
    estado: 'Activo'
  });

  // 🚫 Sin conexión al servicio → cargamos mock
  useEffect(() => {
    const dataMock = [
      {
        id: 1,
        tipoPersona: "Natural",
        tipoDocumento: "CC",
        numeroDocumento: "123456789",
        nombres: "Carlos",
        apellidos: "Pérez",
        razonSocial: "",
        correo: "carlos@example.com",
        telefono: "3001234567",
        direccion: "Calle 123",
        estado: "Activo",
        tieneCompras: false
      },
      {
        id: 2,
        tipoPersona: "Jurídica",
        tipoDocumento: "NIT",
        numeroDocumento: "900123456-7",
        nombres: "",
        apellidos: "",
        razonSocial: "Tech S.A.S",
        correo: "contacto@tech.com",
        telefono: "6041234567",
        direccion: "Carrera 45",
        estado: "Anulado",
        tieneCompras: false
      }
    ];
    setProveedoresData(dataMock);
  }, []);

  // 🔽 A partir de aquí tu lógica de filtros, CRUD y modales sigue igual
  const filteredActivos = proveedoresData.filter(proveedor => {
    const nombreCompleto = proveedor.tipoPersona === 'Natural' 
      ? `${proveedor.nombres} ${proveedor.apellidos}`.toLowerCase()
      : proveedor.razonSocial.toLowerCase();
    return nombreCompleto.includes(searchTerm.toLowerCase()) && proveedor.estado === 'Activo';
  });

  const filteredAnulados = proveedoresData.filter(proveedor => {
    const nombreCompleto = proveedor.tipoPersona === 'Natural' 
      ? `${proveedor.nombres} ${proveedor.apellidos}`.toLowerCase()
      : proveedor.razonSocial.toLowerCase();
    return nombreCompleto.includes(searchTerm.toLowerCase()) && proveedor.estado === 'Anulado';
  });

  const toggleEstado = (id) => {
    setProveedoresData(proveedoresData.map(proveedor => 
      proveedor.id === id 
        ? { ...proveedor, estado: proveedor.estado === 'Activo' ? 'Anulado' : 'Activo' } 
        : proveedor
    ));
  };

  const eliminarProveedor = (id) => {
    const proveedor = proveedoresData.find(p => p.id === id);
    if (proveedor.tieneCompras) {
      setShowDeleteAlert(true);
      return;
    }
    setProveedorToDelete(proveedor);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    setProveedoresData(proveedoresData.filter(p => p.id !== proveedorToDelete.id));
    setShowConfirmDelete(false);
    setProveedorToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setProveedorToDelete(null);
  };

  const openForm = () => {
    setIsFormOpen(true);
    setCurrentProveedorId(null);
    setFormData({
      tipoPersona: 'Natural',
      tipoDocumento: 'CC',
      numeroDocumento: '',
      nombres: '',
      apellidos: '',
      razonSocial: '',
      correo: '',
      telefono: '',
      direccion: '',
      estado: 'Activo'
    });
    setErrors({});
  };

  const openEditForm = (proveedor) => {
    setIsFormOpen(true);
    setCurrentProveedorId(proveedor.id);
    setFormData({...proveedor});
    setErrors({});
  };

  const openViewModal = (proveedor) => {
    setModalProveedor(proveedor);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setModalProveedor(null);
  };

  const closeForm = () => setIsFormOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
    if (errors[name]) setErrors({...errors, [name]: null});
  };

  const handleTipoPersonaChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData, 
      tipoPersona: value,
      nombres: value === 'Jurídica' ? '' : formData.nombres,
      apellidos: value === 'Jurídica' ? '' : formData.apellidos,
      razonSocial: value === 'Natural' ? '' : formData.razonSocial
    });
  };

  const handleTipoDocumentoChange = (e) => {
    const value = e.target.value;
    setFormData({...formData, tipoDocumento: value, numeroDocumento: ''});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.numeroDocumento.trim()) newErrors.numeroDocumento = 'Este campo es requerido';
    if (formData.tipoPersona === 'Natural') {
      if (!formData.nombres.trim()) newErrors.nombres = 'Los nombres son requeridos';
      if (!formData.apellidos.trim()) newErrors.apellidos = 'Los apellidos son requeridos';
    } else {
      if (!formData.razonSocial.trim()) newErrors.razonSocial = 'La razón social es requerida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (currentProveedorId) {
      setProveedoresData(proveedoresData.map(p => 
        p.id === currentProveedorId ? { ...p, ...formData } : p
      ));
    } else {
      const newProveedor = {
        ...formData,
        id: proveedoresData.length + 1,
        tieneCompras: false
      };
      setProveedoresData([...proveedoresData, newProveedor]);
    }
    closeForm();
  };

  return (
    <div>
      <h1>Proveedores</h1>
      <div className="section-divider"></div>

      {/* Pestañas */}
      <div className="tabs">
        <button className={`tab-button ${activeTab === "activos" ? "active-tab" : ""}`} onClick={() => setActiveTab("activos")}>Proveedores Activos</button>
        <button className={`tab-button ${activeTab === "anulados" ? "active-tab" : ""}`} onClick={() => setActiveTab("anulados")}>Proveedores Anulados</button>
      </div>

      {/* Buscador y botón crear */}
      <div className="search-container">
        <input
          type="text"
          placeholder={activeTab === "activos" ? "Buscar proveedores activos..." : "Buscar proveedores anulados..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {activeTab === "activos" && (
          <div className="create-header">
            <button className="create-button" onClick={openForm}>
              <FontAwesomeIcon icon={faPlus} /> Nuevo Proveedor
            </button>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="table-container">
        {activeTab === "activos" ? (
          filteredActivos.length > 0 ? (
            <ProveedorTable 
              proveedores={filteredActivos} 
              onView={openViewModal}
              onEdit={openEditForm}
              onDelete={eliminarProveedor}
              onToggleEstado={toggleEstado}
            />
          ) : <div className="no-results">No hay proveedores activos</div>
        ) : filteredAnulados.length > 0 ? (
          <ProveedorTable 
            proveedores={filteredAnulados} 
            onView={openViewModal}
            onEdit={openEditForm}
            onDelete={eliminarProveedor}
            onToggleEstado={toggleEstado}
          />
        ) : <div className="no-results">No hay proveedores anulados</div>}
      </div>

      {/* Modal formulario */}
      {isFormOpen && (
        <ProveedorFormModal
          formData={formData}
          errors={errors}
          currentProveedorId={currentProveedorId}
          onClose={closeForm}
          onChange={handleChange}
          onTipoPersonaChange={handleTipoPersonaChange}
          onTipoDocumentoChange={handleTipoDocumentoChange}
          onSubmit={handleSubmit}
        />
      )}

      {/* Modal visualización */}
      {isViewModalOpen && (
        <ViewModal 
          proveedor={modalProveedor} 
          onClose={closeViewModal} 
        />
      )}

      {/* Modal eliminar */}
      {showDeleteAlert && (
        <DeleteModal 
          type="alert"
          onClose={() => setShowDeleteAlert(false)}
        />
      )}

      {showConfirmDelete && proveedorToDelete && (
        <DeleteModal 
          type="confirm"
          proveedor={proveedorToDelete}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default Proveedores;
