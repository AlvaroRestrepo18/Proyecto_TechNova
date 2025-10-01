import axios from "axios";

const API_BASE_URL = "https://localhost:7228/api/Categorias";

// 🔀 Backend -> Frontend
const mapBackendToFrontend = (categoria) => ({
  id: categoria.id,
  tipoCategoria: categoria.tipoCategoria || "",
  nombre: categoria.nombre || "",
  descripcion: categoria.descripcion || "",
  activo: categoria.activo ?? true,
});

// 🔀 Frontend -> Backend
const mapFrontendToBackend = (categoria) => {
  const payload = {
    tipoCategoria: categoria.tipoCategoria || "",
    nombre: categoria.nombre || "",
    descripcion: categoria.descripcion || "",
    activo: categoria.activo ?? true,
  };

  // Solo enviar `id` si existe (para update)
  if (categoria.id) {
    payload.id = categoria.id;
  }

  return payload;
};

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

    let categoriasArray;

    if (Array.isArray(response.data)) {
      categoriasArray = response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      categoriasArray = response.data.data;
    } else if (response.data && Array.isArray(response.data.categorias)) {
      categoriasArray = response.data.categorias;
    } else if (response.data && Array.isArray(response.data.result)) {
      categoriasArray = response.data.result;
    } else if (response.data && typeof response.data === "object") {
      categoriasArray = Object.values(response.data);
    } else {
      console.warn("⚠️ Estructura inesperada, devolviendo array vacío");
      categoriasArray = [];
    }

    return categoriasArray.map(mapBackendToFrontend);
  } catch (error) {
    handleError("obtener categorías", error);
  }
};

// 📌 Versión segura que siempre retorna array
export const getCategoriasSafe = async (soloActivas = null) => {
  try {
    const categorias = await getCategorias(soloActivas);
    return Array.isArray(categorias) ? categorias : [];
  } catch (error) {
    console.error("Error seguro:", error);
    return [];
  }
};

// 📌 Obtener categoría por ID
export const getCategoriaById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    const categoriaData = response.data.data || response.data.result || response.data;
    return mapBackendToFrontend(categoriaData);
  } catch (error) {
    handleError("obtener categoría", error, id);
  }
};

// 📌 Crear categoría
export const createCategoria = async (categoriaData) => {
  try {
    const payload = mapFrontendToBackend(categoriaData);
    const response = await axios.post(API_BASE_URL, payload);
    const nuevaCategoria = response.data.data || response.data.result || response.data;
    return mapBackendToFrontend(nuevaCategoria);
  } catch (error) {
    handleError("crear categoría", error);
  }
};

// 📌 Actualizar categoría
export const updateCategoria = async (id, categoriaData) => {
  try {
    if (!categoriaData.tipoCategoria || !categoriaData.nombre) {
      throw new Error("Debe completar tipo y nombre de la categoría");
    }

    const payload = mapFrontendToBackend({ ...categoriaData, id });
    const response = await axios.put(`${API_BASE_URL}/${id}`, payload);
    const categoriaActualizada = response.data.data || response.data.result || response.data;
    return mapBackendToFrontend(categoriaActualizada);
  } catch (error) {
    handleError("actualizar categoría", error, id);
  }
};

// 📌 Cambiar estado activo/inactivo
export const changeCategoriaStatus = async (id, activo) => {
  try {
    const categoriaActual = await getCategoriaById(id);
    const payload = {
      ...mapFrontendToBackend(categoriaActual),
      activo,
    };

    const response = await axios.put(`${API_BASE_URL}/${id}`, payload);
    const categoriaModificada = response.data.data || response.data.result || response.data;
    return mapBackendToFrontend(categoriaModificada);
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
