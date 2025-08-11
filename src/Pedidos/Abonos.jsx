import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEye, faBan, faFilePdf, faTimes 
} from '@fortawesome/free-solid-svg-icons';
import './Abonos.css';

const Abonos = ({ abonos, pedidos, onCreate, onAnular }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentAbono, setCurrentAbono] = useState(null);
  const [formData, setFormData] = useState({
    numeroAbono: 0,
    numeroPedido: 0,
    fechaAbono: new Date().toISOString().split('T')[0],
    totalPedido: 0,
    loQueDebe: 0,
    abonado: 0,
    estado: 'activo'
  });

  const handleCreate = () => {
    if (!formData.numeroAbono || !formData.numeroPedido || !formData.fechaAbono || 
        !formData.totalPedido || !formData.loQueDebe || !formData.abonado) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    onCreate(formData);
    setShowCreate(false);
    setFormData({
      numeroAbono: 0,
      numeroPedido: 0,
      fechaAbono: new Date().toISOString().split('T')[0],
      totalPedido: 0,
      loQueDebe: 0,
      abonado: 0,
      estado: 'activo'
    });
  };

  const generatePDF = (abono) => {
    alert(`Generando PDF para abono #${abono.numeroAbono}`);
  };

  const handleAnular = (id) => {
    if (window.confirm('¿Está seguro que desea anular este abono?')) {
      onAnular(id);
    }
  };

  return (
    <div className="abonos-container">
      <div className="search-container">
        <button 
          className="create-button"
          onClick={() => setShowCreate(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Crear Abono
        </button>
      </div>

      <div className="table-container">
        <table className="abonos-table">
          <thead>
            <tr>
              <th>Núm Abono</th>
              <th>Núm Pedido</th>
              <th>Fecha Abono</th>
              <th>Total Pedido</th>
              <th>Lo que debe</th>
              <th>Estado</th>
              <th className="actions-header">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {abonos.map(abono => (
              <tr key={abono.id} className={abono.estado === 'anulado' ? 'anulado-row' : ''}>
                <td>{abono.numeroAbono}</td>
                <td>{abono.numeroPedido}</td>
                <td>{abono.fechaAbono}</td>
                <td>${abono.totalPedido.toLocaleString()}</td>
                <td>${abono.loQueDebe.toLocaleString()}</td>
                <td>
                  <span className={`estado-badge ${abono.estado}`}>
                    {abono.estado}
                  </span>
                </td>
                <td>
                  <button 
                    className="icon-button"
                    onClick={() => {
                      setCurrentAbono(abono);
                      setShowDetails(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button 
                    className={`icon-button ${abono.estado === 'anulado' ? 'disabled' : 'delete'}`}
                    onClick={() => abono.estado !== 'anulado' && handleAnular(abono.id)}
                    disabled={abono.estado === 'anulado'}
                  >
                    <FontAwesomeIcon icon={faBan} /> {abono.estado === 'anulado' ? 'Anulado' : 'Anular'}
                  </button>
                  <button 
                    className="icon-button"
                    onClick={() => generatePDF(abono)}
                  >
                    <FontAwesomeIcon icon={faFilePdf} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Crear Abono */}
      {showCreate && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Crear Nuevo Abono</h2>
              <button className="close-button" onClick={() => setShowCreate(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="form-body">
              <div className="form-group">
                <label>Número de Abono</label>
                <input
                  type="number"
                  value={formData.numeroAbono}
                  onChange={(e) => setFormData({...formData, numeroAbono: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Número de Pedido</label>
                <input
                  type="number"
                  value={formData.numeroPedido}
                  onChange={(e) => setFormData({...formData, numeroPedido: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Fecha del Abono</label>
                <input
                  type="date"
                  value={formData.fechaAbono}
                  onChange={(e) => setFormData({...formData, fechaAbono: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Total del Pedido</label>
                <input
                  type="number"
                  value={formData.totalPedido}
                  onChange={(e) => setFormData({...formData, totalPedido: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Lo que debe</label>
                <input
                  type="number"
                  value={formData.loQueDebe}
                  onChange={(e) => setFormData({...formData, loQueDebe: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Abonado</label>
                <input
                  type="number"
                  value={formData.abonado}
                  onChange={(e) => setFormData({...formData, abonado: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button className="cancel-button" onClick={() => setShowCreate(false)}>Cancelar</button>
                <button className="submit-button" onClick={handleCreate}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalles Abono */}
      {showDetails && currentAbono && (
        <div className="modal-overlay">
          <div className="modal-content details-modal">
            <div className="modal-header">
              <h2>Detalles del Abono #{currentAbono.numeroAbono}</h2>
              <button className="close-button" onClick={() => setShowDetails(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="details-content">
              <div className="details-info">
                <div className="detail-row">
                  <div className="detail-label">Número de Abono:</div>
                  <div className="detail-value">{currentAbono.numeroAbono}</div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-label">Número de Pedido:</div>
                  <div className="detail-value">{currentAbono.numeroPedido}</div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-label">Fecha del Abono:</div>
                  <div className="detail-value">{currentAbono.fechaAbono}</div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-label">Total del Pedido:</div>
                  <div className="detail-value">${currentAbono.totalPedido.toLocaleString()}</div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-label">Lo que debe:</div>
                  <div className="detail-value">${currentAbono.loQueDebe.toLocaleString()}</div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-label">Abonado:</div>
                  <div className="detail-value">${currentAbono.abonado.toLocaleString()}</div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-label">Estado:</div>
                  <div className="detail-value">
                    <span className={`estado-badge ${currentAbono.estado}`}>
                      {currentAbono.estado}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="submit-button" onClick={() => generatePDF(currentAbono)}>
                <FontAwesomeIcon icon={faFilePdf} /> Generar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Abonos;
