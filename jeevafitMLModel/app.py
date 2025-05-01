from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler

app = Flask(__name__)

# Load model and transformers
model = joblib.load("hybrid_model.pkl")
scaler = joblib.load("scaler.pkl")
le_gender = joblib.load("le_gender.pkl")
le_risk = joblib.load("le_risk.pkl")


# Manual rules logic
def manual_risk_rules(data):
    reasons = []
    # Age-based rules
    age = data["Age"]

    # Heart Rate Rule (age-based)
    if age < 12:  # Children
        if data["Heart Rate"] < 70:
            reasons.append("Low Heart Rate (Child)")
        elif data["Heart Rate"] > 120:
            reasons.append("High Heart Rate (Child)")
    elif 12 <= age <= 65:  # Adults
        if data["Heart Rate"] < 60:
            reasons.append("Low Heart Rate (Adult)")
        elif data["Heart Rate"] > 100:
            reasons.append("High Heart Rate (Adult)")
    else:  # Older Adults
        if data["Heart Rate"] < 50:
            reasons.append("Low Heart Rate (Elderly)")
        elif data["Heart Rate"] > 90:
            reasons.append("High Heart Rate (Elderly)")

    # Oxygen Saturation Rule (age-based)
    if age > 65:  # Older adults may have slightly lower normal SpO₂ levels
        if data["Oxygen Saturation"] < 90:
            reasons.append("Very Low SpO₂ (Elderly)")
    else:  # For others, normal SpO₂ should be > 90
        if data["Oxygen Saturation"] < 90:
            reasons.append("Very Low SpO₂")

    # Body Temperature Rule (age-based)
    if age < 12:  # Children
        if data["Body Temperature"] < 36.5:
            reasons.append("Low Body Temperature (Child)")
        elif data["Body Temperature"] > 38.5:
            reasons.append("High Body Temperature (Child)")
    elif 12 <= age <= 65:  # Adults
        if data["Body Temperature"] < 36:
            reasons.append("Low Body Temperature (Adult)")
        elif data["Body Temperature"] > 38:
            reasons.append("High Body Temperature (Adult)")
    else:  # Elderly
        if data["Body Temperature"] < 35.5:
            reasons.append("Low Body Temperature (Elderly)")
        elif data["Body Temperature"] > 37.8:
            reasons.append("High Body Temperature (Elderly)")

    # Respiratory Rate Rule (age-based)
    if age < 5:  # Children
        if data["Respiratory Rate"] < 20:
            reasons.append("Low Respiratory Rate (Child)")
        elif data["Respiratory Rate"] > 40:
            reasons.append("High Respiratory Rate (Child)")
    elif 5 <= age <= 65:  # Adults
        if data["Respiratory Rate"] < 12:
            reasons.append("Low Respiratory Rate (Adult)")
        elif data["Respiratory Rate"] > 20:
            reasons.append("High Respiratory Rate (Adult)")
    else:  # Elderly
        if data["Respiratory Rate"] < 14:
            reasons.append("Low Respiratory Rate (Elderly)")
        elif data["Respiratory Rate"] > 22:
            reasons.append("High Respiratory Rate (Elderly)")

    # Blood Pressure Rule (age-based)
    if age < 18:  # Children
        if data["Systolic Blood Pressure"] < 90:
            reasons.append("Low Systolic BP (Child)")
        elif data["Systolic Blood Pressure"] > 120:
            reasons.append("High Systolic BP (Child)")
    elif 18 <= age <= 65:  # Adults
        if data["Systolic Blood Pressure"] < 90:
            reasons.append("Low Systolic BP (Adult)")
        elif data["Systolic Blood Pressure"] > 140:
            reasons.append("High Systolic BP (Adult)")
    else:  # Elderly
        if data["Systolic Blood Pressure"] < 100:
            reasons.append("Low Systolic BP (Elderly)")
        elif data["Systolic Blood Pressure"] > 160:
            reasons.append("High Systolic BP (Elderly)")

    # BMI Rule (age-based)
    if age < 18:  # Children/Adolescents
        if data["Derived_BMI"] < 18.5:
            reasons.append("Underweight (Low BMI) (Child)")
        elif data["Derived_BMI"] > 25:
            reasons.append("Overweight (High BMI) (Child)")
    elif 18 <= age <= 65:  # Adults
        if data["Derived_BMI"] < 18.5:
            reasons.append("Underweight (Low BMI) (Adult)")
        elif data["Derived_BMI"] > 25:
            reasons.append("Overweight (High BMI) (Adult)")
    else:  # Elderly
        if data["Derived_BMI"] < 20:
            reasons.append("Underweight (Low BMI) (Elderly)")
        elif data["Derived_BMI"] > 30:
            reasons.append("Overweight (High BMI) (Elderly)")
    # Determine gender-specific vital thresholds
    if data["Gender"] == 0:  # Male
        # Male-specific rules
        if data["Heart Rate"] < 60:
            reasons.append("Low Heart Rate (Male)")
        elif data["Heart Rate"] > 85:
            reasons.append("High Heart Rate (Male)")

        if data["Oxygen Saturation"] < 90:
            reasons.append("Very Low SpO₂ (Male)")
        elif data["Oxygen Saturation"] > 100:
            reasons.append("Dangerous SpO₂ (Male)")

        if data["Body Temperature"] < 36:
            reasons.append("Low Body Temperature (Male)")
        elif data["Body Temperature"] > 38:
            reasons.append("High Body Temperature (Male)")

        if data["Respiratory Rate"] < 12:
            reasons.append("Low Respiratory Rate (Male)")
        elif data["Respiratory Rate"] > 20:
            reasons.append("High Respiratory Rate (Male)")

        if data["Systolic Blood Pressure"] < 90:
            reasons.append("Low Systolic BP (Male)")
        elif data["Systolic Blood Pressure"] > 140:
            reasons.append("High Systolic BP (Male)")

        if data["Diastolic Blood Pressure"] < 60:
            reasons.append("Low Diastolic BP (Male)")
        elif data["Diastolic Blood Pressure"] > 90:
            reasons.append("High Diastolic BP (Male)")

        if data["Derived_HRV"] < 25:
            reasons.append("Low HRV (Male)")
        elif data["Derived_HRV"] > 100:
            reasons.append("High HRV (Male)")

        if data["Derived_BMI"] < 18.5:
            reasons.append("Underweight (Low BMI) (Male)")
        elif data["Derived_BMI"] > 25:
            reasons.append("Overweight (High BMI) (Male)")

        if data["Derived_Pulse_Pressure"] < 30:
            reasons.append("Low Pulse Pressure (Male)")
        elif data["Derived_Pulse_Pressure"] > 60:
            reasons.append("High Pulse Pressure (Male)")

        if data["Derived_MAP"] < 70:
            reasons.append("Low MAP (Male)")
        elif data["Derived_MAP"] > 110:
            reasons.append("High MAP (Male)")

    elif data["Gender"] == 1:  # Female
        # Female-specific rules
        if data["Heart Rate"] < 70:
            reasons.append("Low Heart Rate (Female)")
        elif data["Heart Rate"] > 95:
            reasons.append("High Heart Rate (Female)")

        if data["Oxygen Saturation"] < 90:
            reasons.append("Very Low SpO₂ (Female)")
        elif data["Oxygen Saturation"] > 100:
            reasons.append("Dangerous SpO₂ (Female)")

        if data["Body Temperature"] < 36:
            reasons.append("Low Body Temperature (Female)")
        elif data["Body Temperature"] > 38:
            reasons.append("High Body Temperature (Female)")

        if data["Respiratory Rate"] < 12:
            reasons.append("Low Respiratory Rate (Female)")
        elif data["Respiratory Rate"] > 22:
            reasons.append("High Respiratory Rate (Female)")

        if data["Systolic Blood Pressure"] < 90:
            reasons.append("Low Systolic BP (Female)")
        elif data["Systolic Blood Pressure"] > 130:
            reasons.append("High Systolic BP (Female)")

        if data["Diastolic Blood Pressure"] < 60:
            reasons.append("Low Diastolic BP (Female)")
        elif data["Diastolic Blood Pressure"] > 85:
            reasons.append("High Diastolic BP (Female)")

        if data["Derived_HRV"] < 20:
            reasons.append("Low HRV (Female)")
        elif data["Derived_HRV"] > 90:
            reasons.append("High HRV (Female)")

        if data["Derived_BMI"] < 18.5:
            reasons.append("Underweight (Low BMI) (Female)")
        elif data["Derived_BMI"] > 25:
            reasons.append("Overweight (High BMI) (Female)")

        if data["Derived_Pulse_Pressure"] < 30:
            reasons.append("Low Pulse Pressure (Female)")
        elif data["Derived_Pulse_Pressure"] > 60:
            reasons.append("High Pulse Pressure (Female)")

        if data["Derived_MAP"] < 70:
            reasons.append("Low MAP (Female)")
        elif data["Derived_MAP"] > 110:
            reasons.append("High MAP (Female)")

    # Return high risk (1) if any of the rules triggered
    if reasons:
        return 1, reasons

    # If no rules triggered, return low risk (0)
    return 0, []

# Validate input for required fields
def validate_input(data):
    required_fields = [
        "Heart Rate", "Respiratory Rate", "Body Temperature", "Oxygen Saturation",
        "Systolic Blood Pressure", "Diastolic Blood Pressure", "Age", "Gender",
        "Weight (kg)", "Height (m)", "Derived_HRV", "Derived_Pulse_Pressure", 
        "Derived_BMI", "Derived_MAP"
    ]
    
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
    
    # Check if all fields have valid data types (numeric fields)
    for field in required_fields:
        if field in data:
            if not isinstance(data[field], (int, float)):
                raise ValueError(f"Invalid data type for {field}. Expected numeric value.")

# Predict function
def predict_risk(data):
    manual_prediction, reasons = manual_risk_rules(data)
    if manual_prediction == 1:
        return "High",reasons, None  

    ordered_features = [
        "Heart Rate", "Respiratory Rate", "Body Temperature",
        "Oxygen Saturation", "Systolic Blood Pressure", "Diastolic Blood Pressure",
        "Age", "Gender", "Weight (kg)", "Height (m)",
        "Derived_HRV", "Derived_Pulse_Pressure", "Derived_BMI", "Derived_MAP"
    ]
    input_values = [data[feature] for feature in ordered_features]
    scaled_data = scaler.transform([input_values])
    model_prediction = model.predict(scaled_data)[0]
    model_probability = model.predict_proba(scaled_data)[0][1]  # Probability of high risk
    return le_risk.inverse_transform([model_prediction])[0], reasons, model_probability

# API endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received in Flask:", data)
        if isinstance(data, list):
            data = data[0]  # Expecting only one record

        # Validate the input data
        validate_input(data)
        
        # Get the prediction, reasons, and confidence score
        prediction, reasons, model_confidence = predict_risk(data)

        print("Model Prediction:", prediction)
        print("Reasons for Prediction:", reasons)
        
        # Return the prediction response
        if prediction == "High":
            return jsonify({"prediction": prediction, "reasons": reasons})
        else:
            return jsonify({
                "prediction": prediction, 
                "reasons": reasons, 
                "model_confidence": round(model_confidence, 2) if model_confidence else None
            })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
