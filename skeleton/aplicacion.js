/**
 * aplicacion.js - Manejo de animaciones y Firebase
 * Versión CORREGIDA: No redirige a chat.html, se queda en index.html
 */

// ==================== CONFIGURACIÓN INICIAL ====================

// Verificar si hay sesión activa al cargar
document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem('aury_usuario') || 'null');
    const enIndex = window.location.pathname.includes('index.html') || 
                    window.location.pathname.endsWith('/');
    
    // Si estamos en index.html y YA HAY sesión
    if (enIndex && usuario) {
        console.log(`✅ Usuario logueado: ${usuario.nombre}`);
        
        // NO ocultar elementos, solo actualizar interfaz
        actualizarInterfazConSesion(usuario);
        return;
    }
    
    // Solo ejecutar animaciones si estamos en registro.html
    if (window.location.pathname.includes('registro.html')) {
        inicializarAnimaciones();
        inicializarFirebase();
    }
});

// ==================== ANIMACIONES DE FORMULARIO ====================

function inicializarAnimaciones() {
    const btnInicio = document.querySelector("#btn-inicio");
    const btnRegistro = document.querySelector("#btn-registro");
    const contenedor = document.querySelector(".contenedor-principal");
    
    if (btnInicio && btnRegistro && contenedor) {
        // Evento para mostrar formulario de registro
        btnRegistro.addEventListener("click", () => {
            contenedor.classList.add("modo-registro");
            // Scroll suave al formulario
            document.querySelector('.contenedor-formularios').scrollIntoView({
                behavior: 'smooth'
            });
        });
        
        // Evento para mostrar formulario de inicio
        btnInicio.addEventListener("click", () => {
            contenedor.classList.remove("modo-registro");
            // Scroll suave al formulario
            document.querySelector('.contenedor-formularios').scrollIntoView({
                behavior: 'smooth'
            });
        });
        
        console.log('✅ Animaciones de formulario activadas');
    }
}

// ==================== FIREBASE / GOOGLE AUTH ====================

function inicializarFirebase() {
    // Seleccionar todos los íconos de Google (solo en registro.html)
    const botonesGoogle = document.querySelectorAll(".icono-red .fa-google, .iconos-redes .fa-google");
    
    if (botonesGoogle.length > 0) {
        botonesGoogle.forEach((boton) => {
            boton.addEventListener("click", (e) => {
                e.preventDefault();
                manejarGoogleAuth();
            });
        });
        console.log(`✅ ${botonesGoogle.length} botones Google configurados`);
    }
}

function manejarGoogleAuth() {
    // Por ahora muestra un mensaje y simula login
    
    Swal.fire({
        title: '🔐 Inicio con Google',
        text: 'Próximamente podrás iniciar sesión con tu cuenta de Google',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#667eea',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Simular Login',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            simularLoginGoogle();
        }
    });
}

function simularLoginGoogle() {
    // Simulación de login con Google
    Swal.fire({
        title: 'Iniciando sesión...',
        html: 'Conectando con Google <b></b>',
        timer: 1500,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        }
    }).then(() => {
        // Crear usuario simulado
        const usuarioGoogle = {
            id: 'google_' + Date.now(),
            nombre: 'Usuario Google',
            email: 'usuario@gmail.com',
            provider: 'google',
            avatar: 'https://ui-avatars.com/api/?name=Usuario+Google&background=667eea&color=fff',
            fecha: new Date().toISOString()
        };
        
        // Guardar en localStorage
        localStorage.setItem('aury_usuario', JSON.stringify(usuarioGoogle));
        
        // Mostrar éxito
        Swal.fire({
            title: '✅ ¡Sesión iniciada!',
            text: 'Redirigiendo al menú principal...',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false
        }).then(() => {
            // ✅ CORREGIDO: Redirigir a index.html (menú principal)
            window.location.href = 'index.html';
        });
    });
}

// ==================== MANEJO DE SESIÓN EN INDEX.HTML ====================

function actualizarInterfazConSesion(usuario) {
    console.log('🔄 Actualizando interfaz para usuario logueado...');
    
    // 1. Actualizar el botón de "Iniciar sesión" en index.html
    const botonInicio = document.querySelector('.boton-iniciar');
    if (botonInicio) {
        botonInicio.textContent = `Cerrar sesión (${usuario.nombre})`;
        botonInicio.href = '#';
        botonInicio.onclick = function(e) {
            e.preventDefault();
            cerrarSesion();
        };
        botonInicio.style.backgroundColor = '#ff4444'; // Rojo para indicar cerrar sesión
        botonInicio.style.color = 'white';
    }
    
    // 2. Mostrar indicador de sesión
    mostrarIndicadorSesion(usuario);
    
    // 3. Habilitar enlaces protegidos (chat y dinámicas)
    const enlacesProtegidos = document.querySelectorAll('.chat-link');
    enlacesProtegidos.forEach(enlace => {
        enlace.onclick = null; // Quitar cualquier bloqueo previo
        enlace.style.cursor = 'pointer';
    });
    
    console.log('✅ Interfaz actualizada para usuario logueado');
}

function mostrarIndicadorSesion(usuario) {
    // Crear o actualizar indicador de sesión
    let indicador = document.querySelector('.indicador-sesion');
    
    if (!indicador) {
        indicador = document.createElement('div');
        indicador.className = 'indicador-sesion';
        document.body.appendChild(indicador);
    }
    
    indicador.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
            <i class="fas fa-user-circle" style="font-size:20px;"></i>
            <span style="font-weight:bold;">${usuario.nombre}</span>
            <small style="opacity:0.7;">(${usuario.email})</small>
        </div>
    `;
    
    indicador.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        padding: 10px 15px;
        border-radius: 25px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        font-size: 14px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(102, 126, 234, 0.2);
        animation: slideInRight 0.5s ease;
    `;
    
    // Agregar estilo de animación si no existe
    if (!document.getElementById('estilos-animacion')) {
        const estilo = document.createElement('style');
        estilo.id = 'estilos-animacion';
        estilo.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(estilo);
    }
}

// ==================== FUNCIONES GLOBALES ====================

// Función para cerrar sesión
function cerrarSesion() {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: 'Volverás a la página de inicio',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#667eea',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('aury_usuario');
            window.location.reload();
        }
    });
}

// Función para obtener usuario actual
function obtenerUsuarioActual() {
    const usuarioData = localStorage.getItem('aury_usuario');
    if (!usuarioData) return null;
    
    try {
        return JSON.parse(usuarioData);
    } catch {
        localStorage.removeItem('aury_usuario');
        return null;
    }
}

// Función para verificar si hay sesión activa
function haySesionActiva() {
    return localStorage.getItem('aury_usuario') !== null;
}

// Función para proteger enlaces (se llama desde index.html)
function protegerEnlace(paginaDestino) {
    const usuario = obtenerUsuarioActual();
    
    if (!usuario) {
        event.preventDefault();
        Swal.fire({
            title: 'Inicia sesión primero',
            text: 'Para acceder a esta funcionalidad, necesitas iniciar sesión o registrarte',
            icon: 'info',
            confirmButtonText: 'Ir a registro',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            confirmButtonColor: '#667eea'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'registro.html';
            }
        });
        return false;
    }
    return true;
}

// ==================== INICIALIZACIÓN ADICIONAL ====================

// Agregar SweetAlert2 si no está cargado
if (typeof Swal === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    script.onload = () => console.log('✅ SweetAlert2 cargado');
    document.head.appendChild(script);
}

// Exponer funciones globalmente
window.cerrarSesion = cerrarSesion;
window.obtenerUsuarioActual = obtenerUsuarioActual;
window.haySesionActiva = haySesionActiva;
window.protegerEnlace = protegerEnlace;

console.log('✅ aplicacion.js cargado correctamente');