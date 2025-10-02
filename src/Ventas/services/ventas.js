import axios from "axios";

const API_BASE_URL = "https://localhost:7228/api";

// ✅ Endpoints correctos
const VENTAS_URL = `${API_BASE_URL}/Ventas`;
const PRODUCTO_VENTA_URL = `${API_BASE_URL}/Productoxventas`;
const SERVICIO_VENTA_URL = `${API_BASE_URL}/Servicioxventums`;
const PRODUCTOS_URL = `${API_BASE_URL}/Productos`;
const SERVICIOS_URL = `${API_BASE_URL}/Servicios`;
const CLIENTES_URL = `${API_BASE_URL}/Clientes`;

// ======================= Mapeos =======================

// ✅ Backend → Frontend
const mapBackendToFrontend = (venta) => {
  console.log("Venta cruda desde API:", venta);

  const estado = venta.estado ? "Activo" : "Inactivo";

  const clienteNombreCompleto =
    venta.fkClienteNavigation?.nombre && venta.fkClienteNavigation?.apellido
      ? `${venta.fkClienteNavigation.nombre} ${venta.fkClienteNavigation.apellido}`
      : venta.fkClienteNavigation?.nombre || "N/A";

  return {
    id: venta.id,
    fecha: venta.fecha,
    clienteId: venta.fkCliente,
    total: venta.total,
    estado: estado,
    cliente: {
      id: venta.fkClienteNavigation?.id,
      nombre: venta.fkClienteNavigation?.nombre,
      apellido: venta.fkClienteNavigation?.apellido,
      nombreCompleto: clienteNombreCompleto,
    },
    // 🔹 Ojo: aquí sí preservamos productos y servicios
    productos: venta.productoxventa || [],
    servicios: venta.servicioxventum || [],
  };
};

// ✅ Frontend → Backend
const mapFrontendToBackend = (venta) => ({
  id: venta.id || 0,
  fecha: venta.fecha,
  fkCliente: venta.fkCliente,   // usa el mismo nombre que llega del modal
  total: venta.total,
  estado: venta.estado === true || venta.estado === "Activo",

  productoxventa: venta.productos?.map(p => ({
    fkProducto: p.productoId,
    cantidad: p.cantidad,
    precioUnitario: p.precioUnitario,  
    valorTotal: p.cantidad * p.precioUnitario
  })) || [],

  servicioxventa: venta.servicios?.map(s => ({
    fkServicio: s.servicioId,
    cantidad: s.cantidad,
    precioUnitario: s.precioUnitario,  
    valorTotal: s.cantidad * s.precioUnitario
  })) || []
});



// ======================= CRUD Ventas =======================

// Obtener todas las ventas
export const getVentas = async () => {
  try {
    const response = await axios.get(VENTAS_URL);
    return response.data.map((venta) => mapBackendToFrontend(venta));
  } catch (error) {
    console.error("Error al obtener ventas:", error.response?.data || error);
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

// Crear venta
export const createVenta = async (ventaData) => {
  try {
    const payload = mapFrontendToBackend(ventaData);
    console.log("📦 Payload enviado:", payload);

    const response = await axios.post(VENTAS_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error("Error al crear venta:", error.response?.data || error);
    throw error;
  }
};

// Actualizar venta
export const updateVenta = async (id, ventaData) => {
  try {
    const payload = mapFrontendToBackend(ventaData);
    const response = await axios.put(`${VENTAS_URL}/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`Error al actualizar venta con id ${id}:`, error);
    throw error;
  }
};

// Cambiar estado
export const changeVentaStatus = async (id, estado) => {
  try {
    const response = await axios.patch(`${VENTAS_URL}/${id}/estado`, { estado });
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`Error al cambiar estado de venta con id ${id}:`, error);
    throw error;
  }
};

// ======================= Productos & Servicios en Venta =======================

export const addProductoToVenta = async (ventaId, productoData) => {
  try {
    const payload = {
      fkVenta: ventaId,
      fkProducto: productoData.productoId,
      cantidad: productoData.cantidad,
      valorUnitario: productoData.valorUnitario,
      valorTotal: productoData.valorTotal,
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
      fkVenta: ventaId,
      fkServicio: servicioData.servicioId,
      precio: servicioData.precio,
      detalles: servicioData.detalles,
      valorTotal: servicioData.valorTotal,
    };
    const response = await axios.post(SERVICIO_VENTA_URL, payload);
    return response.data;
  } catch (error) {
    console.error(`Error al agregar servicio a venta ${ventaId}:`, error);
    throw error;
  }
};

// ======================= Catálogos =======================

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
    console.error(`Error al obtener cliente con id ${id}:`, error);
    throw error;
  }
};
