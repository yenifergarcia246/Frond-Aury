(function () {
    const btnRespirar = document.getElementById("btnRespirar");
    const tiempoRespirar = document.getElementById("tiempoRespirar");

    if (!btnRespirar || !tiempoRespirar) return;

    let tiempo = 0;
    let intervalo;

    const iniciarConteo = () => {
        intervalo = setInterval(() => {
            tiempo++;
            tiempoRespirar.textContent = tiempo;
        }, 1000);
    };

    const detenerConteo = () => {
        clearInterval(intervalo);
        tiempo = 0;
    };

    btnRespirar.addEventListener("mousedown", iniciarConteo);
    btnRespirar.addEventListener("mouseup", detenerConteo);

    btnRespirar.addEventListener("touchstart", iniciarConteo);
    btnRespirar.addEventListener("touchend", detenerConteo);
})();

(function () {
    const btnAntiestres = document.getElementById("btnAntiestres");

    if (!btnAntiestres) return;

    btnAntiestres.addEventListener("mouseover", () => {
        const x = Math.random() * window.innerWidth * 0.8;
        const y = Math.random() * window.innerHeight * 0.8;

        btnAntiestres.style.position = "absolute";
        btnAntiestres.style.left = x + "px";
        btnAntiestres.style.top = y + "px";
    });
})();

(function () {
    const muneco = document.getElementById("btnGolpe");
    const contadorTexto = document.getElementById("contadorGolpes");
    const barraVida = document.getElementById("barraVida");

    const sonidoGolpe = document.getElementById("sonidoGolpe");
    const sonidoDano = document.getElementById("sonidoDano");
    const sonidoKO = document.getElementById("sonidoKO");

    if (!muneco || !contadorTexto || !barraVida) return;

    let golpes = 0;
    let vida = 100;
    let puedeGolpear = true;

    muneco.addEventListener("click", () => {
        if (!puedeGolpear) return;

        golpes++;
        contadorTexto.textContent = golpes;

        vida -= 10;
        if (vida < 0) vida = 0;
        barraVida.style.width = vida + "%";

        sonidoGolpe.play();
        sonidoDano.play();

        muneco.classList.add("dolor");
        setTimeout(() => muneco.classList.remove("dolor"), 400);

        if (vida === 0) {
            KO();
        }
    });

    function KO() {
        puedeGolpear = false;
        sonidoKO.play();

        muneco.classList.add("caido");

        setTimeout(() => {
            regenerar();
        }, 2500);
    }

    function regenerar() {
        muneco.classList.add("regenerando");

        setTimeout(() => {
            vida = 100;
            barraVida.style.width = "100%";

            muneco.classList.remove("caido");
            muneco.classList.remove("regenerando");
            muneco.classList.add("regenerado");

            setTimeout(() => {
                muneco.classList.remove("regenerado");
                puedeGolpear = true;
            }, 600);

        }, 1200);
    }
})();

