import axios from "axios";

const API_BASE_URL = "https://cyber360-api.onrender.com/api";
const SERVICIO_VENTA_URL = `${API_BASE_URL}/servicioxventums`;

// Mapeo backend -> frontend servicio x venta (DEBUG VERSION)
const mapBackendToFrontend = (servicioVenta) => {
  console.log("📋 ServicioVenta CRUDO desde API:", servicioVenta);
  
  // Debug: Mostrar todas las propiedades disponibles
  if (servicioVenta) {
    console.log("🔍 Propiedades disponibles:", Object.keys(servicioVenta));
  }

  // Buscar el nombre del servicio en diferentes posibles ubicaciones
  let nombreServicio = 'Servicio';
  if (servicioVenta.servicio && servicioVenta.servicio.nombre) {
    nombreServicio = servicioVenta.servicio.nombre;
  } else if (servicioVenta.nombreServicio) {
    nombreServicio = servicioVenta.nombreServicio;
  } else if (servicioVenta.servicio && servicioVenta.servicio.nombreServicio) {
    nombreServicio = servicioVenta.servicio.nombreServicio;
  } else if (servicioVenta.Servicio && servicioVenta.Servicio.nombre) {
    nombreServicio = servicioVenta.Servicio.nombre;
  }

  // Buscar detalles en diferentes posibles ubicaciones
  let detalles = '';
  if (servicioVenta.detalles) {
    detalles = servicioVenta.detalles;
  } else if (servicioVenta.descripcion) {
    detalles = servicioVenta.descripcion;
  } else if (servicioVenta.detalle) {
    detalles = servicioVenta.detalle;
  }

  // Buscar valorTotal en diferentes posibles ubicaciones
  let valorTotal = 0;
  if (servicioVenta.valorTotal !== undefined) {
    valorTotal = servicioVenta.valorTotal;
  } else if (servicioVenta.precioTotal !== undefined) {
    valorTotal = servicioVenta.precioTotal;
  } else if (servicioVenta.monto !== undefined) {
    valorTotal = servicioVenta.monto;
  } else if (servicioVenta.total !== undefined) {
    valorTotal = servicioVenta.total;
  }

  // Buscar valorUnitario en diferentes posibles ubicaciones
  let valorUnitario = 0;
  if (servicioVenta.valorUnitario !== undefined) {
    valorUnitario = servicioVenta.valorUnitario;
  } else if (servicioVenta.precioUnitario !== undefined) {
    valorUnitario = servicioVenta.precioUnitario;
  } else if (servicioVenta.precio !== undefined) {
    valorUnitario = servicioVenta.precio;
  }

  const servicioMapeado = {
    id: servicioVenta.id || servicioVenta.ID || servicioVenta.Id,
    servicioId: servicioVenta.servicioId || servicioVenta.idServicio || servicioVenta.servicioID,
    ventaId: servicioVenta.ventaId || servicioVenta.idVenta || servicioVenta.ventaID,
    detalles: detalles,
    valorTotal: Number(valorTotal),
    valorUnitario: Number(valorUnitario),
    cantidad: servicioVenta.cantidad || 1,
    servicio: {
      nombre: nombreServicio,
      ...servicioVenta.servicio
    },
    venta: servicioVenta.venta
  };

  console.log("✅ Servicio mapeado:", servicioMapeado);
  return servicioMapeado;
};

// Mapeo frontend -> backend servicio x venta
const mapFrontendToBackend = (servicioVenta) => ({
  servicioId: servicioVenta.servicioId,
  ventaId: servicioVenta.ventaId,
  detalles: servicioVenta.detalles,
  valorTotal: servicioVenta.valorTotal,
  valorUnitario: servicioVenta.valorUnitario,
  cantidad: servicioVenta.cantidad
});

// Obtener servicios x venta por venta ID - VERSIÓN SIMPLIFICADA
export const getServiciosByVentaId = async (ventaId) => {
  try {
    console.log(`🔍 Fetching servicios for ventaId: ${ventaId}`);
    console.log(`🌐 URL: ${SERVICIO_VENTA_URL}?ventaId=${ventaId}`);
    
    // Usar query parameter para filtrar por ventaId específico
    const response = await axios.get(`${SERVICIO_VENTA_URL}?ventaId=${ventaId}`);
    console.log("📦 Response completa:", response);
    console.log("📊 Response data:", response.data);
    console.log("📋 Tipo de data:", typeof response.data);
    
    if (response.data && Array.isArray(response.data)) {
      // Filtrar solo los servicios que pertenecen a esta venta específica
      const serviciosDeEstaVenta = response.data.filter(servicio => 
        servicio.ventaId === ventaId || servicio.idVenta === ventaId || servicio.ventaID === ventaId
      );
      
      console.log(`✅ Se encontraron ${serviciosDeEstaVenta.length} servicios para venta ${ventaId}`);
      
      const serviciosMapeados = serviciosDeEstaVenta.map(servicioVenta => {
        const mapeado = mapBackendToFrontend(servicioVenta);
        console.log("🔄 Servicio transformado:", mapeado);
        return mapeado;
      });
      
      return serviciosMapeados;
    } else if (response.data && typeof response.data === 'object') {
      // Verificar si el objeto individual pertenece a esta venta
      const servicio = response.data;
      if (servicio.ventaId === ventaId || servicio.idVenta === ventaId || servicio.ventaID === ventaId) {
        console.log("⚠️  Data es un objeto, convirtiendo a array");
        const servicioMapeado = mapBackendToFrontend(servicio);
        return [servicioMapeado];
      } else {
        console.warn("❌ El objeto no pertenece a esta venta");
        return [];
      }
    } else {
      console.warn("❌ Response data no es array u objeto:", response.data);
      return [];
    }
  } catch (error) {
    console.error(`💥 Error al obtener servicios por venta ${ventaId}:`, error);
    if (error.response) {
      console.error("📋 Error response data:", error.response.data);
      console.error("🔢 Error status:", error.response.status);
      console.error("📋 Error headers:", error.response.headers);
    }
    return [];
  }
};


// Obtener todos los servicios x venta
export const getServiciosVenta = async () => {
  try {
    console.log("🌐 Haciendo petición a:", SERVICIO_VENTA_URL);
    const response = await axios.get(SERVICIO_VENTA_URL);
    console.log("📦 Respuesta de servicios:", response.data);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(servicioVenta => mapBackendToFrontend(servicioVenta));
    }
    return [];
  } catch (error) {
    console.error("❌ Error al obtener servicios x venta:", error);
    if (error.response) {
      console.error("📋 Respuesta del error:", error.response.data);
    }
    return [];
  }
};

// Obtener un servicio x venta por ID
export const getServicioVentaById = async (id) => {
  try {
    const response = await axios.get(`${SERVICIO_VENTA_URL}/${id}`);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`❌ Error al obtener servicio x venta con id ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo servicio x venta
export const createServicioVenta = async (servicioVentaData) => {
  try {
    const payload = mapFrontendToBackend(servicioVentaData);
    const response = await axios.post(SERVICIO_VENTA_URL, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error("❌ Error al crear servicio x venta:", error);
    throw error;
  }
};

// Actualizar un servicio x venta
export const updateServicioVenta = async (id, servicioVentaData) => {
  try {
    const payload = mapFrontendToBackend(servicioVentaData);
    const response = await axios.put(`${SERVICIO_VENTA_URL}/${id}`, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`❌ Error al actualizar servicio x venta con id ${id}:`, error);
    throw error;
  }
};

// Eliminar un servicio x venta
export const deleteServicioVenta = async (id) => {
  try {
    await axios.delete(`${SERVICIO_VENTA_URL}/${id}`);
  } catch (error) {
    console.error(`❌ Error al eliminar servicio x venta con id ${id}:`, error);
    throw error;
  }
};

// Obtener servicios x venta por servicio ID
export const getVentasByServicioId = async (servicioId) => {
  try {
    const response = await axios.get(`${SERVICIO_VENTA_URL}/${servicioId}`);
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(servicioVenta => mapBackendToFrontend(servicioVenta));
    }
    return [];
  } catch (error) {
    console.error(`❌ Error al obtener ventas por servicio ${servicioId}:`, error);
    return [];
  }
};

// Agregar servicio a una venta
// Agregar servicio a una venta - VERSIÓN CORREGIDA
export const addServicioToVenta = async (ventaId, servicioData) => {
  try {
    // Enviar los datos directamente, sin la propiedad "servicioxventum"
    const payload = {
      ventaId: ventaId,
      servicioId: servicioData.servicioId,
      detalles: servicioData.detalles,
      valorTotal: servicioData.valorTotal,
      valorUnitario: servicioData.valorUnitario,
      cantidad: servicioData.cantidad || 1
    };
    
    console.log("📤 Enviando payload:", payload);
    
    const response = await axios.post(SERVICIO_VENTA_URL, payload);
    return mapBackendToFrontend(response.data);
  } catch (error) {
    console.error(`❌ Error al agregar servicio a venta ${ventaId}:`, error);
    if (error.response) {
      console.error("📋 Detalles del error:", error.response.data);
    }
    throw error;
  }
};