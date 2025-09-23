import axios from "axios";

const API_BASE_URL = "";

// ====================
// Mapeos
// ====================

// Backend -> Frontend (para mostrar en tablas, etc.)
const mapBackendToFrontend = (u) => ({
  id: u.idUsuario,
  name: u.nombre,
  email: u.email,
  role: u.rol, // el backend ya devuelve el nombre del rol en UsuarioDto
  tipoDocumento: u.tipoDoc,
  documento: u.documento,
  direccion: u.direccion,
  telefono: u.celular,
  estado: u.estado ? "activo" : "inactivo",
});

// Frontend -> Backend (para crear o editar)
const mapFrontendToBackend = (usuario) => ({
  tipoDoc: usuario.tipoDocumento,       // asegúrate de usar el mismo nombre que el frontend
  documento: usuario.documento,
  nombre: usuario.name,
  celular: usuario.telefono,
  email: usuario.email,
  direccion: usuario.direccion,
  fkRol: usuario.rolId || usuario.fkRol, // enviar el id del rol
  contrasena: usuario.contrasena || null,
});

// ====================
// CRUD Usuarios
// ====================

// Obtener todos los usuarios
export const getUsuarios = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.map(mapBackendToFrontend);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`Error al obtener usuario con id ${id}:`, error);
    throw error;
  }
};

// Crear usuario
export const createUsuario = async (usuarioData) => {
  try {
    const payload = mapFrontendToBackend(usuarioData);
    const response = await axios.post(API_BASE_URL, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

// Editar usuario
export const updateUsuario = async (id, usuarioData) => {
  try {
    const payload = mapFrontendToBackend(usuarioData);
    await axios.put(`${API_BASE_URL}/${id}`, payload);
  } catch (error) {
    console.error(`Error al actualizar usuario con id ${id}:`, error);
    throw error;
  }
};

// Cambiar estado (activar/inactivar)
// Cambiar estado (activar/inactivar)
export const toggleUsuarioEstado = async (id, estadoActual) => {
  try {
    // Determinar el nuevo estado
    const nuevoEstado = estadoActual === "activo" ? false : true;

    // Enviar directamente un booleano como body
    await axios.patch(
      `${API_BASE_URL}/${id}/estado`,
      JSON.stringify(nuevoEstado),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(
      `Error al cambiar estado del usuario con id ${id}:`,
      error
    );
    throw error;
  }
};


// Eliminar usuario (DELETE físico)
export const deleteUsuario = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar usuario con id ${id}:`, error);
    throw error;
  }
};
