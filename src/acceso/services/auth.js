// src/services/auth.js

export const authService = {
  // 🔐 LOGIN - Adaptado a tu backend (sin modelos extra)
  async login(email, password) {
    try {
      console.log("🔐 Intentando login con:", email);

      const response = await fetch("https://localhost:7228/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Si la respuesta no tiene JSON válido, evitamos errores
      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("📨 Respuesta del servidor:", data);

      if (!response.ok) {
        throw new Error(data.message || "Credenciales inválidas o error del servidor");
      }

      // 🧹 Limpiar cualquier sesión anterior
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("headerUser");

      // 🔥 Guardar token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // 👤 Preparar usuario según lo que devuelva tu backend
      const userData = {
        idUsuario: data.user?.id || data.idUsuario || 0,
        nombre: data.user?.nombre || data.nombre || "Sin nombre",
        email: data.user?.email || data.email || email,
        fkRol: data.user?.rol || data.rol || "Sin rol",
      };

      console.log("💾 Guardando userData:", userData);
      localStorage.setItem("headerUser", JSON.stringify(userData));

      return {
        success: true,
        user: userData,
        token: data.token,
        message: data.message || "Inicio de sesión exitoso",
      };
    } catch (error) {
      console.error("❌ Error en login:", error);
      return {
        success: false,
        message: error.message || "Error al iniciar sesión",
      };
    }
  },

  // 📧 RECUPERAR CONTRASEÑA
  async recuperarContrasena(email) {
    try {
      console.log("📧 Recuperando contraseña para:", email);

      const response = await fetch("https://localhost:7228/api/auth/recuperar-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("📨 Respuesta recuperación:", data);

      if (!response.ok) {
        throw new Error(data.message || "Error al recuperar contraseña");
      }

      return { success: true, message: data.message || "Correo enviado con éxito" };
    } catch (error) {
      console.error("❌ Error recuperando contraseña:", error);
      return { success: false, message: error.message };
    }
  },

  // 🔑 RESETEAR CONTRASEÑA
  async resetearContrasena(codigo, nuevaContrasena) {
    try {
      console.log("🔑 Reseteando contraseña con código:", codigo);

      const response = await fetch("https://localhost:7228/api/auth/resetear-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, nuevaContrasena }),
      });

      const data = await response.json();
      console.log("📨 Respuesta reset:", data);

      if (!response.ok) {
        throw new Error(data.message || "Error al resetear contraseña");
      }

      return { success: true, message: data.message || "Contraseña actualizada correctamente" };
    } catch (error) {
      console.error("❌ Error reseteando contraseña:", error);
      return { success: false, message: error.message };
    }
  },

  // 🚪 LOGOUT
  logout() {
    console.log("🚪 Cerrando sesión...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("headerUser");
    window.location.href = "/login";
  },

  // 👤 OBTENER USUARIO ACTUAL
  getCurrentUser() {
    try {
      const stored = localStorage.getItem("headerUser");
      const user = stored ? JSON.parse(stored) : null;
      console.log("👤 Usuario actual:", user);
      return user;
    } catch (err) {
      console.error("❌ Error leyendo usuario:", err);
      return null;
    }
  },

  // 🔐 OBTENER TOKEN
  getToken() {
    const token = localStorage.getItem("token");
    console.log("🔐 Token actual:", token ? "✅ Presente" : "❌ Ausente");
    return token;
  },

  // ✅ VERIFICAR SI ESTÁ AUTENTICADO
  isAuthenticated() {
    const authenticated = !!localStorage.getItem("token");
    console.log("🔍 Autenticado:", authenticated);
    return authenticated;
  },
};

// 🎯 Exportar también funciones individuales
export const login = authService.login;
export const logout = authService.logout;
export const getCurrentUser = authService.getCurrentUser;
export const recuperarContrasena = authService.recuperarContrasena;
export const resetearContrasena = authService.resetearContrasena;
