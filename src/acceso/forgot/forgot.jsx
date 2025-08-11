import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../login/login.css'; // Reutilizamos los mismos estilos

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      if (email.includes('@')) {
        setSuccess(true);
      } else {
        setError('Por favor ingresa un correo electrónico válido');
      }
      setLoading(false);
    }, 1500);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button 
          onClick={handleBackToLogin}
          className="back-button"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Volver al login
        </button>
        
        <h1>Recuperar contraseña</h1>
        
        {success ? (
          <div className="success-message">
            <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
            <p>Hemos enviado un enlace para restablecer tu contraseña al correo electrónico proporcionado.</p>
            <p>Por favor revisa tu bandeja de entrada.</p>
          </div>
        ) : (
          <>
            <p className="instructions">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            
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
              
              {error && <div className="error-message">{error}</div>}
              
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
            </form>
          </>
        )}

        <div className="login-footer">
          <a href="/terms">Términos de Uso</a> | <a href="/privacy">Política de Privacidad</a>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
