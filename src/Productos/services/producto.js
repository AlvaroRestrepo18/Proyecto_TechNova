import axios from "axios";

const API_BASE_URL = "https://localhost:7228/api/Productos";

// Mapeo backend -> frontend producto
const mapBackendToFrontend = (producto) => ({
  id: producto.id,
  nombre: producto.nombre,
  cantidad: producto.cantidad,
  precio: producto.precio,
  fechaCreacion: producto.fechaCreacion,
  categoriaId: producto.categoriaId,
  categoria: producto.categoria,
});

// Mapeo frontend -> backend producto
// ⚡️ NO mandamos id ni fechaCreacion porque los genera el backend
const mapFrontendToBackend = (producto) => ({
  nombre: producto.nombre,
  cantidad: producto.cantidad,
  precio: producto.precio,
  categoriaId: producto.categoriaId,
});

// Obtener todos los productos
export const getProductos = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.map(mapBackendToFrontend);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};

// Obtener un producto por ID
export const getProductoById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`Error al obtener producto con id ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo producto
export const createProducto = async (productoData) => {
  try {
    const payload = mapFrontendToBackend(productoData);
    const response = await axios.post(API_BASE_URL, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error("Error al crear producto:", error.response?.data || error);
    throw error;
  }
};

// Actualizar un producto
export const updateProducto = async (id, productoData) => {
  try {
    const payload = mapFrontendToBackend(productoData);
    const response = await axios.put(`${API_BASE_URL}/${id}`, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(
      `Error al actualizar producto con id ${id}:`,
      error.response?.data || error
    );
    throw error;
  }
};

// Eliminar un producto
export const deleteProducto = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error(
      `Error al eliminar producto con id ${id}:`,
      error.response?.data || error
    );
    throw error;
  }
};

// Obtener productos por categoría
export const getProductosByCategoria = async (categoriaId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categoria/${categoriaId}`);
    return response.data.map(mapBackendToFrontend);
  } catch (error) {
    console.error(
      `Error al obtener productos por categoría ${categoriaId}:`,
      error.response?.data || error
    );
    throw error;
  }
};

// Obtener productos con stock bajo
export const getProductosStockBajo = async (stockMinimo = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stock-bajo`, {
      params: { stockMinimo },
    });
    return response.data.map(mapBackendToFrontend);
  } catch (error) {
    console.error(
      "Error al obtener productos con stock bajo:",
      error.response?.data || error
    );
    throw error;
  }
};

// ✅ Obtener lista simple (solo id, nombre, precio) -> usado en ComprasFormModal
export const getProductosSimple = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/lista-simple`);
    return response.data; // ya viene optimizado desde el backend
  } catch (error) {
    console.error("Error al obtener lista simple de productos:", error);
    throw error;
  }
};
