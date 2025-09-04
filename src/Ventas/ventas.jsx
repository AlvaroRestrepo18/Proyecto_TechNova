import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faEye, faFilePdf, faTrash } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from 'jspdf';
import './Ventas.css';

const Ventas = () => {
  // Estados principales
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("activas");
  const [modalVenta, setModalVenta] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Referencia y estado para manejar el scroll
  const modalContentRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Datos de ejemplo de ventas
  const [ventasData, setVentasData] = useState([
    { 
      id: '120-45-67', 
      nombre: 'Alejo', 
      fecha: '08/04/2025', 
      metodo: 'Efectivo', 
      estado: 'Activo',
      productos: [
        { id: 1, nombre: 'Mouse Gamer', cantidad: 1, precio: 50 }
      ],
      servicios: [],
      equipos: [],
      subtotal: 50,
      total: 50
    },
    { 
      id: '234-56-78', 
      nombre: 'Samuel', 
      fecha: '09/04/2025', 
      metodo: 'Efectivo', 
      estado: 'Inactivo',
      productos: [
        { id: 2, nombre: 'Teclado Mecánico', cantidad: 1, precio: 120 }
      ],
      servicios: [],
      equipos: [],
      subtotal: 120,
      total: 120
    },
    { 
      id: '345-67-89', 
      nombre: 'Camilo', 
      fecha: '10/04/2025', 
      metodo: 'Efectivo', 
      estado: 'Activo',
      productos: [],
      servicios: [
        { id: 1, nombre: 'Mantenimiento PC', precio: 30 }
      ],
      equipos: [],
      subtotal: 30,
      total: 30
    }
  ]);

  // Datos disponibles para ventas
  const productosDisponibles = [
    { id: 1, nombre: 'Mouse Gamer', precio: 50 },
    { id: 2, nombre: 'Teclado Mecánico', precio: 120 },
    { id: 3, nombre: 'Monitor 24"', precio: 200 },
    { id: 4, nombre: 'Auriculares', precio: 80 },
    { id: 5, nombre: 'Mousepad', precio: 15 }
  ];

  const serviciosDisponibles = [
    { id: 1, nombre: 'Mantenimiento PC', precio: 30 },
    { id: 2, nombre: 'Instalación Software', precio: 20 },
    { id: 3, nombre: 'Limpieza Interna', precio: 25 },
    { id: 4, nombre: 'Actualización Sistema', precio: 40 },
    { id: 5, nombre: 'Recuperación Datos', precio: 50 }
  ];

  const equiposDisponibles = [
    { id: 1, nombre: 'PC Gamer', precioHora: 5 },
    { id: 2, nombre: 'Consola PS5', precioHora: 4 },
    { id: 3, nombre: 'Consola Xbox', precioHora: 4 },
    { id: 4, nombre: 'PC Básica', precioHora: 3 },
    { id: 5, nombre: 'Sala VR', precioHora: 8 }
  ];

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    fechaVenta: new Date().toISOString().split('T')[0],
    metodoPago: 'Efectivo',
    estado: 'Activo',
    productos: [{ id: Date.now(), productoId: '', cantidad: 1, precio: 0 }],
    servicios: [{ id: Date.now(), servicioId: '', precio: 0 }],
    equipos: [{ id: Date.now(), equipoId: '', horas: 1, precioHora: 0 }],
    subtotal: 0,
    total: 0
  });

  // Filtros de ventas
  const filteredActivas = ventasData.filter(venta => 
    (venta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
    venta.estado === 'Activo'
  ));

  const filteredInactivas = ventasData.filter(venta => 
    (venta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    venta.estado === 'Inactivo'
  );

  // Función para guardar posición del scroll antes de actualizar
  const handleBeforeChange = () => {
    if (modalContentRef.current) {
      setScrollPosition(modalContentRef.current.scrollTop);
    }
  };

  // Restaurar posición del scroll después de actualizar
  useEffect(() => {
    if (modalContentRef.current && scrollPosition > 0) {
      modalContentRef.current.scrollTop = scrollPosition;
    }
  }, [formData.productos, formData.servicios, formData.equipos, scrollPosition]);

  // Validaciones
  const validateForm = () => {
    const newErrors = {};
    
    // Validar nombre del cliente
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del cliente es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    
    // Validar fecha
    if (!formData.fechaVenta) {
      newErrors.fechaVenta = 'La fecha de venta es requerida';
    } else {
      const fechaVenta = new Date(formData.fechaVenta);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaVenta > hoy) {
        newErrors.fechaVenta = 'La fecha no puede ser futura';
      }
    }
    
    // Validar items
    const hasValidItems = formData.productos.some(p => p.productoId) || 
                         formData.servicios.some(s => s.servicioId) || 
                         formData.equipos.some(e => e.equipoId);
    
    if (!hasValidItems) {
      newErrors.items = 'Debe agregar al menos un producto, servicio o equipo';
    }
    
    // Validar cantidades
    formData.productos.forEach((prod, index) => {
      if (prod.productoId && (!prod.cantidad || prod.cantidad < 1)) {
        newErrors[`productos-cantidad-${index}`] = 'La cantidad debe ser al menos 1';
      }
    });

    formData.equipos.forEach((equipo, index) => {
      if (equipo.equipoId && (!equipo.horas || equipo.horas < 1)) {
        newErrors[`equipos-horas-${index}`] = 'Las horas deben ser al menos 1';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const toggleEstado = (id) => {
    setVentasData(ventasData.map(venta => 
      venta.id === id && venta.estado === 'Activo'
        ? { ...venta, estado: 'Inactivo' }
        : venta
    ));
  };

  const openForm = () => {
    setIsFormOpen(true);
    setErrors({});
    setFormData({
      nombre: '',
      fechaVenta: new Date().toISOString().split('T')[0],
      metodoPago: 'Efectivo',
      estado: 'Activo',
      productos: [{ id: Date.now(), productoId: '', cantidad: 1, precio: 0 }],
      servicios: [{ id: Date.now(), servicioId: '', precio: 0 }],
      equipos: [{ id: Date.now(), equipoId: '', horas: 1, precioHora: 0 }],
      subtotal: 0,
      total: 0
    });
  };

  const closeForm = () => setIsFormOpen(false);

  // Modal de visualización
  const openViewModal = (venta) => {
    setModalVenta(venta);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setModalVenta(null);
  };

  const openPdfModal = (venta) => {
    setModalVenta(venta);
    setIsPdfModalOpen(true);
  };

  const closePdfModal = () => {
    setIsPdfModalOpen(false);
    setModalVenta(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
    
    // Limpiar error cuando se corrige
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handlers para productos, servicios y equipos
  const handleProductoChange = (e, index) => {
    handleBeforeChange();
    const { name, value } = e.target;
    const nuevosProductos = [...formData.productos];
    
    if (name === 'productoId') {
      const productoSeleccionado = productosDisponibles.find(p => p.id.toString() === value);
      nuevosProductos[index] = {
        ...nuevosProductos[index],
        productoId: value,
        nombre: productoSeleccionado?.nombre || '',
        precio: productoSeleccionado?.precio || 0
      };
      
      // Limpiar error de cantidad cuando se selecciona producto
      if (errors[`productos-cantidad-${index}`]) {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[`productos-cantidad-${index}`];
          return newErrors;
        });
      }
    } else {
      nuevosProductos[index] = {
        ...nuevosProductos[index],
        [name]: name === 'cantidad' ? parseInt(value) || 0 : value
      };
      
      // Validar cantidad en tiempo real
      if (name === 'cantidad' && value < 1) {
        setErrors(prev => ({
          ...prev,
          [`productos-cantidad-${index}`]: 'La cantidad debe ser al menos 1'
        }));
      } else if (errors[`productos-cantidad-${index}`]) {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[`productos-cantidad-${index}`];
          return newErrors;
        });
      }
    }
    
    updateTotales(nuevosProductos, formData.servicios, formData.equipos);
  };

  const handleServicioChange = (e, index) => {
    handleBeforeChange();
    const { name, value } = e.target;
    const nuevosServicios = [...formData.servicios];
    
    if (name === 'servicioId') {
      const servicioSeleccionado = serviciosDisponibles.find(s => s.id.toString() === value);
      nuevosServicios[index] = {
        ...nuevosServicios[index],
        servicioId: value,
        nombre: servicioSeleccionado?.nombre || '',
        precio: servicioSeleccionado?.precio || 0
      };
    }
    
    updateTotales(formData.productos, nuevosServicios, formData.equipos);
  };

  const handleEquipoChange = (e, index) => {
    handleBeforeChange();
    const { name, value } = e.target;
    const nuevosEquipos = [...formData.equipos];
    
    if (name === 'equipoId') {
      const equipoSeleccionado = equiposDisponibles.find(e => e.id.toString() === value);
      nuevosEquipos[index] = {
        ...nuevosEquipos[index],
        equipoId: value,
        nombre: equipoSeleccionado?.nombre || '',
        precioHora: equipoSeleccionado?.precioHora || 0
      };
      
      // Limpiar error de horas cuando se selecciona equipo
      if (errors[`equipos-horas-${index}`]) {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[`equipos-horas-${index}`];
          return newErrors;
        });
      }
    } else {
      nuevosEquipos[index] = {
        ...nuevosEquipos[index],
        [name]: name === 'horas' ? parseInt(value) || 0 : value
      };
      
      // Validar horas en tiempo real
      if (name === 'horas' && value < 1) {
        setErrors(prev => ({
          ...prev,
          [`equipos-horas-${index}`]: 'Las horas deben ser al menos 1'
        }));
      } else if (errors[`equipos-horas-${index}`]) {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[`equipos-horas-${index}`];
          return newErrors;
        });
      }
    }
    
    updateTotales(formData.productos, formData.servicios, nuevosEquipos);
  };

  const updateTotales = (productos, servicios, equipos) => {
    const subtotalProductos = productos.reduce((sum, prod) => sum + (prod.precio * (prod.cantidad || 1)), 0);
    const subtotalServicios = servicios.reduce((sum, serv) => sum + serv.precio, 0);
    const subtotalEquipos = equipos.reduce((sum, eq) => sum + (eq.precioHora * (eq.horas || 1)), 0);
    
    const nuevoSubtotal = subtotalProductos + subtotalServicios + subtotalEquipos;
    
    setFormData({
      ...formData,
      productos,
      servicios,
      equipos,
      subtotal: nuevoSubtotal,
      total: nuevoSubtotal
    });
  };

  // Funciones para agregar/eliminar items
  const addItem = (tipo) => {
    handleBeforeChange();
    const newId = Date.now();
    const newItem = tipo === 'productos' 
      ? { id: newId, productoId: '', cantidad: 1, precio: 0 }
      : tipo === 'servicios'
      ? { id: newId, servicioId: '', precio: 0 }
      : { id: newId, equipoId: '', horas: 1, precioHora: 0 };
    
    setFormData({
      ...formData,
      [tipo]: [...formData[tipo], newItem]
    });
  };

  const removeItem = (tipo, index) => {
    const nuevosItems = formData[tipo].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [tipo]: nuevosItems
    });
    
    // Limpiar errores asociados al item eliminado
    setErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[`${tipo}-cantidad-${index}`];
      delete newErrors[`${tipo}-horas-${index}`];
      return newErrors;
    });
    
    updateTotales(
      tipo === 'productos' ? nuevosItems : formData.productos,
      tipo === 'servicios' ? nuevosItems : formData.servicios,
      tipo === 'equipos' ? nuevosItems : formData.equipos
    );
  };

  // Submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const nuevaVenta = {
      id: `V-${Date.now()}`,
      nombre: formData.nombre,
      fecha: formData.fechaVenta,
      metodo: formData.metodoPago,
      estado: 'Activo',
      productos: formData.productos.filter(p => p.productoId),
      servicios: formData.servicios.filter(s => s.servicioId),
      equipos: formData.equipos.filter(e => e.equipoId),
      subtotal: formData.subtotal,
      total: formData.total
    };
    
    setVentasData([...ventasData, nuevaVenta]);
    closeForm();
  };

  // Componente para el modal de visualización
  const ViewModal = ({ venta, onClose }) => {
    if (!venta) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content view-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Detalles de Venta</h2>
            <button className="close-button" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="view-modal-body" ref={modalContentRef}>
            <div className="venta-info">
              <div className="info-row">
                <span className="info-label">ID Venta:</span>
                <span className="info-value">{venta.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Cliente:</span>
                <span className="info-value">{venta.nombre}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Fecha:</span>
                <span className="info-value">{venta.fecha}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Método Pago:</span>
                <span className="info-value">{venta.metodo}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Estado:</span>
                <span className={`info-value estado-${venta.estado.toLowerCase()}`}>
                  {venta.estado}
                </span>
              </div>
            </div>

            <div className="section-divider"></div>

            <h3>Productos/Servicios</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Cantidad/Horas</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {venta.productos.map((item, index) => (
                  <tr key={`prod-${index}`}>
                    <td>Producto</td>
                    <td>{item.nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>${item.precio.toFixed(2)}</td>
                    <td>${(item.precio * item.cantidad).toFixed(2)}</td>
                  </tr>
                ))}
                {venta.servicios.map((item, index) => (
                  <tr key={`serv-${index}`}>
                    <td>Servicio</td>
                    <td>{item.nombre}</td>
                    <td>1</td>
                    <td>${item.precio.toFixed(2)}</td>
                    <td>${item.precio.toFixed(2)}</td>
                  </tr>
                ))}
                {venta.equipos && venta.equipos.map((item, index) => (
                  <tr key={`equi-${index}`}>
                    <td>Equipo</td>
                    <td>{item.nombre}</td>
                    <td>{item.horas} hora{item.horas > 1 ? 's' : ''}</td>
                    <td>${item.precioHora.toFixed(2)}/h</td>
                    <td>${(item.precioHora * item.horas).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="section-divider"></div>

            <div className="totals-section">
              <div className="total-row">
                <span>SubTotal:</span>
                <span>${venta.subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>${venta.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="close-modal-button" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente para el modal de PDF
  const PdfModal = ({ venta, onClose }) => {
    if (!venta) return null;

    const generatePDF = () => {
      const doc = new jsPDF();
      // Configuración inicial
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFont("helvetica", "bold");
      doc.text("Cyber360 - Comprobante de Venta", 105, 20, { align: "center" });
      // Información de la venta
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`ID Venta: ${venta.id}`, 20, 35);
      doc.text(`Cliente: ${venta.nombre}`, 20, 45);
      doc.text(`Fecha: ${venta.fecha}`, 20, 55);
      doc.text(`Método de Pago: ${venta.metodo}`, 20, 65);
      // Tabla de items
      doc.setFont("helvetica", "bold");
      doc.text("Descripción", 20, 80);
      doc.text("Cantidad", 80, 80);
      doc.text("Precio", 120, 80);
      doc.text("Subtotal", 160, 80);
      doc.setFont("helvetica", "normal");
      let yPosition = 90;
      // Productos
      venta.productos.forEach(item => {
        doc.text(item.nombre, 20, yPosition);
        doc.text(item.cantidad.toString(), 80, yPosition);
        doc.text(`$${item.precio.toFixed(2)}`, 120, yPosition);
        doc.text(`$${(item.precio * item.cantidad).toFixed(2)}`, 160, yPosition);
        yPosition += 10;
      });
      // Servicios
      venta.servicios.forEach(item => {
        doc.text(item.nombre, 20, yPosition);
        doc.text("1", 80, yPosition);
        doc.text(`$${item.precio.toFixed(2)}`, 120, yPosition);
        doc.text(`$${item.precio.toFixed(2)}`, 160, yPosition);
        yPosition += 10;
      });
      // Equipos
      venta.equipos && venta.equipos.forEach(item => {
        doc.text(item.nombre, 20, yPosition);
        doc.text(`${item.horas} hora${item.horas > 1 ? 's' : ''}`, 80, yPosition);
        doc.text(`$${item.precioHora.toFixed(2)}/h`, 120, yPosition);
        doc.text(`$${(item.precioHora * item.horas).toFixed(2)}`, 160, yPosition);
        yPosition += 10;
      });
      // Total
      doc.setFont("helvetica", "bold");
      doc.text("Total:", 140, yPosition + 10);
      doc.text(`$${venta.total.toFixed(2)}`, 160, yPosition + 10);
      // Guardar el PDF
      doc.save(`venta_${venta.id}.pdf`);
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content view-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Vista Previa PDF</h2>
            <button className="close-button" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="view-modal-body" ref={modalContentRef}>
            <div className="venta-info">
              <div className="info-row">
                <span className="info-label">ID Venta:</span>
                <span className="info-value">{venta.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Cliente:</span>
                <span className="info-value">{venta.nombre}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Fecha:</span>
                <span className="info-value">{venta.fecha}</span>
              </div>
            </div>

            <div className="section-divider"></div>

            <h3>Productos/Servicios</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cantidad/Horas</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {venta.productos.map((item, index) => (
                  <tr key={`prod-${index}`}>
                    <td>{item.nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>${item.precio.toFixed(2)}</td>
                    <td>${(item.precio * item.cantidad).toFixed(2)}</td>
                  </tr>
                ))}
                {venta.servicios.map((item, index) => (
                  <tr key={`serv-${index}`}>
                    <td>{item.nombre}</td>
                    <td>1</td>
                    <td>${item.precio.toFixed(2)}</td>
                    <td>${item.precio.toFixed(2)}</td>
                  </tr>
                ))}
                {venta.equipos && venta.equipos.map((item, index) => (
                  <tr key={`equi-${index}`}>
                    <td>{item.nombre}</td>
                    <td>{item.horas} hora{item.horas > 1 ? 's' : ''}</td>
                    <td>${item.precioHora.toFixed(2)}/h</td>
                    <td>${(item.precioHora * item.horas).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="section-divider"></div>

            <div className="totals-section">
              <div className="total-row">
                <span>Total:</span>
                <span>${venta.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="pdf-button"
                onClick={(e) => {
                  e.preventDefault();
                  generatePDF();
                }}
              >
                <FontAwesomeIcon icon={faFilePdf} /> Descargar PDF
              </button>
              <button className="close-modal-button" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente ItemForm
  const ItemForm = ({ tipo, items, handleChange, removeItem }) => {
    const datosDisponibles = tipo === 'productos' 
      ? productosDisponibles 
      : tipo === 'servicios' 
      ? serviciosDisponibles 
      : equiposDisponibles;
    
    const titulo = tipo === 'productos' ? 'Productos' : tipo === 'servicios' ? 'Servicios' : 'Equipos';
    const idField = tipo === 'productos' ? 'productoId' : tipo === 'servicios' ? 'servicioId' : 'equipoId';
    const precioField = tipo === 'equipos' ? 'precioHora' : 'precio';
    const cantidadField = tipo === 'productos' ? 'cantidad' : 'horas';

    return (
      <>
        <div className="section-divider"></div>
        <h3>{titulo}</h3>
        {errors.items && (
          <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>
            {errors.items}
          </div>
        )}
        <div className="products-grid">
          {items.map((item, index) => (
            <div key={item.id} className="product-item">
              <div className="form-group">
                <label>{titulo.slice(0, -1)}</label>
                <select
                  name={idField}
                  value={item[idField]}
                  onChange={(e) => handleChange(e, index)}
                  className={!item[idField] && errors.items ? 'error' : ''}
                >
                  <option value="">Seleccione...</option>
                  {datosDisponibles.map(opcion => (
                    <option key={opcion.id} value={opcion.id}>
                      {opcion.nombre} (${opcion[precioField]}{tipo === 'equipos' ? '/hora' : ''})
                    </option>
                  ))}
                </select>
              </div>
              {tipo !== 'servicios' && (
                <div className="form-group">
                  <label>{tipo === 'productos' ? 'Cantidad' : 'Horas'}</label>
                  <input
                    type="number"
                    name={cantidadField}
                    value={item[cantidadField]}
                    onChange={(e) => handleChange(e, index)}
                    min="1"
                    className={errors[`${tipo}-${cantidadField}-${index}`] ? 'error' : ''}
                  />
                  {errors[`${tipo}-${cantidadField}-${index}`] && (
                    <div className="error-message" style={{color: 'red', fontSize: '0.8rem'}}>
                      {errors[`${tipo}-${cantidadField}-${index}`]}
                    </div>
                  )}
                </div>
              )}
              <div className="form-group">
                <label>Precio{tipo === 'equipos' ? '/Hora' : ''}</label>
                <input
                  type="text"
                  value={`$${item[precioField]}`}
                  className="elegant-input"
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Subtotal</label>
                <input
                  type="text"
                  value={`$${(
                    tipo === 'productos' ? item.precio * item.cantidad :
                    tipo === 'servicios' ? item.precio :
                    item.precioHora * item.horas
                  ).toFixed(2)}`}
                  className="elegant-input"
                  disabled
                />
              </div>
              <div className="form-group">
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeItem(tipo, index)}
                  disabled={items.length <= 1}
                  title={`Eliminar ${titulo.slice(0, -1)}`}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="form-group">
          <button
            type="button"
            className="add-button"
            onClick={() => addItem(tipo)}
          >
            <FontAwesomeIcon icon={faPlus} /> Agregar {titulo.slice(0, -1)}
          </button>
        </div>
      </>
    );
  };

  // Componente TablaVentas
  const TablaVentas = ({ ventas }) => (
    <table className="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Fecha venta</th>
          <th>Método pago</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ventas.map((venta, index) => (
          <tr key={venta.id || index}>
            <td>{venta.nombre}</td>
            <td>{venta.fecha}</td>
            <td>{venta.metodo}</td>
            <td>${venta.total.toFixed(2)}</td>
            <td>
              <button
                className={`status-toggle ${venta.estado === 'Activo' ? 'active' : 'inactive'}`}
                onClick={() => toggleEstado(venta.id)}
              >
                {venta.estado}
              </button>
            </td>
            <td>
              <button className="icon-button" title="Ver" onClick={() => openViewModal(venta)}>
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button
                className="icon-button"
                title="PDF"
                onClick={() => openPdfModal(venta)}
              >
                <FontAwesomeIcon icon={faFilePdf} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="ventas-container">
      <h1>Cyber360 - Ventas</h1>
      
      <div className="section-divider"></div>
      
      {/* Pestañas */}
      <div className="items-buttons">
        <button
          className={`tab-button productos${activeTab === "activas" ? " active" : ""}`}
          onClick={() => setActiveTab("activas")}
        >
          Ventas Activas
        </button>
        <button
          className={`tab-button servicios${activeTab === "inactivas" ? " active" : ""}`}
          onClick={() => setActiveTab("inactivas")}
        >
          Ventas Inactivas
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder={activeTab === "activas" ? "Buscar ventas activas" : "Buscar ventas inactivas"}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {activeTab === "activas" && (
          <button className="create-button" onClick={openForm}>
            <FontAwesomeIcon icon={faPlus} /> Crear
          </button>
        )}
      </div>
      
      <div className="table-container">
        {activeTab === "activas" ? (
          <TablaVentas ventas={filteredActivas} />
        ) : (
          <TablaVentas ventas={filteredInactivas} />
        )}
      </div>

      {/* Modal de formulario */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Crear Venta</h2>
              <button className="close-button" onClick={closeForm}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Sección de datos básicos */}
              <div className="form-row">
                <div className="form-group" style={{width: '100%'}}>
                  <label>Nombre del Cliente <span className="required-asterisk">*</span>:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre completo del cliente"
                    className={errors.nombre ? 'error' : ''}
                  />
                  {errors.nombre && (
                    <div className="error-message">{errors.nombre}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Venta <span className="required-asterisk">*</span>:</label>
                  <input
                    type="date"
                    name="fechaVenta"
                    value={formData.fechaVenta}
                    onChange={handleChange}
                    className={errors.fechaVenta ? 'error' : ''}
                  />
                  {errors.fechaVenta && (
                    <div className="error-message">{errors.fechaVenta}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Método de Pago <span className="required-asterisk">*</span>:</label>
                  <select
                    name="metodoPago"
                    value={formData.metodoPago}
                    onChange={handleChange}
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Trombere">Trombere</option>
                  </select>
                </div>
              </div>

              {/* Secciones de items */}
              <ItemForm 
                tipo="productos" 
                items={formData.productos} 
                handleChange={handleProductoChange} 
                removeItem={removeItem} 
              />

              <ItemForm 
                tipo="servicios" 
                items={formData.servicios} 
                handleChange={handleServicioChange} 
                removeItem={removeItem} 
              />

              <ItemForm 
                tipo="equipos" 
                items={formData.equipos} 
                handleChange={handleEquipoChange} 
                removeItem={removeItem} 
              />

              {/* Totales */}
              <div className="section-divider"></div>
              <div className="totals-section">
                <div className="total-row">
                  <span>Total:</span>
                  <span>${formData.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={closeForm}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button">
                  Registrar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de visualización */}
      {isViewModalOpen && (
        <ViewModal venta={modalVenta} onClose={closeViewModal} />
      )}

      {/* Modal de PDF */}
      {isPdfModalOpen && (
        <PdfModal venta={modalVenta} onClose={closePdfModal} />
      )}
    </div>
  );
};

export default Ventas;