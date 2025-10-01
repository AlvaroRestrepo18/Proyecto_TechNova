import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faTimes, faEye } from '@fortawesome/free-solid-svg-icons';
import './productos.css';
import axios from 'axios';

const API_PRODUCTOS_URL = "https://localhost:7228/api/Productos";
const API_CATEGORIA_URL = "https://localhost:7228/api/Categorias";

const Productos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalProducto, setModalProducto] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [productosData, setProductosData] = useState([]);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    categoriaId: '',
    cantidad: '',
    precio: '',
    fechaCreacion: new Date().toISOString().split("T")[0]
  });

  // Cargar categorías y productos al montar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(API_CATEGORIA_URL);
        setCategoriasDisponibles(response.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    const fetchProductos = async () => {
      try {
        const response = await axios.get(API_PRODUCTOS_URL);
        setProductosData(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchCategorias();
    fetchProductos();
  }, []);

  // Filtro de búsqueda
  const filteredProductos = productosData.filter(producto =>
    producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!formData.categoriaId) errors.categoriaId = 'Seleccione una categoría';
    if (!formData.precio || formData.precio <= 0) errors.precio = 'Precio válido requerido';
    if (formData.cantidad === '' || formData.cantidad < 0) errors.cantidad = 'Cantidad válida requerida';
    if (!formData.fechaCreacion) errors.fechaCreacion = 'La fecha es requerida';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await axios.delete(`${API_PRODUCTOS_URL}/${id}`);
        setProductosData(productosData.filter(producto => producto.id !== id));
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      }
    }
  };

  const openForm = () => {
    setIsFormOpen(true);
    setFormData({
      id: null,
      nombre: '',
      categoriaId: '',
      cantidad: '',
      precio: '',
      fechaCreacion: new Date().toISOString().split("T")[0]
    });
    setFormErrors({});
  };

  const closeForm = () => setIsFormOpen(false);

  const openViewModal = (producto) => {
    setModalProducto(producto);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setModalProducto(null);
  };

  const openEditForm = (producto) => {
    setIsFormOpen(true);
    setFormData({
      ...producto,
      fechaCreacion: producto.fechaCreacion
        ? new Date(producto.fechaCreacion).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0]
    });
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productoPayload = {
      nombre: formData.nombre,
      categoriaId: parseInt(formData.categoriaId),
      cantidad: parseInt(formData.cantidad),
      precio: parseFloat(formData.precio),
      fechaCreacion: new Date(formData.fechaCreacion).toISOString()
    };

    try {
      if (formData.id) {
        // UPDATE
        const response = await axios.put(`${API_PRODUCTOS_URL}/${formData.id}`, {
          ...productoPayload,
          id: formData.id
        });
        setProductosData(productosData.map(p =>
          p.id === formData.id ? response.data : p
        ));
      } else {
        // CREATE
        const response = await axios.post(API_PRODUCTOS_URL, productoPayload);
        setProductosData([...productosData, response.data]);
      }
      closeForm();
    } catch (error) {
      console.error("Error al guardar producto:", error.response?.data || error);
    }
  };

  // Modal de visualización
  const ViewModal = ({ producto, onClose }) => {
    if (!producto) return null;
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Detalles del Producto</h2>
            <button className="close-button" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="user-details-container">
            <p><b>ID:</b> {producto.id}</p>
            <p><b>Nombre:</b> {producto.nombre}</p>
            <p><b>Categoría:</b> {
              categoriasDisponibles.find(cat => cat.id === producto.categoriaId)?.nombre || "Sin categoría"
            }</p>
            <p><b>Precio:</b> ${producto.precio?.toFixed(2)}</p>
            <p><b>Cantidad:</b> {producto.cantidad}</p>
            <p><b>Fecha de Creación:</b> {producto.fechaCreacion ? new Date(producto.fechaCreacion).toLocaleDateString() : "N/A"}</p>
            <div className="form-actions">
              <button type="button" className="close-details-button" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tabla de productos
  const TablaProductos = ({ productos }) => (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((producto) => (
          <tr key={producto.id}>
            <td>{producto.id}</td>
            <td>{producto.nombre}</td>
            <td>{categoriasDisponibles.find(cat => cat.id === producto.categoriaId)?.nombre || "Sin categoría"}</td>
            <td>${producto.precio?.toFixed(2)}</td>
            <td>{producto.cantidad}</td>
            <td>
              <button className="icon-button" title="Ver" onClick={() => openViewModal(producto)}>
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className="icon-button" title="Editar" onClick={() => openEditForm(producto)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                className="icon-button"
                title="Eliminar"
                onClick={() => eliminarProducto(producto.id)}
                style={{ color: '#e74c3c' }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

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
        <TablaProductos productos={filteredProductos} />
      </div>

      {/* Modal Formulario */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{formData.id ? "Editar Producto" : "Nuevo Producto"}</h2>
              <button className="close-button" onClick={closeForm}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form className="form-body" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                {formErrors.nombre && <span className="error">{formErrors.nombre}</span>}
              </div>

              <div className="form-group">
                <label>Categoría</label>
                <select name="categoriaId" value={formData.categoriaId} onChange={handleChange} required>
                  <option value="">Seleccione...</option>
                  {categoriasDisponibles.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
                {formErrors.categoriaId && <span className="error">{formErrors.categoriaId}</span>}
              </div>

              <div className="form-group">
                <label>Precio</label>
                <input type="number" name="precio" value={formData.precio} onChange={handleChange} min="0" step="0.01" required />
                {formErrors.precio && <span className="error">{formErrors.precio}</span>}
              </div>

              <div className="form-group">
                <label>Cantidad</label>
                <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} min="0" required />
                {formErrors.cantidad && <span className="error">{formErrors.cantidad}</span>}
              </div>

              <div className="form-group">
                <label>Fecha de Creación</label>
                <input type="date" name="fechaCreacion" value={formData.fechaCreacion} onChange={handleChange} required />
                {formErrors.fechaCreacion && <span className="error">{formErrors.fechaCreacion}</span>}
              </div>

              <div className="form-actions">
                <button type="button" onClick={closeForm}>Cancelar</button>
                <button type="submit">{formData.id ? "Actualizar" : "Crear"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Visualización */}
      {isViewModalOpen && (
        <ViewModal producto={modalProducto} onClose={closeViewModal} />
      )}
    </div>
  );
};

export default Productos;
