import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import "../clientes.css"; // ✅ usa tu CSS global de clientes

const ClientesFormModal = ({ cliente, isEditMode, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDoc: 'CC',
    documento: '',
    fechaNac: '',
    correo: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [checkingEmail, setCheckingEmail] = useState(false);

  // 🔹 Cargar datos al editar
  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || '',
        apellido: cliente.apellido || '',
        tipoDoc: cliente.tipoDoc || 'CC',
        documento: cliente.documento?.toString() || '',
        fechaNac: cliente.fechaNac?.split('T')[0] || '',
        correo: cliente.correo || ''
      });
    }
  }, [cliente]);

  // ✅ Verificar correo existente (solo al crear)
  const verificarCorreo = async (correo) => {
    try {
      setCheckingEmail(true);
      const res = await fetch(`https://tuapi.com/api/clientes/verificar-correo?email=${correo}`);
      const data = await res.json();
      return data.existe; // true si ya está registrado
    } catch (err) {
      console.error('Error verificando correo:', err);
      return false;
    } finally {
      setCheckingEmail(false);
    }
  };

  const validateEmail = (email) => {
    if (!email) return true;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // ✅ Validación del formulario
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Nombre
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
      isValid = false;
    } else if (formData.nombre.trim().length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
      isValid = false;
    }

    // Apellido
    if (!formData.apellido.trim()) {
      errors.apellido = 'El apellido es obligatorio';
      isValid = false;
    } else if (formData.apellido.trim().length < 3) {
      errors.apellido = 'El apellido debe tener al menos 3 caracteres';
      isValid = false;
    }

    // Tipo documento
    if (!formData.tipoDoc.trim()) {
      errors.tipoDoc = 'Tipo de documento es requerido';
      isValid = false;
    }

    // Documento
    if (!formData.documento.trim()) {
      errors.documento = 'Documento es requerido';
      isValid = false;
    } else if (isNaN(formData.documento)) {
      errors.documento = 'Documento debe ser numérico';
      isValid = false;
    } else if (formData.documento.trim().length < 6 || formData.documento.trim().length > 10) {
      errors.documento = 'Documento debe tener entre 6 y 10 dígitos';
      isValid = false;
    }

    // Correo
    if (!formData.correo.trim()) {
      errors.correo = 'Correo es requerido';
      isValid = false;
    } else if (!validateEmail(formData.correo)) {
      errors.correo = 'Correo electrónico inválido';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // ✅ Manejar envío con validación de correo solo en creación
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Solo validar correo si es nuevo (no edición)
    if (!isEditMode) {
      const existe = await verificarCorreo(formData.correo);
      if (existe) {
        setFormErrors(prev => ({
          ...prev,
          correo: 'Este correo ya está registrado'
        }));
        return;
      }
    }

    const nuevoCliente = {
      id: cliente?.id || null,
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      tipoDoc: formData.tipoDoc,
      documento: parseInt(formData.documento),
      fechaNac: formData.fechaNac,
      correo: formData.correo.trim(),
      activo: cliente?.activo ?? true,
    };

    console.log("📤 Enviando datos al padre:", nuevoCliente);
    onSave(nuevoCliente);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form className="form-body" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre <span className="required">*</span></label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={formErrors.nombre ? 'error-input' : ''}
              />
              {formErrors.nombre && <span className="error-message">{formErrors.nombre}</span>}
            </div>

            <div className="form-group">
              <label>Apellido <span className="required">*</span></label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className={formErrors.apellido ? 'error-input' : ''}
              />
              {formErrors.apellido && <span className="error-message">{formErrors.apellido}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo Documento <span className="required">*</span></label>
              <select
                name="tipoDoc"
                value={formData.tipoDoc}
                onChange={handleChange}
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="NIT">NIT</option>
                <option value="PAS">Pasaporte</option>
              </select>
              {formErrors.tipoDoc && <span className="error-message">{formErrors.tipoDoc}</span>}
            </div>

            <div className="form-group">
              <label>Documento <span className="required">*</span></label>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                disabled={isEditMode}
                className={formErrors.documento ? 'error-input' : ''}
              />
              {formErrors.documento && <span className="error-message">{formErrors.documento}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha Nacimiento <span className="required">*</span></label>
              <input
                type="date"
                name="fechaNac"
                value={formData.fechaNac}
                onChange={handleChange}
                className={formErrors.fechaNac ? 'error-input' : ''}
              />
              {formErrors.fechaNac && <span className="error-message">{formErrors.fechaNac}</span>}
            </div>

            <div className="form-group">
              <label>Correo <span className="required">*</span></label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className={formErrors.correo ? 'error-input' : ''}
              />
              {checkingEmail && !formErrors.correo && (
                <span className="checking-message">Verificando correo...</span>
              )}
              {formErrors.correo && <span className="error-message">{formErrors.correo}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={checkingEmail}>
              {isEditMode ? 'Guardar Cambios' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientesFormModal;
