import axios from "axios";

const API_BASE_URL = "https://localhost:7228/api/Clientes";

/* 
  🔄 Mapper Backend -> Frontend
  Backend usa: estado
  Frontend usa: activo
*/
const mapBackendToFrontend = (cliente) => ({
  id: cliente.id,
  nombre: cliente.nombre || "",
  apellido: cliente.apellido || "",
  tipoDoc: cliente.tipoDoc || "",
  documento: cliente.documento ?? null,
  correo: cliente.correo || "",
  activo: cliente.estado ?? true, // 👈 siempre "activo" en frontend
});

/* 
  🔄 Mapper Frontend -> Backend
  Frontend usa: activo
  Backend recibe: estado
*/
const mapFrontendToBackend = (cliente) => {
  const payload = {
    nombre: cliente.nombre || "",
    apellido: cliente.apellido || "",
    tipoDoc: cliente.tipoDoc || "",
    documento: cliente.documento ?? null,
    correo: cliente.correo || "",
    estado: cliente.activo ?? true, // 👈 backend espera "estado"
  };

  if (cliente.id) {
    payload.id = cliente.id; // solo enviar ID en update
  }

  return payload;
};

/* 
  🛠️ Manejo de errores centralizado 
*/
const handleError = (action, error, id = null) => {
  const backendMsg = error.response?.data || error.message;
  console.error(`❌ Error al ${action}${id ? ` con id ${id}` : ""}:`, backendMsg);

  throw new Error(
    typeof backendMsg === "string"
      ? backendMsg
      : backendMsg.message || "Ocurrió un error inesperado"
  );
};

/* 
  📌 Obtener todos los clientes 
*/
export const getClientes = async (soloActivos = null) => {
  try {
    const params = soloActivos !== null ? { soloActivos } : {};
    const response = await axios.get(API_BASE_URL, { params });

    let clientesArray;

    // Normalización de respuesta
    if (Array.isArray(response.data)) {
      clientesArray = response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      clientesArray = response.data.data;
    } else if (response.data?.clientes && Array.isArray(response.data.clientes)) {
      clientesArray = response.data.clientes;
    } else if (response.data?.result && Array.isArray(response.data.result)) {
      clientesArray = response.data.result;
    } else if (response.data && typeof response.data === "object") {
      clientesArray = Object.values(response.data);
    } else {
      console.warn("⚠️ Estructura inesperada, devolviendo array vacío");
      clientesArray = [];
    }

    return clientesArray.map(mapBackendToFrontend);
  } catch (error) {
    handleError("obtener clientes", error);
  }
};

/* 
  📌 Obtener cliente por ID 
*/
export const getClienteById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    const clienteData = response.data.data || response.data.result || response.data;
    return mapBackendToFrontend(clienteData);
  } catch (error) {
    handleError("obtener cliente", error, id);
  }
};

/* 
  📌 Crear cliente 
*/
export const createCliente = async (clienteData) => {
  try {
    const payload = mapFrontendToBackend(clienteData);
    const response = await axios.post(API_BASE_URL, payload);
    const nuevoCliente = response.data.data || response.data.result || response.data;
    return mapBackendToFrontend(nuevoCliente);
  } catch (error) {
    handleError("crear cliente", error);
  }
};

/* 
  📌 Actualizar cliente 
*/
export const updateCliente = async (id, clienteData) => {
  try {
    if (!clienteData.nombre) {
      throw new Error("El nombre del cliente es obligatorio");
    }

    const payload = mapFrontendToBackend({ ...clienteData, id });
    const response = await axios.put(`${API_BASE_URL}/${id}`, payload);
    const clienteActualizado = response.data.data || response.data.result || response.data;
    return mapBackendToFrontend(clienteActualizado);
  } catch (error) {
    handleError("actualizar cliente", error, id);
  }
};

/* 
  📌 Cambiar estado activo/inactivo 
*/
export const changeClienteStatus = async (id, activo) => {
  try {
    const clienteActual = await getClienteById(id);
    const payload = {
      ...mapFrontendToBackend(clienteActual),
      estado: activo, // 👈 forzamos cambio de estado
    };

    const response = await axios.put(`${API_BASE_URL}/${id}`, payload);
    const clienteModificado = response.data.data || response.data.result || response.data;
    return mapBackendToFrontend(clienteModificado);
  } catch (error) {
    handleError("cambiar estado de cliente", error, id);
  }
};

/* 
  📌 Eliminar cliente 
*/
export const deleteCliente = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
    return { id };
  } catch (error) {
    handleError("eliminar cliente", error, id);
  }
};
