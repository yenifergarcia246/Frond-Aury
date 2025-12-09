/**
 * CONECTAR_CARPETAS.JS - Para estructuras con carpetas separadas
 * Coloca este archivo en la MISMA carpeta que tu chat.html
 */

class ConectorAurySeparado {
    constructor() {
        // CONFIGURACIÓN - AJUSTA SEGÚN TU ESTRUCTURA
        this.config = {
            // URL del servidor Python (Flask)
            urlPython: 'http://localhost:5000',
            
            // Ruta de tu API (si usas web_app.py)
            rutaAPI: '/api/chat',
            
            // Si tu Python está en subcarpeta 'chat/' o raíz
            pythonEnCarpetaChat: false, // cambia a true si está en carpeta chat/
            
            // Elementos de tu HTML (se detectan automáticamente)
            selectores: {
                chatContainer: '#chatMessages, .chat-messages, [id*="chat"], .chat-container',
                inputMensaje: '#messageInput, input[type="text"], input[placeholder*="mensaje"], input[placeholder*="escrib"]',
                botonEnviar: '#sendButton, button, [onclick*="send"], .send-btn',
                estado: '.status, [id*="status"], [class*="status"]'
            }
        };
        
        this.conectado = false;
        console.log('🔌 Conector Aury (carpetas separadas) iniciado');
        
        // Iniciar cuando el DOM cargue
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.iniciar());
        } else {
            this.iniciar();
        }
    }
    
    async iniciar() {
        console.log('📍 Ubicación actual:', window.location.pathname);
        
        // 1. Conectar con Python
        await this.conectarConPython();
        
        // 2. Configurar eventos en tu HTML
        this.configurarEventos();
        
        // 3. Mostrar ayuda si no hay conexión
        if (!this.conectado) {
            this.mostrarInstrucciones();
        }
    }
    
    async conectarConPython() {
        console.log('🔄 Intentando conectar con Python...');
        
        // Probar diferentes endpoints según tu estructura
        const endpoints = [
            this.config.urlPython + '/',
            this.config.urlPython + '/api/salud',
            this.config.urlPython + '/health',
            'http://localhost:5001/', // Puerto alternativo
            'http://127.0.0.1:5000/'  // localhost alternativo
        ];
        
        for (const endpoint of endpoints) {
            try {
                console.log(`🔍 Probando: ${endpoint}`);
                const response = await fetch(endpoint, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok || response.status === 200) {
                    this.conectado = true;
                    this.config.urlPython = endpoint.replace(/\/$/, ''); // Quitar / final
                    console.log(`✅ Conectado a: ${this.config.urlPython}`);
                    this.actualizarEstado('✓ Conectado a Python', 'success');
                    return true;
                }
            } catch (error) {
                console.log(`❌ Falló ${endpoint}:`, error.message);
            }
        }
        
        console.warn('⚠️ No se pudo conectar con Python');
        this.actualizarEstado('Python no conectado', 'warning');
        return false;
    }
    
    actualizarEstado(mensaje, tipo) {
        // Buscar elemento de estado en tu HTML
        const { estado } = this.config.selectores;
        const elemento = document.querySelector(estado);
        
        if (elemento) {
            elemento.textContent = mensaje;
            
            // Colores según tipo
            const colores = {
                success: '#4CAF50', // verde
                warning: '#FF9800', // naranja
                error: '#F44336',   // rojo
                info: '#2196F3'     // azul
            };
            
            elemento.style.color = colores[tipo] || '#666';
        }
    }
    
    configurarEventos() {
        const { inputMensaje, botonEnviar } = this.config.selectores;
        
        // 1. Configurar botón de enviar
        const botones = document.querySelectorAll(botonEnviar);
        botones.forEach(boton => {
            // Guardar evento original si existe
            const originalOnClick = boton.onclick;
            
            boton.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Ejecutar función original primero (si existe)
                if (originalOnClick) {
                    try {
                        originalOnClick.call(boton, e);
                    } catch (error) {
                        console.log('Evento original:', error);
                    }
                }
                
                // Nuestro procesamiento
                await this.procesarMensaje();
            });
            
            console.log(`🎯 Botón configurado: ${boton.id || boton.className}`);
        });
        
        // 2. Configurar tecla Enter en input
        const inputs = document.querySelectorAll(inputMensaje);
        inputs.forEach(input => {
            input.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    await this.procesarMensaje();
                }
            });
            
            console.log(`⌨️ Input configurado: ${input.id || input.placeholder}`);
        });
    }
    
    async procesarMensaje() {
        // Obtener mensaje del input
        const { inputMensaje } = this.config.selectores;
        const input = document.querySelector(inputMensaje);
        
        if (!input) {
            console.error('❌ No se encontró input para mensaje');
            return;
        }
        
        const texto = input.value.trim();
        if (!texto) return;
        
        console.log(`📤 Enviando mensaje (${texto.length} chars):`, texto.substring(0, 50));
        
        // Mostrar mensaje del usuario en el chat
        this.agregarAlChat(texto, 'user');
        
        // Limpiar input
        input.value = '';
        input.focus();
        
        // Enviar a Python
        if (this.conectado) {
            await this.enviarMensajeAPython(texto);
        } else {
            this.agregarAlChat('⚠️ Python no conectado. Ejecuta el servidor primero.', 'ai');
        }
    }
    
    async enviarMensajeAPython(mensaje) {
        // Mostrar indicador de "escribiendo"
        this.mostrarEscribiendo();
        
        try {
            // Intentar diferentes rutas de API
            const rutasAPI = [
                this.config.urlPython + '/chat',
                this.config.urlPython + '/api/chat',
                this.config.urlPython + '/process',
                this.config.urlPython + '/aury/chat'
            ];
            
            let respuestaExitosa = false;
            let datosRespuesta = null;
            
            for (const ruta of rutasAPI) {
                try {
                    console.log(`📡 Enviando a: ${ruta}`);
                    
                    const respuesta = await fetch(ruta, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            mensaje: mensaje,
                            usuario_id: this.obtenerIdUsuario(),
                            timestamp: new Date().toISOString(),
                            origen: 'web_frontend'
                        })
                    });
                    
                    if (respuesta.ok) {
                        datosRespuesta = await respuesta.json();
                        respuestaExitosa = true;
                        console.log(`✅ Respuesta recibida de: ${ruta}`);
                        break;
                    }
                } catch (error) {
                    console.log(`❌ Falló ${ruta}:`, error.message);
                }
            }
            
            // Ocultar "escribiendo"
            this.ocultarEscribiendo();
            
            if (respuestaExitosa && datosRespuesta) {
                // Mostrar respuesta de Aury
                const textoRespuesta = datosRespuesta.respuesta || 
                                     datosRespuesta.mensaje || 
                                     datosRespuesta.text ||
                                     'Respuesta recibida sin formato';
                
                this.agregarAlChat(textoRespuesta, 'ai');
            } else {
                this.agregarAlChat('❌ No se pudo obtener respuesta del servidor', 'ai');
            }
            
        } catch (error) {
            console.error('🔥 Error enviando mensaje:', error);
            this.ocultarEscribiendo();
            this.agregarAlChat(`Error de conexión: ${error.message}`, 'ai');
        }
    }
    
    agregarAlChat(texto, tipo) {
        const { chatContainer } = this.config.selectores;
        const container = document.querySelector(chatContainer);
        
        if (!container) {
            console.error('❌ No se encontró contenedor de chat');
            return;
        }
        
        // Crear elemento de mensaje
        const mensajeDiv = document.createElement('div');
        
        // Usar clases que ya tienes en tu CSS
        if (tipo === 'user') {
            mensajeDiv.className = 'message user-message';
        } else {
            mensajeDiv.className = 'message ai-message';
            
            // Formatear texto de Aury (mantener saltos de línea)
            texto = texto.replace(/\n/g, '<br>')
                         .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }
        
        mensajeDiv.innerHTML = tipo === 'user' ? texto : this.formatearTextoAury(texto);
        container.appendChild(mensajeDiv);
        
        // Scroll automático
        container.scrollTop = container.scrollHeight;
    }
    
    formatearTextoAury(texto) {
        // Formatear respuesta de Aury manteniendo estructura
        return texto
            .replace(/\n{2,}/g, '<br><br>')
            .replace(/🎯 (.*?):/g, '<strong style="color:#667eea">🎯 $1:</strong>')
            .replace(/💡 (.*?):/g, '<strong style="color:#4CAF50">💡 $1:</strong>')
            .replace(/🛠️ (.*?):/g, '<strong style="color:#FF9800">🛠️ $1:</strong>')
            .replace(/📋 (.*?):/g, '<strong style="color:#9C27B0">📋 $1:</strong>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }
    
    mostrarEscribiendo() {
        const { chatContainer } = this.config.selectores;
        const container = document.querySelector(chatContainer);
        
        if (!container) return;
        
        // Crear elemento de "escribiendo"
        const escribiendoDiv = document.createElement('div');
        escribiendoDiv.id = 'aury-escribiendo';
        escribiendoDiv.className = 'message ai-message';
        escribiendoDiv.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;color:#666;">
                <div class="dots-container">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <span>Aury está pensando...</span>
            </div>
        `;
        
        // Agregar estilos para los puntos
        if (!document.getElementById('estilos-dots')) {
            const estilos = document.createElement('style');
            estilos.id = 'estilos-dots';
            estilos.textContent = `
                .dots-container {
                    display: flex;
                    gap: 4px;
                }
                .dot {
                    width: 8px;
                    height: 8px;
                    background: #667eea;
                    border-radius: 50%;
                    animation: dot-pulse 1.4s infinite;
                }
                .dot:nth-child(2) { animation-delay: 0.2s; }
                .dot:nth-child(3) { animation-delay: 0.4s; }
                @keyframes dot-pulse {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-5px); opacity: 1; }
                }
            `;
            document.head.appendChild(estilos);
        }
        
        container.appendChild(escribiendoDiv);
        container.scrollTop = container.scrollHeight;
    }
    
    ocultarEscribiendo() {
        const escribiendo = document.getElementById('aury-escribiendo');
        if (escribiendo) escribiendo.remove();
    }
    
    obtenerIdUsuario() {
        // Generar o recuperar ID de usuario
        let id = localStorage.getItem('aury_user_id');
        if (!id) {
            id = 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
            localStorage.setItem('aury_user_id', id);
        }
        return id;
    }
    
    mostrarInstrucciones() {
        const { chatContainer } = this.config.selectores;
        const container = document.querySelector(chatContainer);
        
        if (!container) return;
        
        const instrucciones = document.createElement('div');
        instrucciones.className = 'message ai-message';
        instrucciones.innerHTML = `
            <h4 style="margin-top:0;color:#F44336;">⚠️ Instrucciones de conexión</h4>
            
            <p><strong>Tu estructura detectada:</strong></p>
            <ul style="margin:10px 0;padding-left:20px;">
                <li>Frontend HTML/JS: <code>${window.location.pathname}</code></li>
                <li>Python Aury: <code>${this.config.pythonEnCarpetaChat ? 'carpeta chat/' : 'carpeta raíz'}</code></li>
            </ul>
            
            <p><strong>Para conectar:</strong></p>
            <ol style="margin:10px 0;padding-left:20px;">
                <li>Abre una terminal en la carpeta de tu Python</li>
                <li>Ejecuta: <code>python server_aury.py</code></li>
                <li>Asegúrate que el servidor escuche en <code>http://localhost:5000</code></li>
                <li>Actualiza esta página</li>
            </ol>
            
            <p><em>Mientras tanto, puedes usar las dinámicas y ejercicios disponibles.</em></p>
        `;
        
        container.appendChild(instrucciones);
    }
}

// Inicializar automáticamente
window.AuryConnector = new ConectorAurySeparado();