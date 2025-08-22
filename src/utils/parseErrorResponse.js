export function parseErrorResponse(err) {
  let mensaje = "Hubo un error inesperado.";

  if (err.response) {
    const data = err.response.data;

    // 🔹 Si el backend devuelve validaciones tipo { errors: { Email: ["ya existe"] } }
    if (data?.errors) {
      const errores = data.errors;
      // Tomamos el primer mensaje disponible
      mensaje = Object.values(errores).flat()[0];
    } 
    // 🔹 Si viene un título (ej: "Bad Request")
    else if (data?.title) {
      mensaje = data.title;
    } 
    // 🔹 Si es un string plano
    else if (typeof data === "string") {
      mensaje = data;
    }
  }

  return mensaje;
}
