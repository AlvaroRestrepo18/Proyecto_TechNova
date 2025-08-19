import axios from "axios";

const API_BASE_URL = "https://cyber360-api.onrender.com/api/permisos";
const API_PERMISOS_ROL_URL = "https://cyber360-api.onrender.com/api/permisosrol";

// Obtener todos los permisos disponibles
export const getPermissions = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener permisos:", error);
    throw error;
  }
};

// Obtener permisos asignados a un rol específico
export const getPermissionsByRoleId = async (rolId) => {
  try {
    const response = await axios.get(`${API_PERMISOS_ROL_URL}/rol/${rolId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener permisos para rol ${rolId}:`, error);
    throw error;
  }
};

// Asignar permisos a un rol (reemplazando los actuales)
export const assignPermissionsToRole = async (rolId, permisosIds) => {
  try {
    const response = await axios.post(`${API_PERMISOS_ROL_URL}/rol/${rolId}/asignar`, permisosIds);
    return response.data;
  } catch (error) {
    console.error(`Error al asignar permisos para rol ${rolId}:`, error);
    throw error;
  }
};
