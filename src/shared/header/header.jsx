import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout, getCurrentUser } from "../../acceso/services/auth.js";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [rolNombre, setRolNombre] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const isLoggedIn = !!user;

  useEffect(() => {
    if (user?.fkRol) {
      setRolNombre(user.fkRol);
    } else {
      setRolNombre("Rol desconocido");
    }
  }, [user]);

  const handleLoginClick = () => navigate("/login");

  const handleLogoutClick = () => setShowConfirm(true);

  const handleCancel = () => setShowConfirm(false);

  const handleConfirmLogout = () => {
    logout();
    setUser(null);
    setRolNombre("");
    setShowConfirm(false);
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="app-title">
          <span className="highlighted-brand">TechNova</span>
        </h1>
      </div>

      <div className="header-right">
        {!isLoggedIn ? (
          <button className="Hlogin-button" onClick={handleLoginClick}>
            <FontAwesomeIcon icon={faSignInAlt} /> Iniciar sesión
          </button>
        ) : (
          <>
            <div className="admin-info">
              <p className="admin-role">{rolNombre || "Cargando rol..."}</p>
              <p className="admin-name">{user?.nombre}</p>
            </div>
            <div className="admin-avatar">
              {user?.nombre
                ?.split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <button className="Hlogout-button" onClick={handleLogoutClick}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar sesión
            </button>
          </>
        )}
      </div>

      {/* === MODAL DE CONFIRMACIÓN === */}
      {showConfirm && (
        <div className="logout-confirm-overlay">
          <div className="logout-confirm-modal">
            <h3>¿Seguro que quieres cerrar sesión?</h3>
            <p>🤔 Si lo haces, tendrás que iniciar sesión otra vez.</p>
            <div className="logout-confirm-actions">
              <button className="cancel-btn" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="confirm-btn" onClick={handleConfirmLogout}>
                Sí, cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
