import axios from "axios";

const API_BASE_URL = "";

// Mapeo backend -> frontend proveedor
const mapBackendToFrontend = (proveedor) => ({
  id: proveedor.id,
  tipoPersona: proveedor.tipoPersona,
  numeroDocumento: proveedor.numeroDocumento,
  tipoDocumento: proveedor.tipoDocumento,
  nombres: proveedor.nombres,
  apellidos: proveedor.apellidos,
  razonSocial: proveedor.razonSocial,
  correo: proveedor.correo,
  direccion: proveedor.direccion,
  telefono: proveedor.telefono,
});

// Mapeo frontend -> backend proveedor
const mapFrontendToBackend = (proveedor) => ({
  tipoPersona: proveedor.tipoPersona,
  numeroDocumento: proveedor.numeroDocumento,
  tipoDocumento: proveedor.tipoDocumento,
  nombres: proveedor.nombres,
  apellidos: proveedor.apellidos,
  razonSocial: proveedor.razonSocial,
  correo: proveedor.correo,
  direccion: proveedor.direccion,
  telefono: proveedor.telefono,
});

// Obtener todos los proveedores
export const getProveedores = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.map((prov) => mapBackendToFrontend(prov));
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    throw error;
  }
};

// Obtener un proveedor por ID
export const getProveedorById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`Error al obtener proveedor con id ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo proveedor
export const createProveedor = async (proveedorData) => {
  try {
    const payload = mapFrontendToBackend(proveedorData);
    const response = await axios.post(API_BASE_URL, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error al crear proveedor:", error.response.data);
    } else {
      console.error("Error al crear proveedor:", error.message);
    }
    throw error;
  }
};

// Actualizar un proveedor
export const updateProveedor = async (id, proveedorData) => {
  try {
    const payload = mapFrontendToBackend(proveedorData);
    console.log("Payload enviado al backend:", payload); // 🔍 depuración
    const response = await axios.put(`${API_BASE_URL}/${id}`, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    if (error.response) {
      console.error(`Error al actualizar proveedor con id ${id}:`, error.response.data);
    } else {
      console.error(`Error al actualizar proveedor con id ${id}:`, error.message);
    }
    throw error;
  }
};

// Eliminar un proveedor
export const deleteProveedor = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    if (error.response) {
      console.error(`Error al eliminar proveedor con id ${id}:`, error.response.data);
    } else {
      console.error(`Error al eliminar proveedor con id ${id}:`, error.message);
    }
    throw error;
  }
};
