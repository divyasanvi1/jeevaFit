from flask import Flask, request, jsonify
import joblib
import numpy as np
import os
import pandas as pd

app = Flask(__name__)

# Load model, scaler, and label encoder
sgd_model = joblib.load("models/sgd_continuous_model.pkl")
scaler = joblib.load("models/standard_scaler.pkl")
le_risk = joblib.load("models/risk_label_encoder.pkl")
stacking_model = joblib.load("models/stacking_model.pkl")  # or your actual ensemble filename


# Full feature input expected from user
all_input_features = [
    "Heart_Rate", "Respiratory_Rate", "Body_Temperature", "Oxygen_Saturation",
    "Systolic_Blood_Pressure", "Diastolic_Blood_Pressure", "Age", "Gender",
    "Weight (kg)", "Height (m)", "Derived_HRV", "Derived_Pulse_Pressure",
    "Derived_BMI", "Derived_MAP"
]

# Only model-required features (as trained)
model_features = [
    "Heart_Rate", "Respiratory_Rate", "Body_Temperature", "Oxygen_Saturation",
    "Systolic_Blood_Pressure", "Diastolic_Blood_Pressure", "Age", "Gender",
    "Derived_HRV", "Derived_Pulse_Pressure", "Derived_MAP", "RespiratoryRate_x_Age"
]
NEW_DATA_CSV_PATH = "newdata.csv"
# ========== VALIDATION ========== #
def validate_input(data):
    missing = [f for f in all_input_features if f not in data]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")
    for f in all_input_features:
        if not isinstance(data[f], (int, float)):
            raise ValueError(f"Invalid type for {f}. Must be numeric.")

# ========== MANUAL RULES ========== #
# Manual rules logic
def manual_risk_rules(data):
    reasons = []
    # Age-based rules
    age = data["Age"]

    # Heart Rate Rule (age-based)
    if 12 <= age <= 65:  # Adults
        if data["Heart_Rate"] < 60:
            reasons.append("Low Heart Rate (Adult)")
        elif data["Heart_Rate"] > 100:
            reasons.append("High Heart Rate (Adult)")
    else:  # Older Adults
        if data["Heart_Rate"] < 50:
            reasons.append("Low Heart Rate (Elderly)")
        elif data["Heart_Rate"] > 90:
            reasons.append("High Heart Rate (Elderly)")

    # Oxygen Saturation Rule (age-based)
    if age > 65:  # Older adults may have slightly lower normal SpO₂ levels
        if data["Oxygen_Saturation"] < 92:
            reasons.append("Very Low SpO₂ (Elderly)")
    else:  # For others, normal SpO₂ should be > 90
        if data["Oxygen_Saturation"] < 95:
            reasons.append("Very Low SpO₂")

    # Body Temperature Rule (age-based)
    if 12 <= age <= 65:  # Adults
        if data["Body_Temperature"] < 36:
            reasons.append("Low Body Temperature (Adult)")
        elif data["Body_Temperature"] > 38:
            reasons.append("High Body Temperature (Adult)")
    else:  # Elderly
        if data["Body_Temperature"] < 35.5:
            reasons.append("Low Body Temperature (Elderly)")
        elif data["Body_Temperature"] > 37.8:
            reasons.append("High Body Temperature (Elderly)")

    # Respiratory Rate Rule (age-based)
    if 12 <= age <= 65:  # Adults
        if data["Respiratory_Rate"] < 12:
            reasons.append("Low Respiratory Rate (Adult)")
        elif data["Respiratory_Rate"] > 18:
            reasons.append("High Respiratory Rate (Adult)")
    else:  # Elderly
        if data["Respiratory_Rate"] < 14:
            reasons.append("Low Respiratory Rate (Elderly)")
        elif data["Respiratory_Rate"] > 20:
            reasons.append("High Respiratory Rate (Elderly)")

    # Blood Pressure Rule (age-based)
    if age < 18:  # Children
        if data["Systolic_Blood_Pressure"] < 90:
            reasons.append("Low Systolic BP (Child)")
        elif data["Systolic_Blood_Pressure"] > 120:
            reasons.append("High Systolic BP (Child)")
    elif 18 <= age <= 65:  # Adults
        if data["Systolic_Blood_Pressure"] < 90:
            reasons.append("Low Systolic BP (Adult)")
        elif data["Systolic_Blood_Pressure"] > 130:
            reasons.append("High Systolic BP (Adult)")
    else:  # Elderly
        if data["Systolic_Blood_Pressure"] < 100:
            reasons.append("Low Systolic BP (Elderly)")
        elif data["Systolic_Blood_Pressure"] > 140:
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
        if data["Heart_Rate"] < 60:
            reasons.append("Low Heart Rate (Male)")
        elif data["Heart_Rate"] > 100:
            reasons.append("High Heart Rate (Male)")

        if data["Oxygen_Saturation"] < 95:
            reasons.append("Very Low SpO₂ (Male)")
        elif data["Oxygen_Saturation"] > 100:
            reasons.append("Dangerous SpO₂ (Male)")

        if data["Body_Temperature"] < 36:
            reasons.append("Low Body Temperature (Male)")
        elif data["Body_Temperature"] > 38:
            reasons.append("High Body Temperature (Male)")

        if data["Respiratory_Rate"] < 12:
            reasons.append("Low Respiratory Rate (Male)")
        elif data["Respiratory_Rate"] > 20:
            reasons.append("High Respiratory Rate (Male)")

        if data["Systolic_Blood_Pressure"] < 90:
            reasons.append("Low Systolic BP (Male)")
        elif data["Systolic_Blood_Pressure"] > 130:
            reasons.append("High Systolic BP (Male)")

        if data["Diastolic_Blood_Pressure"] < 50:
            reasons.append("Low Diastolic BP (Male)")
        elif data["Diastolic_Blood_Pressure"] > 90:
            reasons.append("High Diastolic BP (Male)")

        if data["Derived_HRV"] < 0.03:
            reasons.append("Low HRV (Male)")
        elif data["Derived_HRV"] > 0.2:
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
        if data["Heart_Rate"] < 65:
            reasons.append("Low Heart Rate (Female)")
        elif data["Heart_Rate"] > 95:
            reasons.append("High Heart Rate (Female)")

        if data["Oxygen_Saturation"] < 95:
            reasons.append("Very Low SpO₂ (Female)")
        elif data["Oxygen_Saturation"] > 100:
            reasons.append("Dangerous SpO₂ (Female)")

        if data["Body_Temperature"] < 36:
            reasons.append("Low Body Temperature (Female)")
        elif data["Body_Temperature"] > 38:
            reasons.append("High Body Temperature (Female)")

        if data["Respiratory_Rate"] < 12:
            reasons.append("Low Respiratory Rate (Female)")
        elif data["Respiratory_Rate"] > 18:
            reasons.append("High Respiratory Rate (Female)")

        if data["Systolic_Blood_Pressure"] < 90:
            reasons.append("Low Systolic BP (Female)")
        elif data["Systolic_Blood_Pressure"] > 130:
            reasons.append("High Systolic BP (Female)")

        if data["Diastolic_Blood_Pressure"] < 60:
            reasons.append("Low Diastolic BP (Female)")
        elif data["Diastolic_Blood_Pressure"] > 85:
            reasons.append("High Diastolic BP (Female)")

        if data["Derived_HRV"] < 0.03:
            reasons.append("Low HRV (Female)")
        elif data["Derived_HRV"] > 0.2:
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

# ========== PREDICTION LOGIC ========== #
def predict_risk(data):
    # First check rules
    manual_pred, reasons = manual_risk_rules(data)
    if manual_pred == 1:
        return "High Risk", reasons, None
    data["RespiratoryRate_x_Age"] = data["Respiratory_Rate"] * data["Age"]
    # Prepare input only with features model expects
    # Prepare input as dict with model feature names and values
    model_input_dict = {f: data[f] for f in model_features}

    # Convert to single-row DataFrame to keep feature names
    model_input_df = pd.DataFrame([model_input_dict])

    # Scale input using scaler
    scaled_input = scaler.transform(model_input_df)

    # Predict using stacking model
    model_pred = stacking_model.predict(scaled_input)[0]
    confidence = stacking_model.predict_proba(scaled_input)[0][1]  # prob of 'High' risk

    # Decode predicted label back to original
    pred_label = le_risk.inverse_transform([model_pred])[0]

    return pred_label, reasons, round(confidence, 2)
def append_data_to_csv(data, prediction):
    # Prepare a row dictionary matching your incremental training CSV format
    row = {
        "Heart_Rate": data["Heart_Rate"],
        "Respiratory_Rate": data["Respiratory_Rate"],
        "Body_Temperature": data["Body_Temperature"],
        "Oxygen_Saturation": data["Oxygen_Saturation"],
        "Systolic_Blood_Pressure": data["Systolic_Blood_Pressure"],
        "Diastolic_Blood_Pressure": data["Diastolic_Blood_Pressure"],
        "Age": data["Age"],
        "Gender": data["Gender"],
        "Derived_HRV": data["Derived_HRV"],
        "Derived_Pulse_Pressure": data["Derived_Pulse_Pressure"],
        "Derived_MAP": data["Derived_MAP"],
        # Interaction feature for incremental training
        "RespiratoryRate_x_Age": data["Respiratory_Rate"] * data["Age"],
        # Target label for training
        "Risk_Category": prediction
    }

     # Convert to DataFrame
    df_new = pd.DataFrame([row])
    print(df_new)


    # Append or create CSV
    if os.path.exists(NEW_DATA_CSV_PATH):
        df_new.to_csv(NEW_DATA_CSV_PATH, mode='a', header=False, index=False)
    else:
        df_new.to_csv(NEW_DATA_CSV_PATH, index=False)
        print(f"[INFO] Appended new data to {NEW_DATA_CSV_PATH}")
    
# ========== API ENDPOINT ========== #
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        print("Model expected feature names:", stacking_model.feature_names_in_)
        print("[DEBUG] Received input data:", data)
        validate_input(data)
        print("[DEBUG] Input validation passed.")
        prediction, reasons, confidence = predict_risk(data)
        print(f"[DEBUG] Prediction: {prediction}, Reasons: {reasons}, Confidence: {confidence}")
        append_data_to_csv(data, prediction)
        print("[DEBUG] Appended data to CSV.")
        result = {"prediction": prediction, "reasons": reasons}
        if confidence is not None:
            result["model_confidence"] =  float(confidence) 
        return jsonify(result)

    except Exception as e:
        print("[ERROR] Exception during prediction:", str(e))
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
