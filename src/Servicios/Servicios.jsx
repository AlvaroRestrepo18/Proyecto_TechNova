import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faTimes, faEye, faPen, faTrash, faPowerOff
} from '@fortawesome/free-solid-svg-icons';
import '../app.css';

const Productos = () => {
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

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    details: '',
    image: '',
    estado: 'activo'
  });

  const filteredServices = servicesData.filter(servicio =>
    servicio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicio.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openForm = () => {
    setIsFormOpen(true);
    setIsEditing(false);
    setFormData({
      id: '',
      name: '',
      price: '',
      details: '',
      image: '',
      estado: 'activo'
    });
  };

  const openEditForm = (service) => {
    setIsFormOpen(true);
    setIsEditing(true);
    setFormData({
      id: service.id,
      name: service.name,
      price: service.price,
      details: service.details,
      image: service.image,
      estado: service.active ? 'activo' : 'inactivo'
    });
  };

  const showServiceDetails = (service) => {
    setCurrentService(service);
    setShowDetailsModal(true);
  };

  const closeForm = () => setIsFormOpen(false);
  const closeDetailsModal = () => setShowDetailsModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitConfirmation = () => {
    setShowConfirmation(false);
    handleSubmit();
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!formData.name || !formData.price || !formData.details) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    if (isEditing) {
      setServicesData(servicesData.map(servicio =>
        servicio.id === formData.id ? {
          ...servicio,
          name: formData.name,
          price: formData.price,
          details: formData.details,
          image: formData.image || servicio.image,
          active: formData.estado === 'activo'
        } : servicio
      ));
    } else {
      const newService = {
        id: Date.now().toString(),
        name: formData.name,
        price: formData.price,
        details: formData.details,
        image: formData.image || 'https://via.placeholder.com/150',
        active: formData.estado === 'activo'
      };
      setServicesData([...servicesData, newService]);
    }

    closeForm();
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

  const executeDelete = () => {
    setServicesData(servicesData.filter(servicio => servicio.id !== serviceToDelete));
    setShowDeleteConfirmation(false);
  };

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
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Imagen</th>
              <th>Precio</th>
              <th>Estado</th>
              <th className="Action">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((servicio) => (
              <tr key={servicio.id}>
                <td>{servicio.name}</td>
                <td>
                  <img
                    src={servicio.image}
                    alt={servicio.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td>${servicio.price}</td>
                <td>
                  <button
                    className={`status-toggle ${servicio.active ? 'active' : 'inactive'}`}
                    onClick={() => toggleServiceStatus(servicio.id)}
                  >
                    <FontAwesomeIcon icon={faPowerOff} />
                    <span>{servicio.active ? ' Activo' : ' Inactivo'}</span>
                  </button>
                </td>
                <td>
                  <button className="icon-button" onClick={() => showServiceDetails(servicio)} title="Ver">
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button className="icon-button" onClick={() => openEditForm(servicio)} title="Editar">
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className="icon-button" onClick={() => confirmDelete(servicio.id)} title="Eliminar">
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ backgroundColor: '#1e3c72' }}>
              <h2>{isEditing ? 'Editar Servicio' : 'Crear Servicio'}</h2>
              <button className="close-button" onClick={closeForm}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form className="form-body" onSubmit={(e) => { e.preventDefault(); setShowConfirmation(true); }}>
              <div className="form-group">
                <label>Nombre</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Detalles</label>
                <textarea name="details" value={formData.details} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Imagen</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {formData.image && <img src={formData.image} alt="preview" style={{ width: '100px', marginTop: '10px' }} />}
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select name="estado" value={formData.estado} onChange={handleChange}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={closeForm}>Cancelar</button>
                <button type="submit" className="submit-button">{isEditing ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmación creación/edición */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content confirmation-modal">
            <h3>¿Confirmar {isEditing ? 'actualización' : 'creación'}?</h3>
            <div className="form-actions">
              <button className="cancel-button" onClick={() => setShowConfirmation(false)}>Cancelar</button>
              <button className="submit-button" onClick={handleSubmitConfirmation}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmación eliminación */}
      {showDeleteConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <h3>¿Eliminar este servicio?</h3>
            <div className="form-actions">
              <button className="cancel-button" onClick={() => setShowDeleteConfirmation(false)}>Cancelar</button>
              <button className="delete-confirm-button" onClick={executeDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* Detalles */}
      {showDetailsModal && currentService && (
        <div className="modal-overlay" onClick={closeDetailsModal}>
          <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ backgroundColor: '#1e3c72' }}>
              <h2>Detalles del Servicio</h2>
              <button className="close-button" onClick={closeDetailsModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="details-body">
              <div className="details-row"><strong>ID:</strong> {currentService.id}</div>
              <div className="details-row"><strong>Nombre:</strong> {currentService.name}</div>
              <div className="details-row"><strong>Precio:</strong> ${currentService.price}</div>
              <div className="details-row"><strong>Estado:</strong> <span className={`details-value ${currentService.active ? 'active' : 'inactive'}`}>{currentService.active ? 'Activo' : 'Inactivo'}</span></div>
              <div className="details-row"><strong>Detalles:</strong>
                <div>
                  {currentService.details.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
              <div className="details-row">
                <strong>Imagen:</strong>
                <img src={currentService.image} alt="Servicio" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="submit-button" onClick={closeDetailsModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;
