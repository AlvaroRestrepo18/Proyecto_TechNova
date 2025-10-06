// src/acceso/forgot/forgot.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../login/login.css';
import { recuperarContrasena } from '../services/auth';

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('El email es obligatorio');
      setLoading(false);
      return;
    }

    try {
      const res = await recuperarContrasena(email);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate('/reset-password'), 2000); // redirige a resetpassword
      } else {
        setError(res.message || 'Error enviando código');
      }
    } catch (err) {
      setError(err.message || 'Error inesperado');
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

        <h1>Recuperar contraseña</h1>

        {success ? (
          <div className="success-message">
            <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
            <p>Se ha enviado un código a tu correo electrónico.</p>
            <p>Redirigiendo a restablecer contraseña...</p>
          </div>
        ) : (
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
                  placeholder="Ingresa tu correo"
                  required
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar código'}
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

export default Forgot;
