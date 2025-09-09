import axios from "axios";

const API_BASE_URL = "https://cyber360-api.onrender.com/api";
const VENTAS_URL = `${API_BASE_URL}/ventas`;
const PRODUCTO_VENTA_URL = `${API_BASE_URL}/productoxventa`;
const SERVICIO_VENTA_URL = `${API_BASE_URL}/servicioxventums`;
const PRODUCTOS_URL = `${API_BASE_URL}/productos`;
const SERVICIOS_URL = `${API_BASE_URL}/servicios`;
const CLIENTES_URL = `${API_BASE_URL}/clientes`;

// Mapeo backend -> frontend venta (versión mejorada)
const mapBackendToFrontend = (venta) => {
  console.log("Venta cruda desde API:", venta);
  
  // Manejo flexible del estado
  const estado = venta.activo !== undefined ? 
    (venta.activo ? 'Activo' : 'Inactivo') : 
    venta.estado || 'Activo';
  
  // Manejo flexible del cliente - ahora incluye nombre completo
  const clienteNombreCompleto = venta.cliente?.nombre && venta.cliente?.apellido 
    ? `${venta.cliente.nombre} ${venta.cliente.apellido}`
    : venta.cliente?.nombre || venta.nombreCliente || venta.nombre || 'N/A';

  return {
    id: venta.id || venta.ID,
    fecha: venta.fecha || venta.fechaVenta,
    clienteId: venta.clienteId || venta.idCliente,
    total: venta.total || venta.montoTotal || 0,
    cliente: {
      id: venta.cliente?.id,
      nombre: venta.cliente?.nombre,
      apellido: venta.cliente?.apellido,
      nombreCompleto: clienteNombreCompleto
    },
    productos: venta.productoxventa || venta.productos || [],
    servicios: venta.servicioxventa || venta.servicios || [],
    metodo: venta.metodo || venta.metodoPago || 'Efectivo',
    estado: estado
  };
};

// Mapeo frontend -> backend venta
const mapFrontendToBackend = (venta) => ({
  fecha: venta.fecha,
  clienteId: venta.clienteId,
  total: venta.total,
  metodo: venta.metodo,
  activo: venta.estado === 'Activo'
});

// Obtener todas las ventas
export const getVentas = async () => {
  try {
    console.log("Haciendo petición a:", VENTAS_URL);
    const response = await axios.get(VENTAS_URL);
    console.log("Respuesta de la API:", response.data);
    return response.data.map(venta => mapBackendToFrontend(venta));
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    if (error.response) {
      console.error("Respuesta del error:", error.response.data);
      console.error("Status del error:", error.response.status);
    }
    throw error;
  }
};

// Obtener una venta por ID
export const getVentaById = async (id) => {
  try {
    const response = await axios.get(`${VENTAS_URL}/${id}`);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`Error al obtener venta con id ${id}:`, error);
    throw error;
  }
};

// Resto de las funciones se mantienen igual...
export const createVenta = async (ventaData) => {
  try {
    const payload = mapFrontendToBackend(ventaData);
    const response = await axios.post(VENTAS_URL, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error("Error al crear venta:", error);
    throw error;
  }
};

export const updateVenta = async (id, ventaData) => {
  try {
    const payload = mapFrontendToBackend(ventaData);
    const response = await axios.put(`${VENTAS_URL}/${id}`, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`Error al actualizar venta con id ${id}:`, error);
    throw error;
  }
};

export const changeVentaStatus = async (id, activo) => {
  try {
    const response = await axios.patch(`${VENTAS_URL}/${id}/estado`, { activo });
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`Error al cambiar estado de venta con id ${id}:`, error);
    throw error;
  }
};

export const addProductoToVenta = async (ventaId, productoData) => {
  try {
    const payload = {
      ventaId: ventaId,
      productoId: productoData.productoId,
      cantidad: productoData.cantidad,
      precioUnitario: productoData.precioUnitario
    };
    const response = await axios.post(PRODUCTO_VENTA_URL, payload);
    return response.data;
  } catch (error) {
    console.error(`Error al agregar producto a venta ${ventaId}:`, error);
    throw error;
  }
};

export const addServicioToVenta = async (ventaId, servicioData) => {
  try {
    const payload = {
      ventaId: ventaId,
      servicioId: servicioData.servicioId,
      cantidad: servicioData.cantidad,
      precioUnitario: servicioData.precioUnitario
    };
    const response = await axios.post(SERVICIO_VENTA_URL, payload);
    return response.data;
  } catch (error) {
    console.error(`Error al agregar servicio a venta ${ventaId}:`, error);
    throw error;
  }
};

export const getProductos = async () => {
  try {
    const response = await axios.get(PRODUCTOS_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};

export const getServicios = async () => {
  try {
    const response = await axios.get(SERVICIOS_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    throw error;
  }
};

export const getClientes = async () => {
  try {
    const response = await axios.get(CLIENTES_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    throw error;
  }
};

export const getClienteById = async (id) => {
  try {
    const response = await axios.get(`${CLIENTES_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener cliente con id para la venta ${id}:`, error);
    throw error;
  }
};