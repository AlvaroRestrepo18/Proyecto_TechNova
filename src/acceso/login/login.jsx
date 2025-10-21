import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { authService } from '../services/auth';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('alvarostivens13@gmail.com');
  const [password, setPassword] = useState('1138824002Stivens');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const navigate = useNavigate();

  // 🔐 LOGIN REAL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log("🔄 Iniciando login...");
      const result = await authService.login(email, password);

      if (result.success) {
        console.log("✅ Login exitoso, redirigiendo...");
        navigate('/'); // 👉 Redirige a la raíz o dashboard principal
      } else {
        setError(result.message || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // 📧 RECUPERACIÓN DE CONTRASEÑA
  const handleRecovery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.recuperarContrasena(recoveryEmail);
      setRecoverySent(true);
    } catch (err) {
      setError(err.message || 'Error al enviar código de recuperación');
    } finally {
      setLoading(false);
    }
  };

  // 🎯 FORMULARIO DE RECUPERACIÓN
  if (showRecovery) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="brand-title">TechNova</h1>
          </div>

          <h2>Recuperar Contraseña</h2>

          {recoverySent ? (
            <div className="success-message">
              <p>✅ Si el correo existe, se enviarán instrucciones de recuperación.</p>
              <button
                onClick={() => setShowRecovery(false)}
                className="back-button"
              >
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

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Instrucciones'}
              </button>

              <button
                type="button"
                onClick={() => setShowRecovery(false)}
                className="back-button"
              >
                ← Volver al Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // 🎯 FORMULARIO DE LOGIN PRINCIPAL
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="brand-title">TechNova</h1>
        </div>

        <h2>Iniciar sesión</h2>

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
                placeholder="alvarostivens13@gmail.com"
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
                placeholder="123456"
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

          {error && <div className="error-message">{error}</div>}

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
