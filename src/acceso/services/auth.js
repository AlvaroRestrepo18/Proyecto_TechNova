// services/auth.js
export const login = async (email, password) => {
  const response = await fetch("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, contrasena: password }),
  });

  if (!response.ok) {
    throw new Error("Credenciales inválidas");
  }

  const data = await response.json();
  console.log("Respuesta login:", data); // 👀 Ver qué trae la API

  // 🔥 Limpieza de localStorage para evitar datos viejos
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Guarda token nuevo
  localStorage.setItem("token", data.token);

  // 🔑 Guarda usuario completo (incluyendo fkRol)
  const userData = {
    idUsuario: data.idUsuario,
    nombre: data.nombre,
    email: data.email,
    fkRol: data.fkRol, // 👈 clave para tu Header
  };

  console.log("Guardando userData:", userData); // 👀 verificado

  localStorage.setItem("headerUser", JSON.stringify(userData));

  return userData; // ✅ devolvemos ya el objeto correcto
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Aquí puedes agregar cualquier otra limpieza necesaria
  window.location.href = "/login"; // Redirige al login
};

// 🔎 Siempre devuelve el usuario actual desde localStorage
export const getCurrentUser = () => {
  try {
    const stored = localStorage.getItem("headerUser");
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error("Error leyendo usuario de localStorage:", err);
    return null;
  }
};