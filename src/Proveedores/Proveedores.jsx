import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ProveedorTable from './components/ProveedorTable';
import ProveedorFormModal from './components/ProveedorFormModal';
import ViewModal from './components/ViewModal';
import DeleteModal from './components/DeleteModal';
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from './services/Proveedores.js';
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

  // Cargar proveedores desde la API
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const data = await getProveedores();
        setProveedoresData(data.map(p => ({ ...p, estado: 'Activo', tieneCompras: false })));
      } catch (error) {
        console.error("Error cargando proveedores:", error);
      }
    };
    fetchProveedores();
  }, []);

  // Filtros
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

  // Cambiar estado (Activo/Anulado)
  const toggleEstado = (id) => {
    setProveedoresData(proveedoresData.map(proveedor => 
      proveedor.id === id 
        ? { ...proveedor, estado: proveedor.estado === 'Activo' ? 'Anulado' : 'Activo' } 
        : proveedor
    ));
  };

  // Eliminar proveedor
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
    try {
      await deleteProveedor(proveedorToDelete.id);
      setProveedoresData(proveedoresData.filter(p => p.id !== proveedorToDelete.id));
      setShowConfirmDelete(false);
      setProveedorToDelete(null);
    } catch (error) {
      console.error("Error eliminando proveedor:", error);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setProveedorToDelete(null);
  };

  // Abrir formularios
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
    setFormData({
      tipoPersona: proveedor.tipoPersona,
      tipoDocumento: proveedor.tipoDocumento,
      numeroDocumento: proveedor.numeroDocumento,
      nombres: proveedor.nombres,
      apellidos: proveedor.apellidos,
      razonSocial: proveedor.razonSocial,
      correo: proveedor.correo,
      telefono: proveedor.telefono,
      direccion: proveedor.direccion,
      estado: proveedor.estado
    });
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

  // Validaciones
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.numeroDocumento.trim()) newErrors.numeroDocumento = 'Este campo es requerido';
    else if (formData.tipoDocumento === 'NIT' && !/^\d{9}-?\d$/.test(formData.numeroDocumento)) newErrors.numeroDocumento = 'NIT inválido';
    else if (formData.tipoDocumento === 'CC' && !/^\d{6,10}$/.test(formData.numeroDocumento)) newErrors.numeroDocumento = 'Cédula inválida (6-10 dígitos)';
    else if (formData.tipoDocumento === 'CE' && !/^[a-zA-Z0-9]{6,12}$/.test(formData.numeroDocumento)) newErrors.numeroDocumento = 'Cédula extranjera inválida';
    else if (formData.tipoDocumento === 'PAS' && !/^[a-zA-Z0-9]{6,12}$/.test(formData.numeroDocumento)) newErrors.numeroDocumento = 'Pasaporte inválido';

    if (formData.tipoPersona === 'Natural') {
      if (!formData.nombres.trim()) newErrors.nombres = 'Los nombres son requeridos';
      else if (formData.nombres.length < 3) newErrors.nombres = 'Los nombres deben tener al menos 3 caracteres';
      
      if (!formData.apellidos.trim()) newErrors.apellidos = 'Los apellidos son requeridos';
      else if (formData.apellidos.length < 3) newErrors.apellidos = 'Los apellidos deben tener al menos 3 caracteres';
    } else {
      if (!formData.razonSocial.trim()) newErrors.razonSocial = 'La razón social es requerida';
      else if (formData.razonSocial.length < 3) newErrors.razonSocial = 'La razón social debe tener al menos 3 caracteres';
    }

    if (formData.correo && !/^\S+@\S+\.\S+$/.test(formData.correo)) newErrors.correo = 'Correo electrónico inválido';
    if (formData.telefono && !/^[0-9]{7,15}$/.test(formData.telefono)) newErrors.telefono = 'Teléfono inválido (7-15 dígitos)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar o actualizar proveedor
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const nuevoProveedor = {...formData};

    try {
      if (currentProveedorId) {
        const updated = await updateProveedor(currentProveedorId, nuevoProveedor);
        setProveedoresData(proveedoresData.map(p => 
          p.id === currentProveedorId ? { ...p, ...updated } : p
        ));
      } else {
        const created = await createProveedor(nuevoProveedor);
        setProveedoresData([...proveedoresData, { ...created, tieneCompras: false, estado: 'Activo' }]);
      }
      closeForm();
    } catch (error) {
      console.error("Error guardando proveedor:", error);
    }
  };

  return (
    <div>
      <h1>Cyber360 - Proveedores</h1>
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
