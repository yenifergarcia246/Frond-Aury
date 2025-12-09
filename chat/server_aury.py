# aury_completa.py - Todo en un archivo
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import sys
import json
from datetime import datetime
import random

# ==================== AURY LOCAL (sin APIs) ====================
class AuryConfig:
    def __init__(self):
        self.modo = "local_terapeutico"
        print("✅ Configuración local activada")

class AuryPsicologaIA:
    def __init__(self, config):
        self.config = config
        self.historial = []
        print("🧠 AURY - Psicóloga Virtual inicializada")
    
    def procesar_mensaje(self, mensaje, usuario_id):
        """Procesa mensajes con respuestas terapéuticas locales"""
        
        print(f"💭 Procesando: '{mensaje[:50]}...' de {usuario_id}")
        
        # Respuestas empáticas predefinidas
        respuestas = [
            f"Entiendo que estés compartiendo esto: '{mensaje[:40]}...'. Es valiente expresar lo que sientes. ¿Puedes contarme más sobre esta experiencia?",
            f"Veo que esto es importante para ti. Las emociones que describes merecen atención cuidadosa. ¿Cómo ha afectado esto tu día?",
            f"Gracias por confiar en mí. Estoy aquí para escucharte sin juicio. ¿Qué aspecto de esto te resulta más difícil?",
            f"Lo que describes resuena con autenticidad. A veces nombrar lo que sentimos ya es un paso sanador. ¿Hay algo específico en lo que te gustaría trabajar?"
        ]
        
        # Técnicas prácticas
        tecnicas = [
            "🌬️ **Respiración consciente**: 4 segundos inhalar, 4 mantener, 4 exhalar. Repite 5 veces",
            "📝 **Descarga emocional**: Escribe por 7 minutos sin parar ni juzgar",
            "🚶 **Caminata atenta**: Camina 10 minutos prestando atención a cada paso",
            "🎨 **Expresión no verbal**: Dibuja o modela con arcilla lo que sientes",
            "🧘 **Escaneo corporal**: Recorre tu cuerpo mentalmente, soltando tensión"
        ]
        
        # Reflexiones
        reflexiones = [
            "¿Qué necesita tu corazón en este momento?",
            "Si esta emoción tuviera un mensaje para ti, ¿qué sería?",
            "¿Qué pequeño autocuidado podrías ofrecerte ahora?",
            "¿Cómo sería tratarte con la misma compasión que le ofreces a un ser querido?"
        ]
        
        respuesta_base = random.choice(respuestas)
        tecnica = random.choice(tecnicas)
        reflexion = random.choice(reflexiones)
        
        return f"""🧠 **AURY - ACOMPAÑAMIENTO EMOCIONAL**

{respuesta_base}

🎯 **TÉCNICA PRÁCTICA:**
{tecnica}

💭 **PARA REFLEXIONAR:**
{reflexion}

---

✨ **Recuerda:** 
• Todas las emociones son válidas
• Este momento no es permanente
• Mereces cuidado y comprensión

¿Hay algo más específico de lo que te gustaría hablar?"""

# ==================== SERVIDOR FLASK ====================
app = Flask(__name__, static_folder=os.path.dirname(os.path.abspath(__file__)))
CORS(app)

# Inicializar Aury
config = AuryConfig()
aury = AuryPsicologaIA(config)

print("\n" + "="*60)
print("🚀 AURY COMPLETA - TODO EN UNO")
print("="*60)
print("✅ Backend: Python/Flask")
print("✅ IA: Aury Local (sin APIs)")
print("✅ Frontend: HTML estático")
print(f"✅ Puerto: 5000")
print("="*60)

# ==================== RUTAS ====================
@app.route('/')
def index():
    try:
        return send_from_directory('.', 'chat.html')
    except:
        return """
        <html>
            <body style="font-family: Arial; padding: 40px; text-align: center;">
                <h1>🧠 AURY - Chat Emocional</h1>
                <p>Ve a <a href="/chat.html">/chat.html</a> para el chat</p>
                <p>API: <a href="/api/salud">/api/salud</a></p>
            </body>
        </html>
        """

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)

@app.route('/api/salud')
def salud():
    return jsonify({
        'estado': 'activo',
        'servicio': 'Aury Chat Local',
        'aury': 'conectada',
        'hora': datetime.now().strftime("%H:%M:%S")
    })

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        mensaje = data.get('mensaje', '')
        usuario_id = data.get('usuario_id', 'anonimo')
        
        if not mensaje:
            return jsonify({'error': 'Mensaje vacío'})
        
        print(f"\n📨 MENSAJE RECIBIDO de {usuario_id}: {mensaje[:50]}...")
        
        # Procesar con Aury
        respuesta = aury.procesar_mensaje(mensaje, usuario_id)
        
        print(f"📤 RESPUESTA ENVIADA: {respuesta[:50]}...")
        
        return jsonify({
            'respuesta': respuesta,
            'usuario': usuario_id,
            'estado': 'ok',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return jsonify({
            'error': str(e),
            'respuesta': 'Error procesando el mensaje',
            'estado': 'error'
        }), 500

# ==================== INICIAR ====================
if __name__ == '__main__':
    print("\n📡 Endpoints disponibles:")
    print("   http://localhost:5000/          - Página principal")
    print("   http://localhost:5000/chat.html - Chat con Aury")
    print("   http://localhost:5000/api/salud - Estado del servidor")
    print("   POST http://localhost:5000/chat - Enviar mensajes")
    print("\n✨ Servidor listo. Abre tu navegador en http://localhost:5000/")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
    