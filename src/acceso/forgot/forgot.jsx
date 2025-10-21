import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recuperarContrasena } from '../services/auth';
import './forgot.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const res = await recuperarContrasena(email);
    if (res.success) {
      setMessage('📩 Revisa tu correo para continuar');
      setTimeout(() => navigate('/reset'), 2000);
    } else {
      setError(res.message || 'Error al enviar correo');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>¿Olvidaste tu contraseña?</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Enviar correo
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
