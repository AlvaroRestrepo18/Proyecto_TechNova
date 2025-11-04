import axios from "axios";

const API_BASE_URL = "https://localhost:7228/api";

const VENTAS_URL = `${API_BASE_URL}/Ventas`;
const PRODUCTO_VENTA_URL = `${API_BASE_URL}/Productoxventums`;
const SERVICIO_VENTA_URL = `${API_BASE_URL}/Servicioxventums`;
const PRODUCTOS_URL = `${API_BASE_URL}/Productos`;
const SERVICIOS_URL = `${API_BASE_URL}/Servicios`;
const CLIENTES_URL = `${API_BASE_URL}/Clientes`;

// 🔹 Backend → Frontend
const mapBackendToFrontend = (venta) => {
  if (!venta) return null;

 const estado = Boolean(venta.estado);
  const clienteNav = venta.cliente || venta.fkClienteNavigation || {};

  const productos = (venta.productoxventa || venta.productoxventums || []).map((p) => ({
    id: p.id,
    productoId: p.productoId,
    nombreProducto:
      p.producto?.nombre ||
      p.fkProductoNavigation?.nombre ||
      `Producto #${p.productoId}`,
    cantidad: p.cantidad,
    valorUnitario: p.valorUnitario,
    valorTotal: p.valorTotal,
  }));

  return {
    id: venta.id,
    fecha: venta.fecha,
    clienteId: venta.clienteId || venta.fkCliente,
    total: venta.total,
    estado,
    cliente: {
      id: clienteNav.id,
      nombre: clienteNav.nombre,
      apellido: clienteNav.apellido,
      documento: clienteNav.documento || "No registrado",
      nombreCompleto: clienteNav.nombre
        ? `${clienteNav.nombre} ${clienteNav.apellido || ""}`.trim()
        : "N/A",
    },
    productos,
    servicios: venta.servicioxventa || venta.servicioxventums || [],
  };
};

// 🔹 Frontend → Backend
const mapFrontendToBackend = (venta) => {
  const clienteId = venta.ClienteId || venta.clienteId;

  if (!clienteId || clienteId === 0 || isNaN(clienteId)) {
    throw new Error("Debe seleccionar un cliente válido.");
  }

  return {
    id: venta.id || 0,
    clienteId: Number(clienteId),
    fecha: new Date().toISOString().split("T")[0],
    total: Number(venta.total || 0),
    estado: venta.estado === true || venta.estado === "Activo",
    productoxventa: [],
    servicioxventa: [],
  };
};

// ==================== CRUD DE VENTAS ====================
export const getVentas = async () => {
  try {
    const response = await axios.get(VENTAS_URL);
    return response.data.map(mapBackendToFrontend);
  } catch (error) {
    console.error("❌ Error al obtener ventas:", error);
    throw error;
  }
};

// 🔹 getVentaById corregido
export const getVentaById = async (id) => {
  try {
    const response = await axios.get(`${VENTAS_URL}/${id}`);
    let venta = mapBackendToFrontend(response.data);

    // Traer productos del catálogo
    const productosResponse = await axios.get(PRODUCTOS_URL);
    const productosCatalogo = productosResponse.data || [];

    venta.productos = (venta.productos || []).map((p) => {
      const productoInfo = productosCatalogo.find(
        (prod) => prod.id === p.productoId
      );
      return {
        ...p,
        nombreProducto: productoInfo
          ? productoInfo.nombre
          : `Producto #${p.productoId}`,
      };
    });

    // Traer servicios de la venta
    const serviciosResponse = await getServiciosByVentaId(id);
    venta.servicios = (serviciosResponse || []).map((s) => ({
      id: s.id,
      fkServicio: s.fkServicio,
      fkVenta: s.fkVenta,
      precio: s.precio,
      detalles: s.detalles,
      valorTotal: s.valorTotal,
    }));

    return venta;
  } catch (error) {
    console.error(`❌ Error al obtener venta con ID ${id}:`, error);
    throw error;
  }
};

export const createVenta = async (ventaData) => {
  try {
    const payload = mapFrontendToBackend(ventaData);
    const response = await axios.post(VENTAS_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear venta:", error.response?.data || error);
    throw error;
  }
};

export const updateVenta = async (id, ventaData) => {
  try {
    const payload = mapFrontendToBackend(ventaData);
    const response = await axios.put(`${VENTAS_URL}/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`❌ Error al actualizar venta con ID ${id}:`, error);
    throw error;
  }
};

// ==================== PRODUCTOS & SERVICIOS ====================
export const addProductoToVenta = async (ventaId, productoData) => {
  try {
    const payload = {
      id: 0,
      productoId: productoData.ProductoId || productoData.productoId,
      ventaId,
      cantidad: productoData.Cantidad || productoData.cantidad || 1,
      valorUnitario:
        productoData.ValorUnitario || productoData.valorUnitario || 0,
      valorTotal: productoData.ValorTotal || productoData.valorTotal || 0,
      fkproductoNavigation: null,
      fkVentaNavigation: null,
    };
    const response = await axios.post(PRODUCTO_VENTA_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error al agregar producto a venta ${ventaId}:`, error);
    throw error;
  }
};

export const addServicioToVenta = async (ventaId, servicioData) => {
  try {
    const payload = {
      id: 0,
      fkServicio: servicioData.FkServicio || servicioData.fkServicio,
      fkVenta: ventaId,
      precio: servicioData.Precio || servicioData.precio || 0,
      detalles:
        servicioData.Detalles || `Servicio: ${servicioData.nombre || ""}`,
      valorTotal: servicioData.ValorTotal || servicioData.valorTotal || 0,
      fkServicioNavigation: null,
      fkVentaNavigation: null,
    };
    const response = await axios.post(SERVICIO_VENTA_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error al agregar servicio a venta ${ventaId}:`, error);
    throw error;
  }
};

// 🔹 Obtener productos de una venta
export const getProductosByVentaId = async (ventaId) => {
  try {
    const response = await axios.get(`${PRODUCTO_VENTA_URL}/ByVenta/${ventaId}`);
    return response.data || [];
  } catch (error) {
    console.error(`❌ Error al obtener productos de venta ${ventaId}:`, error);
    return [];
  }
};

// 🔹 Obtener servicios de una venta
export const getServiciosByVentaId = async (ventaId) => {
  try {
    const response = await axios.get(`${SERVICIO_VENTA_URL}/ByVenta/${ventaId}`);
    return response.data || [];
  } catch (error) {
    console.error(`❌ Error al obtener servicios de venta ${ventaId}:`, error);
    return [];
  }
};

// ==================== CATÁLOGOS ====================
export const getProductos = async () => {
  try {
    const response = await axios.get(PRODUCTOS_URL);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    throw error;
  }
};

export const getServicios = async () => {
  try {
    const response = await axios.get(SERVICIOS_URL);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener servicios:", error);
    throw error;
  }
};

export const getClientes = async () => {
  try {
    const response = await axios.get(CLIENTES_URL);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener clientes:", error);
    throw error;
  }
};

export const getClienteById = async (id) => {
  try {
    const response = await axios.get(`${CLIENTES_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al obtener cliente con ID ${id}:`, error);
    throw error;
  }
};

// ==================== CAMBIAR ESTADO DE VENTA ====================
export const cambiarEstadoVenta = async (id, nuevoEstado) => {
  try {
    const response = await axios.put(
      `https://localhost:7228/api/Ventas/${id}/estado`,
      { estado: nuevoEstado }, // 👈 importante: objeto JSON con "estado"
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("✅ Estado cambiado:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al cambiar estado de la venta ${id}:`, error);
    throw error;
  }
};

