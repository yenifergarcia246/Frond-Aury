# config.py
import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()

@dataclass
class EmotionalConfig:
    api_key: str = os.getenv("GEMINI_API_KEY", "")
    
    model: str = os.getenv("GEMINI_MODEL", "gemini-1.0-pro")
    
    temperature: float = float(os.getenv("EMOTIONAL_TEMPERATURE", 0.8))
    
    def validate(self):
        if not self.api_key:
            raise ValueError("API Key no configurada. Por favor, configura GEMINI_API_KEY en .env")
        return self

config = EmotionalConfig()