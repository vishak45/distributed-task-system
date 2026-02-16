## import  flask 
from flask import Flask, request, jsonify

## import cors
from flask_cors import CORS

import os
## import models
import joblib
app = Flask(__name__)

CORS(app)

model_path = os.path.join(os.path.dirname(__file__), "./models/spam_model.pkl")
vectorizer_path = os.path.join(os.path.dirname(__file__), "./models/vectorizer.pkl")
model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)
@app.route("/")
def hello():
    return "Hello, World!"