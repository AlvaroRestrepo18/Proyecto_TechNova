import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './productos.css';
import axios from 'axios';

import ProductosTable from './components/ProductosTable';
import ProductosFormModal from './components/ProductosFormModal';
import ProductosViewModal from './components/ProductosViewModal';
import DeleteModal from './components/DeleteModal';

const API_PRODUCTOS_URL = "https://localhost:7228/api/Productos";
const API_CATEGORIA_URL = "https://localhost:7228/api/Categorias";

const Productos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalProducto, setModalProducto] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [productosData, setProductosData] = useState([]);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    categoriaId: '',
    cantidad: '',
    precio: '',
    fechaCreacion: new Date().toISOString().split("T")[0],
  });

  const [formErrors, setFormErrors] = useState({});

  // Cargar productos y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          axios.get(API_CATEGORIA_URL),
          axios.get(API_PRODUCTOS_URL)
        ]);
        setCategoriasDisponibles(cats.data);
        setProductosData(prods.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    fetchData();
  }, []);

  // Filtro de búsqueda
  const filteredProductos = productosData.filter(p =>
    p.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Controladores
  const openForm = () => {
    setFormData({
      id: null,
      nombre: '',
      categoriaId: '',
      cantidad: '',
      precio: '',
      fechaCreacion: new Date().toISOString().split("T")[0]
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditForm = (producto) => {
    setFormData({
      ...producto,
      fechaCreacion: producto.fechaCreacion
        ? new Date(producto.fechaCreacion).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const openViewModal = (producto) => {
    setModalProducto(producto);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setModalProducto(null);
    setIsViewModalOpen(false);
  };

  const openDeleteModal = (producto) => {
    setProductoAEliminar(producto);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setProductoAEliminar(null);
    setIsDeleteModalOpen(false);
  };

  // CRUD
  const handleSave = async (formData) => {
    try {
      if (formData.id) {
        const res = await axios.put(`${API_PRODUCTOS_URL}/${formData.id}`, formData);
        setProductosData(productosData.map(p => p.id === formData.id ? res.data : p));
      } else {
        const res = await axios.post(API_PRODUCTOS_URL, formData);
        setProductosData([...productosData, res.data]);
      }
      closeForm();
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  const handleDelete = async () => {
    if (!productoAEliminar) return;
    try {
      await axios.delete(`${API_PRODUCTOS_URL}/${productoAEliminar.id}`);
      setProductosData(productosData.filter(p => p.id !== productoAEliminar.id));
      closeDeleteModal();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  };

  return (
    <div>
      <h1>Productos</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="create-button" onClick={openForm}>
          <FontAwesomeIcon icon={faPlus} /> Nuevo
        </button>
      </div>

      <div className="table-container">
        <ProductosTable
          productos={filteredProductos}
          categorias={categoriasDisponibles}
          onView={openViewModal}
          onEdit={openEditForm}
          onDelete={openDeleteModal}
        />
      </div>

      {isFormOpen && (
        <ProductosFormModal
          formData={formData}
          setFormData={setFormData}
          categorias={categoriasDisponibles}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {isViewModalOpen && (
        <ProductosViewModal
          producto={modalProducto}
          categorias={categoriasDisponibles}
          onClose={closeViewModal}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          producto={productoAEliminar}
          onConfirm={handleDelete}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
};

export default Productos;
