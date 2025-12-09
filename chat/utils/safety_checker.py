"""
Verificador de seguridad para contenido sensible
"""
import re
from typing import Dict, List

class SafetyChecker:
    
    def __init__(self):
        self.crisis_patterns = {
            "suicidal": [
                r"quiero morir",
                r"me quiero suicidar",
                r"acabar con todo",
                r"no quiero vivir",
                r"mejor estar muerto",
                r"acabar con mi vida",
                r"no aguanto más",
                r"no puedo seguir",
                r"no vale la pena vivir"
            ],
            "self_harm": [
                r"lastimarme",
                r"hacerme daño",
                r"cortarme",
                r"auto[l\-]?lesion",
                r"herirme a mí mismo"
            ],
            "immediate_danger": [
                r"voy a saltar",
                r"tomar pastillas",
                r"ahorcarme",
                r"dispararme",
                r"en este momento",
                r"ahora mismo",
                r"inmediatamente"
            ]
        }
        
        self.violence_patterns = [
            r"matar",
            r"asesinar",
            r"violar",
            r"golpear",
            r"agredir",
            r"venganza",
            r"hacer daño a"
        ]
    
    def check_message(self, text: str) -> Dict:
        text_lower = text.lower()
        risk_level = "low"
        reasons = []
        
        for category, patterns in self.crisis_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text_lower, re.IGNORECASE):
                    if category == "immediate_danger":
                        risk_level = "critical"
                    elif risk_level != "critical":
                        risk_level = "high"
                    reasons.append(category)
                    break
        
        for pattern in self.violence_patterns:
            if re.search(pattern, text_lower, re.IGNORECASE):
                if risk_level != "critical":
                    risk_level = "medium"
                reasons.append("violence")
                break
        
        intensity_words = [
            r"desesperado",
            r"sin esperanza",
            r"totalmente solo",
            r"nadie me entiende",
            r"insoportable",
            r"intolerable"
        ]
        
        intense_count = 0
        for word in intensity_words:
            if re.search(word, text_lower, re.IGNORECASE):
                intense_count += 1
        
        if intense_count >= 2:
            if risk_level == "low":
                risk_level = "medium"
            reasons.append("high_emotional_intensity")
        
        return {
            "risk_level": risk_level,
            "reasons": list(set(reasons)),
            "requires_intervention": risk_level in ["high", "critical"],
            "message_preview": text[:50] + "..." if len(text) > 50 else text
        }
    
    def get_intervention_plan(self, risk_level: str, reasons: List[str]) -> Dict:
        interventions = {
            "critical": {
                "action": "immediate_crisis_response",
                "priority": 1,
                "resources": ["emergency_services", "suicide_hotline", "crisis_chat"],
                "response_template": "crisis_immediate"
            },
            "high": {
                "action": "crisis_intervention",
                "priority": 2,
                "resources": ["suicide_hotline", "mental_health_services", "support_contacts"],
                "response_template": "crisis_support"
            },
            "medium": {
                "action": "emotional_support",
                "priority": 3,
                "resources": ["coping_strategies", "support_groups", "therapist_referral"],
                "response_template": "emotional_first_aid"
            },
            "low": {
                "action": "general_support",
                "priority": 4,
                "resources": ["listening", "validation", "mild_coping"],
                "response_template": "empathic_listening"
            }
        }
        
        plan = interventions.get(risk_level, interventions["low"])
        plan["detected_risks"] = reasons
        
        return plan