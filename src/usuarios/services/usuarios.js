// src/services/usuarios.js
import axios from "axios";

const API_BASE_URL = "https://localhost:7228/api/Usuarios";

// ====================
// Mapeos
// ====================

// Backend -> Frontend
const mapBackendToFrontend = (u) => ({
  idUsuario: u.idUsuario,              // 🔥 MANTENER idUsuario
  id: u.idUsuario,                     // También mantener id por compatibilidad
  nombre: u.nombre,
  email: u.email,
  rol: u.fkRolNavigation?.nombreRol || null,
  rolId: u.fkRol,
  tipoDocumento: u.tipoDoc,
  documento: u.documento,
  direccion: u.direccion,
  telefono: u.celular,
  celular: u.celular,                  // 🔥 AGREGAR celular también
  estado: u.estado ? "activo" : "inactivo",
});

// Frontend -> Backend
const mapFrontendToBackend = (usuario, isEdit = false) => {
  const payload = {
    Nombre: usuario.nombre,
    Email: usuario.email,
    Contrasena: usuario.contrasena || null,
    TipoDoc: usuario.tipoDocumento,
    Documento: usuario.documento,
    Celular: usuario.telefono,
    Direccion: usuario.direccion,
    FkRol: usuario.rolId,
    Estado: usuario.estado === "activo" || usuario.estado === true, // backend espera bool
  };

  if (isEdit) {
    payload.IdUsuario = usuario.id || usuario.idUsuario;
  }

  return payload;
};

// ====================
// CRUD Usuarios
// ====================

export const getUsuarios = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    const mappedData = response.data.map(mapBackendToFrontend);
    console.log("🔍 Usuarios mapeados:", mappedData); // 🔥 DEBUG
    return mappedData;
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error.response?.data || error);
    throw error;
  }
};

export const getUsuarioById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`❌ Error al obtener usuario con id ${id}:`, error.response?.data || error);
    throw error;
  }
};

export const createUsuario = async (usuarioData) => {
  try {
    const payload = mapFrontendToBackend(usuarioData, false);
    const response = await axios.post(API_BASE_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error("❌ Error al crear usuario:", error.response?.data || error);
    throw error;
  }
};

export const updateUsuario = async (id, usuarioData) => {
  try {
    const payload = mapFrontendToBackend(usuarioData, true);
    await axios.put(`${API_BASE_URL}/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`❌ Error al actualizar usuario con id ${id}:`, error.response?.data || error);
    throw error;
  }
};

export const toggleUsuarioEstado = async (id, estadoActual) => {
  try {
    console.log("🔄 Cambiando estado para usuario ID:", id, "Estado actual:", estadoActual); // 🔥 DEBUG
    
    if (!id) {
      throw new Error("ID de usuario es undefined");
    }
    
    const nuevoEstado = estadoActual === "activo" ? false : true;
    
    console.log("📤 Enviando PATCH a:", `${API_BASE_URL}/${id}/estado`);
    console.log("📤 Payload:", { Estado: nuevoEstado });
    
    await axios.patch(
      `${API_BASE_URL}/${id}/estado`,
      { Estado: nuevoEstado },
      { headers: { "Content-Type": "application/json" } }
    );
    
    console.log("✅ Estado cambiado exitosamente");
  } catch (error) {
    console.error(`❌ Error al cambiar estado del usuario con id ${id}:`, error.response?.data || error);
    throw error;
  }
};

export const deleteUsuario = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error(`❌ Error al eliminar usuario con id ${id}:`, error.response?.data || error);
    throw error;
  }
};