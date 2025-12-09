/**
 * verificar_sesion.js - Manejo de sesiones y redirección
 */

class SesionAury {
    constructor() {
        this.usuario = this.obtenerUsuario();
        this.manejarSesion();
    }
    
    obtenerUsuario() {
        const usuarioData = localStorage.getItem('aury_usuario');
        try {
            return usuarioData ? JSON.parse(usuarioData) : null;
        } catch (e) {
            localStorage.removeItem('aury_usuario');
            return null;
        }
    }
    
    manejarSesion() {
        const paginaActual = window.location.pathname;
        
        // Si estamos en index.html y YA HAY sesión
        if (paginaActual.includes('index.html') || paginaActual.endsWith('/')) {
            if (this.usuario) {
                // Redirigir al inicio (chat.html o la página principal de tu app)
                setTimeout(() => {
                    window.location.href = 'chat.html';
                }, 100);
            }
        }
        
        // Si estamos en chat.html y NO HAY sesión
        if (paginaActual.includes('chat.html') && !this.usuario) {
            setTimeout(() => {
                alert('Por favor inicia sesión primero');
                window.location.href = 'index.html';
            }, 100);
        }
        
        // Actualizar interfaz según sesión
        this.actualizarInterfaz();
    }
    
    actualizarInterfaz() {
        // Ocultar/mostrar elementos según sesión
        if (this.usuario) {
            // Si hay sesión, ocultar botones de inicio/registro
            this.ocultarBotonesSesion();
            this.mostrarUsuario();
        }
    }
    
    ocultarBotonesSesion() {
        // Ocultar panel de "Inicia sesión" y botones relacionados
        const elementosAOcultar = [
            '.formulario-inicio',
            '#btn-inicio',
            '.panel-derecho .btn',
            '.panel-izquierdo .btn:not(#btn-registro)'
        ];
        
        elementosAOcultar.forEach(selector => {
            const elementos = document.querySelectorAll(selector);
            elementos.forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
            });
        });
        
        // Mostrar mensaje de bienvenida en lugar del formulario
        if (this.usuario && document.querySelector('.login-registro')) {
            const mensajeBienvenida = document.createElement('div');
            mensajeBienvenida.className = 'mensaje-bienvenida';
            mensajeBienvenida.innerHTML = `
                <h2>¡Bienvenido de vuelta, ${this.usuario.nombre}!</h2>
                <p>Serás redirigido automáticamente al chat...</p>
                <div class="cargando">
                    <div class="spinner"></div>
                    <p>Redirigiendo...</p>
                </div>
                <button onclick="SesionAury.cerrarSesion()" class="btn-cerrar">
                    Cerrar sesión
                </button>
            `;
            
            // Ocultar los formularios
            document.querySelector('.formulario-inicio')?.style.display = 'none';
            document.querySelector('.formulario-registro')?.style.display = 'none';
            
            // Agregar estilos
            const estilo = document.createElement('style');
            estilo.textContent = `
                .mensaje-bienvenida {
                    text-align: center;
                    padding: 30px;
                    background: rgba(102, 126, 234, 0.1);
                    border-radius: 10px;
                    margin: 20px 0;
                }
                .mensaje-bienvenida h2 {
                    color: #667eea;
                    margin-bottom: 15px;
                }
                .cargando {
                    margin: 20px 0;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 10px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .btn-cerrar {
                    background: #f44336;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 20px;
                }
                .btn-cerrar:hover {
                    background: #d32f2f;
                }
            `;
            document.head.appendChild(estilo);
            
            // Insertar mensaje
            const contenedor = document.querySelector('.login-registro');
            if (contenedor) {
                contenedor.appendChild(mensajeBienvenida);
            }
        }
    }
    
    mostrarUsuario() {
        // Mostrar información del usuario en la esquina
        const userBadge = document.createElement('div');
        userBadge.id = 'user-badge';
        userBadge.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <i class="fas fa-user-circle" style="font-size:24px;"></i>
                <span>${this.usuario.nombre}</span>
                <button onclick="SesionAury.cerrarSesion()" 
                        style="background:none; border:none; color:#666; cursor:pointer;">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        `;
        
        userBadge.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 10px 15px;
            border-radius: 25px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
        `;
        
        document.body.appendChild(userBadge);
    }
    
    static cerrarSesion() {
        localStorage.removeItem('aury_usuario');
        window.location.href = 'index.html';
    }
    
    static verificar() {
        return new SesionAury();
    }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    SesionAury.verificar();
});