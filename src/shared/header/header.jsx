import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from "../../acceso/services/auth";

import { getRoles } from "../../roles/services/roles.js";

const Header = () => {
  const navigate = useNavigate();

  const getStoredUser = () => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  };

  const [user, setUser] = useState(getStoredUser());
  const [isLoggedIn, setIsLoggedIn] = useState(!!getStoredUser());
  const [rolNombre, setRolNombre] = useState("");

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setIsLoggedIn(!!storedUser);

    // si hay usuario logueado, traemos roles
    if (storedUser) {
      getRoles()
        .then((roles) => {
          const rol = roles.find((r) => r.idRol === storedUser.fkRol);
          if (rol) setRolNombre(rol.nombre);
        })
        .catch((err) => {
          console.error("Error obteniendo roles:", err);
        });
    }
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    logout();
    setUser(null);
    setIsLoggedIn(false);
    setRolNombre(""); // limpiar rol
    navigate("/login");
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
