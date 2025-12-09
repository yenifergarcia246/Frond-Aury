/**
 * proteger_chat.js - Verifica sesión antes de permitir acceso al chat
 */

class ProtegerChat {
    constructor() {
        this.usuario = this.verificarSesion();
        this.protegerAcceso();
    }
    
    verificarSesion() {
        const usuarioData = localStorage.getItem('aury_usuario');
        if (usuarioData) {
            try {
                return JSON.parse(usuarioData);
            } catch (e) {
                console.error('Error parseando sesión:', e);
                localStorage.removeItem('aury_usuario');
                return null;
            }
        }
        return null;
    }
    
    protegerAcceso() {
        // Si no hay sesión y estamos en chat.html, redirigir
        if (!this.usuario && window.location.pathname.includes('chat.html')) {
            alert('Debes iniciar sesión para acceder al chat');
            window.location.href = 'index.html';
            return;
        }
        
        // Si hay sesión, mostrar info del usuario
        if (this.usuario) {
            this.mostrarUsuario();
        }
    }
    
    mostrarUsuario() {
        // Buscar donde mostrar el nombre de usuario
        const header = document.querySelector('.header, header, .user-info');
        if (header && this.usuario.nombre) {
            const userSpan = document.createElement('span');
            userSpan.className = 'usuario-activo';
            userSpan.textContent = `👤 ${this.usuario.nombre}`;
            userSpan.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(255,255,255,0.1);
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 14px;
            `;
            
            // Agregar botón de cerrar sesión
            userSpan.addEventListener('click', () => {
                if (confirm('¿Cerrar sesión?')) {
                    localStorage.removeItem('aury_usuario');
                    window.location.href = 'index.html';
                }
            });
            
            header.appendChild(userSpan);
        }
    }
    
    static cerrarSesion() {
        localStorage.removeItem('aury_usuario');
        window.location.href = 'index.html';
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    new ProtegerChat();
});