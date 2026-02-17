import joblib
import os

model_path = os.path.join(os.path.dirname(__file__), "./models/spam_model.pkl")
vectorizer_path = os.path.join(os.path.dirname(__file__), "./models/vectorizer.pkl")
model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)

def process_spam_detection(text):
    """Job handler function for spam detection"""
    vectorized = vectorizer.transform([text])
    prediction = model.predict(vectorized)[0]
    

    try:
        confidence = float(model.predict_proba(vectorized)[0].max())
    except AttributeError:
        confidence = None
        
    return {
        "result": int(prediction),
        "confidence": confidence,
        "text": text
    }

