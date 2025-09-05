// services/auth.js
export const login = async (email, password) => {
  const response = await fetch("https://cyber360-api.onrender.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, contrasena: password }),
  });

  if (!response.ok) {
    throw new Error("Credenciales inválidas"); // ❌ si la API dice que no está ok
  }

  const data = await response.json();
  localStorage.setItem("token", data.token); // 🔑 guarda el JWT real
  return data; // ⬅ aquí deberían venir datos del usuario
};
