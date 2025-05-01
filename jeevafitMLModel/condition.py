from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load model and transformers
model = joblib.load("hybrid_model.pkl")
scaler = joblib.load("scaler.pkl")
le_gender = joblib.load("le_gender.pkl")
le_risk = joblib.load("le_risk.pkl")

# Manual rules logic
def manual_risk_rules(data):
    if data["Systolic Blood Pressure"] > 160:
        return 1  # High risk
    elif data["Oxygen Saturation"] < 90:
        return 1  # High risk
    else:
        return 0  # Low risk

# Predict function
def predict_risk(data):
    
    manual_prediction = manual_risk_rules(data)
    if manual_prediction == 1:
        return "High Risk"

    ordered_features = [
        "Heart Rate", "Respiratory Rate", "Body Temperature",
        "Oxygen Saturation", "Systolic Blood Pressure", "Diastolic Blood Pressure",
        "Age", "Gender", "Weight (kg)", "Height (m)",
        "Derived_HRV", "Derived_Pulse_Pressure", "Derived_BMI", "Derived_MAP"
    ]
    input_values = [data[feature] for feature in ordered_features]
    scaled_data = scaler.transform([input_values])
    model_prediction = model.predict(scaled_data)[0]
    return le_risk.inverse_transform([model_prediction])[0]

# API endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        prediction = predict_risk(data)
        return jsonify({"prediction": prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
