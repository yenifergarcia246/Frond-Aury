const form = document.getElementById("registroForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const formData = new FormData(form);
    const data = {
        nombre: formData.get("nombre"),
        email: formData.get("email"),
        password: formData.get("password"),
    };

    try {
        const res = await fetch("http://127.0.0.1:5000/usuarios/agregar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
        mensaje.textContent = result.mensaje; 
        mensaje.style.color = "green";
        form.reset();
        } else {
        mensaje.textContent = result.mensaje;
        mensaje.style.color = "red";
        }

    } catch (error) {
        console.error(error);
        mensaje.textContent = "Error al conectarse con la API";
        mensaje.style.color = "red";
    }
});
