from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
ad_folder = os.path.join(BASE_DIR, "database")
ad_path = os.path.join(ad_folder, "chat.db")

if not os.path.exists(ad_folder):
    os.makedirs(ad_folder)

app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{ad_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    mensaje_usuario = db.Column(db.String(50), nullable=False)
    mensaje_chat = db.Column(db.String(50), nullable=False)

with app.app_context():
    db.create_all()

@app.route("/chat/agregar/mensaje", methods=["POST"])
def agregar_mensaje():
    data = request.get_json()
    mensaje_usuario = data.get("mensaje_usuario")
    mensaje_chat = data.get("mensaje_chat")

    if not mensaje_usuario or not mensaje_chat:
        return jsonify({"mensaje": "Faltan datos"}), 400
    
    nuevo_mensaje = Chat(
        mensaje_usuario=mensaje_usuario, 
        mensaje_chat=mensaje_chat)
    
    db.session.add(nuevo_mensaje)
    db.session.commit()

    return jsonify({"mensaje": "Mensaje agregado", "id": nuevo_mensaje.id}), 201

if __name__ == "__main__":
    app.run(debug=True)
