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

  // 🔹 Cargar proveedores
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

  // 🔹 Filtro
  const filteredProveedores = proveedoresData.filter(proveedor => {
    const nombreCompleto = proveedor.tipoPersona === 'Natural'
      ? `${proveedor.nombres} ${proveedor.apellidos}`.toLowerCase()
      : proveedor.razonSocial?.toLowerCase() || "";
    return nombreCompleto.includes(searchTerm.toLowerCase());
  });

  // 🔹 Eliminar proveedor
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

  // 🔹 Handlers
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

  // ✅ VALIDACIÓN COMPLETA
  const validateForm = () => {
    const newErrors = {};

    // Tipo de persona
    if (!formData.tipoPersona.trim()) {
      newErrors.tipoPersona = "El tipo de persona es obligatorio";
    }

    // Tipo de documento
    if (!formData.tipoDocumento.trim()) {
      newErrors.tipoDocumento = "El tipo de documento es obligatorio";
    }

    // Documento
    if (!formData.numeroDocumento.trim()) {
      newErrors.numeroDocumento = "El número de documento es requerido";
    } else if (!/^\d+$/.test(formData.numeroDocumento)) {
      newErrors.numeroDocumento = "Solo se permiten números";
    } else if (formData.numeroDocumento.length < 6) {
      newErrors.numeroDocumento = "Debe tener al menos 6 dígitos";
    }

    // Persona natural
    if (formData.tipoPersona === 'Natural') {
      if (!formData.nombres.trim()) {
        newErrors.nombres = "Los nombres son requeridos";
      } else if (/\d/.test(formData.nombres)) {
        newErrors.nombres = "Los nombres no pueden tener números";
      }

      if (!formData.apellidos.trim()) {
        newErrors.apellidos = "Los apellidos son requeridos";
      } else if (/\d/.test(formData.apellidos)) {
        newErrors.apellidos = "Los apellidos no pueden tener números";
      }
    }

    // Persona jurídica
    if (formData.tipoPersona === 'Jurídica') {
      if (!formData.razonSocial.trim()) {
        newErrors.razonSocial = "La razón social es requerida";
      } else if (formData.razonSocial.length < 3) {
        newErrors.razonSocial = "Debe tener al menos 3 caracteres";
      }
    }

    // Correo
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "Ingrese un correo válido";
    }

    // Teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!/^\d{7,}$/.test(formData.telefono)) {
      newErrors.telefono = "Ingrese un teléfono válido (mínimo 7 dígitos)";
    }

    // Dirección
    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida";
    } else if (formData.direccion.length < 4) {
      newErrors.direccion = "Debe tener al menos 4 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Guardar
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      nombre: formData.tipoPersona === "Natural"
        ? `${formData.nombres} ${formData.apellidos}`.trim()
        : formData.razonSocial
    };

    try {
      if (currentProveedorId) {
        const res = await axios.put(`${API_URL}/${currentProveedorId}`, payload);
        setProveedoresData(proveedoresData.map(p =>
          p.id === currentProveedorId ? res.data : p
        ));
      } else {
        const res = await axios.post(API_URL, payload);
        setProveedoresData([...proveedoresData, res.data]);
      }

      // Refrescar lista
      const updatedList = await axios.get(API_URL);
      setProveedoresData(updatedList.data);

      closeForm();
    } catch (error) {
      console.error("❌ Error al guardar proveedor:", error);
    }
  };

  return (
    <div>
      <h1>Proveedores</h1>
      <div className="section-divider"></div>

      {/* Buscar y agregar */}
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

      {/* Modales */}
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

      {isViewModalOpen && (
        <ViewModal proveedor={modalProveedor} onClose={closeViewModal} />
      )}

      {showDeleteAlert && (
        <DeleteModal type="alert" onClose={() => setShowDeleteAlert(false)} />
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
