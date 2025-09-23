import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faTimes, faPen, faTrash, 
  faCheck, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import './fidelizacion.css';

const Fidelizacion = ({ clientesData }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showReclamarDialog, setShowReclamarDialog] = useState(false);
  const [clienteToReclamar, setClienteToReclamar] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Datos iniciales de fidelización
  const [fidelizacionData, setFidelizacionData] = useState([
    { 
      id: '1', 
      clienteId: '1',
      tipoDoc: 'CC',
      documento: 123456789,
      horasJugadas: 10,
      fichasAcumulables: 3,
      fichasReclamadas: 2,
      fichasNoAcumulables: 1,
      activo: true 
    },
    { 
      id: '2', 
      clienteId: '2',
      tipoDoc: 'CE',
      documento: 987654321,
      horasJugadas: 5,
      fichasAcumulables: 1,
      fichasReclamadas: 0,
      fichasNoAcumulables: 0,
      activo: true 
    },
  ]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    tipoDoc: 'CC',
    documento: '',
    horasJugadas: '',
    fichasAcumulables: 0,
    activo: true
  });

  const [formErrors, setFormErrors] = useState({});

  // Verificar si documento existe en clientes
  const documentoExisteEnClientes = (documento) => {
    return clientesData.some(cliente => 
      cliente.documento === parseInt(documento) && cliente.activo
    );
  };

  // Obtener cliente por documento
  const getClienteByDocumento = (documento) => {
    return clientesData.find(cliente => 
      cliente.documento === parseInt(documento)) || null;
  };

  const openForm = () => {
    setIsFormOpen(true);
    setFormData({
      tipoDoc: 'CC',
      documento: '',
      horasJugadas: '',
      fichasAcumulables: 0,
      activo: true
    });
    setFormErrors({});
    setEditingId(null);
  };

  const openEditForm = (id) => {
    const fidelizacion = fidelizacionData.find(f => f.id === id);
    if (fidelizacion) {
      setIsFormOpen(true);
      setFormData({
        tipoDoc: fidelizacion.tipoDoc,
        documento: fidelizacion.documento.toString(),
        horasJugadas: fidelizacion.horasJugadas.toString(),
        fichasAcumulables: fidelizacion.fichasAcumulables,
        activo: fidelizacion.activo
      });
      setEditingId(id);
      setFormErrors({});
    }
  };

  const closeForm = () => setIsFormOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
    // Limpiar error al editar
    if (formErrors[name]) {
      setFormErrors({...formErrors, [name]: ''});
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.documento) {
      errors.documento = 'Documento es requerido';
      isValid = false;
    } else if (!documentoExisteEnClientes(formData.documento)) {
      errors.documento = 'No existe un cliente activo con este documento';
      isValid = false;
    }

    if (!formData.horasJugadas) {
      errors.horasJugadas = 'Horas jugadas es requerido';
      isValid = false;
    } else if (isNaN(formData.horasJugadas) || parseFloat(formData.horasJugadas) <= 0) {
      errors.horasJugadas = 'Debe ser un número positivo';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const cliente = getClienteByDocumento(formData.documento);
    if (!cliente) return;

    const newFidelizacion = {
      id: editingId || Date.now().toString(),
      clienteId: cliente.id,
      tipoDoc: formData.tipoDoc,
      documento: parseInt(formData.documento),
      horasJugadas: parseFloat(formData.horasJugadas),
      fichasAcumulables: parseInt(formData.fichasAcumulables),
      fichasReclamadas: 0,
      fichasNoAcumulables: 0,
      activo: formData.activo
    };
    
    if (editingId) {
      // Editar existente
      setFidelizacionData(fidelizacionData.map(f => 
        f.id === editingId ? newFidelizacion : f
      ));
    } else {
      // Crear nuevo
      setFidelizacionData([...fidelizacionData, newFidelizacion]);
    }
    
    closeForm();
  };

  const toggleFidelizacionStatus = (id) => {
    setFidelizacionData(fidelizacionData.map(fidelizacion => 
      fidelizacion.id === id ? { ...fidelizacion, activo: !fidelizacion.activo } : fidelizacion
    ));
  };

  const deleteFidelizacion = (id) => {
    setShowConfirmation(true);
    setEditingId(id);
  };

  const confirmDelete = () => {
    setFidelizacionData(fidelizacionData.filter(fidelizacion => fidelizacion.id !== editingId));
    setShowConfirmation(false);
  };

  const openReclamarDialog = (fidelizacion) => {
    setClienteToReclamar(fidelizacion);
    setShowReclamarDialog(true);
  };

  const closeReclamarDialog = () => {
    setShowReclamarDialog(false);
    setClienteToReclamar(null);
  };

  const handleReclamarFichas = () => {
    if (!clienteToReclamar) return;
    
    const fichasDisponibles = clienteToReclamar.fichasAcumulables;
    const fichasAReclamar = Math.floor(fichasDisponibles / 5) * 5;
    
    if (fichasAReclamar <= 0) {
      alert('No hay suficientes fichas acumulables para reclamar (mínimo 5)');
      return;
    }

    setFidelizacionData(fidelizacionData.map(f => {
      if (f.id === clienteToReclamar.id) {
        return {
          ...f,
          fichasAcumulables: f.fichasAcumulables - fichasAReclamar,
          fichasReclamadas: f.fichasReclamadas + fichasAReclamar,
          fichasNoAcumulables: f.fichasNoAcumulables + (fichasAReclamar / 5)
        };
      }
      return f;
    }));

    closeReclamarDialog();
    alert(`Se han reclamado ${fichasAReclamar} fichas acumulables y convertido en ${fichasAReclamar / 5} fichas no acumulables`);
  };

  const getClienteInfo = (clienteId) => {
    const cliente = clientesData.find(c => c.id === clienteId);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente no encontrado';
  };

  return (
    <div className="fidelizacion-container">
      <h1> Programa de Fidelización</h1>
      
      <div className="section-divider"></div>
      
      <div className="create-header">
        <button className="create-button" onClick={openForm}>
          <FontAwesomeIcon icon={faPlus} /> Nuevo Registro
        </button>
      </div>
      
      <div className="table-container">
        <table className="fidelizacion-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Tipo Doc</th>
              <th>Documento</th>
              <th>Horas Jugadas</th>
              <th>Fichas Acum.</th>
              <th>Fichas Reclam.</th>
              <th>Fichas No Acum.</th>
              <th>Estado</th>
              <th className='Action'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fidelizacionData.map((fidelizacion, index) => {
              const cliente = clientesData.find(c => c.id === fidelizacion.clienteId);
              return (
                <tr key={index}>
                  <td>{cliente ? `${cliente.nombre} ${cliente.apellido}` : 'N/A'}</td>
                  <td>{fidelizacion.tipoDoc}</td>
                  <td>{fidelizacion.documento}</td>
                  <td className="text-center">{fidelizacion.horasJugadas}</td>
                  <td className="text-center">
                    <span className="fichas-info fichas-acumulables">
                      {fidelizacion.fichasAcumulables}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="fichas-info fichas-reclamadas">
                      {fidelizacion.fichasReclamadas}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="fichas-info fichas-no-acumulables">
                      {fidelizacion.fichasNoAcumulables}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`status-toggle ${fidelizacion.activo ? 'active' : 'inactive'}`}
                      onClick={() => toggleFidelizacionStatus(fidelizacion.id)}
                      title={fidelizacion.activo ? 'Desactivar' : 'Activar'}
                    >
                      {fidelizacion.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="icon-button reclamar-button" 
                        title="Reclamar fichas"
                        onClick={() => openReclamarDialog(fidelizacion)}
                        disabled={!fidelizacion.activo || fidelizacion.fichasAcumulables < 5}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button 
                        className={`icon-button edit-button ${!fidelizacion.activo ? 'disabled' : ''}`} 
                        title="Editar"
                        onClick={() => openEditForm(fidelizacion.id)}
                        disabled={!fidelizacion.activo}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button 
                        className="icon-button delete-button" 
                        title="Eliminar"
                        onClick={() => deleteFidelizacion(fidelizacion.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de formulario */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content form-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Editar Fidelización' : 'Nuevo Registro de Fidelización'}</h2>
              <button className="close-button" onClick={closeForm}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form className="form-body" onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Información del Cliente</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo Documento:</label>
                    <select
                      name="tipoDoc"
                      value={formData.tipoDoc}
                      onChange={handleChange}
                      disabled={!!editingId}
                    >
                      <option value="CC">Cédula</option>
                      <option value="CE">Cédula Extranjería</option>
                      <option value="TI">Tarjeta Identidad</option>
                      <option value="PA">Pasaporte</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Documento:</label>
                    <input
                      type="number"
                      name="documento"
                      value={formData.documento}
                      onChange={handleChange}
                      placeholder="Documento del cliente"
                      disabled={!!editingId}
                    />
                    {formErrors.documento && <span className="error-message">{formErrors.documento}</span>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Datos de Fidelización</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Horas Jugadas:</label>
                    <input
                      type="number"
                      name="horasJugadas"
                      value={formData.horasJugadas}
                      onChange={handleChange}
                      placeholder="Horas jugadas"
                      step="0.5"
                      min="0.5"
                    />
                    {formErrors.horasJugadas && <span className="error-message">{formErrors.horasJugadas}</span>}
                  </div>

                  <div className="form-group">
                    <label>Fichas Acumulables:</label>
                    <input
                      type="number"
                      name="fichasAcumulables"
                      value={formData.fichasAcumulables}
                      onChange={handleChange}
                      placeholder="Fichas acumulables"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Estado</h3>
                <div className="form-group full-width">
                  <select
                    name="activo"
                    value={formData.activo}
                    onChange={(e) => setFormData({...formData, activo: e.target.value === 'true'})}
                  >
                    <option value={true}>Activo</option>
                    <option value={false}>Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={closeForm}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button">
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de reclamar fichas */}
      {showReclamarDialog && clienteToReclamar && (
        <div className="modal-overlay" onClick={closeReclamarDialog}>
          <div className="modal-content confirmation-modal" onClick={e => e.stopPropagation()}>
            <h3>Reclamar Fichas Acumulables</h3>
            <div className="reclamar-content">
              <div className="reclamar-details">
                <p><strong>Cliente:</strong> {getClienteInfo(clienteToReclamar.clienteId)}</p>
                <p><strong>Documento:</strong> {clienteToReclamar.documento}</p>
                <p><strong>Fichas acumulables disponibles:</strong> {clienteToReclamar.fichasAcumulables}</p>
              </div>
              
              <div className="reclamar-result">
                <p>Se convertirán:</p>
                <p>{Math.floor(clienteToReclamar.fichasAcumulables / 5) * 5} fichas acumulables</p>
                <p>en</p>
                <p>{Math.floor(clienteToReclamar.fichasAcumulables / 5)} fichas no acumulables</p>
              </div>

              <div className="confirmation-buttons">
                <button 
                  className="cancel-button" 
                  onClick={closeReclamarDialog}
                >
                  Cancelar
                </button>
                <button 
                  className="submit-button" 
                  onClick={handleReclamarFichas}
                >
                  Confirmar Reclamación
                </button>
              </div>
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
              <p>¿Estás seguro de eliminar este registro de fidelización?</p>
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

export default Fidelizacion;
