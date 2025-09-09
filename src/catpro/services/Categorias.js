import axios from "axios";

const API_BASE_URL = "https://cyber360-api.onrender.com/api/Categorias";

// 🔀 Backend -> Frontend
const mapBackendToFrontend = (categoria) => ({
  id: categoria.id,
  tipoCategoria: categoria.tipoCategoria || "",
  nombreCategoria: categoria.nombreCategoria || "",
  descripcion: categoria.descripcion || "",
  activo: categoria.activo ?? true,
});

// 🔀 Frontend -> Backend
const mapFrontendToBackend = (categoria) => ({
  id: categoria.id,
  tipoCategoria: categoria.tipoCategoria || "",
  nombreCategoria: categoria.nombreCategoria || "",
  descripcion: categoria.descripcion || "",
  activo: categoria.activo ?? true,
});

// 🛠️ Manejo de errores
const handleError = (action, error, id = null) => {
  const backendMsg = error.response?.data || error.message;
  console.error(`❌ Error al ${action}${id ? ` con id ${id}` : ""}:`, backendMsg);
  throw new Error(
    typeof backendMsg === "string"
      ? backendMsg
      : backendMsg.message || "Ocurrió un error inesperado"
  );
};

// 📌 Obtener todas las categorías
export const getCategorias = async (soloActivas = null) => {
  try {
    const params = soloActivas !== null ? { soloActivas } : {};
    const response = await axios.get(API_BASE_URL, { params });
    return response.data.map(mapBackendToFrontend);
  } catch (error) {
    handleError("obtener categorías", error);
  }
};

// 📌 Obtener categoría por ID
export const getCategoriaById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    handleError("obtener categoría", error, id);
  }
};

// 📌 Crear categoría
export const createCategoria = async (categoriaData) => {
  try {
    const payload = mapFrontendToBackend(categoriaData);
    const response = await axios.post(API_BASE_URL, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    handleError("crear categoría", error);
  }
};

// 📌 Actualizar categoría
export const updateCategoria = async (id, categoriaData) => {
  try {
    if (!categoriaData.tipoCategoria || !categoriaData.nombreCategoria) {
      throw new Error("Debe completar tipo y nombre de la categoría");
    }

    const payload = mapFrontendToBackend({ ...categoriaData, id });
    const response = await axios.put(`${API_BASE_URL}/${id}`, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    handleError("actualizar categoría", error, id);
  }
};

// 📌 Cambiar estado activo/inactivo
export const changeCategoriaStatus = async (id, activo) => {
  try {
    // Obtener la categoría actual
    const categoriaActual = await getCategoriaById(id);

    // Crear payload con el nuevo estado
    const payload = {
      ...mapFrontendToBackend(categoriaActual),
      activo,
    };

    const response = await axios.put(`${API_BASE_URL}/${id}`, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    handleError("cambiar estado de categoría", error, id);
  }
};

// 📌 Eliminar categoría
export const deleteCategoria = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
    return { id };
  } catch (error) {
    handleError("eliminar categoría", error, id);
  }
};
