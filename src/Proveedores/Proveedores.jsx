import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faTimes, faEye, faTrash, faPen, 
  faBuilding, faPhone, faEnvelope, faCheck, faBan,
  faIdCard, faAddressCard, faExclamationTriangle, faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

const Proveedores = () => {
  // Estados principales
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

  // Datos de ejemplo de proveedores
  const [proveedoresData, setProveedoresData] = useState([
    { 
      id: '120-45-67',
      tipoDocumento: 'CC', 
      numeroDocumento: '11111111', 
      nombreRazonSocial: 'Juan Pérez', 
      correo: 'juan@email.com', 
      contacto: '3001234567',
      direccion: 'Calle 123 #45-67, Bogotá',
      estado: 'Activo',
      tieneCompras: true
    },
    { 
      id: '234-56-78',
      tipoDocumento: 'NIT', 
      numeroDocumento: '900111222-1', 
      nombreRazonSocial: 'Tecnologías Avanzadas SAS', 
      correo: 'contacto@empresa.com', 
      contacto: '6019876543',
      direccion: 'Calle 100 #15-20, Bogotá',
      estado: 'Anulado',
      tieneCompras: false
    }
  ]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    tipoDocumento: 'CC',
    numeroDocumento: '',
    nombreRazonSocial: '',
    correo: '',
    contacto: '',
    direccion: '',
    estado: 'Activo'
  });

  // Filtros de proveedores
  const filteredActivos = proveedoresData.filter(proveedor => 
    proveedor.nombreRazonSocial.toLowerCase().includes(searchTerm.toLowerCase()) &&
    proveedor.estado === 'Activo'
  );

  const filteredAnulados = proveedoresData.filter(proveedor => 
    proveedor.nombreRazonSocial.toLowerCase().includes(searchTerm.toLowerCase()) &&
    proveedor.estado === 'Anulado'
  );

  // Handlers
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

  const confirmDelete = () => {
    setProveedoresData(proveedoresData.filter(proveedor => proveedor.id !== proveedorToDelete.id));
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
      tipoDocumento: 'CC',
      numeroDocumento: '',
      nombreRazonSocial: '',
      correo: '',
      contacto: '',
      direccion: '',
      estado: 'Activo'
    });
    setErrors({});
  };

  const openEditForm = (proveedor) => {
    setIsFormOpen(true);
    setCurrentProveedorId(proveedor.id);
    setFormData({
      tipoDocumento: proveedor.tipoDocumento,
      numeroDocumento: proveedor.numeroDocumento,
      nombreRazonSocial: proveedor.nombreRazonSocial,
      correo: proveedor.correo,
      contacto: proveedor.contacto,
      direccion: proveedor.direccion || '',
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
    
    if (errors[name]) {
      setErrors({...errors, [name]: null});
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.numeroDocumento.trim()) {
      newErrors.numeroDocumento = 'Este campo es requerido';
    } else if (formData.tipoDocumento === 'NIT') {
      if (!/^\d{9}-?\d$/.test(formData.numeroDocumento)) {
        newErrors.numeroDocumento = 'NIT inválido (formato: 123456789-1)';
      }
    } else if (formData.tipoDocumento === 'CC' && !/^\d{6,10}$/.test(formData.numeroDocumento)) {
      newErrors.numeroDocumento = 'Cédula inválida (6-10 dígitos)';
    } else if (formData.tipoDocumento === 'CE' && !/^[a-zA-Z0-9]{6,12}$/.test(formData.numeroDocumento)) {
      newErrors.numeroDocumento = 'Cédula extranjera inválida';
    } else if (formData.tipoDocumento === 'PAS' && !/^[a-zA-Z0-9]{6,12}$/.test(formData.numeroDocumento)) {
      newErrors.numeroDocumento = 'Pasaporte inválido';
    }
    
    if (!formData.nombreRazonSocial.trim()) {
      newErrors.nombreRazonSocial = 'Este campo es requerido';
    } else if (formData.nombreRazonSocial.length < 3) {
      newErrors.nombreRazonSocial = formData.tipoDocumento === 'NIT' 
        ? 'El nombre debe tener al menos 3 caracteres' 
        : 'El nombre completo debe tener al menos 3 caracteres';
    }
    
    if (formData.correo && !/^\S+@\S+\.\S+$/.test(formData.correo)) {
      newErrors.correo = 'Correo electrónico inválido';
    }
    
    if (formData.contacto && !/^[0-9]{7,15}$/.test(formData.contacto)) {
      newErrors.contacto = 'Contacto inválido (debe tener entre 7 y 15 dígitos)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const nuevoProveedor = {
      id: currentProveedorId || `P-${Date.now()}`,
      tipoDocumento: formData.tipoDocumento,
      numeroDocumento: formData.numeroDocumento,
      nombreRazonSocial: formData.nombreRazonSocial,
      correo: formData.correo,
      contacto: formData.contacto,
      direccion: formData.direccion,
      estado: formData.estado,
      tieneCompras: currentProveedorId 
        ? proveedoresData.find(p => p.id === currentProveedorId)?.tieneCompras || false
        : false
    };
    
    if (currentProveedorId) {
      setProveedoresData(proveedoresData.map(proveedor => 
        proveedor.id === currentProveedorId ? nuevoProveedor : proveedor
      ));
    } else {
      setProveedoresData([...proveedoresData, nuevoProveedor]);
    }
    
    closeForm();
  };

  // Componente para el modal de visualización
  const ViewModal = ({ proveedor, onClose }) => {
    if (!proveedor) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Detalles del Proveedor</h2>
            <button className="close-button" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="user-details-container">
            <div className="user-details-row">
              <span className="detail-label">Tipo Documento:</span>
              <span className="detail-value">
                {proveedor.tipoDocumento === 'CC' ? 'Cédula de Ciudadanía' : 
                 proveedor.tipoDocumento === 'NIT' ? 'NIT' : 
                 proveedor.tipoDocumento === 'CE' ? 'Cédula de Extranjería' : 'Pasaporte'}
              </span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">N° Documento:</span>
              <span className="detail-value">{proveedor.numeroDocumento}</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Estado:</span>
              <span className={`detail-value ${proveedor.estado === 'Activo' ? 'status-active' : 'status-inactive'}`}>
                {proveedor.estado}
              </span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">
                {proveedor.tipoDocumento === 'NIT' ? 'Razón Social:' : 'Nombre:'}
              </span>
              <span className="detail-value">{proveedor.nombreRazonSocial}</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Contacto:</span>
              <span className="detail-value">{proveedor.contacto || 'N/A'}</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Correo:</span>
              <span className="detail-value">{proveedor.correo || 'N/A'}</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Dirección:</span>
              <span className="detail-value">{proveedor.direccion || 'N/A'}</span>
            </div>
            
            {proveedor.tieneCompras && (
              <div className="user-details-row">
                <span className="detail-label"></span>
                <span className="detail-value" style={{color: '#e67e22', fontWeight: 'bold'}}>
                  <FontAwesomeIcon icon={faExclamationTriangle} /> Este proveedor tiene compras asociadas
                </span>
              </div>
            )}
            
            <div className="form-actions">
              <button type="button" className="close-details-button" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente para la alerta de confirmación de eliminación
  const ConfirmDeleteModal = () => (
    <div className="modal-overlay">
      <div className="modal-content delete-modal">
        <div className="modal-header">
          <h2>Confirmar eliminación</h2>
          <button className="close-button" onClick={cancelDelete}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="delete-modal-body">
          <FontAwesomeIcon icon={faQuestionCircle} className="delete-warning-icon" size="3x" />
          <p>¿Estás seguro que deseas eliminar al proveedor <strong>{proveedorToDelete?.nombreRazonSocial}</strong>?</p>
          <p>Esta acción no se puede deshacer.</p>
        </div>
        <div className="form-actions">
          <button className="cancel-button" onClick={cancelDelete}>
            Cancelar
          </button>
          <button className="delete-confirm-button" onClick={confirmDelete}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );

  // Componente para la alerta de eliminación con compras
  const DeleteAlert = () => (
    <div className="modal-overlay">
      <div className="modal-content delete-modal">
        <div className="modal-header">
          <h2>No se puede eliminar</h2>
          <button className="close-button" onClick={() => setShowDeleteAlert(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="delete-modal-body">
          <FontAwesomeIcon icon={faExclamationTriangle} className="delete-warning-icon" size="3x" />
          <p>Este proveedor está asociado a una o más compras y no puede ser eliminado.</p>
          <p>Puedes cambiar su estado a "Anulado" si deseas desactivarlo.</p>
        </div>
        <div className="form-actions">
          <button className="close-details-button" onClick={() => setShowDeleteAlert(false)}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );

  // Componente para la tabla de proveedores
  const TablaProveedores = ({ proveedores }) => (
    <table className="table">
      <thead>
        <tr>
          <th>Nombre/Razón Social</th>
          <th>Documento</th>
          <th>Contacto</th>
          <th>Estado</th>
          <th className="Action">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {proveedores.map((proveedor) => (
          <tr key={proveedor.id}>
            <td>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <span style={{fontWeight: '500'}}>{proveedor.nombreRazonSocial}</span>
                {proveedor.tieneCompras && (
                  <span style={{
                    fontSize: '0.75rem',
                    backgroundColor: '#e67e22',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    marginTop: '4px',
                    display: 'inline-block',
                    width: 'fit-content'
                  }}>
                    Con compras
                  </span>
                )}
              </div>
            </td>
            <td>
              <span>
                {proveedor.tipoDocumento === 'CC' ? 'C.C.' : 
                 proveedor.tipoDocumento === 'NIT' ? 'NIT' : 
                 proveedor.tipoDocumento === 'CE' ? 'C.E.' : 'PAS'} {proveedor.numeroDocumento}
              </span>
            </td>
            <td>
              <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                {proveedor.contacto && (
                  <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                    <FontAwesomeIcon icon={faPhone} size="sm" /> {proveedor.contacto}
                  </span>
                )}
                {proveedor.correo && (
                  <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                    <FontAwesomeIcon icon={faEnvelope} size="sm" /> {proveedor.correo}
                  </span>
                )}
              </div>
            </td>
            <td>
              <button 
                className={`status-toggle ${proveedor.estado === 'Activo' ? 'active' : 'inactive'}`}
                onClick={() => toggleEstado(proveedor.id)}
              >
                <FontAwesomeIcon icon={proveedor.estado === 'Activo' ? faCheck : faBan} />
                {proveedor.estado}
              </button>
            </td>
            <td className="Action">
              <button className="icon-button" onClick={() => openViewModal(proveedor)} title="Ver">
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button 
                className="icon-button" 
                onClick={() => openEditForm(proveedor)}
                disabled={proveedor.estado === 'Anulado'}
                title="Editar"
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button 
                className="icon-button" 
                onClick={() => eliminarProveedor(proveedor.id)}
                disabled={proveedor.estado === 'Anulado'}
                title="Eliminar"
                style={{color: '#e74c3c'}}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <h1>Cyber360 - Proveedores</h1>
      
      <div className="section-divider"></div>
      
      {/* Pestañas */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "activos" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("activos")}
        >
          Proveedores Activos
        </button>
        <button
          className={`tab-button ${activeTab === "anulados" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("anulados")}
        >
          Proveedores Anulados
        </button>
      </div>

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
      
      <div className="table-container">
        {activeTab === "activos" ? (
          filteredActivos.length > 0 ? (
            <TablaProveedores proveedores={filteredActivos} />
          ) : (
            <div className="no-results">No hay proveedores activos</div>
          )
        ) : filteredAnulados.length > 0 ? (
          <TablaProveedores proveedores={filteredAnulados} />
        ) : (
          <div className="no-results">No hay proveedores anulados</div>
        )}
      </div>

      {/* Modal de formulario */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentProveedorId ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
              <button className="close-button" onClick={closeForm}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form className="form-body" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="inline-group">
                  <div className="form-group">
                    <label>Tipo Documento <span className="required-asterisk">*</span></label>
                    <select
                      name="tipoDocumento"
                      value={formData.tipoDocumento}
                      onChange={(e) => {
                        handleChange(e);
                        setFormData({...formData, tipoDocumento: e.target.value, numeroDocumento: ''});
                      }}
                      className={errors.tipoDocumento ? 'input-error' : ''}
                      disabled={!!currentProveedorId}
                      required
                    >
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="NIT">NIT</option>
                      <option value="CE">Cédula de Extranjería</option>
                      <option value="PAS">Pasaporte</option>
                    </select>
                  </div>
                </div>

                <div className="inline-group">
                  <div className="form-group">
                    <label>N° Documento <span className="required-asterisk">*</span></label>
                    <input
                      type="text"
                      name="numeroDocumento"
                      value={formData.numeroDocumento}
                      onChange={handleChange}
                      className={errors.numeroDocumento ? 'input-error' : ''}
                      disabled={!!currentProveedorId}
                      required
                      placeholder={
                        formData.tipoDocumento === 'NIT' ? '123456789-1' : 
                        formData.tipoDocumento === 'CC' ? '1234567890' : 
                        formData.tipoDocumento === 'CE' ? 'ABC123456' : 'AB123456'
                      }
                    />
                    {errors.numeroDocumento && <span className="error">{errors.numeroDocumento}</span>}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="inline-group">
                  <div className="form-group">
                    <label>
                      {formData.tipoDocumento === 'NIT' ? 'Razón Social' : 'Nombre'} <span className="required-asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombreRazonSocial"
                      value={formData.nombreRazonSocial}
                      onChange={handleChange}
                      className={errors.nombreRazonSocial ? 'input-error' : ''}
                      required
                      placeholder={
                        formData.tipoDocumento === 'NIT' ? 'Ej: Tecnologías Avanzadas SAS' : 'Ej: Juan Pérez'
                      }
                    />
                    {errors.nombreRazonSocial && <span className="error">{errors.nombreRazonSocial}</span>}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="inline-group">
                  <div className="form-group">
                    <label>Contacto <span className="required-asterisk">*</span></label>
                    <input
                      type="text"
                      name="contacto"
                      value={formData.contacto}
                      onChange={handleChange}
                      className={errors.contacto ? 'input-error' : ''}
                      placeholder="Ej: 3001234567 o 6012345678"
                    />
                    {errors.contacto && <span className="error">{errors.contacto}</span>}
                  </div>
                </div>

                <div className="inline-group">
                  <div className="form-group">
                    <label>Correo Electrónico <span className="required-asterisk">*</span></label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      className={errors.correo ? 'input-error' : ''}
                      placeholder="Ej: contacto@proveedor.com"
                    />
                    {errors.correo && <span className="error">{errors.correo}</span>}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="inline-group">
                  <div className="form-group">
                    <label>Dirección <span className="required-asterisk">*</span></label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      placeholder="Dirección completa"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={closeForm}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button">
                  {currentProveedorId ? 'Actualizar Proveedor' : 'Crear Proveedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de visualización */}
      {isViewModalOpen && (
        <ViewModal proveedor={modalProveedor} onClose={closeViewModal} />
      )}

      {/* Alertas */}
      {showDeleteAlert && <DeleteAlert />}
      {showConfirmDelete && <ConfirmDeleteModal />}
    </div>
  );
};

export default Proveedores;