import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEye, faEdit, faMoneyBillWave, 
  faBan, faFilePdf, faTimes 
} from '@fortawesome/free-solid-svg-icons';
import './Pedidos.css';

const Pedidos = ({ pedidos, clientes, onCreate, onEdit, onDelete, onToggleEstado, onShowAbono }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPedido, setCurrentPedido] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    clienteCedula: '',
    estado: 'Activo',
    prioridad: false,
    fecha: new Date().toISOString().split('T')[0],
    fechaReparacion: '',
    fechaEstimada: '',
    detallesDanio: '',
    detallesSolucion: '',
    tipoReparacion: false,
    valor: 0
  });

  const filteredPedidos = pedidos.filter(pedido => {
    if (!searchTerm) return true;
    return (
      pedido.id.toString().includes(searchTerm) ||
      (clientes.find(c => c.cedula === pedido.clienteCedula)?.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const getClienteNombre = (cedula) => {
    const cliente = clientes.find(c => c.cedula === cedula);
    return cliente ? cliente.nombre : 'Cliente no encontrado';
  };

  const handleCreate = () => {
    if (!formData.clienteCedula || !formData.fecha || !formData.detallesDanio || 
        formData.detallesDanio.length > 500 || (formData.detallesSolucion && formData.detallesSolucion.length > 500)) {
      alert('Complete los campos requeridos y verifique los límites de caracteres');
      return;
    }
    onCreate(formData);
    setShowCreate(false);
    setFormData({
      clienteCedula: '',
      estado: 'Activo',
      prioridad: false,
      fecha: new Date().toISOString().split('T')[0],
      fechaReparacion: '',
      fechaEstimada: '',
      detallesDanio: '',
      detallesSolucion: '',
      tipoReparacion: false,
      valor: 0
    });
  };

  const handleEdit = () => {
    if (!currentPedido.detallesDanio || currentPedido.detallesDanio.length > 500 || 
        (currentPedido.detallesSolucion && currentPedido.detallesSolucion.length > 500)) {
      alert('Complete los campos requeridos y verifique los límites de caracteres');
      return;
    }
    onEdit(currentPedido);
    setShowEdit(false);
  };

  const handleAnular = (id) => {
    const pedido = pedidos.find(p => p.id === id);
    if (pedido) {
      onEdit({...pedido, estado: 'Anulado'});
    }
  };

  const generatePDF = (pedido) => {
    alert(`Generando PDF para pedido #${pedido.id}`);
  };

  const getEstadoClass = (estado) => {
    switch(estado) {
      case 'Activo': return 'active';
      case 'Inactivo': return 'inactive';
      case 'Anulado': return 'anulado';
      default: return '';
    }
  };

  const getEstadoText = (estado) => {
    switch(estado) {
      case 'Activo': return 'Activo';
      case 'Inactivo': return 'Inactivo';
      case 'Anulado': return 'Anulado';
      default: return estado;
    }
  };

  return (
    <div className="pedidos-container">
      <div className="search-container">
        <button 
          className="create-button"
          onClick={() => setShowCreate(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Crear Pedido
        </button>
      </div>

      <div className="table-container">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>Núm Pedido</th>
              <th>Nombre Cliente</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Fecha</th>
              <th className="actions-header">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.map(pedido => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{getClienteNombre(pedido.clienteCedula)}</td>
                <td>
                  <button 
                    className={`status-toggle ${getEstadoClass(pedido.estado)}`}
                    onClick={() => onToggleEstado(pedido.id)}
                  >
                    {getEstadoText(pedido.estado)}
                  </button>
                </td>
                <td>{pedido.prioridad ? 'Alta' : 'Normal'}</td>
                <td>{pedido.fecha}</td>
                <td>
                  <button 
                    className="icon-button"
                    onClick={() => {
                      setCurrentPedido(pedido);
                      setShowDetails(true);
                    }}
                    disabled={pedido.estado === 'Anulado'}
                  >
                    <FontAwesomeIcon icon={faEye} /> Ver
                  </button>
                  <button 
                    className="icon-button"
                    onClick={() => {
                      setCurrentPedido({...pedido});
                      setShowEdit(true);
                    }}
                    disabled={pedido.estado === 'Anulado'}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Editar
                  </button>
                  <button 
                    className="icon-button"
                    onClick={() => {
                      setCurrentPedido(pedido);
                      onShowAbono();
                    }}
                    disabled={pedido.estado === 'Anulado'}
                  >
                    <FontAwesomeIcon icon={faMoneyBillWave} /> Abono
                  </button>
                  <button 
                    className={`icon-button ${pedido.estado === 'Anulado' ? 'anulado' : 'delete'}`}
                    onClick={() => handleAnular(pedido.id)}
                    disabled={pedido.estado === 'Anulado'}
                  >
                    <FontAwesomeIcon icon={faBan} /> {pedido.estado === 'Anulado' ? 'Anulado' : 'Anular'}
                  </button>
                  <button 
                    className="icon-button"
                    onClick={() => generatePDF(pedido)}
                  >
                    <FontAwesomeIcon icon={faFilePdf} /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Crear Pedido */}
      {showCreate && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Crear Nuevo Pedido</h2>
              <button className="close-button" onClick={() => setShowCreate(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="form-body">
              <div className="form-group">
                <label>Cédula del Cliente</label>
                <select
                  value={formData.clienteCedula}
                  onChange={(e) => setFormData({...formData, clienteCedula: e.target.value})}
                  required
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.cedula} value={cliente.cedula}>{cliente.nombre} - {cliente.cedula}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Fecha</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Detalles del Daño (Máx. 500 caracteres)</label>
                <textarea
                  value={formData.detallesDanio}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setFormData({...formData, detallesDanio: e.target.value});
                    }
                  }}
                  required
                />
                <small>{formData.detallesDanio.length}/500 caracteres</small>
              </div>
              
              <div className="form-group">
                <label>Detalles de la Solución (Máx. 500 caracteres)</label>
                <textarea
                  value={formData.detallesSolucion}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setFormData({...formData, detallesSolucion: e.target.value});
                    }
                  }}
                />
                <small>{formData.detallesSolucion.length}/500 caracteres</small>
              </div>
              
              <div className="form-group">
                <label>Fecha Estimada de Reparación</label>
                <input
                  type="date"
                  value={formData.fechaEstimada}
                  onChange={(e) => setFormData({...formData, fechaEstimada: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Valor</label>
                <input
                  type="number"
                  value={formData.valor}
                  onChange={(e) => setFormData({...formData, valor: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.prioridad}
                    onChange={(e) => setFormData({...formData, prioridad: e.target.checked})}
                  />
                  Prioridad Alta
                </label>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.tipoReparacion}
                    onChange={(e) => setFormData({...formData, tipoReparacion: e.target.checked})}
                  />
                  Reparación Completa
                </label>
              </div>
              
              <div className="form-actions">
                <button className="cancel-button" onClick={() => setShowCreate(false)}>Cancelar</button>
                <button className="submit-button" onClick={handleCreate}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Pedido */}
      {showEdit && currentPedido && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Editar Pedido #{currentPedido.id}</h2>
              <button className="close-button" onClick={() => setShowEdit(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="form-body">
              <div className="form-group">
                <label>Fecha Reparación</label>
                <input
                  type="date"
                  value={currentPedido.fechaReparacion}
                  onChange={(e) => setCurrentPedido({...currentPedido, fechaReparacion: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Detalles del Daño (Máx. 500 caracteres)</label>
                <textarea
                  value={currentPedido.detallesDanio}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setCurrentPedido({...currentPedido, detallesDanio: e.target.value});
                    }
                  }}
                  required
                />
                <small>{currentPedido.detallesDanio.length}/500 caracteres</small>
              </div>
              
              <div className="form-group">
                <label>Detalles de la Solución (Máx. 500 caracteres)</label>
                <textarea
                  value={currentPedido.detallesSolucion}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setCurrentPedido({...currentPedido, detallesSolucion: e.target.value});
                    }
                  }}
                />
                <small>{currentPedido.detallesSolucion.length}/500 caracteres</small>
              </div>
              
              <div className="form-group">
                <label>Valor</label>
                <input
                  type="number"
                  value={currentPedido.valor}
                  onChange={(e) => setCurrentPedido({...currentPedido, valor: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={currentPedido.prioridad}
                    onChange={(e) => setCurrentPedido({...currentPedido, prioridad: e.target.checked})}
                  />
                  Prioridad Alta
                </label>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={currentPedido.tipoReparacion}
                    onChange={(e) => setCurrentPedido({...currentPedido, tipoReparacion: e.target.checked})}
                  />
                  Reparación Completa
                </label>
              </div>
              
              <div className="form-actions">
                <button className="cancel-button" onClick={() => setShowEdit(false)}>Cancelar</button>
                <button className="submit-button" onClick={handleEdit}>Guardar Cambios</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalles Pedido */}
      {showDetails && currentPedido && (
        <div className="modal-overlay">
          <div className="modal-content details-modal">
            <div className="modal-header">
              <h2>Detalles del Pedido #{currentPedido.id}</h2>
              <button className="close-button" onClick={() => setShowDetails(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="details-content">
              <div className="details-info">
                <div className="detail-row">
                  <div className="detail-label">Cliente:</div>
                  <div className="detail-value">{getClienteNombre(currentPedido.clienteCedula)}</div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-label">Estado:</div>
                  <div className={`detail-value ${getEstadoClass(currentPedido.estado)}`}>
                    {getEstadoText(currentPedido.estado)}
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-label">Prioridad:</div>
                  <div className="detail-value">{currentPedido.prioridad ? 'Alta' : 'Normal'}</div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-label">Fecha:</div>
                  <div className="detail-value">{currentPedido.fecha}</div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-label">Fecha Reparación:</div>
                  <div className="detail-value">{currentPedido.fechaReparacion || 'No reparado'}</div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-label">Fecha Estimada:</div>
                  <div className="detail-value">{currentPedido.fechaEstimada}</div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-label">Tipo Reparación:</div>
                  <div className="detail-value">{currentPedido.tipoReparacion ? 'Completa' : 'Parcial'}</div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-label">Valor:</div>
                  <div className="detail-value">${currentPedido.valor.toLocaleString()}</div>
                </div>
                
                <div className="detail-row full-width">
                  <div className="detail-label">Detalles del Daño:</div>
                  <div className="details-text">{currentPedido.detallesDanio}</div>
                </div>
                
                <div className="detail-row full-width">
                  <div className="detail-label">Detalles de la Solución:</div>
                  <div className="details-text">{currentPedido.detallesSolucion || 'No hay solución registrada'}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="submit-button" onClick={() => generatePDF(currentPedido)}>
                <FontAwesomeIcon icon={faFilePdf} /> Generar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedidos;
