import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faEye, faPen, faTrash, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import './catpro.css';
import '../app.css'; // Usamos app.css centralizado

const CatPro = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'view', 'edit', 'create'
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Datos de ejemplo con estado activo/inactivo
  const [categoriasData, setCategoriasData] = useState([
    { id: generateId(), nombre: 'Soporte Técnico', descripcion: 'Servicios de soporte y mantenimiento de equipos.', activo: true },
    { id: generateId(), nombre: 'Consultoría', descripcion: 'Asesoría en soluciones tecnológicas.', activo: true },
    { id: generateId(), nombre: 'Capacitación', descripcion: 'Cursos y talleres de formación.', activo: false },
  ]);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  // Generar ID automático
  function generateId() {
    return 'CAT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  const filteredCategorias = categoriasData.filter(cat =>
    cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateForm = () => {
    setIsFormOpen(true);
    setCurrentView('create');
    setFormData({
      nombre: '',
      descripcion: ''
    });
  };

  const openEditForm = (cat) => {
    setIsFormOpen(true);
    setCurrentView('edit');
    setCurrentCategory(cat);
    setFormData({
      nombre: cat.nombre,
      descripcion: cat.descripcion
    });
  };

  const openView = (cat) => {
    setIsFormOpen(true);
    setCurrentView('view');
    setCurrentCategory(cat);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentView('list');
    setCurrentCategory(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentView === 'create') {
      // Crear nueva categoría
      const newCategory = {
        id: generateId(),
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        activo: true
      };
      setCategoriasData([...categoriasData, newCategory]);
    } else if (currentView === 'edit' && currentCategory) {
      // Editar categoría existente
      setCategoriasData(categoriasData.map(cat =>
        cat.id === currentCategory.id 
          ? { ...cat, nombre: formData.nombre, descripcion: formData.descripcion }
          : cat
      ));
    }
    
    closeForm();
  };

  const confirmDelete = (id) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const deleteCategory = () => {
    setCategoriasData(categoriasData.filter(cat => cat.id !== categoryToDelete));
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const toggleCategoriaEstado = (id) => {
    setCategoriasData(categoriasData.map(cat =>
      cat.id === id ? { ...cat, activo: !cat.activo } : cat
    ));
  };

  return (
    <div className="container">
      <h1>Cyber360 - Categoría de Producto</h1>
      
      <div className="section-divider"></div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar categoría"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="create-button" onClick={openCreateForm}>
          <FontAwesomeIcon icon={faPlus} /> Crear
        </button>
      </div>
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre de la Categoría <span></span></th>
              <th>Estado</th>
              <th className='Action'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategorias.map((cat, index) => (
              <tr key={index}>
                <td>{cat.nombre}</td>
                <td>
                  <button
                    className={`status-toggle ${cat.activo ? 'active' : 'inactive'}`}
                    onClick={() => toggleCategoriaEstado(cat.id)}
                    title={cat.activo ? 'Desactivar' : 'Activar'}
                  >
                    <FontAwesomeIcon icon={faPowerOff} />
                    <span>{cat.activo ? ' Activo' : ' Inactivo'}</span>
                  </button>
                </td>
                <td>
                  <button 
                    className="icon-button" 
                    title="Ver" 
                    onClick={() => openView(cat)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button 
                    className="icon-button" 
                    title="Editar" 
                    onClick={() => openEditForm(cat)}
                    disabled={!cat.activo}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button 
                    className="icon-button" 
                    title="Eliminar" 
                    onClick={() => confirmDelete(cat.id)}
                    disabled={!cat.activo}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para formularios */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {currentView === 'create' && 'Crear Nueva Categoría'}
                {currentView === 'edit' && 'Editar Categoría'}
                {currentView === 'view' && 'Detalles de Categoría'}
              </h2>
              <button className="close-button" onClick={closeForm}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="form-body">
              {currentView === 'view' ? (
                <div className="view-mode">
                  <div className="detail-group">
                    <label>Nombre:</label>
                    <p>{currentCategory?.nombre}</p>
                  </div>
                  <div className="detail-group">
                    <label>Descripción:</label>
                    <p>{currentCategory?.descripcion}</p>
                  </div>
                  <div className="detail-group">
                    <label>Estado:</label>
                    <p>{currentCategory?.activo ? 'Activo' : 'Inactivo'}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nombre de la Categoría: <span className="required-asterisk">*</span></label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Nombre de la categoría"
                      required
                      disabled={currentView === 'view'}
                    />
                  </div>

                  <div className="form-group">
                    <label>Descripción: <span className="required-asterisk">*</span></label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      placeholder="Ingrese la descripción de la categoría"
                      required
                      disabled={currentView === 'view'}
                      rows="4"
                    />
                  </div>

                  {currentView !== 'view' && (
                    <div className="form-actions">
                      <button type="button" className="cancel-button" onClick={closeForm}>
                        Cancelar
                      </button>
                      <button type="submit" className="submit-button">
                        {currentView === 'create' ? 'Crear' : 'Guardar'}
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirmar Eliminación</h2>
              <button className="close-button" onClick={cancelDelete}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="form-body">
              <p>¿Estás seguro que deseas eliminar esta categoría?</p>
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={cancelDelete}>
                  Cancelar
                </button>
                <button type="button" className="cancel-button" onClick={deleteCategory}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatPro;