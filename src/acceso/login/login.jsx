import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faArrowRight, faCircleExclamation, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { authService } from '../services/auth';
import './Login.css';

// 🔔 Componente de alerta visual
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

const Login = () => {
  const [email, setEmail] = useState('alvarostivens13@gmail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const navigate = useNavigate();

  // 🧠 Simulación de correos registrados (puedes ajustar según tu sistema)
  const correosRegistrados = [
    'alvarostivens13@gmail.com',
    'admin@technova.com',
    'cliente@technova.com',
    'soporte@technova.com'
  ];

  // ⏳ Limpieza automática de alertas
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // 🔐 LOGIN PRINCIPAL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      if (!email || !password) {
        setAlert({ type: 'warning', message: 'Por favor completa todos los campos.' });
        setLoading(false);
        return;
      }

      const result = await authService.login(email, password);

      if (result.success) {
        setAlert({ type: 'success', message: 'Inicio de sesión exitoso. Redirigiendo...' });
        setTimeout(() => navigate('/'), 1500);
      } else {
        setAlert({ type: 'error', message: result.message || 'Credenciales inválidas. Inténtalo nuevamente.' });
      }
    } catch (err) {
      console.error('❌ Error en login:', err);
      setAlert({ type: 'error', message: 'Error de conexión con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  // 📧 RECUPERACIÓN DE CONTRASEÑA
  const handleRecovery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      // Validar campo vacío
      if (!recoveryEmail) {
        setAlert({ type: 'warning', message: 'Debes ingresar un correo electrónico.' });
        setLoading(false);
        return;
      }

      // Validar formato del correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recoveryEmail)) {
        setAlert({ type: 'warning', message: 'Por favor ingresa un correo electrónico válido.' });
        setLoading(false);
        return;
      }

      // Simular verificación de existencia
      await new Promise((res) => setTimeout(res, 1200));
      const existeCorreo = correosRegistrados.includes(recoveryEmail.trim().toLowerCase());

      if (!existeCorreo) {
        setAlert({ type: 'error', message: 'El correo ingresado no se encuentra registrado en TECHNOVA.' });
        setLoading(false);
        return;
      }

      // Simular éxito
      await authService.recuperarContrasena(recoveryEmail);
      setRecoverySent(true);
      setAlert({ type: 'success', message: 'Correo de recuperación enviado correctamente.' });

    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error al enviar el correo de recuperación.' });
    } finally {
      setLoading(false);
    }
  };

  // 🔁 FORMULARIO DE RECUPERACIÓN
  if (showRecovery) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="brand-title">TechNova</h1>
          </div>

          <h2>Recuperar Contraseña</h2>

          <AlertMessage type={alert.type} message={alert.message} />

          {recoverySent ? (
            <div className="success-message">
              <p>✅ Si el correo existe, se enviarán instrucciones de recuperación.</p>
              <button onClick={() => setShowRecovery(false)} className="back-button">
                ← Volver al Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleRecovery}>
              <div className="input-group">
                <label htmlFor="recovery-email">Correo electrónico</label>
                <div className="auth-input-field">
                  <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                  <input
                    type="email"
                    id="recovery-email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="Ingresa tu correo electrónico"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Verificando...' : 'Enviar Instrucciones'}
              </button>

              <button type="button" onClick={() => setShowRecovery(false)} className="back-button">
                ← Volver al Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // 🔑 FORMULARIO PRINCIPAL
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="brand-title">TechNova</h1>
        </div>

        <h2>Iniciar sesión</h2>

        <AlertMessage type={alert.type} message={alert.message} />

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <div className="auth-input-field">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <div className="auth-input-field">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="forgot-password">
              <button
                type="button"
                onClick={() => setShowRecovery(true)}
                className="link-button"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Cargando...' : (
              <>
                Continuar
                <FontAwesomeIcon icon={faArrowRight} className="button-icon" />
              </>
            )}
          </button>
        </form>

        <div className="demo-info">
          <h4>💡 Credenciales de Prueba:</h4>
          <p><strong>Email:</strong> alvarostivens13@gmail.com</p>
          <p><strong>Contraseña:</strong> 1138824002Stivens</p>
        </div>

        <div className="login-footer">
          <a href="/terms">Términos de Uso</a> | <a href="/privacy">Política de Privacidad</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
