const btnInicio = document.querySelector("#btn-inicio");
const btnRegistro = document.querySelector("#btn-registro");
const contenedor = document.querySelector(".contenedor-principal");

btnRegistro.addEventListener("click", () => {
  contenedor.classList.add("modo-registro");
});

btnInicio.addEventListener("click", () => {
  contenedor.classList.remove("modo-registro");
});
