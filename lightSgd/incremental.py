import os
import datetime
import pandas as pd
import joblib
from sklearn.metrics import accuracy_score, classification_report

def incremental_train_sgd(new_data_csv_path, sgd_model_path, scaler_path, label_encoder_path, gender_le_path):
    print(f"[INFO] Training started at {datetime.datetime.now()}")

    if not os.path.exists(new_data_csv_path):
        print(f"[WARN] No new data file found at {new_data_csv_path}. Exiting.")
        return
    
    new_df = pd.read_csv(new_data_csv_path)
    if new_df.empty:
        print("[WARN] New data CSV is empty. Exiting.")
        return
    
    new_df.columns = [col.replace(" ", "_") for col in new_df.columns]

    # Clean Risk_Category: remove NaN or empty strings and strip whitespace
    new_df["Risk_Category"] = new_df["Risk_Category"].astype(str).str.strip()
    new_df = new_df[(new_df["Risk_Category"].notna()) & (new_df["Risk_Category"].str.lower() != 'nan') & (new_df["Risk_Category"] != '')]

    if new_df.empty:
        print("[WARN] No valid Risk_Category labels after filtering. Exiting.")
        return

    # Ensure RespiratoryRate_x_Age is present, else compute it if possible
    if "RespiratoryRate_x_Age" not in new_df.columns:
        if {"Respiratory_Rate", "Age"}.issubset(new_df.columns):
            new_df["RespiratoryRate_x_Age"] = new_df["Respiratory_Rate"] * new_df["Age"]
        else:
            print("[ERROR] Missing columns to compute RespiratoryRate_x_Age. Exiting.")
            return

    # Feature columns expected by the model
    feature_cols = [
        "Heart_Rate", "Respiratory_Rate", "Body_Temperature", "Oxygen_Saturation",
        "Systolic_Blood_Pressure", "Diastolic_Blood_Pressure", "Age", "Gender",
        "Derived_HRV", "Derived_Pulse_Pressure", "Derived_MAP", "RespiratoryRate_x_Age"
    ]

    # Check for missing feature columns in new data
    missing_features = [col for col in feature_cols if col not in new_df.columns]
    if missing_features:
        print(f"[ERROR] Missing feature columns in new data: {missing_features}. Exiting.")
        return

    # Load scaler and label encoders
    scaler = joblib.load(scaler_path)
    le_risk = joblib.load(label_encoder_path)
    le_gender = joblib.load(gender_le_path)

    # Encode Gender only if it is string/object dtype (skip if already numeric)
    if "Gender" in new_df.columns:
        if new_df["Gender"].dtype == object:
            # Ensure all gender labels are known to encoder to avoid errors
            unknown_genders = set(new_df["Gender"].unique()) - set(le_gender.classes_)
            if unknown_genders:
                print(f"[ERROR] Unknown gender labels found: {unknown_genders}. Exiting.")
                return
            new_df["Gender"] = le_gender.transform(new_df["Gender"])
        else:
            # Already numeric, do nothing
            pass
    else:
        print("[ERROR] 'Gender' column missing in new data. Exiting.")
        return

    # Check for unseen Risk_Category labels before encoding
    unique_labels = set(new_df["Risk_Category"].unique())
    known_labels = set(le_risk.classes_)
    unseen_labels = unique_labels - known_labels
    if unseen_labels:
        print(f"[ERROR] Unseen Risk_Category labels found in new data: {unseen_labels}. Exiting.")
        return

    # Encode Risk_Category labels
    y_new = le_risk.transform(new_df["Risk_Category"])

    # Prepare features and scale
    X_new = new_df[feature_cols]
    X_new_scaled = scaler.transform(X_new)

    # Load existing SGD model
    sgd_model = joblib.load(sgd_model_path)

    # For partial_fit, you cannot have class_weight in SGDClassifier directly, 
    # but it should be set during initialization only. 
    # If you want to reapply class weights, you have to create a new instance or ignore here.
    # So just proceed with partial_fit as is.
    # (If you want class weights, better to re-train from scratch or tweak differently.)

    classes = list(range(len(le_risk.classes_)))

    # Perform incremental training
    sgd_model.partial_fit(X_new_scaled, y_new, classes=classes)

    # Save updated model
    joblib.dump(sgd_model, sgd_model_path)

    # Evaluate on this incremental batch
    y_pred = sgd_model.predict(X_new_scaled)
    acc = accuracy_score(y_new, y_pred)
    print(f"[INFO] Accuracy on incremental batch: {acc:.4f}")

    report = classification_report(y_new, y_pred, target_names=le_risk.classes_)
    print("[INFO] Classification Report on incremental batch:")
    print(report)

    print(f"[INFO] Incrementally trained SGD model with {len(new_df)} new samples.")
    print(f"[INFO] Training finished at {datetime.datetime.now()}")


if __name__ == "__main__":
    print(f"[INFO] Current working directory: {os.getcwd()}")
    incremental_train_sgd(
        new_data_csv_path="/Users/anishanand/JeevaFitApp/lightsgd/newdata.csv",
        sgd_model_path="/Users/anishanand/JeevaFitApp/lightsgd/models/sgd_continuous_model.pkl",
        scaler_path="/Users/anishanand/JeevaFitApp/lightsgd/models/standard_scaler.pkl",
        label_encoder_path="/Users/anishanand/JeevaFitApp/lightsgd/models/risk_label_encoder.pkl",
        gender_le_path="/Users/anishanand/JeevaFitApp/lightsgd/models/gender_label_encoder.pkl"
    )
