import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  });

  const API_URL = "https://localhost:7228/api/Proveedores"; // ⚡ cambia a tu URL real

  // 🔹 Cargar proveedores desde API
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const res = await axios.get(API_URL);
        setProveedoresData(res.data);
      } catch (error) {
        console.error("❌ Error al obtener proveedores:", error);
      }
    };
    fetchProveedores();
  }, []);

  // 🔽 Filtro por búsqueda
  const filteredProveedores = proveedoresData.filter(proveedor => {
    const nombreCompleto = proveedor.tipoPersona === 'Natural'
      ? `${proveedor.nombres} ${proveedor.apellidos}`.toLowerCase()
      : proveedor.razonSocial?.toLowerCase() || "";
    return nombreCompleto.includes(searchTerm.toLowerCase());
  });

  // 🔹 Eliminar
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
      await axios.delete(`${API_URL}/${proveedorToDelete.id}`);
      setProveedoresData(proveedoresData.filter(p => p.id !== proveedorToDelete.id));
    } catch (error) {
      console.error("❌ Error al eliminar proveedor:", error);
    }
    setShowConfirmDelete(false);
    setProveedorToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setProveedorToDelete(null);
  };

  // 🔹 Formularios
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
    });
    setErrors({});
  };

  const openEditForm = (proveedor) => {
    setIsFormOpen(true);
    setCurrentProveedorId(proveedor.id);
    setFormData({ ...proveedor });
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

  // 🔹 Handlers de formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
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
    setFormData({ ...formData, tipoDocumento: value, numeroDocumento: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // 👇 Construir el campo "nombre" antes de enviar
    const payload = {
      ...formData,
      nombre: formData.tipoPersona === "Natural"
        ? `${formData.nombres} ${formData.apellidos}`.trim()
        : formData.razonSocial
    };

    try {
      if (currentProveedorId) {
        // 🔄 Editar
        const res = await axios.put(`${API_URL}/${currentProveedorId}`, payload);
        setProveedoresData(proveedoresData.map(p =>
          p.id === currentProveedorId ? res.data : p
        ));
      } else {
        // ➕ Crear
        const res = await axios.post(API_URL, payload);
        setProveedoresData([...proveedoresData, res.data]);
      }
      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar proveedor:", error);
    }
  };

  return (
    <div>
      <h1>Proveedores</h1>
      <div className="section-divider"></div>

      {/* Buscador y botón crear */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar proveedores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="create-header">
          <button className="create-button" onClick={openForm}>
            <FontAwesomeIcon icon={faPlus} /> Nuevo Proveedor
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-container">
        {filteredProveedores.length > 0 ? (
          <ProveedorTable
            proveedores={filteredProveedores}
            onView={openViewModal}
            onEdit={openEditForm}
            onDelete={eliminarProveedor}
          />
        ) : (
          <div className="no-results">No hay proveedores</div>
        )}
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
