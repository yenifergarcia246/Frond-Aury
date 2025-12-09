/**
 * registro.js - Conexión con API Flask
 * REDIRIGE A INDEX.HTML después del login/registro
 */

class RegistroAury {
    constructor() {
        this.API_URL = 'http://localhost:5000';
        this.formRegistro = document.getElementById('registroForm');
        this.formInicio = document.querySelector('.formulario-inicio');
        this.mensajeDiv = document.getElementById('mensaje');
        this.checkboxTerminos = document.getElementById('aceptoTerminos');
        this.btnRegistrar = document.getElementById('btnRegistrar');
        
        this.inicializar();
    }
    
    inicializar() {
        this.configurarEventos();
    }
    
    configurarEventos() {
        // Formulario de REGISTRO
        if (this.formRegistro) {
            this.formRegistro.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Validar checkbox de términos
                if (!this.validarTerminos()) {
                    return;
                }
                
                this.registrarUsuario();
            });
        }
        
        // Formulario de INICIO SESIÓN
        if (this.formInicio) {
            this.formInicio.addEventListener('submit', (e) => {
                e.preventDefault();
                this.iniciarSesion();
            });
        }
        
        // Cambiar estilo del botón según checkbox (SOLO REGISTRO)
        if (this.checkboxTerminos && this.btnRegistrar) {
            this.checkboxTerminos.addEventListener('change', () => {
                if (this.checkboxTerminos.checked) {
                    this.btnRegistrar.style.opacity = '1';
                    this.btnRegistrar.style.cursor = 'pointer';
                    this.btnRegistrar.disabled = false;
                } else {
                    this.btnRegistrar.style.opacity = '0.7';
                    this.btnRegistrar.style.cursor = 'not-allowed';
                    this.btnRegistrar.disabled = true;
                }
            });
            
            // Estado inicial del botón de REGISTRO
            this.btnRegistrar.style.opacity = '0.7';
            this.btnRegistrar.style.cursor = 'not-allowed';
            this.btnRegistrar.disabled = true;
        }
    }
    
    validarTerminos() {
        // Solo validar si existe el checkbox (en formulario de registro)
        if (this.checkboxTerminos && !this.checkboxTerminos.checked) {
            this.mostrarMensaje('❌ Debes aceptar los Términos y Condiciones', 'error');
            
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Términos Requeridos',
                    html: 'Debes aceptar los <b>Términos y Condiciones</b> y la <b>Política de Privacidad</b> para registrarte.<br><br>' +
                          '<a href="#" onclick="mostrarTerminos()" style="color: #667eea;">Ver Términos</a> | ' +
                          '<a href="#" onclick="mostrarPolitica()" style="color: #667eea;">Ver Política</a>',
                    confirmButtonColor: '#667eea'
                });
            }
            return false;
        }
        return true;
    }
    
    async registrarUsuario() {
        const nombre = this.formRegistro.querySelector('input[name="nombre"]').value.trim();
        const email = this.formRegistro.querySelector('input[name="email"]').value.trim();
        const password = this.formRegistro.querySelector('input[name="password"]').value;
        
        // Validaciones
        if (!nombre || !email || !password) {
            this.mostrarMensaje('❌ Completa todos los campos', 'error');
            return;
        }
        
        if (!this.validarEmail(email)) {
            this.mostrarMensaje('❌ Ingresa un correo válido', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.mostrarMensaje('❌ La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
        
        // Mostrar carga
        this.mostrarMensaje('🔄 Registrando usuario...', 'info');
        this.deshabilitarFormulario(true);
        
        try {
            const response = await fetch(`${this.API_URL}/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password })
            });
            
            const data = await response.json();
            
            if (response.status === 201) {
                // ✅ REGISTRO EXITOSO - REDIRIGIR A INDEX.HTML
                this.mostrarMensaje('✅ ¡Registro exitoso! Redirigiendo al menú...', 'success');
                
                // Guardar sesión
                localStorage.setItem('aury_usuario', JSON.stringify({
                    id: data.usuario?.id || Date.now(),
                    nombre: nombre,
                    email: email,
                    registrado: new Date().toISOString(),
                    aceptoTerminos: true
                }));
                
                // ✅ REDIRIGIR A INDEX.HTML (MENÚ PRINCIPAL)
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } else if (response.status === 409) {
                this.mostrarMensaje('⚠️ Este correo ya está registrado', 'warning');
            } else {
                this.mostrarMensaje(`❌ ${data.error || 'Error en registro'}`, 'error');
            }
            
        } catch (error) {
            console.error('Error en registro:', error);
            this.mostrarMensaje('❌ Error de conexión con el servidor', 'error');
        } finally {
            this.deshabilitarFormulario(false);
        }
    }
    
    async iniciarSesion() {
        const usuarioInput = this.formInicio.querySelector('input[name="usuario"]');
        const password = this.formInicio.querySelector('input[name="password"]').value;
        const email = usuarioInput.value.trim();
        
        if (!email || !password) {
            this.mostrarMensaje('❌ Completa todos los campos', 'error');
            return;
        }
        
        this.mostrarMensaje('🔄 Iniciando sesión...', 'info');
        this.deshabilitarFormulario(true);
        
        try {
            const response = await fetch(`${this.API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.status === 200) {
                // ✅ INICIO DE SESIÓN EXITOSO - REDIRIGIR A INDEX.HTML
                this.mostrarMensaje('✅ ¡Inicio de sesión exitoso! Redirigiendo al menú...', 'success');
                
                localStorage.setItem('aury_usuario', JSON.stringify({
                    id: data.usuario?.id || Date.now(),
                    nombre: data.usuario?.nombre || email.split('@')[0],
                    email: email,
                    iniciado: new Date().toISOString()
                }));
                
                // ✅ REDIRIGIR A INDEX.HTML (MENÚ PRINCIPAL)
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } else if (response.status === 404) {
                this.mostrarMensaje('❌ Usuario no encontrado', 'error');
            } else if (response.status === 401) {
                this.mostrarMensaje('❌ Contraseña incorrecta', 'error');
            } else {
                this.mostrarMensaje(`❌ ${data.error || 'Error en inicio de sesión'}`, 'error');
            }
            
        } catch (error) {
            console.error('Error en login:', error);
            this.mostrarMensaje('❌ Error de conexión con el servidor', 'error');
        } finally {
            this.deshabilitarFormulario(false);
        }
    }
    
    deshabilitarFormulario(deshabilitar) {
        // Determinar qué formulario está activo
        const contenedor = document.querySelector('.contenedor-principal');
        let formularioActivo = null;
        
        if (contenedor && contenedor.classList.contains('modo-registro')) {
            formularioActivo = this.formRegistro;
        } else {
            formularioActivo = this.formInicio;
        }
        
        if (formularioActivo) {
            const inputs = formularioActivo.querySelectorAll('input');
            const botones = formularioActivo.querySelectorAll('button, input[type="submit"]');
            
            inputs.forEach(input => {
                if (input.type !== 'checkbox') {
                    input.disabled = deshabilitar;
                }
            });
            
            botones.forEach(boton => {
                boton.disabled = deshabilitar;
            });
        }
    }
    
    validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    mostrarMensaje(texto, tipo) {
        if (!this.mensajeDiv) {
            this.mensajeDiv = document.createElement('div');
            this.mensajeDiv.id = 'mensaje';
            const contenedor = document.querySelector('.login-registro');
            if (contenedor) {
                contenedor.appendChild(this.mensajeDiv);
            }
        }
        
        this.mensajeDiv.textContent = texto;
        
        const estilos = {
            success: { background: '#4CAF50', color: 'white' },
            error: { background: '#F44336', color: 'white' },
            warning: { background: '#FF9800', color: 'white' },
            info: { background: '#2196F3', color: 'white' }
        };
        
        Object.assign(this.mensajeDiv.style, {
            padding: '12px 20px',
            borderRadius: '8px',
            margin: '15px 0',
            textAlign: 'center',
            fontWeight: '500',
            transition: 'all 0.3s',
            ...estilos[tipo]
        });
        
        if (tipo !== 'success') {
            setTimeout(() => {
                this.mensajeDiv.style.opacity = '0';
                setTimeout(() => {
                    this.mensajeDiv.textContent = '';
                    this.mensajeDiv.style.opacity = '1';
                }, 300);
            }, 5000);
        }
    }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    new RegistroAury();
});