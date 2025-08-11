import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../login/login.css'; // Reutiliza estilos existentes

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (newPassword.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
      } else if (newPassword !== confirmPassword) {
        setError('Las contraseñas no coinciden');
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      }
      setLoading(false);
    }, 1200);
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button onClick={handleBack} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Volver al login
        </button>

        <h1>Restablecer contraseña</h1>

        {success ? (
          <div className="success-message">
            <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
            <p>¡Tu contraseña ha sido restablecida exitosamente!</p>
            <p>Redirigiendo al inicio de sesión...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
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

            {error && <div className="error-message">{error}</div>}

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
