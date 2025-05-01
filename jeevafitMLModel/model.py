import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
from sklearn.metrics import classification_report, accuracy_score

# Load dataset
df = pd.read_csv("human_vital_signs_dataset.csv")

# Encode categorical columns
le_gender = LabelEncoder()
df["Gender"] = le_gender.fit_transform(df["Gender"])

le_risk = LabelEncoder()
df["Risk Category"] = le_risk.fit_transform(df["Risk Category"])

# Features and target
X = df[[
    "Heart Rate", "Respiratory Rate",
    "Body Temperature", "Oxygen Saturation",
    "Systolic Blood Pressure", "Diastolic Blood Pressure", "Age", "Gender",
    "Weight (kg)", "Height (m)",
    "Derived_HRV", "Derived_Pulse_Pressure",
    "Derived_BMI", "Derived_MAP"
]]
y = df["Risk Category"]

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred, target_names=le_risk.classes_))

# Save model and encoders
joblib.dump(model, "hybrid_model.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(le_gender, "le_gender.pkl")
joblib.dump(le_risk, "le_risk.pkl")
