import axios from "axios";

const API_BASE_URL = "";
const API_CATEGORIA_URL = "";

// Mapeo backend -> frontend servicio
const mapBackendToFrontend = (servicio) => ({
  id: servicio.id,
  nombre: servicio.nombre,
  precio: servicio.precio,
  detalles: servicio.detalles,
  categoriaId: servicio.categoriaId,
  categoria: servicio.categoria
});

// Mapeo frontend -> backend servicio
const mapFrontendToBackend = (servicio) => ({
  nombre: servicio.nombre,
  precio: servicio.precio,
  detalles: servicio.detalles,
  categoriaId: servicio.categoriaId
});

// Obtener todos los servicios
export const getServicios = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.map(servicio => mapBackendToFrontend(servicio));
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    throw error;
  }
};

// Obtener un servicio por ID
export const getServicioById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`Error al obtener servicio con id ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo servicio
export const createServicio = async (servicioData) => {
  try {
    const payload = mapFrontendToBackend(servicioData);
    const response = await axios.post(API_BASE_URL, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error("Error al crear servicio:", error);
    throw error;
  }
};

// Actualizar un servicio
export const updateServicio = async (id, servicioData) => {
  try {
    const payload = mapFrontendToBackend(servicioData);
    const response = await axios.put(`${API_BASE_URL}/${id}`, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`Error al actualizar servicio con id ${id}:`, error);
    throw error;
  }
};

// Eliminar un servicio
export const deleteServicio = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar servicio con id ${id}:`, error);
    throw error;
  }
};

// Obtener servicios por categoría
export const getServiciosByCategoria = async (categoriaId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categoria/${categoriaId}`);
    return response.data.map(servicio => mapBackendToFrontend(servicio));
  } catch (error) {
    console.error(`Error al obtener servicios por categoría ${categoriaId}:`, error);
    throw error;
  }
};

// Buscar servicios por nombre
export const searchServicios = async (nombre) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { nombre }
    });
    return response.data.map(servicio => mapBackendToFrontend(servicio));
  } catch (error) {
    console.error("Error al buscar servicios:", error);
    throw error;
  }
};