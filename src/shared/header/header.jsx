import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout, getCurrentUser } from "../../acceso/services/auth.js";
import { getRoleNameById } from "../../roles/services/roles.js";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [rolNombre, setRolNombre] = useState("");
  const isLoggedIn = !!user;
  console.log(user)
  useEffect(() => {
    if (user?.fkRol) {
      const token = localStorage.getItem("token");
      getRoleNameById(user.fkRol, token)
        .then((nombre) => setRgolNombre(nombre || "Rol desconocido"))
        .catch((err) => {
          console.error("Error obteniendo rol:", err);
          setRolNombre("Error cargando rol");
        });
    }
  }, [user]);

  const handleLoginClick = () => navigate("/login");

  const handleLogoutClick = () => {
    logout();
    setUser(null);
    setRolNombre("");
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="app-title">
          <span className="highlighted-brand">CyberConect@2</span>
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
    </header>
  );
};

export default Header;
