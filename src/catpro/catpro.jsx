// ...importaciones igual que antes
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CategoryTable from './components/CategoryTable';
import CategoryFormModal from './components/CategoryFormModal';
import DeleteModal from './components/DeleteModal';
import { 
  getCategorias, 
  createCategoria, 
  updateCategoria, 
  changeCategoriaStatus, 
  deleteCategoria 
} from "./services/Categorias.js";
import './catpro.css';

const Categorias = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentView, setCurrentView] = useState('list');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('activas'); 
  const [categoriasData, setCategoriasData] = useState([]);

  // 🚀 Cargar categorías desde la API
  const fetchCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategoriasData(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
      alert('Error al cargar categorías');
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // 🔄 Cambiar estado activo/inactivo
  const toggleCategoriaEstado = async (id, nuevoEstado) => {
    try {
      await changeCategoriaStatus(id, nuevoEstado);
      // Refrescar la tabla
      await fetchCategorias();
      console.log(`Categoría ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`);
    } catch (error) {
      console.error("Error cambiando estado:", error);
      alert('Error al cambiar el estado de la categoría');
    }
  };

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

  const deleteCategory = async () => {
    try {
      await deleteCategoria(categoryToDelete);
      await fetchCategorias(); // refrescar tabla
      console.log('Categoría eliminada correctamente');
    } catch (error) {
      console.error("Error eliminando categoría:", error);
      alert('Error al eliminar la categoría');
    } finally {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  // 📝 Guardar categoría
  const handleSaveCategory = async (formData) => {
    try {
      if (!formData.nombreCategoria || !formData.tipoCategoria) {
        alert("Debe completar el nombre y tipo de categoría");
        return;
      }

      if (currentView === 'create') {
        await createCategoria({ ...formData, activo: true });
        console.log('Categoría creada correctamente');
      } else if (currentView === 'edit') {
        await updateCategoria(currentCategory.id, formData);
        console.log('Categoría actualizada correctamente');
      }

      // 🔁 Refrescar la tabla después de crear o editar
      await fetchCategorias();

    } catch (error) {
      console.error(`Error guardando categoría (id: ${currentCategory?.id}):`, error);
      alert('Ocurrió un error al guardar la categoría');
    }
    closeForm();
  };

  return (
    <div className="equipment-container">
      <h1>Cyber360 - Categorías</h1>
      
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
      
      <CategoryTable
        categorias={activeTab === 'activas' ? categoriasActivas : categoriasInactivas}
        searchTerm={searchTerm}
        onEdit={openEditForm}
        onView={openView}
        onDelete={confirmDelete}
        onToggleStatus={toggleCategoriaEstado}
      />

      {isFormOpen && (
        <CategoryFormModal
          currentView={currentView}
          currentCategory={currentCategory}
          onClose={closeForm}
          onSave={handleSaveCategory}
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
