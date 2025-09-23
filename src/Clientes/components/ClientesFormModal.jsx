import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ClientesFormModal = ({ cliente, isEditMode, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: cliente?.nombre || '',
    apellido: cliente?.apellido || '',
    tipoDoc: cliente?.tipoDoc || 'CC',
    documento: cliente?.documento?.toString() || '',
    fechaNac: cliente?.fechaNac || '',
    celular: cliente?.celular?.toString() || '',
    correo: cliente?.correo || '',
    direccion: cliente?.direccion || '',
    activo: cliente?.activo ?? true
  });

  const [formErrors, setFormErrors] = useState({});

  // Funciones de validación
  const validateEmail = (email) => {
    if (!email) return true; // Opcional
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateFechaNac = (fecha) => {
    if (!fecha) return false;
    const today = new Date();
    const birthDate = new Date(fecha);
    return birthDate < today;
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.nombre.trim()) {
      errors.nombre = 'Nombre es requerido';
      isValid = false;
    }

    if (!formData.apellido.trim()) {
      errors.apellido = 'Apellido es requerido';
      isValid = false;
    }

    if (!formData.documento) {
      errors.documento = 'Documento es requerido';
      isValid = false;
    } else if (isNaN(formData.documento)) {
      errors.documento = 'Documento debe ser numérico';
      isValid = false;
    }

    if (!formData.fechaNac) {
      errors.fechaNac = 'Fecha de nacimiento es requerida';
      isValid = false;
    } else if (!validateFechaNac(formData.fechaNac)) {
      errors.fechaNac = 'Fecha inválida';
      isValid = false;
    }

    if (formData.correo && !validateEmail(formData.correo)) {
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

  const handleSubmit = () => {
    if (!validateForm()) return;

    const nuevoCliente = {
      id: cliente?.id || Date.now().toString(),
      nombre: formData.nombre,
      apellido: formData.apellido,
      tipoDoc: formData.tipoDoc,
      documento: parseInt(formData.documento),
      fechaNac: formData.fechaNac,
      celular: formData.celular ? parseInt(formData.celular) : null,
      correo: formData.correo || '',
      direccion: formData.direccion || '',
      activo: formData.activo
    };

    onSubmit(nuevoCliente);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="form-body">
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
                <option value="CC">Cédula</option>
                <option value="CE">Cédula Extranjería</option>
                <option value="TI">Tarjeta Identidad</option>
              </select>
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
              <label>Celular</label>
              <input
                type="text"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Correo</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className={formErrors.correo ? 'error-input' : ''}
              />
              {formErrors.correo && <span className="error-message">{formErrors.correo}</span>}
            </div>

            <div className="form-group">
              <label>Estado</label>
              <select
                name="activo"
                value={formData.activo}
                onChange={handleChange}
              >
                <option value={true}>Activo</option>
                <option value={false}>Inactivo</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <textarea
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="submit-button" onClick={handleSubmit}>
            {isEditMode ? 'Guardar Cambios' : 'Crear Cliente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientesFormModal;