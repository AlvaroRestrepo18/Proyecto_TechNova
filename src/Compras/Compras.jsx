import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faEye, faFilePdf, faTrash } from '@fortawesome/free-solid-svg-icons';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import './Compras.css';

// Componentes
import ComprasTable from './components/ComprasTable';
import ComprasFormModal from './components/ComprasFormModal';

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
  }, [modalCompra?.productos, scrollPosition]); // 🔥 Corregido aquí

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

  const handleCreateCompra = (nuevaCompra) => {
    setComprasData([...comprasData, nuevaCompra]);
    closeForm();
  };

  return (
    <div>
      <h1>Compras</h1>
      
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
          <ComprasTable 
            compras={filteredActivas}
            onToggleEstado={toggleEstado}
            onView={openViewModal}
            onPdf={openPdfModal}
          />
        ) : (
          <ComprasTable 
            compras={filteredAnuladas}
            onToggleEstado={toggleEstado}
            onView={openViewModal}
            onPdf={openPdfModal}
          />
        )}
      </div>

      {/* Modal de formulario */}
      {isFormOpen && (
        <ComprasFormModal
          onClose={closeForm}
          onSubmit={handleCreateCompra}
          proveedoresDisponibles={proveedoresDisponibles}
          productosDisponibles={productosDisponibles}
          modalContentRef={modalContentRef}
          onBeforeChange={handleBeforeChange}
        />
      )}

      {/* Modal de visualización */}
      {isViewModalOpen && modalCompra && (
        <div className="modal-overlay" onClick={closeViewModal}>
          <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles de Compra</h2>
              <button className="close-button" onClick={closeViewModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="user-details-container" ref={modalContentRef}>
              <div className="user-details-row">
                <span className="detail-label">Proveedor:</span>
                <span className="detail-value">{modalCompra.proveedor}</span>
              </div>
              
              <div className="user-details-row">
                <span className="detail-label">Contacto:</span>
                <span className="detail-value">{modalCompra.contacto}</span>
              </div>
              
              <div className="user-details-row">
                <span className="detail-label">Dirección:</span>
                <span className="detail-value">{modalCompra.direccion}</span>
              </div>
              
              <div className="user-details-row">
                <span className="detail-label">Fecha de Compra:</span>
                <span className="detail-value">{new Date(modalCompra.fecha).toLocaleDateString()}</span>
              </div>
              
              <div className="user-details-row">
                <span className="detail-label">Fecha de Registro:</span>
                <span className="detail-value">{new Date(modalCompra.fechaRegistro).toLocaleDateString()}</span>
              </div>
              
              <div className="user-details-row">
                <span className="detail-label">Método de Pago:</span>
                <span className="detail-value">{modalCompra.metodo}</span>
              </div>
              
              <div className="user-details-row">
                <span className="detail-label">Estado:</span>
                <span className={`detail-value ${modalCompra.estado === 'Activo' ? 'status-active' : 'status-inactive'}`}>
                  {modalCompra.estado}
                </span>
              </div>
              
              <div className="user-details-row">
                <span className="detail-label">Productos:</span>
                <div className="detail-value">
                  {modalCompra.productos.map((item, index) => (
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
                <span className="detail-value">${modalCompra.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="user-details-row">
                <span className="detail-label">Total:</span>
                <span className="detail-value" style={{fontWeight: 'bold', fontSize: '1.1em'}}>${modalCompra.total.toFixed(2)}</span>
              </div>
              
              <div className="form-actions">
                <button type="button" className="close-details-button" onClick={closeViewModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de PDF */}
      {isPdfModalOpen && modalCompra && (
        <div className="modal-overlay" onClick={closePdfModal}>
          <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Vista Previa PDF</h2>
              <button className="close-button" onClick={closePdfModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="user-details-container" ref={modalContentRef} id="pdf-content">
              <div style={{padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white'}}>
                <h2 style={{textAlign: 'center', color: '#1e3c72', marginBottom: '20px'}}>COMPROBANTE DE COMPRA</h2>
                
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                  <div>
                    <strong>Número de Compra:</strong> {modalCompra.id}
                  </div>
                  <div>
                    <strong>Fecha:</strong> {new Date(modalCompra.fecha).toLocaleDateString()}
                  </div>
                </div>
                
                <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px'}}>
                  <h3 style={{marginBottom: '10px', color: '#1e3c72'}}>Información del Proveedor</h3>
                  <div><strong>Proveedor:</strong> {modalCompra.proveedor}</div>
                  <div><strong>Contacto:</strong> {modalCompra.contacto}</div>
                  <div><strong>Dirección:</strong> {modalCompra.direccion}</div>
                  <div><strong>Método de Pago:</strong> {modalCompra.metodo}</div>
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
                    {modalCompra.productos.map((item, index) => (
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
                  <div style={{marginBottom: '5px'}}><strong>SubTotal:</strong> ${modalCompra.subtotal.toFixed(2)}</div>
                  <div style={{fontSize: '1.2em', fontWeight: 'bold'}}><strong>Total:</strong> ${modalCompra.total.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  className="primary-button"
                  onClick={(e) => {
                    e.preventDefault();
                    generarPdfCompra(modalCompra);
                  }}
                  style={{backgroundColor: '#e74c3c'}}
                >
                  <FontAwesomeIcon icon={faFilePdf} /> Descargar PDF
                </button>
                <button type="button" className="close-details-button" onClick={closePdfModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compras;
