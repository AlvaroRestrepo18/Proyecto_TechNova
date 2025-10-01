import axios from "axios";

const API_BASE_URL = "https://localhost:7228/api/Roles";

/* 
  ===============================
  🔹 Mapeadores
  ===============================
*/

// Backend -> Frontend
const mapBackendToFrontend = (role, permisos = []) => ({
  id: role.idRol,
  nombre: role.nombreRol,
  descripcion: role.descripcion,
  activo: role.activo,
  permissions: permisos, // IDs de permisos
});

// Frontend -> Backend
const mapFrontendToBackend = (role) => ({
  idRol: role.id,
  nombreRol: role.nombre,
  descripcion: role.descripcion,
  activo: role.activo ?? true,
});

/* 
  ===============================
  🔹 Servicios
  ===============================
*/

// ✅ Obtener todos los roles
export const getRoles = async () => {
  try {
    const { data } = await axios.get(API_BASE_URL);
    return data.map((role) => mapBackendToFrontend(role));
  } catch (error) {
    console.error("❌ Error al obtener roles:", error);
    throw error;
  }
};

// ✅ Obtener un rol por ID incluyendo permisos
export const getRoleById = async (id) => {
  try {
    const [roleRes, permisosRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/${id}`),
      axios.get(`${API_BASE_URL}/${id}/Permisos`), // 👈 ahora usa tu endpoint del controller
    ]);

    const permisosIds = permisosRes.data.map(
      (p) => p.idPermiso || p.IdPermiso
    );

    return mapBackendToFrontend(roleRes.data, permisosIds);
  } catch (error) {
    console.error(`❌ Error al obtener rol con id ${id}:`, error);
    throw error;
  }
};

// ✅ Crear un rol
export const createRole = async (roleData) => {
  try {
    const payload = mapFrontendToBackend(roleData);
    const { data } = await axios.post(API_BASE_URL, payload);
    return mapBackendToFrontend(data);
  } catch (error) {
    console.error("❌ Error al crear rol:", error);
    throw error;
  }
};

// ✅ Actualizar un rol
export const updateRole = async (id, roleData) => {
  try {
    const payload = mapFrontendToBackend({ ...roleData, id });
    await axios.put(`${API_BASE_URL}/${id}`, payload);
  } catch (error) {
    console.error(`❌ Error al actualizar rol con id ${id}:`, error);
    throw error;
  }
};

// ✅ Cambiar estado activo/inactivo
export const changeRoleStatus = async (id, activo) => {
  try {
    const { data: currentRole } = await axios.get(`${API_BASE_URL}/${id}`);
    const payload = mapFrontendToBackend({
      ...mapBackendToFrontend(currentRole),
      activo,
    });

    await axios.put(`${API_BASE_URL}/${id}`, payload);
  } catch (error) {
    console.error(`❌ Error al cambiar estado del rol con id ${id}:`, error);
    throw error;
  }
};

// ✅ Eliminar rol
export const deleteRole = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error(`❌ Error al eliminar rol con id ${id}:`, error);
    throw error;
  }
};

// ✅ Asignar permisos a un rol (pendiente implementar en backend)
export const assignPermissionsToRole = async (rolId, permisosIds) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/${rolId}/AsignarPermisos`,
      permisosIds
    );
    return data;
  } catch (error) {
    console.error(`❌ Error al asignar permisos para rol ${rolId}:`, error);
    throw error;
  }
};

// ✅ Obtener solo el nombre del rol (ej: para header)
export const getRoleNameById = async (id, token) => {
  try {
    const { data: role } = await axios.get(`${API_BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return role.nombreRol || "Rol desconocido";
  } catch (error) {
    console.error(`❌ Error al obtener nombre del rol con id ${id}:`, error);
    return "Error cargando rol";
  }
};
