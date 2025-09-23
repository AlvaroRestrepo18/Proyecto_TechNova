import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

const ComprasFormModal = ({
  onClose,
  onSubmit,
  proveedoresDisponibles,
  productosDisponibles,
  modalContentRef,
  onBeforeChange
}) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    proveedor: '',
    contacto: '',
    direccion: '',
    fechaCompra: new Date().toISOString().split('T')[0],
    fechaRegistro: new Date().toISOString().split('T')[0],
    metodoPago: 'Transferencia',
    estado: 'Activo',
    productos: [],
    subtotal: 0,
    total: 0
  });

  const [formErrors, setFormErrors] = useState({});

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
    onBeforeChange();
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

  // Funciones para agregar/eliminar productos
  const addProducto = () => {
    onBeforeChange();
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
    
    onSubmit(nuevaCompra);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Registrar Nueva Compra</h2>
          <button className="close-button" onClick={onClose}>
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
            <div className="products-header">
              <h3>Productos</h3>
              <button 
                type="button" 
                className="primary-button"
                onClick={addProducto}
              >
                <FontAwesomeIcon icon={faPlus} /> Agregar Producto
              </button>
            </div>
            
            <div className="products-list">
              {formData.productos.map((item, index) => {
                const productoSeleccionado = productosDisponibles.find(p => p.id.toString() === item.productoId);
                const errorProducto = formErrors[`producto-${index}`];
                const errorCantidad = formErrors[`cantidad-${index}`];
                
                return (
                  <div key={item.id} className="product-item">
                    <div className="product-item-header">
                      <h4>Producto {index + 1}</h4>
                      {formData.productos.length > 0 && (
                        <button 
                          type="button" 
                          className="icon-button"
                          onClick={() => removeProducto(index)}
                          title="Eliminar producto"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
                    
                    <div className="form-row" style={{alignItems: 'end', marginBottom: '15px'}}>
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
                    </div>
                  </div>
                );
              })}
            </div>
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
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Registrar Compra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComprasFormModal;