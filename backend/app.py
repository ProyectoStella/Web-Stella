from flask import Flask, jsonify
import os
import random

app = Flask(__name__)

@app.after_request
def agregar_headers_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

@app.route('/')
def home():
    return "Servidor funcionando"

@app.route('/datos')
def datos():
    data = {
        "temperatura": round(random.uniform(-50, 30), 2),
        "presion": round(random.uniform(100, 1000), 2)
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
