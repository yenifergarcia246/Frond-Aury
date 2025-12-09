"""
SafeHaven - Versión Web
"""
import streamlit as st
import google.genai as genai
from google.genai.types import Content, Part
import datetime
import random
from PIL import Image
import base64

from config import config
from emotional_support import EmotionalSupportBot
from crisis_resources import CrisisResources

st.set_page_config(
    page_title="SafeHaven - Espacio Seguro",
    page_icon="🌈",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS personalizado
st.markdown("""
<style>
    .stApp {
        background-color: #f8f9fa;
    }
    .main-header {
        color: #2E86AB;
        text-align: center;
        padding: 1rem;
    }
    .safe-message {
        background-color: #E8F4F8;
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
        border-left: 5px solid #2E86AB;
    }
    .user-message {
        background-color: #F0F7FF;
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
        border-left: 5px solid #4A90E2;
    }
    .crisis-alert {
        background-color: #FFE6E6;
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
        border-left: 5px solid #FF6B6B;
        animation: pulse 2s infinite;
    }
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.8; }
        100% { opacity: 1; }
    }
    .resource-card {
        background-color: #FFF9E6;
        padding: 1rem;
        border-radius: 10px;
        margin: 0.5rem 0;
        border: 1px solid #FFD166;
    }
</style>
""", unsafe_allow_html=True)

if "messages" not in st.session_state:
    st.session_state.messages = []
if "emotional_bot" not in st.session_state:
    try:
        st.session_state.emotional_bot = EmotionalSupportBot(config.api_key, config.model)
        st.session_state.crisis_resources = CrisisResources(config.country)
        st.session_state.user_id = f"user_{random.randint(10000, 99999)}"
        st.session_state.session_start = datetime.datetime.now()
    except Exception as e:
        st.error(f"Error de configuración: {e}")

with st.sidebar:
    st.image("https://cdn-icons-png.flaticon.com/512/2917/2917995.png", width=100)
    st.title("🌈 SafeHaven")
    st.markdown("**Tu espacio seguro para desahogarte**")
    
    st.divider()
    
    if st.button("🆘 Recursos de Crisis", use_container_width=True, type="secondary"):
        st.session_state.show_resources = True
    
    if st.button("🔄 Nueva Conversación", use_container_width=True):
        st.session_state.messages = []
        st.rerun()
    
    if st.button("📊 Mi Progreso", use_container_width=True):
        st.session_state.show_progress = True
    
    st.divider()
    
    with st.expander("🔒 Privacidad"):
        st.info("""
        - No guardamos información personal
        - Las conversaciones son anónimas
        - Datos auto-eliminados en 7 días
        - Cifrado de extremo a extremo
        """)
    
    with st.expander("📚 Recursos"):
        st.markdown("""
        **Líneas de ayuda:**
        - 🆘 Emergencias: 911
        - 📞 Línea de la Vida: 800 911 2000
        - 💬 Chat de crisis 24/7
        
        **Sitios web:**
        - [IMSS](https://www.imss.gob.mx)
        - [Salud Mental México](https://www.saludmental.mx)
        """)
    
    st.divider()
    st.caption(f"💬 Mensajes: {len(st.session_state.messages)//2}")
    st.caption(f"⏱️ Inicio: {st.session_state.session_start.strftime('%H:%M')}")

col1, col2, col3 = st.columns([1, 2, 1])
with col2:
    st.markdown("<h1 class='main-header'>🌈 SafeHaven</h1>", unsafe_allow_html=True)
    st.markdown("<h4 style='text-align: center; color: #666;'>Un espacio seguro para expresar tus emociones</h4>", unsafe_allow_html=True)

if hasattr(st.session_state, 'show_resources') and st.session_state.show_resources:
    st.markdown("## 🆘 Recursos de Ayuda Inmediata")
    
    resources = st.session_state.crisis_resources.get_resources()
    
    for category, resource in resources.items():
        with st.container():
            st.markdown(f"### {resource['name']}")
            st.markdown(f"**📞 {resource['number']}**")
            st.markdown(f"*{resource.get('description', '')}*")
            st.markdown(f"Disponible: {resource['available']}")
            st.divider()
    
    if st.button("Cerrar recursos", key="close_res"):
        st.session_state.show_resources = False
        st.rerun()
    
    st.stop()

chat_container = st.container()

with chat_container:
    for message in st.session_state.messages:
        if message["role"] == "user":
            st.markdown(f"""
            <div class='user-message'>
                <strong>👤 Tú:</strong><br>
                {message["content"]}
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div class='safe-message'>
                <strong>🌈 SafeHaven:</strong><br>
                {message["content"]}
            </div>
            """, unsafe_allow_html=True)
    
    if st.session_state.messages:
        last_msg = st.session_state.messages[-1]
        if "🚨" in last_msg["content"] or "CRISIS" in last_msg["content"]:
            st.markdown("""
            <div class='crisis-alert'>
                <strong>⚠️ SE HA DETECTADO UNA POSIBLE CRISIS</strong><br>
                Por favor, contacta los recursos de ayuda proporcionados.
            </div>
            """, unsafe_allow_html=True)

with st.container():
    st.divider()
    
    col1, col2 = st.columns([4, 1])
    
    with col1:
        user_input = st.text_area(
            "Escribe lo que sientes...",
            placeholder="Puedes hablar de ansiedad, tristeza, estrés, soledad, o cualquier cosa que necesites compartir...",
            height=100,
            key="user_input"
        )
    
    with col2:
        st.write("")  
        st.write("")
        send_button = st.button("Enviar ✨", use_container_width=True, type="primary")
    
    st.caption("💭 No sabes por dónde empezar?")
    
    emotion_cols = st.columns(5)
    quick_emotions = [
        ("😔 Tristeza", "Me siento muy triste hoy"),
        ("😰 Ansiedad", "Tengo mucha ansiedad y no sé por qué"),
        ("😤 Estrés", "Estoy estresado con el trabajo/estudio"),
        ("😠 Ira", "Estoy enojado con alguien o conmigo"),
        ("😶 Soledad", "Me siento solo aunque haya gente alrededor")
    ]
    
    for i, (emoji, text) in enumerate(quick_emotions):
        with emotion_cols[i]:
            if st.button(emoji, use_container_width=True, key=f"emo_{i}"):
                user_input = text
                st.session_state.quick_emotion = text

if send_button and user_input:
    st.session_state.messages.append({"role": "user", "content": user_input})
    
    with chat_container:
        st.markdown(f"""
        <div class='user-message'>
            <strong>👤 Tú:</strong><br>
            {user_input}
        </div>
        """, unsafe_allow_html=True)
    
    with st.spinner("🌈 SafeHaven está escuchando..."):
        try:
            emotion_type, confidence, emotion_data = st.session_state.emotional_bot.analyze_emotion(user_input)
            
            response = st.session_state.emotional_bot.generate_empathic_response(user_input, emotion_data)
            
            if emotion_data.get("risk_level") == "alto":
                crisis_card = st.session_state.crisis_resources.get_crisis_card()
                response += f"\n\n{crisis_card}"
            
            st.session_state.messages.append({"role": "assistant", "content": response})
            
            with chat_container:
                st.markdown(f"""
                <div class='safe-message'>
                    <strong>🌈 SafeHaven:</strong><br>
                    {response}
                </div>
                """, unsafe_allow_html=True)
            
            st.session_state.user_input = ""
            
        except Exception as e:
            st.error(f"Error al procesar tu mensaje: {str(e)}")

# Footer
st.divider()
footer_cols = st.columns(3)
with footer_cols[0]:
    st.caption("💬 Conversación segura y confidencial")
with footer_cols[1]:
    st.caption("🔒 100% anónimo • Sin registro")
with footer_cols[2]:
    st.caption("🌈 Apoyo emocional basado en empatía")

st.info("""
**⚠️ Nota importante:** SafeHaven es un sistema de apoyo emocional automatizado. 
No sustituye la atención profesional de psicólogos, psiquiatras o servicios de emergencia. 
En caso de crisis, contacta inmediatamente los recursos proporcionados.
""")