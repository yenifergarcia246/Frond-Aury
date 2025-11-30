from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(50), nullable=False)

with app.app_context():
    db.create_all()

@app.route("/usuarios/agregar", methods=["POST"])
def agregar_usuario():
    data = request.get_json()
    nombre = data.get("nombre")
    email = data.get("email")
    password = data.get("password")

    if not nombre or not email or not password:
        return jsonify({"mensaje": "Faltan datos"}), 400

    usuario_existente = Usuario.query.filter_by(email=email).first()
    if usuario_existente:
        return jsonify({"mensaje": "Usuario ya existe"}), 409
    
    nuevo_usuario = Usuario(
        nombre=nombre, 
        email=email, 
        password=password)
    
    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify({"mensaje": "Usuario agregado", "id": nuevo_usuario.id}), 201

@app.route("/usuarios/<email>", methods=["GET"])
def obtener_usuario(email):
    usuario = Usuario.query.filter_by(email=email).first()
    if usuario:
        return jsonify({"mensaje": "Usuario encontrado", "id": usuario.id}), 200
    else:
        return jsonify({"mensaje": "Usuario no encontrado"}), 404

if __name__ == "__main__":
    app.run(debug=True)
