import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faArrowLeft,
  faCheckCircle,
  faKey,
  faCircleExclamation
} from '@fortawesome/free-solid-svg-icons';
import '../login/login.css'; // Reutiliza estilos existentes
import { resetearContrasena } from '../services/auth'; // Ajusta la ruta según tu proyecto

// 🔔 Componente de alertas visuales
const AlertMessage = ({ type, message }) => {
  if (!message) return null;

  const icons = {
    error: faCircleExclamation,
    success: faCheckCircle,
    warning: faCircleExclamation,
  };

  return (
    <div className={`alert-message ${type}`}>
      <FontAwesomeIcon icon={icons[type]} className="alert-icon" />
      <span>{message}</span>
    </div>
  );
};

const ResetPassword = () => {
  const [codigo, setCodigo] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔙 Volver al login
  const handleBack = () => navigate('/login');

  // ⏳ Limpieza automática de alertas
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // 💾 Manejo de envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });
    setLoading(true);

    // ⚠️ Validaciones básicas
    if (!codigo || !newPassword || !confirmPassword) {
      setAlert({ type: 'warning', message: 'Todos los campos son obligatorios.' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setAlert({ type: 'warning', message: 'La contraseña debe tener al menos 6 caracteres.' });
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({ type: 'error', message: 'Las contraseñas no coinciden.' });
      setLoading(false);
      return;
    }

    try {
      const res = await resetearContrasena(codigo, newPassword);
      if (res.success) {
        setSuccess(true);
        setAlert({ type: 'success', message: '¡Contraseña restablecida correctamente!' });
        setTimeout(() => navigate('/login'), 2500);
      } else {
        setAlert({ type: 'error', message: res.message || 'Código inválido o expirado.' });
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Error inesperado al procesar la solicitud.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button onClick={handleBack} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Volver al login
        </button>

        <h1>Restablecer Contraseña</h1>

        <AlertMessage type={alert.type} message={alert.message} />

        {success ? (
          <div className="success-message fade-in">
            <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
            <p>¡Tu contraseña ha sido restablecida exitosamente!</p>
            <p>Redirigiendo al inicio de sesión...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="codigo">Código de recuperación</label>
              <div className="auth-input-field">
                <FontAwesomeIcon icon={faKey} className="input-icon" />
                <input
                  type="text"
                  id="codigo"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ingresa el código recibido"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="newPassword">Nueva contraseña</label>
              <div className="auth-input-field">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ingresa tu nueva contraseña"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <div className="auth-input-field">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </form>
        )}

        <div className="login-footer">
          <a href="/terms">Términos de Uso</a> | <a href="/privacy">Política de Privacidad</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
