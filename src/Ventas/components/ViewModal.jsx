import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faSpinner, 
  faBox, 
  faTools, 
  faBug, 
  faUser, 
  faCalendar,
  faRedo,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { getVentaById } from '../services/ventas';
import { getProductosByVentaId } from '../services/productoxventa';
import { getServiciosByVentaId } from '../services/servicioxventums';

const ViewModal = ({ ventaId, onClose }) => {
  const [venta, setVenta] = useState(null);
  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    if (ventaId) {
      fetchVentaData();
    }
  }, [ventaId]);

  const fetchVentaData = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo(`Iniciando carga para ventaId: ${ventaId}`);
    
    try {
      console.log(`📦 Cargando datos para ventaId: ${ventaId}`);
      
      // Obtener datos de la venta
      const ventaData = await getVentaById(ventaId);
      setVenta(ventaData);
      setDebugInfo(prev => prev + '\n✅ Venta cargada correctamente');
      console.log("✅ Datos de venta:", ventaData);

      // Obtener productos y servicios en paralelo para mejor rendimiento
      await Promise.allSettled([
        fetchProductos(ventaId),
        fetchServicios(ventaId)
      ]);

    } catch (err) {
      console.error("💥 Error general al cargar venta:", err);
      setError("Error al cargar los detalles de la venta. Por favor, intente nuevamente.");
      setDebugInfo(prev => prev + '\n💥 Error general en la carga');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductos = async (ventaId) => {
    try {
      const productosData = await getProductosByVentaId(ventaId);
      console.log("📊 Productos obtenidos:", productosData);
      setProductos(Array.isArray(productosData) ? productosData : []);
      setDebugInfo(prev => prev + `\n✅ Productos: ${productosData?.length || 0} encontrados`);
    } catch (productosError) {
      console.error("❌ Error al obtener productos:", productosError);
      setProductos([]);
      setDebugInfo(prev => prev + '\n❌ Error al cargar productos');
    }
  };

  const fetchServicios = async (ventaId) => {
    try {
      setDebugInfo(prev => prev + '\n🔄 Solicitando servicios...');
      const serviciosData = await getServiciosByVentaId(ventaId);
      console.log("🛠️ Servicios obtenidos:", serviciosData);
      
      if (serviciosData && Array.isArray(serviciosData)) {
        setServicios(serviciosData);
        setDebugInfo(prev => prev + `\n✅ Servicios: ${serviciosData.length} encontrados`);
        console.log("🔍 Servicios para renderizar:", serviciosData);
        
        // Debug detallado de cada servicio
        serviciosData.forEach((servicio, index) => {
          console.log(`🔍 Servicio ${index}:`, servicio);
          console.log(`   - Nombre: ${servicio.servicio?.nombre}`);
          console.log(`   - ValorTotal: ${servicio.valorTotal}`);
          console.log(`   - Detalles: ${servicio.detalles}`);
        });
      } else {
        console.warn("⚠️ Servicios data no es un array:", serviciosData);
        setServicios([]);
        setDebugInfo(prev => prev + '\n⚠️ Servicios: data no es array');
      }
    } catch (serviciosError) {
      console.error("❌ Error al obtener servicios:", serviciosError);
      setServicios([]);
      setDebugInfo(prev => prev + '\n❌ Error al cargar servicios');
    }
  };

  // Calcular totales
  const calcularSubtotalProductos = () => {
    return productos.reduce((total, producto) => total + (producto.valorTotal || 0), 0);
  };

  const calcularSubtotalServicios = () => {
    return servicios.reduce((total, servicio) => total + (servicio.valorTotal || 0), 0);
  };

  const calcularTotal = () => {
    return calcularSubtotalProductos() + calcularSubtotalServicios();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  if (!ventaId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content view-modal" onClick={e => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>
            <FontAwesomeIcon icon={faBox} className="header-icon" />
            Detalles de Venta #{ventaId}
          </h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="view-modal-body">
          
          {/* Debug Info (solo en desarrollo) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="debug-info">
              <h4>
                <FontAwesomeIcon icon={faBug} /> Debug Info
              </h4>
              
            </div>
          )}

          {loading && (
            <div className="loading-container">
              <FontAwesomeIcon icon={faSpinner} spin /> 
              Cargando detalles de venta...
            </div>
          )}
          
          {error && (
            <div className="error-container">
              <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
              <p className="error-text">{error}</p>
              <button className="retry-button" onClick={fetchVentaData}>
                <FontAwesomeIcon icon={faRedo} /> Reintentar
              </button>
            </div>
          )}
          
          {!loading && !error && venta && (
            <>
              <div className="venta-info-card">
                <h3>Información de la Venta</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">
                      <FontAwesomeIcon icon={faBox} /> ID Venta:
                    </span>
                    <span className="info-value">{venta.id}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <FontAwesomeIcon icon={faUser} /> Cliente:
                    </span>
                    <span className="info-value">{venta.cliente?.nombre || venta.nombre || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <FontAwesomeIcon icon={faCalendar} /> Fecha:
                    </span>
                    <span className="info-value">
                      {formatDate(venta.fecha)}
                    </span>
                  </div>
                  {venta.estado && (
                    <div className="info-item">
                      <span className="info-label">Estado:</span>
                      <span className={`info-value status-${venta.estado.toLowerCase()}`}>
                        {venta.estado}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="section-divider"></div>

              {/* Productos */}
              <div className="section-header">
                <FontAwesomeIcon icon={faBox} />
                <h3>Productos ({productos.length})</h3>
              </div>
              
              {productos.length > 0 ? (
                <div className="table-responsive">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((producto, index) => (
                        <tr key={`prod-${producto.id || index}`}>
                          <td className="product-name">
                            {producto.producto?.nombre || 'Producto ' + (index + 1)}
                            {producto.producto?.codigo && (
                              <div className="product-code">Código: {producto.producto.codigo}</div>
                            )}
                          </td>
                          <td className="text-center">{producto.cantidad || 1}</td>
                          <td className="text-right">{formatCurrency(producto.valorUnitario || 0)}</td>
                          <td className="text-right">{formatCurrency(producto.valorTotal || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-items-message">No hay productos en esta venta</p>
              )}

              <div className="section-divider"></div>

              {/* Servicios */}
              <div className="section-header">
                <FontAwesomeIcon icon={faTools} />
                <h3>Servicios ({servicios.length})</h3>
              </div>
              
              {servicios.length > 0 ? (
                <div className="table-responsive">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Servicio</th>
                        <th>Detalles</th>
                        <th>Valor Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicios.map((servicio, index) => (
                        <tr key={`serv-${servicio.id || index}`}>
                          <td className="service-name">
                            {servicio.servicio?.nombre || 'Servicio ' + (index + 1)}
                          </td>
                          <td>{servicio.detalles || 'Sin detalles'}</td>
                          <td className="text-right">{formatCurrency(servicio.valorTotal || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-items-message">No hay servicios en esta venta</p>
              )}

              <div className="section-divider"></div>

              {/* Totales */}
              <div className="totals-card">
                <h3>Resumen de Totales</h3>
                {productos.length > 0 && (
                  <div className="total-row">
                    <span>Subtotal Productos:</span>
                    <span>{formatCurrency(calcularSubtotalProductos())}</span>
                  </div>
                )}
                
                {servicios.length > 0 && (
                  <div className="total-row">
                    <span>Subtotal Servicios:</span>
                    <span>{formatCurrency(calcularSubtotalServicios())}</span>
                  </div>
                )}
                
                <div className="total-row grand-total">
                  <span>
                    <strong>Total Venta:</strong>
                  </span>
                  <span>
                    <strong>{formatCurrency(calcularTotal())}</strong>
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;