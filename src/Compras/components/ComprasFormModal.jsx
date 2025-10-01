import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";

const ComprasFormModal = ({
  onClose,
  onSubmit,
  proveedoresDisponibles = [],
  productosDisponibles = [],
  modalContentRef,
}) => {
  const [formData, setFormData] = useState({
    proveedorId: "",
    nombreProveedor: "",
    telefonoProveedor: "",
    correoProveedor: "",
    direccionProveedor: "",
    tipoPersonaProveedor: "",
    numeroDocumentoProveedor: "",
    tipoDocumentoProveedor: "",
    nombresProveedor: "",
    apellidosProveedor: "",
    razonSocialProveedor: "",
    fechaCompra: new Date().toISOString().split("T")[0],
    fechaRegistro: new Date().toISOString().split("T")[0],
    metodoPago: "Transferencia",
    detallesCompra: [],
    subtotal: 0,
    iva: 0,
    total: 0,
  });

  const [formErrors, setFormErrors] = useState({});

  // Validaciones mínimas
  const validateForm = () => {
    const errors = {};
    if (!formData.proveedorId) errors.proveedorId = "Seleccione un proveedor";
    if (!formData.fechaCompra) errors.fechaCompra = "Ingrese una fecha válida";
    if (!formData.metodoPago) errors.metodoPago = "Seleccione un método de pago";

    formData.detallesCompra.forEach((d, i) => {
      if (!d.productoId) errors[`producto-${i}`] = "Seleccione un producto";
      if (!d.cantidad || d.cantidad < 1)
        errors[`cantidad-${i}`] = "Cantidad inválida";
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Cambios generales
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "proveedorId") {
      const prov = proveedoresDisponibles.find(
        (p) => String(p.id) === String(value)
      );
      setFormData({
        ...formData,
        proveedorId: value,
        nombreProveedor: prov?.nombre || "",
        telefonoProveedor: prov?.telefono || "",
        correoProveedor: prov?.correo || "",
        direccionProveedor: prov?.direccion || "",
        tipoPersonaProveedor: prov?.tipoPersona || "",
        numeroDocumentoProveedor: prov?.numeroDocumento || "",
        tipoDocumentoProveedor: prov?.tipoDocumento || "",
        nombresProveedor: prov?.nombres || "",
        apellidosProveedor: prov?.apellidos || "",
        razonSocialProveedor: prov?.razonSocial || "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Cambios en detalle (producto / cantidad)
  const handleDetalleChange = (e, index) => {
    const { name, value } = e.target;
    const nuevos = [...formData.detallesCompra];

    if (name === "productoId") {
      const productoSeleccionado = productosDisponibles.find(
        (p) => String(p.id) === String(value)
      );
      nuevos[index] = {
        ...nuevos[index],
        productoId: value,
        precioUnitario: Number(productoSeleccionado?.precio ?? 0),
      };
    } else if (name === "cantidad") {
      nuevos[index] = {
        ...nuevos[index],
        cantidad: parseInt(value, 10) || 1,
      };
    }

    updateTotales(nuevos);
  };

  // Calcula subtotal / iva / total y guarda detalles
  const updateTotales = (detalles) => {
    const subtotal = detalles.reduce(
      (sum, d) =>
        sum + Number(d.precioUnitario || 0) * Number(d.cantidad || 1),
      0
    );
    const iva = +((subtotal * 0.19).toFixed(2));
    const total = +((subtotal + iva).toFixed(2));

    setFormData({ ...formData, detallesCompra: detalles, subtotal, iva, total });
  };

  const addDetalle = () => {
    const id = crypto.randomUUID?.() || `detalle-${Date.now()}`;
    const nuevos = [
      ...formData.detallesCompra,
      { id, productoId: "", cantidad: 1, precioUnitario: 0 },
    ];
    updateTotales(nuevos);
  };

  const removeDetalle = (index) => {
    const nuevos = formData.detallesCompra.filter((_, i) => i !== index);
    updateTotales(nuevos);
  };

  // Submit: construye payload que el backend espera
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const detalles = formData.detallesCompra.map((d) => {
      const productoSeleccionado = productosDisponibles.find(
        (p) => String(p.id) === String(d.productoId)
      );
      
      return {
        productoId: parseInt(d.productoId, 10),
        cantidad: Number(d.cantidad || 1),
        precioUnitario: Number(d.precioUnitario || 0),
        subtotalItems: +(
          (Number(d.precioUnitario || 0) * Number(d.cantidad || 1)).toFixed(2)
        ),
        producto: {
          id: productoSeleccionado?.id,
          nombre: productoSeleccionado?.nombre,
          precio: productoSeleccionado?.precio,
          categoriaId: productoSeleccionado?.categoriaId,
        },
      };
    });

    const proveedorSeleccionado = proveedoresDisponibles.find(
      (p) => String(p.id) === String(formData.proveedorId)
    );

    const payload = {
      proveedorId: parseInt(formData.proveedorId, 10),
      fechaCompra: new Date(formData.fechaCompra).toISOString(),
      fechaRegistro: new Date(formData.fechaRegistro).toISOString(),
      metodoPago: formData.metodoPago,
      estado: true, // se envía automáticamente
      subtotal: Number(formData.subtotal || 0),
      iva: Number(formData.iva || 0),
      total: Number(formData.total || 0),
      proveedor: {
        id: proveedorSeleccionado?.id,
        nombre: proveedorSeleccionado?.nombre,
        telefono: proveedorSeleccionado?.telefono,
        correo: proveedorSeleccionado?.correo,
        direccion: proveedorSeleccionado?.direccion,
        tipoPersona: proveedorSeleccionado?.tipoPersona,
        numeroDocumento: proveedorSeleccionado?.numeroDocumento,
        tipoDocumento: proveedorSeleccionado?.tipoDocumento,
        nombres: proveedorSeleccionado?.nombres,
        apellidos: proveedorSeleccionado?.apellidos,
        razonSocial: proveedorSeleccionado?.razonSocial,
      },
      detallesCompra: detalles,
    };

    console.log("📤 Enviando payload compra:", payload);
    onSubmit(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Registrar Nueva Compra</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form className="form-body" onSubmit={handleSubmit} ref={modalContentRef}>
          {/* Proveedor */}
          <div className="form-row">
            <div className="inline-group">
              <div className="form-group">
                <label>
                  Proveedor <span className="required-asterisk">*</span>
                </label>
                <select
                  name="proveedorId"
                  value={formData.proveedorId}
                  onChange={handleChange}
                  className={formErrors.proveedorId ? "input-error" : ""}
                  required
                >
                  <option value="">Seleccione un proveedor...</option>
                  {proveedoresDisponibles.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.nombre}
                    </option>
                  ))}
                </select>
                {formErrors.proveedorId && (
                  <span className="error">{formErrors.proveedorId}</span>
                )}
              </div>
            </div>

            {/* Información adicional del proveedor */}
            <div className="inline-group">
              <div className="form-group">
                <label>Contacto</label>
                <input
                  type="text"
                  name="contacto"
                  value={formData.telefonoProveedor}
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
                  value={formData.direccionProveedor}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Fechas y método */}
          <div className="form-row">
            <div className="inline-group">
              <div className="form-group">
                <label>
                  Fecha de Compra <span className="required-asterisk">*</span>
                </label>
                <input
                  type="date"
                  name="fechaCompra"
                  value={formData.fechaCompra}
                  onChange={handleChange}
                  className={formErrors.fechaCompra ? "input-error" : ""}
                  required
                />
              </div>
            </div>

            <div className="inline-group">
              <div className="form-group">
                <label>Fecha de Registro</label>
                <input
                  type="date"
                  name="fechaRegistro"
                  value={formData.fechaRegistro}
                  disabled
                />
              </div>
            </div>

            <div className="inline-group">
              <div className="form-group">
                <label>
                  Método de Pago <span className="required-asterisk">*</span>
                </label>
                <select
                  name="metodoPago"
                  value={formData.metodoPago}
                  onChange={handleChange}
                  className={formErrors.metodoPago ? "input-error" : ""}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta Crédito">Tarjeta Crédito</option>
                  <option value="Tarjeta Débito">Tarjeta Débito</option>
                </select>
              </div>
            </div>
          </div>

          {/* Detalle de compra (productos) */}
          <div className="form-group">
            <div className="products-header">
              <h3>Detalle de Compra</h3>
              <button type="button" className="primary-button" onClick={addDetalle}>
                <FontAwesomeIcon icon={faPlus} /> Agregar Producto
              </button>
            </div>

            <div className="products-list">
              {formData.detallesCompra.map((item, idx) => {
                const errorProd = formErrors[`producto-${idx}`];
                const errorCant = formErrors[`cantidad-${idx}`];
                return (
                  <div key={item.id || `detalle-${idx}`} className="product-item">
                    <div className="product-item-header">
                      <h4>Producto {idx + 1}</h4>
                      <button type="button" className="icon-button" onClick={() => removeDetalle(idx)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>

                    <div className="form-row" style={{ alignItems: "end", marginBottom: "15px" }}>
                      <div className="inline-group">
                        <div className="form-group">
                          <label>Producto *</label>
                          <select
                            name="productoId"
                            value={item.productoId}
                            onChange={(e) => handleDetalleChange(e, idx)}
                            className={errorProd ? "input-error" : ""}
                            required
                          >
                            <option value="">Seleccione un producto...</option>
                            {productosDisponibles.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.nombre} ({p.precio})
                              </option>
                            ))}
                          </select>
                          {errorProd && <span className="error">{errorProd}</span>}
                        </div>
                      </div>

                      <div className="inline-group">
                        <div className="form-group">
                          <label>Cantidad *</label>
                          <input
                            type="number"
                            name="cantidad"
                            value={item.cantidad}
                            onChange={(e) => handleDetalleChange(e, idx)}
                            min="1"
                            className={errorCant ? "input-error" : ""}
                            required
                          />
                          {errorCant && <span className="error">{errorCant}</span>}
                        </div>
                      </div>

                      <div className="inline-group">
                        <div className="form-group">
                          <label>Precio Unitario</label>
                          <input type="text" value={`$${(item.precioUnitario || 0).toFixed(2)}`} disabled />
                        </div>
                      </div>

                      <div className="inline-group">
                        <div className="form-group">
                          <label>Subtotal</label>
                          <input type="text" value={`$${(item.precioUnitario * item.cantidad).toFixed(2)}`} disabled />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Totales */}
          <div className="form-row" style={{ justifyContent: "flex-end", marginTop: 20 }}>
            <div className="inline-group">
              <div className="form-group">
                <label>SubTotal:</label>
                <input type="text" value={`$${formData.subtotal.toFixed(2)}`} disabled />
              </div>
            </div>

            <div className="inline-group">
              <div className="form-group">
                <label>IVA:</label>
                <input type="text" value={`$${formData.iva.toFixed(2)}`} disabled />
              </div>
            </div>

            <div className="inline-group">
              <div className="form-group">
                <label>Total:</label>
                <input type="text" value={`$${formData.total.toFixed(2)}`} disabled />
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="submit-button">Registrar Compra</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComprasFormModal;
