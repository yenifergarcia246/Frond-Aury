"""
Módulo principal de apoyo emocional
"""
import google.genai as genai
from google.genai.types import Content, Part, GenerateContentConfig
from typing import List, Dict, Optional, Tuple
import json
import datetime
from enum import Enum

class EmotionType(Enum):
    ANXIETY = "ansiedad"
    DEPRESSION = "depresión"
    STRESS = "estrés"
    LONELINESS = "soledad"
    ANGER = "ira"
    SADNESS = "tristeza"
    JOY = "alegría"
    NEUTRAL = "neutral"
    CRISIS = "crisis"

class EmotionalSupportBot:
    
    def __init__(self, api_key: str, model: str = "gemini-1.5-pro"):
        self.client = genai.Client(api_key=api_key)
        self.model = model
        self.conversation_history = []
        self.user_mood_history = []
        
        self.empathy_config = GenerateContentConfig(
            temperature=0.8,
            top_p=0.95,
            top_k=40,
            max_output_tokens=1024,
            stop_sequences=["USER:", "SYSTEM:"]
        )
    
    def analyze_emotion(self, text: str) -> Tuple[EmotionType, float, Dict]:
        prompt = f"""
        Analiza el siguiente texto y detecta la emoción principal:
        Texto: "{text}"
        
        Responde en formato JSON con:
        {{
            "primary_emotion": "emoción_principal",
            "confidence": 0.95,
            "intensity": "alta|media|baja",
            "keywords": ["palabra1", "palabra2"],
            "risk_level": "bajo|medio|alto",
            "suggested_response_type": "validación|consejo|escucha activa|derivación"
        }}
        
        Emociones posibles: ansiedad, depresión, estrés, soledad, ira, tristeza, alegría, neutral, crisis
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=[Content(parts=[Part(text=prompt)])],
                config=GenerateContentConfig(temperature=0.3, max_output_tokens=500)
            )
            
            import re
            json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
            if json_match:
                analysis = json.loads(json_match.group())
                
                emotion_str = analysis.get("primary_emotion", "neutral").lower()
                emotion = EmotionType(emotion_str)
                
                return (
                    emotion,
                    analysis.get("confidence", 0.5),
                    analysis
                )
            
        except Exception as e:
            print(f"Error analizando emoción: {e}")
        
        return (EmotionType.NEUTRAL, 0.5, {})
    
    def generate_empathic_response(self, user_message: str, emotion_data: Dict) -> str:
        emotion = emotion_data.get("primary_emotion", "neutral")
        intensity = emotion_data.get("intensity", "media")
        risk = emotion_data.get("risk_level", "bajo")
        
        empathy_prompts = {
            "ansiedad": self._anxiety_response_prompt(),
            "depresión": self._depression_response_prompt(),
            "estrés": self._stress_response_prompt(),
            "soledad": self._loneliness_response_prompt(),
            "ira": self._anger_response_prompt(),
            "tristeza": self._sadness_response_prompt(),
            "crisis": self._crisis_response_prompt()
        }
        
        base_prompt = empathy_prompts.get(emotion, self._neutral_response_prompt())
        
        full_prompt = f"""
        Eres un asistente de apoyo emocional llamado SafeHaven.
        Usuario: {user_message}
        
        Análisis emocional:
        - Emoción principal: {emotion}
        - Intensidad: {intensity}
        - Nivel de riesgo: {risk}
        
        {base_prompt}
        
        Instrucciones específicas:
        1. Valida sus sentimientos primero
        2. Sé empático pero profesional
        3. Ofrece apoyo sin juzgar
        4. Pregunta si necesita recursos adicionales
        5. Usa un tono cálido y comprensivo
        
        Responde en español.
        """
        
        response = self.client.models.generate_content(
            model=self.model,
            contents=[Content(parts=[Part(text=full_prompt)])],
            config=self.empathy_config
        )
        
        return response.text
    
    def _anxiety_response_prompt(self) -> str:
        return """
        La persona está experimentando ansiedad. En tu respuesta:
        - Ayúdala a reconocer que la ansiedad es una respuesta normal
        - Sugiere técnicas de respiración o grounding
        - Pregunta si hay desencadenantes específicos
        - Ofrece apoyo para identificar patrones
        - Recuérdale que puede pedir ayuda profesional si lo necesita
        """
    
    def _depression_response_prompt(self) -> str:
        return """
        La persona muestra signos de depresión. En tu respuesta:
        - Valida lo difícil que puede ser
        - Pregunta sobre su red de apoyo
        - Ofrece escuchar sin juzgar
        - Sugiere actividades pequeñas y manejables
        - Proporciona recursos de ayuda profesional
        """
    
    def _crisis_response_prompt(self) -> str:
        return """
        ¡URGENTE - DETECTADO RIESGO DE CRISIS!
        
        La persona necesita ayuda inmediata. En tu respuesta:
        1. VALIDA su dolor intenso
        2. PROPORCIONA líneas de ayuda inmediata
        3. ANIMA a contactar a alguien ahora mismo
        4. OFRECE acompañamiento virtual
        5. PREGUNTA si está a salvo
        
        Incluye estos recursos CRÍTICOS:
        - Línea de prevención del suicidio: 988 (México) o 024 (España)
        - Emergencias: 911
        - Chat de crisis disponible 24/7
        
        NO dejes a la persona sola. Mantén la conversación hasta que se estabilice.
        """
    
    def track_mood_progression(self, user_id: str, emotion: EmotionType, intensity: str):
        timestamp = datetime.datetime.now()
        
        self.user_mood_history.append({
            "user_id": user_id,
            "timestamp": timestamp.isoformat(),
            "emotion": emotion.value,
            "intensity": intensity,
            "day_of_week": timestamp.strftime("%A"),
            "time_of_day": timestamp.strftime("%H:%M")
        })
    
    def get_mood_insights(self, user_id: str) -> Dict:
        user_history = [m for m in self.user_mood_history if m["user_id"] == user_id]
        
        if not user_history:
            return {"message": "No hay datos suficientes aún"}
        
        emotions = [h["emotion"] for h in user_history]
        intensities = [h["intensity"] for h in user_history]
        
        return {
            "total_sessions": len(user_history),
            "most_common_emotion": max(set(emotions), key=emotions.count),
            "average_intensity": sum(1 if i == "alta" else 0.5 if i == "media" else 0 for i in intensities) / len(intensities),
            "pattern_analysis": self._analyze_patterns(user_history),
            "suggestions": self._generate_mood_suggestions(user_history)
        }
    
    def _analyze_patterns(self, history: List[Dict]) -> str:
        if len(history) < 3:
            return "Necesitamos más conversaciones para identificar patrones"
        
        return "Basado en nuestras conversaciones, veo que..."
    
    def _generate_mood_suggestions(self, history: List[Dict]) -> List[str]:
        suggestions = []
        
        emotions = [h["emotion"] for h in history[-5:]]  
        
        if "ansiedad" in emotions:
            suggestions.append("Podrías probar ejercicios de respiración 5-5-5")
        
        if "tristeza" in emotions or "depresión" in emotions:
            suggestions.append("Considera hablar con un profesional de salud mental")
        
        if "soledad" in emotions:
            suggestions.append("¿Has considerado unirte a grupos de apoyo en línea?")
        
        return suggestions