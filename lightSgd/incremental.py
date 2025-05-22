import pandas as pd
import joblib
import os
from sklearn.preprocessing import StandardScaler, LabelEncoder

def incremental_train_sgd(new_data_csv_path, sgd_model_path, scaler_path, label_encoder_path):
    if not os.path.exists(new_data_csv_path):
        print(f"[WARN] No new data file found at {new_data_csv_path}. Exiting.")
        return
    
    new_df = pd.read_csv(new_data_csv_path)
    
    if new_df.empty:
        print("[WARN] New data CSV is empty. Exiting.")
        return
    
    scaler = joblib.load(scaler_path)
    le_risk = joblib.load(label_encoder_path)

    feature_cols = [
        "Heart_Rate", "Respiratory_Rate",
        "Body_Temperature", "Oxygen_Saturation",
        "Systolic_Blood_Pressure", "Diastolic_Blood_Pressure",
        "Age", "Gender", "Derived_HRV", "Derived_Pulse_Pressure", "Derived_MAP",
        "RespiratoryRate_x_Age"
    ]

    # Compute interaction term if missing
    if "RespiratoryRate_x_Age" not in new_df.columns:
        new_df["RespiratoryRate_x_Age"] = new_df["Respiratory_Rate"] * new_df["Age"]

    # Encode Gender if needed - assumes gender_label_encoder.pkl exists
    if "Gender" in new_df.columns and new_df["Gender"].dtype == object:
        le_gender = joblib.load("models/gender_label_encoder.pkl")
        new_df["Gender"] = le_gender.transform(new_df["Gender"])

    # Encode target labels
    y_new = le_risk.transform(new_df["Risk_Category"])

    X_new = new_df[feature_cols]
    X_new_scaled = scaler.transform(X_new)

    sgd_model = joblib.load(sgd_model_path)

    # For multi-class, classes param is important
    classes = list(range(len(le_risk.classes_)))

    sgd_model.partial_fit(X_new_scaled, y_new, classes=classes)

    joblib.dump(sgd_model, sgd_model_path)
    print(f"[INFO] Incrementally trained SGD model with {len(new_df)} new samples.")

    
if __name__ == "__main__":
    incremental_train_sgd(
        new_data_csv_path="data/new_data.csv",  # path where backend will save new labeled data
        sgd_model_path="models/sgd_continuous_model.pkl",
        scaler_path="models/standard_scaler.pkl",
        label_encoder_path="models/risk_label_encoder.pkl"
    )
