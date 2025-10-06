import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * 🔒 PrivateRoute
 * Protege rutas que solo deben verse si el usuario ha iniciado sesión.
 * Verifica la existencia del token en localStorage.
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Si no hay token, redirige al login
  if (!token) {
    console.warn("🚫 Intento de acceso sin login, redirigiendo...");
    return <Navigate to="/login" replace />;
  }

  // ✅ Si hay token, muestra la ruta protegida
  return children ? children : <Outlet />;
};

export default PrivateRoute;
