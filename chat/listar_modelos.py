import google.genai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

print("🔍 Listando TODOS los modelos disponibles...\n")

client = genai.Client(api_key=api_key)

try:
    # Listar todos los modelos
    models = list(client.models.list())
    
    print(f"✅ Se encontraron {len(models)} modelos:\n")
    
    # Filtrar solo modelos Gemini
    gemini_models = [m for m in models if 'gemini' in m.name.lower()]
    
    if gemini_models:
        print("🧠 MODELOS GEMINI DISPONIBLES:")
        print("="*50)
        for model in gemini_models:
            print(f"• {model.name}")
        print("="*50)
        
        # Modelo recomendado
        modelo_recomendado = gemini_models[0].name
        print(f"\n💡 Recomendado: {modelo_recomendado}")
        
        # Actualizar .env automáticamente
        with open('.env', 'r') as f:
            lines = f.readlines()
        
        with open('.env', 'w') as f:
            for line in lines:
                if line.startswith('GEMINI_MODEL='):
                    f.write(f'GEMINI_MODEL={modelo_recomendado}\n')
                else:
                    f.write(line)
        
        print(f"✅ Archivo .env actualizado con: {modelo_recomendado}")
        
    else:
        print("❌ No se encontraron modelos Gemini")
        print("\n📋 Todos los modelos disponibles:")
        for model in models[:10]:  # Mostrar solo primeros 10
            print(f"• {model.name}")
            
except Exception as e:
    print(f"❌ Error: {e}")
    print("\n💡 Intenta con estos modelos comunes:")
    print("• models/gemini-pro")
    print("• models/gemini-1.0-pro")
    print("• gemini-1.0-pro")