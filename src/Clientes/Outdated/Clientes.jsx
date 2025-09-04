import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faTimes, faEye, faPen, faTrash, 
  faPowerOff, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import './clientes.css';

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

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDoc: 'CC',
    documento: '',
    fechaNac: '',
    celular: '',
    correo: '',
    direccion: '',
    activo: true
  });

  // Funciones de validación
  const documentoExiste = (documento) => {
    return clientesData.some(cliente => 
      cliente.documento === parseInt(documento) && 
      (!isEditMode || cliente.id !== currentId)
    );
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateFechaNac = (fecha) => {
    if (!fecha) return false;
    const today = new Date();
    const birthDate = new Date(fecha);
    return birthDate < today;
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.nombre.trim()) {
      errors.nombre = 'Nombre es requerido';
      isValid = false;
    }

    if (!formData.apellido.trim()) {
      errors.apellido = 'Apellido es requerido';
      isValid = false;
    }

    if (!formData.documento) {
      errors.documento = 'Documento es requerido';
      isValid = false;
    } else if (isNaN(formData.documento)) {
      errors.documento = 'Documento debe ser numérico';
      isValid = false;
    } else if (documentoExiste(formData.documento)) {
      errors.documento = 'Este documento ya está registrado';
      isValid = false;
    }

    if (!formData.fechaNac) {
      errors.fechaNac = 'Fecha de nacimiento es requerida';
      isValid = false;
    } else if (!validateFechaNac(formData.fechaNac)) {
      errors.fechaNac = 'Fecha inválida';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Manejo de formulario
  const openForm = () => {
    setIsFormOpen(true);
    setIsEditMode(false);
    setFormData({
      nombre: '',
      apellido: '',
      tipoDoc: 'CC',
      documento: '',
      fechaNac: '',
      celular: '',
      correo: '',
      direccion: '',
      activo: true
    });
    setFormErrors({});
  };

  const openEditForm = (cliente) => {
    setIsFormOpen(true);
    setIsEditMode(true);
    setCurrentId(cliente.id);
    setSelectedCliente(cliente);
    setFormData({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      tipoDoc: cliente.tipoDoc,
      documento: cliente.documento.toString(),
      fechaNac: cliente.fechaNac,
      celular: cliente.celular?.toString() || '',
      correo: cliente.correo || '',
      direccion: cliente.direccion || '',
      activo: cliente.activo
    });
    setFormErrors({});
  };

  const closeForm = () => setIsFormOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Operaciones CRUD
  const handleSubmit = () => {
    if (!validateForm()) return;

    if (isEditMode) {
      setClientesData(clientesData.map(cliente => 
        cliente.id === currentId ? {
          ...cliente,
          ...formData,
          documento: parseInt(formData.documento),
          celular: formData.celular ? parseInt(formData.celular) : null
        } : cliente
      ));
    } else {
      const newCliente = {
        id: Date.now().toString(),
        ...formData,
        documento: parseInt(formData.documento),
        celular: formData.celular ? parseInt(formData.celular) : null
      };
      setClientesData([...clientesData, newCliente]);
    }
    closeForm();
  };

  const toggleClienteStatus = (id) => {
    setClientesData(clientesData.map(cliente => 
      cliente.id === id ? { ...cliente, activo: !cliente.activo } : cliente
    ));
  };

  const deleteCliente = (id) => {
    setDeleteId(id);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    setClientesData(clientesData.filter(cliente => cliente.id !== deleteId));
    setShowConfirmation(false);
  };

  // Renderizado
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
        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Tipo Doc</th>
              <th>Documento</th>
              <th>Celular</th>
              <th>Estado</th>
              <th className='Action'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesData.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.tipoDoc}</td>
                <td>{cliente.documento}</td>
                <td>{cliente.celular || '-'}</td>
                <td>
                  <button 
                    className={`status-toggle ${cliente.activo ? 'active' : 'inactive'}`}
                    onClick={() => toggleClienteStatus(cliente.id)}
                  >
                    <FontAwesomeIcon icon={faPowerOff} />
                    {cliente.activo ? ' Activo' : ' Inactivo'}
                  </button>
                </td>
                <td>
                  <button 
                    className="icon-button" 
                    onClick={() => setSelectedCliente(cliente) || setShowDetails(true)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button 
                    className="icon-button" 
                    onClick={() => openEditForm(cliente)}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button 
                    className="icon-button" 
                    onClick={() => deleteCliente(cliente.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Formulario */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditMode ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
              <button className="close-button" onClick={closeForm}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="form-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre <span className="required">*</span></label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={formErrors.nombre ? 'error-input' : ''}
                  />
                  {formErrors.nombre && <span className="error-message">{formErrors.nombre}</span>}
                </div>

                <div className="form-group">
                  <label>Apellido <span className="required">*</span></label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className={formErrors.apellido ? 'error-input' : ''}
                  />
                  {formErrors.apellido && <span className="error-message">{formErrors.apellido}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tipo Documento <span className="required">*</span></label>
                  <select
                    name="tipoDoc"
                    value={formData.tipoDoc}
                    onChange={handleChange}
                  >
                    <option value="CC">Cédula</option>
                    <option value="CE">Cédula Extranjería</option>
                    <option value="TI">Tarjeta Identidad</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Documento <span className="required">*</span></label>
                  <input
                    type="text"
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    disabled={isEditMode}
                    className={formErrors.documento ? 'error-input' : ''}
                  />
                  {formErrors.documento && <span className="error-message">{formErrors.documento}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha Nacimiento <span className="required">*</span></label>
                  <input
                    type="date"
                    name="fechaNac"
                    value={formData.fechaNac}
                    onChange={handleChange}
                    className={formErrors.fechaNac ? 'error-input' : ''}
                  />
                  {formErrors.fechaNac && <span className="error-message">{formErrors.fechaNac}</span>}
                </div>

                <div className="form-group">
                  <label>Celular</label>
                  <input
                    type="text"
                    name="celular"
                    value={formData.celular}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Correo</label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Estado</label>
                  <select
                    name="activo"
                    value={formData.activo}
                    onChange={handleChange}
                  >
                    <option value={true}>Activo</option>
                    <option value={false}>Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="cancel-button" onClick={closeForm}>
                Cancelar
              </button>
              <button type="button" className="submit-button" onClick={handleSubmit}>
                {isEditMode ? 'Guardar Cambios' : 'Crear Cliente'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles */}
      {showDetails && selectedCliente && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles del Cliente</h2>
              <button className="close-button" onClick={() => setShowDetails(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="user-details-container">
              <div className="user-details-row">
                <span className="detail-label">Nombre:</span>
                <span className="detail-value">{selectedCliente.nombre}</span>
              </div>
              <div className="user-details-row">
                <span className="detail-label">Apellido:</span>
                <span className="detail-value">{selectedCliente.apellido}</span>
              </div>
              <div className="user-details-row">
                <span className="detail-label">Tipo Documento:</span>
                <span className="detail-value">{selectedCliente.tipoDoc}</span>
              </div>
              <div className="user-details-row">
                <span className="detail-label">Documento:</span>
                <span className="detail-value">{selectedCliente.documento}</span>
              </div>
              <div className="user-details-row">
                <span className="detail-label">Fecha Nacimiento:</span>
                <span className="detail-value">{selectedCliente.fechaNac}</span>
              </div>
              <div className="user-details-row">
                <span className="detail-label">Celular:</span>
                <span className="detail-value">{selectedCliente.celular || '-'}</span>
              </div>
              <div className="user-details-row">
                <span className="detail-label">Correo:</span>
                <span className="detail-value">{selectedCliente.correo || '-'}</span>
              </div>
              <div className="user-details-row">
                <span className="detail-label">Dirección:</span>
                <span className="detail-value">{selectedCliente.direccion || '-'}</span>
              </div>
              <div className="user-details-row">
                <span className="detail-label">Estado:</span>
                <span className={`detail-value ${selectedCliente.activo ? 'active' : 'inactive'}`}>
                  {selectedCliente.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div className="form-actions">
              <button 
                className="close-details-button" 
                onClick={() => setShowDetails(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      {showConfirmation && (
        <div className="modal-overlay" onClick={() => setShowConfirmation(false)}>
          <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirmar Eliminación</h2>
              <button className="close-button" onClick={() => setShowConfirmation(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="delete-modal-body">
              <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
              <p>¿Estás seguro de eliminar este cliente?</p>
              <p>Esta acción no se puede deshacer.</p>
            </div>

            <div className="form-actions">
              <button 
                className="cancel-button" 
                onClick={() => setShowConfirmation(false)}
              >
                Cancelar
              </button>
              <button 
                className="delete-confirm-button" 
                onClick={confirmDelete}
              >
                <FontAwesomeIcon icon={faTrash} /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
