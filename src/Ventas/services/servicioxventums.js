import axios from "axios";

// ✅ URL base de la API
const API_BASE_URL = "https://localhost:7228/api";
const SERVICIO_VENTA_URL = `${API_BASE_URL}/Servicioxventums`;

// 🔹 Mapeo backend -> frontend
const mapBackendToFrontend = (servicioVenta) => {
  console.log("📋 ServicioVenta CRUDO desde API:", servicioVenta);

  let nombreServicio = "Servicio";
  if (servicioVenta.fkServicioNavigation?.nombre) {
    nombreServicio = servicioVenta.fkServicioNavigation.nombre;
  } else if (servicioVenta.servicio?.nombre) {
    nombreServicio = servicioVenta.servicio.nombre;
  }

  const servicioMapeado = {
    id: servicioVenta.id,
    servicioId: servicioVenta.fkServicio || servicioVenta.servicioId,
    ventaId: servicioVenta.fkVenta || servicioVenta.ventaId,
    detalles: servicioVenta.detalles || "",
    valorTotal: Number(servicioVenta.valorTotal ?? 0),
    valorUnitario: Number(servicioVenta.precio ?? servicioVenta.valorUnitario ?? 0), // 👈 API usa precio
    cantidad: servicioVenta.cantidad || 1,
    servicio: {
      nombre: nombreServicio,
    },
    venta: servicioVenta.fkVentaNavigation || servicioVenta.venta,
  };

  console.log("✅ Servicio mapeado:", servicioMapeado);
  return servicioMapeado;
};

// 🔹 Mapeo frontend -> backend
const mapFrontendToBackend = (servicioVenta) => ({
  FkServicio: servicioVenta.servicioId,   // 👈 CAMBIO
  FkVenta: servicioVenta.ventaId,         // 👈 CAMBIO
  detalles: servicioVenta.detalles,
  valorTotal: servicioVenta.valorTotal,
  precio: servicioVenta.valorUnitario,    // 👈 CAMBIO
  cantidad: servicioVenta.cantidad,
});

// 🔹 Obtener servicios por venta ID
export const getServiciosByVentaId = async (ventaId) => {
  try {
    console.log(`🔍 Fetching servicios for ventaId: ${ventaId}`);
    const response = await axios.get(`${SERVICIO_VENTA_URL}?ventaId=${ventaId}`);
    console.log("📊 Response data:", response.data);

    if (Array.isArray(response.data)) {
      return response.data.map(mapBackendToFrontend);
    } else if (response.data && typeof response.data === "object") {
      return [mapBackendToFrontend(response.data)];
    } else {
      return [];
    }
  } catch (error) {
    console.error(`💥 Error al obtener servicios por venta ${ventaId}:`, error.response?.data || error);
    return [];
  }
};

// 🔹 Obtener todos los servicios x venta
export const getServiciosVenta = async () => {
  try {
    const response = await axios.get(SERVICIO_VENTA_URL);
    if (Array.isArray(response.data)) {
      return response.data.map(mapBackendToFrontend);
    }
    return [];
  } catch (error) {
    console.error("❌ Error al obtener servicios x venta:", error);
    return [];
  }
};

// 🔹 Obtener un servicio por ID
export const getServicioVentaById = async (id) => {
  try {
    const response = await axios.get(`${SERVICIO_VENTA_URL}/${id}`);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`❌ Error al obtener servicio x venta con id ${id}:`, error);
    throw error;
  }
};

// 🔹 Crear un servicio en una venta
export const createServicioVenta = async (servicioVentaData) => {
  try {
    const payload = mapFrontendToBackend(servicioVentaData);
    console.log("📤 Payload createServicioVenta:", payload);
    const response = await axios.post(SERVICIO_VENTA_URL, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error("❌ Error al crear servicio x venta:", error.response?.data || error);
    throw error;
  }
};

// 🔹 Actualizar un servicio
export const updateServicioVenta = async (id, servicioVentaData) => {
  try {
    const payload = mapFrontendToBackend(servicioVentaData);
    const response = await axios.put(`${SERVICIO_VENTA_URL}/${id}`, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`❌ Error al actualizar servicio x venta con id ${id}:`, error.response?.data || error);
    throw error;
  }
};

// 🔹 Eliminar un servicio de una venta
export const deleteServicioVenta = async (id) => {
  try {
    await axios.delete(`${SERVICIO_VENTA_URL}/${id}`);
  } catch (error) {
    console.error(`❌ Error al eliminar servicio x venta con id ${id}:`, error.response?.data || error);
    throw error;
  }
};

// 🔹 Obtener ventas por servicio ID
export const getVentasByServicioId = async (servicioId) => {
  try {
    const response = await axios.get(`${SERVICIO_VENTA_URL}/${servicioId}`);
    if (Array.isArray(response.data)) {
      return response.data.map(mapBackendToFrontend);
    }
    return [];
  } catch (error) {
    console.error(`❌ Error al obtener ventas por servicio ${servicioId}:`, error.response?.data || error);
    return [];
  }
};

// 🔹 Agregar servicio a una venta (shortcut)
export const addServicioToVenta = async (ventaId, servicioData) => {
  try {
    const payload = {
      FkVenta: ventaId,                         // 👈 CAMBIO
      FkServicio: servicioData.servicioId,      // 👈 CAMBIO
      detalles: servicioData.detalles,
      valorTotal: servicioData.valorTotal,
      precio: servicioData.valorUnitario,       // 👈 CAMBIO
      cantidad: servicioData.cantidad || 1,
    };

    console.log("📤 Payload addServicioToVenta:", payload);

    const response = await axios.post(SERVICIO_VENTA_URL, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`❌ Error al agregar servicio a venta ${ventaId}:`, error.response?.data || error);
    throw error;
  }
};
