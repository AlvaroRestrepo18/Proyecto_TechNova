import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faEye, faPen, faTrash, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import '../app.css';

const Catser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentView, setCurrentView] = useState('list');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [categoriasData, setCategoriasData] = useState([
    { id: generateId(), nombre: 'Soporte Técnico', descripcion: 'Servicios de soporte y mantenimiento de equipos.', activo: true },
    { id: generateId(), nombre: 'Consultoría', descripcion: 'Asesoría en soluciones tecnológicas.', activo: true },
    { id: generateId(), nombre: 'Capacitación', descripcion: 'Cursos y talleres de formación.', activo: false },
  ]);

  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });

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
    setFormData({ nombre: '', descripcion: '' });
  };

  const openEditForm = (cat) => {
    setIsFormOpen(true);
    setCurrentView('edit');
    setCurrentCategory(cat);
    setFormData({ nombre: cat.nombre, descripcion: cat.descripcion });
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
      const newCategory = { id: generateId(), ...formData, activo: true };
      setCategoriasData([...categoriasData, newCategory]);
    } else if (currentView === 'edit' && currentCategory) {
      setCategoriasData(categoriasData.map(cat =>
        cat.id === currentCategory.id ? { ...cat, ...formData } : cat
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
      <h1>Categoría de Servicio</h1>

      <div className="section-divider"></div>

      <div className="top-bar">
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
              <th>Nombre</th>
              <th>Estado</th>
              <th className="Action">Acciones</th>
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
                  <button className="icon-button" title="Ver" onClick={() => openView(cat)}>
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button className="icon-button" title="Editar" onClick={() => openEditForm(cat)} disabled={!cat.activo}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className="icon-button" title="Eliminar" onClick={() => confirmDelete(cat.id)} disabled={!cat.activo}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ backgroundColor: '#1e3c72' }}>
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
                <>
                  <div className="details-row"><strong>Nombre:</strong> {currentCategory?.nombre}</div>
                  <div className="details-row"><strong>Descripción:</strong> {currentCategory?.descripcion}</div>
                  <div className="details-row"><strong>Estado:</strong> <span className={currentCategory?.activo ? 'active' : 'inactive'}>{currentCategory?.activo ? 'Activo' : 'Inactivo'}</span></div>
                  <div className="form-actions">
                    <button className="submit-button" onClick={closeForm}>Cerrar</button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nombre de la Categoría: <span className="required-asterisk">*</span></label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Descripción: <span className="required-asterisk">*</span></label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      required
                      rows="4"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={closeForm}>Cancelar</button>
                    <button type="submit" className="submit-button">{currentView === 'create' ? 'Crear' : 'Guardar'}</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="modal-header" style={{ backgroundColor: '#1e3c72' }}>
              <h2>Confirmar Eliminación</h2>
              <button className="close-button" onClick={cancelDelete}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="form-body">
              <p>¿Estás seguro que deseas eliminar esta categoría?</p>
              <div className="form-actions">
                <button className="cancel-button" onClick={cancelDelete}>Cancelar</button>
                <button className="cancel-button" onClick={deleteCategory}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catser;
