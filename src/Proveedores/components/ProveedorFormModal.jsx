import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ProveedorFormModal = ({ 
  formData, 
  errors, 
  currentProveedorId, 
  onClose, 
  onChange, 
  onTipoPersonaChange, 
  onTipoDocumentoChange, 
  onSubmit 
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{currentProveedorId ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form className="form-body" onSubmit={onSubmit}>
          {/* Tipo Persona y Tipo Documento */}
          <div className="form-row">
            <div className="inline-group">
              <div className="form-group">
                <label>Tipo Persona <span className="required-asterisk">*</span></label>
                <select
                  name="tipoPersona"
                  value={formData.tipoPersona}
                  onChange={onTipoPersonaChange}
                  className={errors.tipoPersona ? 'input-error' : ''}
                  disabled={!!currentProveedorId}
                  required
                >
                  <option value="Natural">Persona Natural</option>
                  <option value="Jurídica">Persona Jurídica</option>
                </select>
                {errors.tipoPersona && <span className="error">{errors.tipoPersona}</span>}
              </div>
            </div>

            <div className="inline-group">
              <div className="form-group">
                <label>Tipo Documento <span className="required-asterisk">*</span></label>
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={onTipoDocumentoChange}
                  className={errors.tipoDocumento ? 'input-error' : ''}
                  disabled={!!currentProveedorId}
                  required
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="NIT">NIT</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PAS">Pasaporte</option>
                </select>
                {errors.tipoDocumento && <span className="error">{errors.tipoDocumento}</span>}
              </div>
            </div>

            <div className="inline-group">
              <div className="form-group">
                <label>N° Documento <span className="required-asterisk">*</span></label>
                <input
                  type="text"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={onChange}
                  className={errors.numeroDocumento ? 'input-error' : ''}
                  disabled={!!currentProveedorId}
                  required
                  placeholder={
                    formData.tipoDocumento === 'NIT' ? '123456789-1' : 
                    formData.tipoDocumento === 'CC' ? '1234567890' : 
                    formData.tipoDocumento === 'CE' ? 'ABC123456' : 'AB123456'
                  }
                />
                {errors.numeroDocumento && <span className="error">{errors.numeroDocumento}</span>}
              </div>
            </div>
          </div>

          {/* Persona Natural o Jurídica */}
          {formData.tipoPersona === 'Natural' ? (
            <div className="form-row">
              <div className="inline-group">
                <div className="form-group">
                  <label>Nombres <span className="required-asterisk">*</span></label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={onChange}
                    className={errors.nombres ? 'input-error' : ''}
                    required
                    placeholder="Ej: Juan Carlos"
                  />
                  {errors.nombres && <span className="error">{errors.nombres}</span>}
                </div>
              </div>

              <div className="inline-group">
                <div className="form-group">
                  <label>Apellidos <span className="required-asterisk">*</span></label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={onChange}
                    className={errors.apellidos ? 'input-error' : ''}
                    required
                    placeholder="Ej: Pérez García"
                  />
                  {errors.apellidos && <span className="error">{errors.apellidos}</span>}
                </div>
              </div>
            </div>
          ) : (
            <div className="form-row">
              <div className="inline-group full-width">
                <div className="form-group">
                  <label>Razón Social <span className="required-asterisk">*</span></label>
                  <input
                    type="text"
                    name="razonSocial"
                    value={formData.razonSocial}
                    onChange={onChange}
                    className={errors.razonSocial ? 'input-error' : ''}
                    required
                    placeholder="Ej: Tecnologías Avanzadas SAS"
                  />
                  {errors.razonSocial && <span className="error">{errors.razonSocial}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Teléfono, Correo y Dirección */}
          <div className="form-row">
            <div className="inline-group">
              <div className="form-group">
                <label>Teléfono <span className="required-asterisk">*</span></label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={onChange}
                  className={errors.telefono ? 'input-error' : ''}
                  placeholder="Ej: 3001234567 o 6012345678"
                />
                {errors.telefono && <span className="error">{errors.telefono}</span>}
              </div>
            </div>

            <div className="inline-group">
              <div className="form-group">
                <label>Correo Electrónico <span className="required-asterisk">*</span></label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={onChange}
                  className={errors.correo ? 'input-error' : ''}
                  placeholder="Ej: contacto@proveedor.com"
                />
                {errors.correo && <span className="error">{errors.correo}</span>}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="inline-group full-width">
              <div className="form-group">
                <label>Dirección <span className="required-asterisk">*</span></label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={onChange}
                  placeholder="Dirección completa"
                />
                {errors.direccion && <span className="error">{errors.direccion}</span>}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              {currentProveedorId ? 'Actualizar Proveedor' : 'Crear Proveedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProveedorFormModal;
