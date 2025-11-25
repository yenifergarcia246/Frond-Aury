const btnInicio = document.querySelector("#btn-inicio");
const btnRegistro = document.querySelector("#btn-registro");
const contenedor = document.querySelector(".contenedor-principal");

btnRegistro.addEventListener("click", () => {
  contenedor.classList.add("modo-registro");
});

btnInicio.addEventListener("click", () => {
  contenedor.classList.remove("modo-registro");
});



// --- INICIO DE SESIÓN CON GOOGLE ---
document.addEventListener("DOMContentLoaded", () => {
  
  // Selecciona todos los íconos de Google del HTML
  const googleButtons = document.querySelectorAll(".google-login");

  googleButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        // Usa las funciones importadas en el HTML
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        console.log("Usuario autenticado:", user.displayName);

        // 👉 Redirige a tu página después del login
        window.location.href = "index.html";

      } catch (error) {
        console.error("Error al iniciar sesión con Google:", error);
        alert("No se pudo iniciar sesión con Google. Revisa la consola.");
      }
    });
  });

});