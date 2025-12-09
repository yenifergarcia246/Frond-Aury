"""
Recursos de crisis y líneas de ayuda
"""
import json
from typing import Dict, List
import datetime

class CrisisResources:
    
    def __init__(self, country_code: str = "MX"):
        self.country_code = country_code.upper()
        self.resources = self._load_resources()
    
    def _load_resources(self) -> Dict:
        resources = {
            "MX": {
                "emergency": {
                    "name": "Emergencias",
                    "number": "911",
                    "available": "24/7",
                    "description": "Para emergencias médicas, policía o bomberos"
                },
                "suicide_prevention": {
                    "name": "Línea de la Vida",
                    "number": "800 911 2000",
                    "available": "24/7",
                    "description": "Atención psicológica y prevención del suicidio"
                },
                "domestic_violence": {
                    "name": "Línea Mujeres",
                    "number": "800 108 4053",
                    "available": "24/7",
                    "description": "Atención a mujeres víctimas de violencia"
                },
                "lgbtq_support": {
                    "name": "Línea Diversidad",
                    "number": "55 4438 5534",
                    "available": "Lun-Vie 9am-6pm",
                    "description": "Apoyo a comunidad LGBTQ+"
                }
            },
            "ES": {
                "emergency": {
                    "name": "Emergencias",
                    "number": "112",
                    "available": "24/7"
                },
                "suicide_prevention": {
                    "name": "Teléfono de la Esperanza",
                    "number": "717 003 717",
                    "available": "24/7"
                },
                "mental_health": {
                    "name": "Salud Mental",
                    "number": "024",
                    "available": "24/7"
                }
            },
            "AR": {
                "emergency": {
                    "name": "Emergencias",
                    "number": "911",
                    "available": "24/7"
                },
                "suicide_prevention": {
                    "name": "Línea de Prevención",
                    "number": "135",
                    "available": "24/7"
                }
            },
            "CO": {
                "emergency": {
                    "name": "Emergencias",
                    "number": "123",
                    "available": "24/7"
                },
                "suicide_prevention": {
                    "name": "Línea de Apoyo",
                    "number": "01 8000 113 113",
                    "available": "24/7"
                }
            }
        }
        
        return resources.get(self.country_code, resources["MX"])
    
    def get_crisis_card(self, crisis_type: str = "general") -> str:
        card = "🚨 **RECURSOS DE CRISIS - NO ESTÁS SOLO/A** 🚨\n\n"
        
        if crisis_type == "suicidal":
            card += "**SI TIENES PENSAMIENTOS SUICIDAS:**\n\n"
            card += "📍 **CONTACTA INMEDIATAMENTE:**\n"
            
            for key, resource in self.resources.items():
                if "suicide" in key or "prevención" in resource.get("name", "").lower():
                    card += f"• {resource['name']}: **{resource['number']}**\n"
                    card += f"  _{resource['description']}_\n\n"
        
        elif crisis_type == "violence":
            card += "**SI ESTÁS EN UNA SITUACIÓN DE VIOLENCIA:**\n\n"
            
            for key, resource in self.resources.items():
                if "violence" in key or "mujeres" in resource.get("name", "").lower():
                    card += f"• {resource['name']}: **{resource['number']}**\n"
                    card += f"  _{resource['description']}_\n\n"
        
        else: 
            card += "**RECURSOS DISPONIBLES:**\n\n"
            
            for key, resource in self.resources.items():
                card += f"• {resource['name']}: **{resource['number']}**\n"
                if "description" in resource:
                    card += f"  _{resource['description']}_\n"
                card += f"  Disponible: {resource['available']}\n\n"
        
        card += "💡 **Recuerda:**\n"
        card += "- Tu vida tiene valor\n"
        card += "- Mereces apoyo y cuidado\n"
        card += "- No tienes que enfrentar esto solo/a\n"
        card += "- La ayuda profesional puede marcar la diferencia\n\n"
        
        card += "🕒 **Horario actual:** " + datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        
        return card
    
    def get_coping_strategies(self, emotion: str) -> List[str]:
        strategies = {
            "ansiedad": [
                "Respiración 4-7-8: Inhala 4 seg, mantén 7, exhala 8",
                "Técnica 5-4-3-2-1: Nombra 5 cosas que ves, 4 que sientes, 3 que oyes, 2 que hueles, 1 que gustas",
                "Escritura express: Escribe 3 páginas sin parar",
                "Paseo consciente: Camina prestando atención a cada paso"
            ],
            "depresión": [
                "Actividad de 5 minutos: Elige algo muy pequeño y hazlo",
                "Lista de logros: Escribe 3 cosas que hiciste hoy",
                "Contacto seguro: Llama o escribe a una persona de confianza",
                "Baño caliente: Con sales o aceites esenciales"
            ],
            "estrés": [
                "Descanso pomodoro: 25 min trabajo, 5 min descanso",
                "Desconexión digital: 1 hora sin pantallas",
                "Lista de preocupaciones: Escríbelas y programa tiempo para ellas",
                "Estiramientos suaves: 5 minutos de yoga básico"
            ],
            "soledad": [
                "Grupos en línea: Busca comunidades de tus intereses",
                "Voluntariado virtual: Ayuda a otros desde casa",
                "Diario de gratitud: 3 cosas por las que estás agradecido",
                "Eventos virtuales: Conferencias, talleres o conciertos"
            ]
        }
        
        return strategies.get(emotion, [
            "Respira profundo 3 veces",
            "Toma un vaso de agua",
            "Estírate suavemente",
            "Recuerda que esto pasará"
        ])