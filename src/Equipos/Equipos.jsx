import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import './Equipos.css';

const Equipos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Datos de ejemplo
  const equipmentData = [
    { id: '111-22-11', name: 'Equipo 1', value: '45000' },
    { id: '111-22-22', name: 'Equipo 2', value: '45000' },
    { id: '111-22-33', name: 'Equipo 3', value: '45000' },
  ];

  // Estado del formulario editable
  const [formData, setFormData] = useState({
    equipoId: '',
    nombre: '',
    estado: 'activo',
    componentes: Array(6).fill('')
  });

  const filteredEquipment = equipmentData.filter(equipo => 
    equipo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipo.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openForm = () => {
    setIsFormOpen(true);
    // Resetear formulario al abrir
    setFormData({
      equipoId: '',
      nombre: '',
      estado: 'activo',
      componentes: Array(6).fill('')
    });
  };

  const closeForm = () => setIsFormOpen(false);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    
    if (index !== null) {
      const nuevosComponentes = [...formData.componentes];
      nuevosComponentes[index] = value;
      setFormData({...formData, componentes: nuevosComponentes});
    } else {
      setFormData({...formData, [name]: value});
    }
  };

  return (
    <div className="equipment-container">
      <h1>Cyber360 - Equipos</h1>
      
      <div className="section-divider"></div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar equipo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="equipment-id-section">
        <h3>Equipo id</h3>
        <p>Nombre Equipo</p>
      </div>

      <div className="create-header">
        <button className="create-button" onClick={openForm}>
          <FontAwesomeIcon icon={faPlus} /> Crear
        </button>
      </div>
      
      <div className="table-container">
        <table className="equipment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Valor</th>
              <th className='Action'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipment.map((equipo, index) => (
              <tr key={index}>
                <td>{equipo.id}</td>
                <td>{equipo.name}</td>
                <td>{equipo.value}</td>
                <td>
                  <button className="icon-button" title="Ver">
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button className="icon-button" title="Editar">
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className="icon-button" title="Eliminar">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de formulario */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Crear Nuevo Equipo</h2>
              <button className="close-button" onClick={closeForm}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="form-body">
              <div className="form-group">
                <label>ID del Equipo:</label>
                <input
                  type="text"
                  name="equipoId"
                  value={formData.equipoId}
                  onChange={handleChange}
                  placeholder="EQ-001"
                />
              </div>

              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del equipo"
                />
              </div>

              <div className="form-group">
                <label>Estado:</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="mantenimiento">En mantenimiento</option>
                </select>
              </div>

              <h3>Componentes</h3>
              <div className="components-grid">
                {formData.componentes.map((comp, index) => (
                  <div key={index} className="component-input">
                    <label>Componente {index + 1}</label>
                    <input
                      type="text"
                      value={comp}
                      onChange={(e) => handleChange(e, index)}
                      placeholder={`Tipo de componente ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button className="cancel-button" onClick={closeForm}>
                  Cancelar
                </button>
                <button className="submit-button" onClick={closeForm}>
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipos;