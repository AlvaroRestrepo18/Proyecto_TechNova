import axios from "axios";

const API_BASE_URL = "https://cyber360-api.onrender.com/api";
const PRODUCTO_VENTA_URL = `${API_BASE_URL}/productoxventa`;

// Mapeo backend -> frontend producto x venta (DEBUG VERSION)
const mapBackendToFrontend = (productoVenta) => {
  console.log("📋 ProductoVenta CRUDO desde API:", productoVenta);
  
  // Debug: Mostrar todas las propiedades disponibles
  if (productoVenta) {
    console.log("🔍 Propiedades disponibles:", Object.keys(productoVenta));
  }

  // Buscar el nombre del producto en diferentes posibles ubicaciones
  let nombreProducto = 'Producto';
  if (productoVenta.producto && productoVenta.producto.nombre) {
    nombreProducto = productoVenta.producto.nombre;
  } else if (productoVenta.nombreProducto) {
    nombreProducto = productoVenta.nombreProducto;
  } else if (productoVenta.producto && productoVenta.producto.nombreProducto) {
    nombreProducto = productoVenta.producto.nombreProducto;
  } else if (productoVenta.Producto && productoVenta.Producto.nombre) {
    nombreProducto = productoVenta.Producto.nombre;
  }

  const productoMapeado = {
    id: productoVenta.id || productoVenta.ID || productoVenta.Id,
    productoId: productoVenta.productoId || productoVenta.idProducto || productoVenta.productoID,
    ventaId: productoVenta.ventaId || productoVenta.idVenta || productoVenta.ventaID,
    valorTotal: Number(productoVenta.valorTotal || productoVenta.precioTotal || productoVenta.total || 0),
    valorUnitario: Number(productoVenta.valorUnitario || productoVenta.precioUnitario || productoVenta.precio || 0),
    cantidad: productoVenta.cantidad || 1,
    producto: {
      nombre: nombreProducto,
      ...productoVenta.producto
    },
    venta: productoVenta.venta
  };

  console.log("✅ Producto mapeado:", productoMapeado);
  return productoMapeado;
};

// Mapeo frontend -> backend producto x venta
const mapFrontendToBackend = (productoVenta) => ({
  productoId: productoVenta.productoId,
  ventaId: productoVenta.ventaId,
  valorTotal: productoVenta.valorTotal,
  valorUnitario: productoVenta.valorUnitario,
  cantidad: productoVenta.cantidad
});

// Obtener productos x venta por venta ID - VERSIÓN DEBUG
export const getProductosByVentaId = async (ventaId) => {
  try {
    console.log(`🔍 Fetching productos for ventaId: ${ventaId}`);
    console.log(`🌐 URL: ${PRODUCTO_VENTA_URL}/${ventaId}`);
    
    const response = await axios.get(`${PRODUCTO_VENTA_URL}/${ventaId}`);
    console.log("📦 Response completa:", response);
    console.log("📊 Response data:", response.data);
    console.log("📋 Tipo de data:", typeof response.data);  
    
    if (response.data && Array.isArray(response.data)) {
      console.log(`✅ Se encontraron ${response.data.length} productos`);
      const productosMapeados = response.data.map(productoVenta => {
        const mapeado = mapBackendToFrontend(productoVenta);
        console.log("🔄 Producto transformado:", mapeado);
        return mapeado;
      });
      return productosMapeados;
    } else if (response.data && typeof response.data === 'object') {
      console.log("⚠️  Data es un objeto, convirtiendo a array");
      const productoMapeado = mapBackendToFrontend(response.data);
      return [productoMapeado];
    } else {
      console.warn("❌ Response data no es array u objeto:", response.data);
      return [];
    }
  } catch (error) {
    console.error(`💥 Error al obtener productos por venta ${ventaId}:`, error);
    if (error.response) {
      console.error("📋 Error response data:", error.response.data);
      console.error("🔢 Error status:", error.response.status);
      console.error("📋 Error headers:", error.response.headers);
    }
    return [];
  }
};

// Obtener todos los productos x venta
export const getProductosVenta = async () => {
  try {
    console.log("🌐 Haciendo petición a:", PRODUCTO_VENTA_URL);
    const response = await axios.get(PRODUCTO_VENTA_URL);
    console.log("📦 Respuesta de productos:", response.data);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(productoVenta => mapBackendToFrontend(productoVenta));
    }
    return [];
  } catch (error) {
    console.error("❌ Error al obtener productos x venta:", error);
    if (error.response) {
      console.error("📋 Respuesta del error:", error.response.data);
    }
    return [];
  }
};

// Obtener un producto x venta por ID
export const getProductoVentaById = async (id) => {
  try {
    const response = await axios.get(`${PRODUCTO_VENTA_URL}/${id}`);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`❌ Error al obtener producto x venta con id ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo producto x venta
export const createProductoVenta = async (productoVentaData) => {
  try {
    const payload = mapFrontendToBackend(productoVentaData);
    const response = await axios.post(PRODUCTO_VENTA_URL, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error("❌ Error al crear producto x venta:", error);
    throw error;
  }
};

// Actualizar un producto x venta
export const updateProductoVenta = async (id, productoVentaData) => {
  try {
    const payload = mapFrontendToBackend(productoVentaData);
    const response = await axios.put(`${PRODUCTO_VENTA_URL}/${id}`, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`❌ Error al actualizar producto x venta con id ${id}:`, error);
    throw error;
  }
};

// Eliminar un producto x venta
export const deleteProductoVenta = async (id) => {
  try {
    await axios.delete(`${PRODUCTO_VENTA_URL}/${id}`);
  } catch (error) {
    console.error(`❌ Error al eliminar producto x venta con id ${id}:`, error);
    throw error;
  }
};

// Obtener productos x venta por producto ID
export const getVentasByProductoId = async (productoId) => {
  try {
    const response = await axios.get(`${PRODUCTO_VENTA_URL}/${productoId}`);
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(productoVenta => mapBackendToFrontend(productoVenta));
    }
    return [];
  } catch (error) {
    console.error(`❌ Error al obtener ventas por producto ${productoId}:`, error);
    return [];
  }
};

// Agregar producto a una venta
export const addProductoToVenta = async (ventaId, productoData) => {
  try {
    const payload = {
      ventaId: ventaId,
      productoId: productoData.productoId,
      valorTotal: productoData.valorTotal,
      valorUnitario: productoData.valorUnitario,
      cantidad: productoData.cantidad || 1
    };
    const response = await axios.post(PRODUCTO_VENTA_URL, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`❌ Error al agregar producto a venta ${ventaId}:`, error);
    throw error;
  }
};