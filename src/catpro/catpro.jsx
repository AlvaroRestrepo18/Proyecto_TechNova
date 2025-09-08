import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CategoryTable from './components/CategoryTable';
import CategoryFormModal from './components/CategoryFormModal';
import DeleteModal from './components/DeleteModal';
import './catpro.css';

const Categorias = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentView, setCurrentView] = useState('list');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('activas'); // ← AÑADIDO: Estado para la pestaña activa
  

  const [categoriasData, setCategoriasData] = useState([
    { 
      id: generateId(), 
      tipoCategoria: 'Producto', 
      nombreCategoria: 'Hardware', 
      descripcion: 'Equipos y componentes físicos para computadoras.', 
      activo: true 
    },
    { 
      id: generateId(), 
      tipoCategoria: 'Servicio', 
      nombreCategoria: 'Soporte Técnico', 
      descripcion: 'Servicios de soporte y mantenimiento de equipos.', 
      activo: true 
    },
  ]);

  function generateId() {
    return 'CAT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  // ← AÑADIDO: Función para cambiar el estado de las categorías
  const toggleCategoriaEstado = (id) => {
    setCategoriasData(categoriasData.map(cat =>
      cat.id === id ? { ...cat, activo: !cat.activo } : cat
    ));
  };

  // ← AÑADIDO: Separar categorías por estado
  const categoriasActivas = categoriasData.filter(cat => cat.activo);
  const categoriasInactivas = categoriasData.filter(cat => !cat.activo);

  const openCreateForm = () => {
    setIsFormOpen(true);
    setCurrentView('create');
    setCurrentCategory(null);
  };

  const openEditForm = (cat) => {
    setIsFormOpen(true);
    setCurrentView('edit');
    setCurrentCategory(cat);
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

  return (
    <div className="equipment-container">
      <h1>Cyber360 - Categorías</h1>
      
      {/* ← AÑADIDO: Tabs para categorías activas/inactivas */}
      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'activas' ? 'active' : ''}`}
          onClick={() => setActiveTab('activas')}
        >
          Categorías Activas ({categoriasActivas.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'inactivas' ? 'active' : ''}`}
          onClick={() => setActiveTab('inactivas')}
        >
          Categorías Inactivas ({categoriasInactivas.length})
        </button>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder={`Buscar categoría ${activeTab === 'activas' ? 'activas' : 'inactivas'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="create-button" onClick={openCreateForm}>
          <FontAwesomeIcon icon={faPlus} /> Crear
        </button>
      </div>
      
      {/* ← MODIFICADO: Pasar las categorías según la pestaña activa y la función toggle */}
      <CategoryTable
        categorias={activeTab === 'activas' ? categoriasActivas : categoriasInactivas}
        searchTerm={searchTerm}
        onEdit={openEditForm}
        onView={openView}
        onDelete={confirmDelete}
        onToggleStatus={toggleCategoriaEstado} // ← AÑADIDO: Pasar la función toggle
      />

      {isFormOpen && (
        <CategoryFormModal
          currentView={currentView}
          currentCategory={currentCategory}
          onClose={closeForm}
          onSave={(formData) => {
            if (currentView === 'create') {
              const newCategory = {
                id: generateId(),
                ...formData,
                activo: true
              };
              setCategoriasData([...categoriasData, newCategory]);
            } else if (currentView === 'edit') {
              setCategoriasData(categoriasData.map(cat =>
                cat.id === currentCategory.id 
                  ? { ...cat, ...formData }
                  : cat
              ));
            }
            closeForm();
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          onClose={cancelDelete}
          onConfirm={deleteCategory}
          title="Confirmar Eliminación"
          message="¿Estás seguro que deseas eliminar esta categoría?"
        />
      )}
    </div>
  );
};

export default Categorias;