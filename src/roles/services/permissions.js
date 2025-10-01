import axios from "axios";

// ✅ Ajustado el endpoint al nombre correcto del controlador
const API_BASE_URL = "https://localhost:7228/api/Permisos";
const API_PERMISOS_ROL_URL = "https://localhost:7228/api/Permisoxrols";

// Obtener todos los permisos disponibles
export const getPermissions = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.map(p => ({
      id: p.idPermiso,
      nombre: p.nombre,
      activo: p.activo ?? true, // por si en el backend tienes columna activo
    }));
  } catch (error) {
    console.error("❌ Error al obtener permisos:", error);
    throw error;
  }
};

// Obtener permisos asignados a un rol específico
export const getPermissionsByRoleId = async (rolId) => {
  try {
    const response = await axios.get(`${API_PERMISOS_ROL_URL}/rol/${rolId}`);
    
    // 🔑 Normalizamos los datos (pues EF puede devolver IdPermiso, FkPermiso, etc.)
    return response.data.map(p => p.idPermiso || p.IdPermiso || p.fkPermiso);
  } catch (error) {
    console.error(`❌ Error al obtener permisos para rol ${rolId}:`, error);
    throw error;
  }
};

// Asignar permisos a un rol (reemplazando los actuales)
export const assignPermissionsToRole = async (rolId, permisosIds) => {
  try {
    const response = await axios.post(
      `${API_PERMISOS_ROL_URL}/rol/${rolId}/asignar`,
      permisosIds
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Error al asignar permisos para rol ${rolId}:`, error);
    throw error;
  }
};
