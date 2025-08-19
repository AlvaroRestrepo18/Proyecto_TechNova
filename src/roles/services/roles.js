import axios from "axios";

const API_BASE_URL = "https://cyber360-api.onrender.com/api/Roles";
const API_PERMISOS_ROL_URL = "https://cyber360-api.onrender.com/api/PermisosRol";

// Mapeo backend -> frontend rol
const mapBackendToFrontend = (role, permisos = []) => ({
  id: role.idRol,
  nombre: role.nombreRol,
  descripcion: role.descripcion,
  activo: role.activo,
  permissions: permisos, // permisos asignados al rol (solo array de IDs)
});

// Mapeo frontend -> backend rol
const mapFrontendToBackend = (role) => ({
  idRol: role.id,
  nombreRol: role.nombre,
  descripcion: role.descripcion,
  activo: role.activo,
});

// Obtener todos los roles, opcionalmente solo activos
export const getRoles = async (soloActivos = null) => {
  try {
    const params = soloActivos !== null ? { soloActivos } : {};
    const response = await axios.get(API_BASE_URL, { params });
    return response.data.map(role => mapBackendToFrontend(role));
  } catch (error) {
    console.error("Error al obtener roles:", error);
    throw error;
  }
};

// Obtener un rol por ID incluyendo permisos asignados (retorna permisos como array de IDs)
export const getRoleById = async (id) => {
  try {
    const roleResponse = await axios.get(`${API_BASE_URL}/${id}`);
    const permisosResponse = await axios.get(`${API_PERMISOS_ROL_URL}/rol/${id}`);

    // Mapear permisos a array solo de IDs
    const permisosIds = permisosResponse.data.map(p => p.idPermiso || p.IdPermiso || p.FkPermiso);

    return mapBackendToFrontend(roleResponse.data, permisosIds);
  } catch (error) {
    console.error(`Error al obtener rol con id ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo rol
export const createRole = async (roleData) => {
  try {
    const payload = {
      nombreRol: roleData.nombre,
      descripcion: roleData.descripcion,
      activo: roleData.activo ?? true,
    };
    const response = await axios.post(API_BASE_URL, payload);
    return {
      id: response.data.idRol,
      nombreRol: response.data.nombreRol,
      descripcion: response.data.descripcion,
    };
  } catch (error) {
    console.error("Error al crear rol:", error);
    throw error;
  }
};

// Actualizar un rol
export const updateRole = async (id, roleData) => {
  try {
    const payload = {
      idRol: id,
      nombreRol: roleData.nombre,
      descripcion: roleData.descripcion,
      activo: roleData.activo ?? true,
    };
    await axios.put(`${API_BASE_URL}/${id}`, payload);
  } catch (error) {
    console.error(`Error al actualizar rol con id ${id}:`, error);
    throw error;
  }
};

// Cambiar estado activo/inactivo del rol (PATCH)
export const changeRoleStatus = async (id, activo) => {
  try {
    await axios.patch(`${API_BASE_URL}/CambiarEstado/${id}`, null, {
      params: { activo },
    });
  } catch (error) {
    console.error(`Error al cambiar estado del rol con id ${id}:`, error);
    throw error;
  }
};

// Eliminar un rol (borrado físico)
export const deleteRole = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar rol con id ${id}:`, error);
    throw error;
  }
};

// Asignar permisos a un rol (reemplaza los actuales)
export const assignPermissionsToRole = async (rolId, permisosIds) => {
  try {
    const response = await axios.post(`${API_PERMISOS_ROL_URL}/rol/${rolId}/asignar`, permisosIds);
    return response.data;
  } catch (error) {
    console.error(`Error al asignar permisos para rol ${rolId}:`, error);
    throw error;
  }
};
