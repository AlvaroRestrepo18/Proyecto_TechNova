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

  const emptyCategory = {
    id: 0,
    nombre: "",
    tipoCategoria: "",
    descripcion: "",
    activo: true,
  };

  const openCreateForm = () => {
    setIsFormOpen(true);
    setCurrentView('create');
    setCurrentCategory({ ...emptyCategory }); // 👈 siempre con valores definidos
  };

  const openEditForm = (cat) => {
    setIsFormOpen(true);
    setCurrentView('edit');
    setCurrentCategory({
      id: cat.id ?? 0,
      nombre: cat.nombre ?? "",
      tipoCategoria: cat.tipoCategoria ?? "",
      descripcion: cat.descripcion ?? "",
      activo: cat.activo ?? true,
    });
  };

  const openView = (cat) => {
    setIsFormOpen(true);
    setCurrentView('view');
    setCurrentCategory({
      id: cat.id ?? 0,
      nombre: cat.nombre ?? "",
      tipoCategoria: cat.tipoCategoria ?? "",
      descripcion: cat.descripcion ?? "",
      activo: cat.activo ?? true,
    });
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
      if (!formData.nombre || !formData.tipoCategoria) {   // validación
        alert("Debe completar el nombre y tipo de categoría");
        return;
      }

      if (currentView === 'create') {
        await createCategoria(formData);
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
      <h1>Categorías</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="create-button" onClick={openCreateForm}>
          <FontAwesomeIcon icon={faPlus} /> Crear
        </button>
      </div>
      
      <CategoryTable
        categorias={categoriasData}
        searchTerm={searchTerm}
        onEdit={openEditForm}
        onView={openView}
        onDelete={confirmDelete}
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
