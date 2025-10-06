import axios from "axios";

// ✅ URL base corregida
const API_BASE_URL = "https://localhost:7228/api";
const PRODUCTO_VENTA_URL = `${API_BASE_URL}/Productoxventums`;

// 🔹 Mapeo backend -> frontend producto x venta
const mapBackendToFrontend = (productoVenta) => {
  console.log("📋 ProductoVenta CRUDO desde API:", productoVenta);

  let nombreProducto = "Producto";
  if (productoVenta.producto?.nombre) {
    nombreProducto = productoVenta.producto.nombre;
  } else if (productoVenta.nombreProducto) {
    nombreProducto = productoVenta.nombreProducto;
  } else if (productoVenta.Producto?.nombre) {
    nombreProducto = productoVenta.Producto.nombre;
  }

  const productoMapeado = {
    id: productoVenta.id || productoVenta.ID,
    productoId:
      productoVenta.productoId ||
      productoVenta.idProducto ||
      productoVenta.fkProducto, // 👈 por si la API devuelve fkProducto
    ventaId:
      productoVenta.ventaId ||
      productoVenta.idVenta ||
      productoVenta.fkVenta, // 👈 por si la API devuelve fkVenta
    valorTotal: Number(
      productoVenta.valorTotal ??
        productoVenta.precioTotal ??
        productoVenta.total ??
        0
    ),
    valorUnitario: Number(
      productoVenta.valorUnitario ??
        productoVenta.precioUnitario ??
        productoVenta.precio ??
        0
    ),
    cantidad: productoVenta.cantidad || 1,
    producto: {
      nombre: nombreProducto,
      ...productoVenta.producto,
    },
    venta: productoVenta.venta || productoVenta.fkVentaNavigation,
  };

  console.log("✅ Producto mapeado:", productoMapeado);
  return productoMapeado;
};

// 🔹 Mapeo frontend -> backend producto x venta
const mapFrontendToBackend = (productoVenta) => ({
  productoId: productoVenta.productoId, // 👈 CAMBIO
  ventaId: productoVenta.ventaId,       // 👈 CAMBIO
  valorTotal: productoVenta.valorTotal,
  valorUnitario: productoVenta.valorUnitario,
  precio: productoVenta.valorUnitario,  // 👈 CAMBIO
  cantidad: productoVenta.cantidad,
});

// 🔹 Obtener productos por venta ID
export const getProductosByVentaId = async (ventaId) => {
  try {
    console.log(`🔍 Fetching productos for ventaId: ${ventaId}`);
    const response = await axios.get(`${PRODUCTO_VENTA_URL}?ventaId=${ventaId}`);
    console.log("📊 Response data:", response.data);

    if (Array.isArray(response.data)) {
      return response.data.map(mapBackendToFrontend);
    } else if (response.data && typeof response.data === "object") {
      return [mapBackendToFrontend(response.data)];
    } else {
      return [];
    }
  } catch (error) {
    console.error(
      `💥 Error al obtener productos por venta ${ventaId}:`,
      error.response?.data || error
    );
    return [];
  }
};

// 🔹 Obtener todos los productos x venta
export const getProductosVenta = async () => {
  try {
    const response = await axios.get(PRODUCTO_VENTA_URL);
    if (Array.isArray(response.data)) {
      return response.data.map(mapBackendToFrontend);
    }
    return [];
  } catch (error) {
    console.error("❌ Error al obtener productos x venta:", error.response?.data || error);
    return [];
  }
};

// 🔹 Obtener producto x venta por ID
export const getProductoVentaById = async (id) => {
  try {
    const response = await axios.get(`${PRODUCTO_VENTA_URL}/${id}`);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`❌ Error al obtener producto x venta con id ${id}:`, error.response?.data || error);
    throw error;
  }
};

// 🔹 Crear producto x venta
export const createProductoVenta = async (productoVentaData) => {
  try {
    const payload = mapFrontendToBackend(productoVentaData);
    console.log("📤 Payload createProductoVenta:", payload);
    const response = await axios.post(PRODUCTO_VENTA_URL, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error("❌ Error al crear producto x venta:", error.response?.data || error);
    throw error;
  }
};

// 🔹 Actualizar producto x venta
export const updateProductoVenta = async (id, productoVentaData) => {
  try {
    const payload = mapFrontendToBackend(productoVentaData);
    const response = await axios.put(`${PRODUCTO_VENTA_URL}/${id}`, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`❌ Error al actualizar producto x venta con id ${id}:`, error.response?.data || error);
    throw error;
  }
};

// 🔹 Eliminar producto x venta
export const deleteProductoVenta = async (id) => {
  try {
    await axios.delete(`${PRODUCTO_VENTA_URL}/${id}`);
  } catch (error) {
    console.error(`❌ Error al eliminar producto x venta con id ${id}:`, error.response?.data || error);
    throw error;
  }
};

// 🔹 Obtener ventas por producto ID
export const getVentasByProductoId = async (productoId) => {
  try {
    const response = await axios.get(`${PRODUCTO_VENTA_URL}/${productoId}`);
    if (Array.isArray(response.data)) {
      return response.data.map(mapBackendToFrontend);
    }
    return [];
  } catch (error) {
    console.error(`❌ Error al obtener ventas por producto ${productoId}:`, error.response?.data || error);
    return [];
  }
};

// 🔹 Agregar producto a una venta (shortcut)
export const addProductoToVenta = async (ventaId, productoData) => {
  try {
    const payload = {
      ventaId: ventaId,                          // 👈 CAMBIO
      productoId: productoData.productoId,       // 👈 CAMBIO
      valorUnitario: productoData.valorTotal,
      valorTotal: productoData.valorTotal,
      precio: productoData.valorUnitario,        // 👈 CAMBIO
      cantidad: productoData.cantidad || 1,
    };

    console.log("📤 Payload addProductoToVenta:", payload);

    const response = await axios.post(PRODUCTO_VENTA_URL, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`❌ Error al agregar producto a venta ${ventaId}:`, error.response?.data || error);
    throw error;
  }
};
