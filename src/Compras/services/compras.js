import axios from "axios";

const API_COMPRAS_URL = "https://localhost:7228/api/Compras";
const API_PROVEEDORES_URL = "https://localhost:7228/api/Proveedores";
const API_DETALLE_COMPRAS_URL = "https://localhost:7228/api/DetalleCompras";
const API_PRODUCTOS_URL = "https://localhost:7228/api/Productos";

/* ============================================================
  🔀 Mappers
============================================================ */
const mapBackendToFrontend = (compra) => ({
  id: compra.id,
  proveedorId: compra.proveedorId,
  fechaCompra: compra.fechaCompra,
  fechaRegistro: compra.fechaRegistro || null,
  metodoPago: compra.metodoPago || "",
  estado: Boolean(compra.estado),
  subtotal: compra.subtotal ?? 0,
  iva: compra.iva ?? 0,
  total: compra.total ?? 0,
  detalles: (compra.detallesCompra || []).map((d) => ({
    id: d.id,
    compraId: d.compraId,
    productoId: d.productoId,
    cantidad: d.cantidad,
    precioUnitario: d.precioUnitario,
    subtotalItems: d.subtotalItems ?? d.cantidad * d.precioUnitario,
    producto: d.producto
      ? {
          id: d.producto.id,
          nombre: d.producto.nombre,
          precio: d.producto.precio,
        }
      : null,
  })),
});

const mapFrontendToBackend = (compra) => {
  const payload = {
    proveedorId: parseInt(compra.proveedorId, 10),
    fechaCompra: compra.fechaCompra || new Date().toISOString(),
    fechaRegistro: compra.fechaRegistro || new Date().toISOString(), // 👈 siempre enviado
    metodoPago: compra.metodoPago || null,
    estado: !!compra.estado,
    subtotal: compra.subtotal ?? 0,
    iva: compra.iva ?? 0,
    total: compra.total ?? 0,
    detallesCompra: (compra.detalles || []).map((d) => ({
      id: d.id || 0,
      productoId: parseInt(d.productoId, 10),
      cantidad: d.cantidad,
      precioUnitario: d.precioUnitario,
      subtotalItems: d.subtotalItems ?? d.cantidad * d.precioUnitario,
    })),
  };

  if (compra.id) payload.id = compra.id;

  return payload;
};

/* ============================================================
  🛠️ Manejo de errores
============================================================ */
const handleError = (action, error, id = null) => {
  const backendMsg = error.response?.data || error.message;
  console.error(`❌ Error al ${action}${id ? ` con id ${id}` : ""}:`, backendMsg);

  if (error.response) {
    console.group("📩 Respuesta completa del backend");
    console.log("Status:", error.response.status);
    console.log("Headers:", error.response.headers);
    console.log("Data:", error.response.data);

    // 👇 Extra: mostrar errores de validación más legibles
    if (error.response.data?.errors) {
      console.error("❌ Errores de validación:");
      Object.entries(error.response.data.errors).forEach(([campo, mensajes]) => {
        console.error(`   - ${campo}: ${mensajes.join(", ")}`);
      });
    }
    console.groupEnd();
  }

  throw new Error(
    typeof backendMsg === "string"
      ? backendMsg
      : backendMsg.message || "Ocurrió un error inesperado"
  );
};



/* ============================================================
  📌 CRUD COMPRAS
============================================================ */
export const getCompras = async () => {
  try {
    const response = await axios.get(API_COMPRAS_URL);
    const comprasArray = Array.isArray(response.data)
      ? response.data
      : response.data?.data || response.data?.result || [];
    return comprasArray.map(mapBackendToFrontend);
  } catch (error) {
    handleError("obtener compras", error);
  }
};

export const getCompraById = async (id) => {
  try {
    const response = await axios.get(`${API_COMPRAS_URL}/${id}`);
    const compraData =
      response.data.data || response.data.result || response.data;
    return mapBackendToFrontend(compraData);
  } catch (error) {
    handleError("obtener compra", error, id);
  }
};

export const createCompra = async (compraData) => {
  try {
    const payload = mapFrontendToBackend(compraData);
    console.log("📤 Enviando payload:", payload);
    const response = await axios.post(API_COMPRAS_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return mapBackendToFrontend(
      response.data.data || response.data.result || response.data
    );
  } catch (error) {
    handleError("crear compra", error);
  }
};

export const updateCompra = async (id, compraData) => {
  try {
    const payload = mapFrontendToBackend({ ...compraData, id });
    console.log("✏️ Payload update:", payload);
    const response = await axios.put(`${API_COMPRAS_URL}/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return mapBackendToFrontend(
      response.data.data || response.data.result || response.data
    );
  } catch (error) {
    handleError("actualizar compra", error, id);
  }
};

export const changeCompraStatus = async (id, estado) => {
  try {
    const response = await axios.patch(`${API_COMPRAS_URL}/${id}/estado`, {
      estado: !!estado,
    });
    return mapBackendToFrontend(
      response.data.data || response.data.result || response.data
    );
  } catch (error) {
    handleError("cambiar estado de la compra", error, id);
  }
};

export const deleteCompra = async (id) => {
  try {
    await axios.delete(`${API_COMPRAS_URL}/${id}`);
    return { id };
  } catch (error) {
    handleError("eliminar compra", error, id);
  }
};

/* ============================================================
  📌 CRUD PROVEEDORES
============================================================ */
export const getProveedores = async () => {
  try {
    const response = await axios.get(API_PROVEEDORES_URL);
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || response.data?.result || [];
  } catch (error) {
    handleError("obtener proveedores", error);
  }
};

/* ============================================================
  📌 CRUD PRODUCTOS
============================================================ */
export const getProductos = async () => {
  try {
    const response = await axios.get(API_PRODUCTOS_URL);
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || response.data?.result || [];
  } catch (error) {
    handleError("obtener productos", error);
  }
};

export const getProductoById = async (id) => {
  try {
    const response = await axios.get(`${API_PRODUCTOS_URL}/${id}`);
    return response.data.data || response.data.result || response.data;
  } catch (error) {
    handleError("obtener producto", error, id);
  }
};

/* ============================================================
  📌 CRUD DETALLE COMPRAS
============================================================ */
export const getDetalleCompras = async () => {
  try {
    const response = await axios.get(API_DETALLE_COMPRAS_URL);
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || response.data?.result || [];
  } catch (error) {
    handleError("obtener detalle compras", error);
  }
};

export const createDetalleCompra = async (detalleData) => {
  try {
    const response = await axios.post(API_DETALLE_COMPRAS_URL, detalleData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.data || response.data.result || response.data;
  } catch (error) {
    handleError("crear detalle compra", error);
  }
};

export const updateDetalleCompra = async (id, detalleData) => {
  try {
    const response = await axios.put(
      `${API_DETALLE_COMPRAS_URL}/${id}`,
      detalleData,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data.data || response.data.result || response.data;
  } catch (error) {
    handleError("actualizar detalle compra", error, id);
  }
};

export const deleteDetalleCompra = async (id) => {
  try {
    await axios.delete(`${API_DETALLE_COMPRAS_URL}/${id}`);
    return { id };
  } catch (error) {
    handleError("eliminar detalle compra", error, id);
  }
};
