const btnInicio = document.querySelector("#btn-inicio");
const btnRegistro = document.querySelector("#btn-registro");
const contenedor = document.querySelector(".contenedor-principal");

btnRegistro.addEventListener("click", () => {
  contenedor.classList.add("modo-registro");
});

btnInicio.addEventListener("click", () => {
  contenedor.classList.remove("modo-registro");
});


// ESta parte es sobre la conexion que hice con el firebase

// Esperar a que el contenido cargue
document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar todos los íconos de Google (login y registro)
  const botonesGoogle = document.querySelectorAll(".icono-red .fa-google");

  // Agregar evento a cada uno
  botonesGoogle.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      e.preventDefault();
      alert("🔒 Próximamente podrás iniciar sesión con Google 😄");
    });
  });
});
