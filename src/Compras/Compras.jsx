import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faEye, faFilePdf, faTrash } from '@fortawesome/free-solid-svg-icons';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import './Compras.css';

const Compras = () => {
  // Estados principales
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("activas");
  const [modalCompra, setModalCompra] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Referencia para manejar el scroll
  const modalContentRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Datos de ejemplo de compras
  const [comprasData, setComprasData] = useState([
    { 
      id: 'C-120-45-67', 
      proveedor: 'Proveedor A', 
      contacto: '555-1234',
      direccion: 'Calle Principal 123',
      fecha: '2025-06-26', 
      fechaRegistro: '2025-06-25',
      metodo: 'Transferencia', 
      estado: 'Activo',
      productos: [
        { id: '1', productoId: '1', nombre: 'Wilson Camera', cantidad: 4, precio: 2500 }
      ],
      subtotal: 10000,
      total: 10000
    },
    { 
      id: 'C-234-56-78', 
      proveedor: 'Proveedor B', 
      contacto: '555-5678',
      direccion: 'Avenida Central 456',
      fecha: '2025-04-09', 
      fechaRegistro: '2025-04-08',
      metodo: 'Efectivo', 
      estado: 'Anulado',
      productos: [
        { id: '2', productoId: '2', nombre: 'Lente 50mm', cantidad: 3, precio: 1200 }
      ],
      subtotal: 3600,
      total: 3600
    }
  ]);

  // Datos disponibles para compras
  const proveedoresDisponibles = [
    { id: 1, nombre: 'Proveedor A', contacto: '555-1234', direccion: 'Calle Principal 123' },
    { id: 2, nombre: 'Proveedor B', contacto: '555-5678', direccion: 'Avenida Central 456' },
    { id: 3, nombre: 'Proveedor C', contacto: '555-9012', direccion: 'Boulevard Norte 789' }
  ];

  const productosDisponibles = [
    { id: 1, codigo: 'CAM-001', nombre: 'Wilson Camera', precio: 2500, categoria: 'Cámaras' },
    { id: 2, codigo: 'LEN-050', nombre: 'Lente 50mm', precio: 1200, categoria: 'Lentes' },
    { id: 3, codigo: 'TRI-PRO', nombre: 'Trípode Profesional', precio: 800, categoria: 'Accesorios' },
    { id: 4, codigo: 'FLS-EXT', nombre: 'Flash Externo', precio: 600, categoria: 'Iluminación' }
  ];

  // Estado del formulario
  const [formData, setFormData] = useState({
    proveedor: '',
    contacto: '',
    direccion: '',
    fechaCompra: new Date().toISOString().split('T')[0],
    fechaRegistro: new Date().toISOString().split('T')[0],
    metodoPago: 'Transferencia',
    estado: 'Activo',
    productos: [{ id: Date.now().toString(), productoId: '', cantidad: 1, precio: 0 }],
    subtotal: 0,
    total: 0
  });

  // Filtros de compras
  const filteredActivas = comprasData.filter(compra => 
    compra.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) &&
    compra.estado === 'Activo'
  );

  const filteredAnuladas = comprasData.filter(compra => 
    compra.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) &&
    compra.estado === 'Anulado'
  );

  // Función para guardar posición del scroll
  const handleBeforeChange = () => {
    if (modalContentRef.current) {
      setScrollPosition(modalContentRef.current.scrollTop);
    }
  };

  // Restaurar posición del scroll
  useEffect(() => {
    if (modalContentRef.current && scrollPosition > 0) {
      modalContentRef.current.scrollTop = scrollPosition;
    }
  }, [formData.productos, scrollPosition]);

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.proveedor) errors.proveedor = 'Seleccione un proveedor';
    if (!formData.fechaCompra) errors.fechaCompra = 'Ingrese una fecha válida';
    if (!formData.metodoPago) errors.metodoPago = 'Seleccione un método de pago';
    
    formData.productos.forEach((prod, index) => {
      if (!prod.productoId) errors[`producto-${index}`] = 'Seleccione un producto';
      if (!prod.cantidad || prod.cantidad < 1) errors[`cantidad-${index}`] = 'Cantidad inválida';
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const toggleEstado = (id) => {
    setComprasData(comprasData.map(compra => 
      compra.id === id 
        ? { ...compra, estado: compra.estado === 'Activo' ? 'Anulado' : 'Activo' }
        : compra
    ));
  };

  const openForm = () => {
    setIsFormOpen(true);
    setFormData({
      proveedor: '',
      contacto: '',
      direccion: '',
      fechaCompra: new Date().toISOString().split('T')[0],
      fechaRegistro: new Date().toISOString().split('T')[0],
      metodoPago: 'Transferencia',
      estado: 'Activo',
      productos: [{ id: Date.now().toString(), productoId: '', cantidad: 1, precio: 0 }],
      subtotal: 0,
      total: 0
    });
    setFormErrors({});
  };

  const closeForm = () => setIsFormOpen(false);

  // Modal de visualización
  const openViewModal = (compra) => {
    setModalCompra(compra);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setModalCompra(null);
  };

  const openPdfModal = (compra) => {
    setModalCompra(compra);
    setIsPdfModalOpen(true);
  };

  const closePdfModal = () => {
    setIsPdfModalOpen(false);
    setModalCompra(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'proveedor') {
      const proveedorSeleccionado = proveedoresDisponibles.find(p => p.nombre === value);
      setFormData({
        ...formData, 
        [name]: value,
        contacto: proveedorSeleccionado?.contacto || '',
        direccion: proveedorSeleccionado?.direccion || ''
      });
    } else {
      setFormData({...formData, [name]: value});
    }
  };

  // Handler para productos
  const handleProductoChange = (e, index) => {
    handleBeforeChange();
    const { name, value } = e.target;
    const nuevosProductos = [...formData.productos];
    
    if (name === 'productoId') {
      const productoSeleccionado = productosDisponibles.find(p => p.id.toString() === value);
      nuevosProductos[index] = {
        ...nuevosProductos[index],
        productoId: value,
        precio: productoSeleccionado?.precio || 0
      };
    } else {
      nuevosProductos[index] = {
        ...nuevosProductos[index],
        [name]: name === 'cantidad' ? parseInt(value) || 1 : value
      };
    }
    
    updateTotales(nuevosProductos);
  };

  const updateTotales = (productos) => {
    const nuevoSubtotal = productos.reduce((sum, prod) => sum + (prod.precio * (prod.cantidad || 1)), 0);
    
    setFormData({
      ...formData,
      productos,
      subtotal: nuevoSubtotal,
      total: nuevoSubtotal
    });
  };

  const generarPdfCompra = (compra) => {
    const input = document.getElementById("pdf-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Compra_${compra.id}.pdf`);
    });
  };

  // Funciones para agregar/eliminar productos
  const addProducto = () => {
    handleBeforeChange();
    const newId = Date.now().toString();
    
    setFormData({
      ...formData,
      productos: [...formData.productos, { id: newId, productoId: '', cantidad: 1, precio: 0 }]
    });
  };

  const removeProducto = (index) => {
    const nuevosProductos = formData.productos.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      productos: nuevosProductos
    });
    updateTotales(nuevosProductos);
  };

  // Submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const productosValidos = formData.productos.filter(p => p.productoId);
    
    const nuevaCompra = {
      id: `C-${Date.now()}`,
      proveedor: formData.proveedor,
      contacto: formData.contacto,
      direccion: formData.direccion,
      fecha: formData.fechaCompra,
      fechaRegistro: formData.fechaRegistro,
      metodo: formData.metodoPago,
      estado: 'Activo',
      productos: productosValidos.map(p => {
        const productoSeleccionado = productosDisponibles.find(prod => prod.id.toString() === p.productoId);
        return {
          id: p.productoId,
          nombre: productoSeleccionado.nombre,
          cantidad: p.cantidad,
          precio: p.precio
        };
      }),
      subtotal: formData.subtotal,
      total: formData.total
    };
    
    setComprasData([...comprasData, nuevaCompra]);
    closeForm();
  };

  // Componente para el modal de visualización
  const ViewModal = ({ compra, onClose }) => {
    if (!compra) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Detalles de Compra</h2>
            <button className="close-button" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="user-details-container" ref={modalContentRef}>
            <div className="user-details-row">
              <span className="detail-label">Proveedor:</span>
              <span className="detail-value">{compra.proveedor}</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Contacto:</span>
              <span className="detail-value">{compra.contacto}</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Dirección:</span>
              <span className="detail-value">{compra.direccion}</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Fecha de Compra:</span>
              <span className="detail-value">{new Date(compra.fecha).toLocaleDateString()}</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Fecha de Registro:</span>
              <span className="detail-value">{new Date(compra.fechaRegistro).toLocaleDateString()}</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Método de Pago:</span>
              <span className="detail-value">{compra.metodo}</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Estado:</span>
              <span className={`detail-value ${compra.estado === 'Activo' ? 'status-active' : 'status-inactive'}`}>
                {compra.estado}
              </span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Productos:</span>
              <div className="detail-value">
                {compra.productos.map((item, index) => (
                  <div key={index} style={{marginBottom: '10px', padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '4px'}}>
                    <div><strong>Producto:</strong> {item.nombre}</div>
                    <div><strong>Cantidad:</strong> {item.cantidad}</div>
                    <div><strong>Precio Unitario:</strong> ${item.precio.toFixed(2)}</div>
                    <div><strong>Subtotal:</strong> ${(item.precio * item.cantidad).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">SubTotal:</span>
              <span className="detail-value">${compra.subtotal.toFixed(2)}</span>
            </div>
            
            <div className="user-details-row">
              <span className="detail-label">Total:</span>
              <span className="detail-value" style={{fontWeight: 'bold', fontSize: '1.1em'}}>${compra.total.toFixed(2)}</span>
            </div>
            
            <div className="form-actions">
              <button type="button" className="close-details-button" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente para el modal de PDF
  const PdfModal = ({ compra, onClose }) => {
    if (!compra) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Vista Previa PDF</h2>
            <button className="close-button" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="user-details-container" ref={modalContentRef} id="pdf-content">
            <div style={{padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white'}}>
              <h2 style={{textAlign: 'center', color: '#1e3c72', marginBottom: '20px'}}>COMPROBANTE DE COMPRA</h2>
              
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                <div>
                  <strong>Número de Compra:</strong> {compra.id}
                </div>
                <div>
                  <strong>Fecha:</strong> {new Date(compra.fecha).toLocaleDateString()}
                </div>
              </div>
              
              <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px'}}>
                <h3 style={{marginBottom: '10px', color: '#1e3c72'}}>Información del Proveedor</h3>
                <div><strong>Proveedor:</strong> {compra.proveedor}</div>
                <div><strong>Contacto:</strong> {compra.contacto}</div>
                <div><strong>Dirección:</strong> {compra.direccion}</div>
                <div><strong>Método de Pago:</strong> {compra.metodo}</div>
              </div>
              
              <h3 style={{marginBottom: '10px', color: '#1e3c72'}}>Productos</h3>
              <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '20px'}}>
                <thead>
                  <tr style={{backgroundColor: '#f8f9fa'}}>
                    <th style={{padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd'}}>Producto</th>
                    <th style={{padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd'}}>Cantidad</th>
                    <th style={{padding: '10px', textAlign: 'right', borderBottom: '2px solid #ddd'}}>Precio Unitario</th>
                    <th style={{padding: '10px', textAlign: 'right', borderBottom: '2px solid #ddd'}}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {compra.productos.map((item, index) => (
                    <tr key={index}>
                      <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>{item.nombre}</td>
                      <td style={{padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee'}}>{item.cantidad}</td>
                      <td style={{padding: '10px', textAlign: 'right', borderBottom: '1px solid #eee'}}>${item.precio.toFixed(2)}</td>
                      <td style={{padding: '10px', textAlign: 'right', borderBottom: '1px solid #eee'}}>${(item.precio * item.cantidad).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div style={{textAlign: 'right', padding: '10px', borderTop: '2px solid #ddd', marginTop: '10px'}}>
                <div style={{marginBottom: '5px'}}><strong>SubTotal:</strong> ${compra.subtotal.toFixed(2)}</div>
                <div style={{fontSize: '1.2em', fontWeight: 'bold'}}><strong>Total:</strong> ${compra.total.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                className="primary-button"
                onClick={(e) => {
                  e.preventDefault();
                  generarPdfCompra(compra);
                }}
                style={{backgroundColor: '#e74c3c'}}
              >
                <FontAwesomeIcon icon={faFilePdf} /> Descargar PDF
              </button>
              <button type="button" className="close-details-button" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente para la tabla de compras
  const TablaCompras = ({ compras }) => (
    <table className="table">
      <thead>
        <tr>
          <th>Proveedor</th>
          <th>Fecha compra</th>
          <th>Fecha registro</th>
          <th>Método pago</th>
          <th>Total</th>
          <th>Estado</th>
          <th className='Action'>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {compras.map((compra, index) => (
          <tr key={index}>
            <td>{compra.proveedor}</td>
            <td>{new Date(compra.fecha).toLocaleDateString()}</td>
            <td>{new Date(compra.fechaRegistro).toLocaleDateString()}</td>
            <td>{compra.metodo}</td>
            <td>${compra.total.toFixed(2)}</td>
            <td>
              <button 
                className={`status-toggle ${compra.estado === 'Activo' ? 'active' : 'inactive'}`}
                onClick={() => toggleEstado(compra.id)}
              >
                {compra.estado}
              </button>
            </td>
            <td className='Action'>
              <button className="icon-button" title="Ver" onClick={() => openViewModal(compra)}>
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button 
                className="icon-button" 
                title="PDF" 
                onClick={() => openPdfModal(compra)}
                style={{color: '#e74c3c'}}
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
    <div>
      <h1>Cyber360 - Compras</h1>
      
      <div className="section-divider"></div>
      
      {/* Pestañas */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "activas" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("activas")}
        >
          Compras Activas
        </button>
        <button
          className={`tab-button ${activeTab === "anuladas" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("anuladas")}
        >
          Compras Anuladas
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder={activeTab === "activas" ? "Buscar compras activas" : "Buscar compras anuladas"}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {activeTab === "activas" && (
          <div className="create-header">
            <button className="create-button" onClick={openForm}>
              <FontAwesomeIcon icon={faPlus} /> Crear
            </button>
          </div>
        )}
      </div>
      
      <div className="table-container">
        {activeTab === "activas" ? (
          <TablaCompras compras={filteredActivas} />
        ) : (
          <TablaCompras compras={filteredAnuladas} />
        )}
      </div>

      {/* Modal de formulario */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registrar Nueva Compra</h2>
              <button className="close-button" onClick={closeForm}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form className="form-body" onSubmit={handleSubmit} ref={modalContentRef}>
              <div className="form-row">
                <div className="inline-group">
                  <div className="form-group">
                    <label>Proveedor <span className="required-asterisk">*</span></label>
                    <select
                      name="proveedor"
                      value={formData.proveedor}
                      onChange={handleChange}
                      className={formErrors.proveedor ? 'input-error' : ''}
                      required
                    >
                      <option value="">Seleccione un proveedor...</option>
                      {proveedoresDisponibles.map((prov) => (
                        <option key={prov.id} value={prov.nombre}>
                          {prov.nombre}
                        </option>
                      ))}
                    </select>
                    {formErrors.proveedor && <span className="error">{formErrors.proveedor}</span>}
                  </div>
                </div>

                <div className="inline-group">
                  <div className="form-group">
                    <label>Contacto</label>
                    <input
                      type="text"
                      name="contacto"
                      value={formData.contacto}
                      disabled
                    />
                  </div>
                </div>

                <div className="inline-group">
                  <div className="form-group">
                    <label>Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="inline-group">
                  <div className="form-group">
                    <label>Fecha de Compra <span className="required-asterisk">*</span></label>
                    <input
                      type="date"
                      name="fechaCompra"
                      value={formData.fechaCompra}
                      onChange={handleChange}
                      className={formErrors.fechaCompra ? 'input-error' : ''}
                      required
                    />
                    {formErrors.fechaCompra && <span className="error">{formErrors.fechaCompra}</span>}
                  </div>
                </div>

                <div className="inline-group">
                  <div className="form-group">
                    <label>Fecha de Registro</label>
                    <input
                      type="date"
                      name="fechaRegistro"
                      value={formData.fechaRegistro}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
                </div>

                <div className="inline-group">
                  <div className="form-group">
                    <label>Método de Pago <span className="required-asterisk">*</span></label>
                    <select
                      name="metodoPago"
                      value={formData.metodoPago}
                      onChange={handleChange}
                      className={formErrors.metodoPago ? 'input-error' : ''}
                      required
                    >
                      <option value="">Seleccione...</option>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta Crédito">Tarjeta Crédito</option>
                      <option value="Tarjeta Débito">Tarjeta Débito</option>
                    </select>
                    {formErrors.metodoPago && <span className="error">{formErrors.metodoPago}</span>}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <h3>Productos</h3>
                {formData.productos.map((item, index) => {
                  const productoSeleccionado = productosDisponibles.find(p => p.id.toString() === item.productoId);
                  const errorProducto = formErrors[`producto-${index}`];
                  const errorCantidad = formErrors[`cantidad-${index}`];
                  
                  return (
                    <div key={item.id} className="form-row" style={{alignItems: 'end', marginBottom: '15px'}}>
                      <div className="inline-group">
                        <div className="form-group">
                          <label>Producto <span className="required-asterisk">*</span></label>
                          <select
                            name="productoId"
                            value={item.productoId}
                            onChange={(e) => handleProductoChange(e, index)}
                            className={errorProducto ? 'input-error' : ''}
                            required
                          >
                            <option value="">Seleccione un producto...</option>
                            {productosDisponibles.map(opcion => (
                              <option key={opcion.id} value={opcion.id}>
                                {opcion.nombre} (${opcion.precio})
                              </option>
                            ))}
                          </select>
                          {errorProducto && <span className="error">{errorProducto}</span>}
                        </div>
                      </div>

                      <div className="inline-group">
                        <div className="form-group">
                          <label>Cantidad <span className="required-asterisk">*</span></label>
                          <input
                            type="number"
                            name="cantidad"
                            value={item.cantidad}
                            onChange={(e) => handleProductoChange(e, index)}
                            min="1"
                            className={errorCantidad ? 'input-error' : ''}
                            required
                          />
                          {errorCantidad && <span className="error">{errorCantidad}</span>}
                        </div>
                      </div>

                      <div className="inline-group">
                        <div className="form-group">
                          <label>Precio Unitario</label>
                          <input
                            type="text"
                            value={`$${item.precio.toFixed(2)}`}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="inline-group">
                        <div className="form-group">
                          <label>Subtotal</label>
                          <input
                            type="text"
                            value={`$${(item.precio * item.cantidad).toFixed(2)}`}
                            disabled
                          />
                        </div>
                      </div>

                      <button 
                        type="button" 
                        className="icon-button"
                        onClick={() => removeProducto(index)}
                        title="Eliminar producto"
                        style={{marginBottom: '8px'}}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  );
                })}
                
                <button 
                  type="button" 
                  className="primary-button"
                  onClick={addProducto}
                  style={{marginTop: '10px'}}
                >
                  <FontAwesomeIcon icon={faPlus} /> Agregar Producto
                </button>
              </div>

              <div className="form-row" style={{justifyContent: 'flex-end', marginTop: '20px'}}>
                <div className="inline-group">
                  <div className="form-group">
                    <label>SubTotal:</label>
                    <input
                      type="text"
                      value={`$${formData.subtotal.toFixed(2)}`}
                      disabled
                    />
                  </div>
                </div>
                
                <div className="inline-group">
                  <div className="form-group">
                    <label>Total:</label>
                    <input
                      type="text"
                      value={`$${formData.total.toFixed(2)}`}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={closeForm}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button">
                  Registrar Compra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de visualización */}
      {isViewModalOpen && (
        <ViewModal compra={modalCompra} onClose={closeViewModal} />
      )}

      {/* Modal de PDF */}
      {isPdfModalOpen && (
        <PdfModal compra={modalCompra} onClose={closePdfModal} />
      )}
    </div>
  );
};

export default Compras;