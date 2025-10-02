import axios from "axios";

const API_BASE_URL = "https://localhost:7228/api/Servicios";
const API_CATEGORIA_URL = "https://localhost:7228/api/Categorias";

// ✅ Mapeo backend -> frontend
const mapBackendToFrontend = (servicio) => ({
  id: servicio.id,
  nombre: servicio.nombre,
  precio: servicio.precio,
  detalles: servicio.detalles, // 👈 corregido
  categoriaId: servicio.categoriaId,
});

// ✅ Mapeo frontend -> backend
const mapFrontendToBackend = (servicio) => ({
  id: servicio.id,
  nombre: servicio.nombre,
  precio: servicio.precio,
  detalles: servicio.detalles, // 👈 corregido
  categoriaId: servicio.categoriaId,
});

// 📝 Manejo del submit para crear/actualizar servicios
const handleSubmit = async (serviceData) => {
  if (!serviceData) return;

  // Normalizamos los datos para el backend
  const payload = {
    nombre: serviceData.nombre,
    detalles: serviceData.detalles, // 👈 corregido
    precio: Number(serviceData.precio),
    categoriaId: serviceData.categoriaId,
  };

  console.log("📤 Payload que se envía:", payload); // <--- DEBUG

  try {
    if (isEditing) {
      const updated = await updateServicio(currentService.id, payload);
      setServicesData(
        servicesData.map((s) => (s.id === updated.id ? updated : s))
      );
    } else {
      const created = await createServicio(payload);
      setServicesData([...servicesData, created]);
    }
  } catch (error) {
    console.error("❌ Error al guardar servicio:", error.response?.data || error);
  }

  closeForm();
};

// 🔹 Obtener todos los servicios
export const getServicios = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.map(mapBackendToFrontend);
  } catch (error) {
    console.error("❌ Error al obtener servicios:", error);
    throw error;
  }
};

// 🔹 Obtener un servicio por ID
export const getServicioById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`❌ Error al obtener servicio con id ${id}:`, error);
    throw error;
  }
};

// 🔹 Crear un nuevo servicio
export const createServicio = async (servicioData) => {
  try {
    const payload = mapFrontendToBackend(servicioData);
    const response = await axios.post(API_BASE_URL, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error("❌ Error al crear servicio:", error);
    throw error;
  }
};

// 🔹 Actualizar un servicio
export const updateServicio = async (id, servicioData) => {
  try {
    const payload = mapFrontendToBackend(servicioData);
    const response = await axios.put(`${API_BASE_URL}/${id}`, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`❌ Error al actualizar servicio con id ${id}:`, error);
    throw error;
  }
};

// 🔹 Eliminar un servicio
export const deleteServicio = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error(`❌ Error al eliminar servicio con id ${id}:`, error);
    throw error;
  }
};

// 🔹 Obtener servicios por categoría
export const getServiciosByCategoria = async (categoriaId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categoria/${categoriaId}`);
    return response.data.map(mapBackendToFrontend);
  } catch (error) {
    console.error(`❌ Error al obtener servicios por categoría ${categoriaId}:`, error);
    throw error;
  }
};

// 🔹 Buscar servicios por nombre
export const searchServicios = async (nombre) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { nombre },
    });
    return response.data.map(mapBackendToFrontend);
  } catch (error) {
    console.error("❌ Error al buscar servicios:", error);
    throw error;
  }
};

// 🔹 Obtener categorías (para combos en formularios)
export const getCategorias = async () => {
  try {
    const response = await axios.get(API_CATEGORIA_URL);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    throw error;
  }
};
