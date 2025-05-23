import pandas as pd

def check_high_risk_in_csv(csv_path):
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"[ERROR] Could not read CSV file: {e}")
        return

    # Clean Risk_Category column
    df["Risk_Category"] = df["Risk_Category"].astype(str).str.strip()

    # Print all unique labels found in Risk_Category
    unique_labels = df["Risk_Category"].unique()
    print("Unique Risk_Category labels found:")
    print(unique_labels)

    # Check if "High Risk" is present (case-sensitive)
    if "High Risk" in unique_labels:
        print("\n✅ 'High Risk' is present in Risk_Category (case-sensitive).")
    else:
        print("\n❌ 'High Risk' is NOT present in Risk_Category (case-sensitive).")

    # Case-insensitive check
    if any(label.lower() == "high risk".lower() for label in unique_labels):
        print("✅ 'High Risk' is present in Risk_Category (case-insensitive).")
    else:
        print("❌ 'High Risk' is NOT present in Risk_Category (case-insensitive).")

if __name__ == "__main__":
    csv_path = "/Users/anishanand/JeevaFitApp/lightsgd/newdata.csv"
    check_high_risk_in_csv(csv_path)
