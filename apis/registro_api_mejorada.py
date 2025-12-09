"""
registro_api_mejorada.py - API Flask completa para registro y login
"""
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
import hashlib
import secrets

app = Flask(__name__)
CORS(app)

# Configuración de base de datos
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_folder = os.path.join(BASE_DIR, "database")
db_path = os.path.join(db_folder, "usuarios.db")

if not os.path.exists(db_folder):
    os.makedirs(db_folder)

app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)  # Contraseña hasheada
    token = db.Column(db.String(32), unique=True)  # Token para sesiones
    
    def set_password(self, password):
        """Hash de la contraseña"""
        self.password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    def check_password(self, password):
        """Verificar contraseña"""
        return self.password_hash == hashlib.sha256(password.encode()).hexdigest()
    
    def generate_token(self):
        """Generar token de sesión"""
        self.token = secrets.token_hex(16)
        return self.token

# Crear tablas
with app.app_context():
    db.create_all()

# Ruta de verificación
@app.route("/")
def index():
    return jsonify({
        "mensaje": "API de registro Aury funcionando",
        "endpoints": {
            "POST /usuarios/registro": "Registrar nuevo usuario",
            "POST /usuarios/login": "Iniciar sesión",
            "GET /usuarios/<email>": "Obtener usuario por email",
            "GET /usuarios/verificar/<token>": "Verificar sesión"
        }
    })

# Registro de usuario
@app.route("/usuarios/registro", methods=["POST"])
@app.route("/usuarios/agregar", methods=["POST"])  # Compatible con tu código anterior
def registrar_usuario():
    data = request.get_json()
    
    nombre = data.get("nombre", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    
    # Validaciones
    if not nombre or not email or not password:
        return jsonify({"mensaje": "Todos los campos son requeridos"}), 400
    
    if len(password) < 6:
        return jsonify({"mensaje": "La contraseña debe tener al menos 6 caracteres"}), 400
    
    # Verificar si el usuario ya existe
    usuario_existente = Usuario.query.filter_by(email=email).first()
    if usuario_existente:
        return jsonify({"mensaje": "Este correo ya está registrado"}), 409
    
    try:
        # Crear nuevo usuario
        nuevo_usuario = Usuario(
            nombre=nombre,
            email=email
        )
        nuevo_usuario.set_password(password)
        nuevo_usuario.generate_token()
        
        db.session.add(nuevo_usuario)
        db.session.commit()
        
        return jsonify({
            "mensaje": "Usuario registrado exitosamente",
            "id": nuevo_usuario.id,
            "nombre": nuevo_usuario.nombre,
            "email": nuevo_usuario.email,
            "token": nuevo_usuario.token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"mensaje": f"Error al registrar: {str(e)}"}), 500

# Login de usuario
@app.route("/usuarios/login", methods=["POST"])
def login_usuario():
    data = request.get_json()
    
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    
    if not email or not password:
        return jsonify({"mensaje": "Email y contraseña requeridos"}), 400
    
    # Buscar usuario
    usuario = Usuario.query.filter_by(email=email).first()
    
    if not usuario:
        return jsonify({"mensaje": "Usuario no encontrado"}), 404
    
    # Verificar contraseña
    if not usuario.check_password(password):
        return jsonify({"mensaje": "Contraseña incorrecta"}), 401
    
    # Generar nuevo token
    token = usuario.generate_token()
    db.session.commit()
    
    return jsonify({
        "mensaje": "Inicio de sesión exitoso",
        "id": usuario.id,
        "nombre": usuario.nombre,
        "email": usuario.email,
        "token": token
    }), 200

# Obtener usuario por email (para verificación)
@app.route("/usuarios/<email>", methods=["GET"])
def obtener_usuario(email):
    usuario = Usuario.query.filter_by(email=email.lower()).first()
    
    if usuario:
        return jsonify({
            "mensaje": "Usuario encontrado",
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email
        }), 200
    else:
        return jsonify({"mensaje": "Usuario no encontrado"}), 404

# Verificar token de sesión
@app.route("/usuarios/verificar/<token>", methods=["GET"])
def verificar_sesion(token):
    usuario = Usuario.query.filter_by(token=token).first()
    
    if usuario:
        return jsonify({
            "valido": True,
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email
        }), 200
    else:
        return jsonify({"valido": False}), 401

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 API DE REGISTRO AURY INICIANDO")
    print("="*60)
    print("📡 Endpoints disponibles:")
    print("   GET  /                      - Esta página")
    print("   POST /usuarios/registro     - Registrar usuario")
    print("   POST /usuarios/login        - Iniciar sesión")
    print("   GET  /usuarios/<email>      - Buscar usuario")
    print("   GET  /usuarios/verificar/<token> - Verificar sesión")
    print("\n🌐 URL: http://localhost:5000")
    print("="*60 + "\n")
    
    app.run(host="0.0.0.0", port=5000, debug=True)