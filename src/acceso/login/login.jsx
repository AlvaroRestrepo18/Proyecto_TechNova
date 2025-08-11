import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('tomcook@example.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (password.length >= 6) {
        // Guardar sesión visual en localStorage
        localStorage.setItem('user', JSON.stringify({
          nombre: 'Sacardona Cardona Muñoz',
          rol: 'Administrador'
        }));
        navigate('/dashboard');
      } else {
        setError('La contraseña debe tener al menos 6 caracteres');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Iniciar sesión</h1>

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
                placeholder="Ingresa tu correo electrónico"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña*</label>
            <div className="auth-input-field">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            <div className="forgot-password">
              <a href="/forgot">¿Olvidaste tu contraseña?</a>
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

        <div className="login-footer">
          <a href="/terms">Términos de Uso</a> | <a href="/privacy">Política de Privacidad</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
