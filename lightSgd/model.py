import pandas as pd
import numpy as np
import lightgbm as lgb
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
import os


from sklearn.linear_model import SGDClassifier
from sklearn.ensemble import StackingClassifier
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import (
    classification_report, confusion_matrix, precision_recall_curve, f1_score, roc_curve
)
from sklearn.utils.class_weight import compute_class_weight
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
from lightgbm import early_stopping, log_evaluation
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.inspection import permutation_importance
import shap
import matplotlib.patches as mpatches


df = pd.read_csv("human_vital_signs_dataset.csv")

#  Replace spaces in column names with underscores
df.columns = [col.replace(" ", "_") for col in df.columns]

# Encode Gender and Risk Category
le_gender = LabelEncoder()
df["Gender"] = le_gender.fit_transform(df["Gender"])

le_risk = LabelEncoder()
df["Risk_Category"] = le_risk.fit_transform(df["Risk_Category"])

#  Feature columns and interaction term 
feature_cols = [
    "Heart_Rate", "Respiratory_Rate",
    "Body_Temperature", "Oxygen_Saturation",
    "Systolic_Blood_Pressure", "Diastolic_Blood_Pressure",
    "Age", "Gender", "Derived_HRV", "Derived_Pulse_Pressure", "Derived_MAP"
]

#  interaction term
df["RespiratoryRate_x_Age"] = df["Respiratory_Rate"] * df["Age"]
feature_cols.append("RespiratoryRate_x_Age")

X = df[feature_cols]
y = df["Risk_Category"]

# Split into train + validation + test 
X_temp, X_test, y_temp, y_test = train_test_split(
    X, y, stratify=y, test_size=0.2, random_state=42
)
X_train, X_val, y_train, y_val = train_test_split(
    X_temp, y_temp, stratify=y_temp, test_size=0.25, random_state=42
)  # 0.25 * 0.8 = 0.2

#  Scale features 
scaler = StandardScaler()
X_train_scaled = pd.DataFrame(scaler.fit_transform(X_train), columns=feature_cols)
X_val_scaled = pd.DataFrame(scaler.transform(X_val), columns=feature_cols)
X_test_scaled = pd.DataFrame(scaler.transform(X_test), columns=feature_cols)


class_weights = {0: 1, 1: 5}  
print("[INFO] Using manual class weights:", class_weights)



#  SMOTE 
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train_scaled, y_train)


lgb_model = lgb.LGBMClassifier(
    objective='multiclass',
    num_class=len(le_risk.classes_),
    n_estimators=100,  
    learning_rate=0.1,  
    max_depth=20,       
    num_leaves=31,      
    colsample_bytree=0.8, 
    subsample=0.8,         
    class_weight=class_weights,  
    random_state=42
)

lgb_model.fit(
    X_train_resampled, y_train_resampled,
    eval_set=[(X_val_scaled, y_val)],
    callbacks=[
        early_stopping(stopping_rounds=50),
        log_evaluation(20)  
    ]
)


sgd_model = SGDClassifier(
    loss='log_loss',
    max_iter=1000,
    tol=1e-3,
    class_weight=class_weights,
    random_state=42
)


calibrated_lgb = CalibratedClassifierCV(estimator=lgb_model, method='isotonic', cv=5)
calibrated_sgd = CalibratedClassifierCV(estimator=sgd_model, method='isotonic', cv=5)

#  Stacking Classifier 
stacking_model = StackingClassifier(
    estimators=[('lgbm', calibrated_lgb), ('sgd', calibrated_sgd)],
    final_estimator=XGBClassifier(use_label_encoder=False, eval_metric='mlogloss', random_state=42),
    passthrough=True,
    cv=5
)


print("[INFO] Training stacking model with SMOTE and calibration...")
stacking_model.fit(X_train_resampled, y_train_resampled)

#  Prediction on validation set 
y_val_pred = stacking_model.predict(X_val_scaled)
y_val_proba = stacking_model.predict_proba(X_val_scaled)

print("[INFO] Classification Report on Validation Set (Default Threshold=0.5):")
print(classification_report(y_val, y_val_pred, target_names=le_risk.classes_))

#  Threshold tuning with Youden's J statistic based on ROC curve 
def tune_threshold_roc(y_true, y_proba):
    fpr, tpr, thresholds = roc_curve(y_true, y_proba)
    j_scores = tpr - fpr
    best_idx = np.argmax(j_scores)
    return thresholds[best_idx]


high_risk_idx = np.where(le_risk.classes_ == "High Risk")[0][0]

# Binary true labels for High Risk class
y_val_binary = (y_val == high_risk_idx).astype(int)
val_probs_high_risk = y_val_proba[:, high_risk_idx]

best_threshold = tune_threshold_roc(y_val_binary, val_probs_high_risk)
print(f"[INFO] Best threshold on validation set by Youden's J: {best_threshold:.2f}")


y_test_proba = stacking_model.predict_proba(X_test_scaled)
y_test_pred = stacking_model.predict(X_test_scaled)

print("[INFO] Classification Report on Test Set (Default Threshold=0.5):")
print(classification_report(y_test, y_test_pred, target_names=le_risk.classes_))

# Adjust predictions based on tuned threshold for High Risk vs others
y_test_binary = (y_test == high_risk_idx).astype(int)
test_probs_high_risk = y_test_proba[:, high_risk_idx]
y_test_adjusted_pred_binary = (test_probs_high_risk >= best_threshold).astype(int)


y_test_labels = le_risk.inverse_transform(y_test)
y_test_adjusted_pred = np.where(
    y_test_adjusted_pred_binary == 1,
    "High Risk",
    "Low Risk"
)

print("[INFO] Classification Report on Test Set (Tuned Threshold):")
print(classification_report(y_test_labels, y_test_adjusted_pred, target_names=le_risk.classes_))

# Confusion matrix plot (tuned threshold) 
cm = confusion_matrix(y_test_labels, y_test_adjusted_pred, labels=le_risk.classes_)
sns.heatmap(cm, annot=True, fmt='d', xticklabels=le_risk.classes_, yticklabels=le_risk.classes_)
plt.title('Confusion Matrix (Tuned Threshold)')
plt.xlabel('Predicted')
plt.ylabel('True')
plt.show()



low_risk_idx = np.where(le_risk.classes_ == "Low Risk")[0][0]
high_risk_idx = np.where(le_risk.classes_ == "High Risk")[0][0]


mask = ((y_test == low_risk_idx) | (y_test == high_risk_idx)).values  # numpy boolean array

# Use iloc with the boolean numpy array mask to select rows
X_vis = X_test_scaled.iloc[mask]
y_vis = y_test.iloc[mask]

# Map numeric labels to strings for plotting
label_names = le_risk.inverse_transform(y_vis)

pca = PCA(n_components=2, random_state=42)
X_pca = pca.fit_transform(X_vis)

plt.figure(figsize=(8,6))
sns.scatterplot(
    x=X_pca[:, 0],
    y=X_pca[:, 1],
    hue=label_names,
    palette={'Low Risk': 'blue', 'High Risk': 'red'},
    alpha=0.7
)
plt.title("PCA Visualization of High Risk vs Low Risk Groups")
plt.xlabel("PCA Component 1")
plt.ylabel("PCA Component 2")
plt.legend(title="Risk Category")
plt.show()

tsne = TSNE(n_components=2, random_state=42, perplexity=30, n_iter=1000)
X_tsne = tsne.fit_transform(X_vis)

plt.figure(figsize=(8,6))
sns.scatterplot(
    x=X_tsne[:, 0],
    y=X_tsne[:, 1],
    hue=label_names,
    palette={'Low Risk': 'blue', 'High Risk': 'red'},
    alpha=0.7
)
plt.title("t-SNE Visualization of High Risk vs Low Risk Groups")
plt.xlabel("t-SNE Dimension 1")
plt.ylabel("t-SNE Dimension 2")
plt.legend(title="Risk Category")
plt.show()


#  Feature importance from LightGBM 
print("[INFO] Training LightGBM base learner for feature importance on resampled train...")
lgb_model.fit(X_train_resampled, y_train_resampled)
importances = lgb_model.feature_importances_
feature_importance_dict = {f: float(i) for f, i in zip(feature_cols, importances)}
print("Feature importances:", feature_importance_dict)

# Plot calibration curve 
prob_true, prob_pred = calibration_curve(y_val_binary, val_probs_high_risk, n_bins=10)
plt.plot(prob_pred, prob_true, marker='o', label='Calibration curve')
plt.plot([0,1],[0,1],'--', label='Perfect calibration')
plt.xlabel('Predicted probability')
plt.ylabel('True probability')
plt.title('Calibration Curve for High Risk Class')
plt.legend()
plt.show()




y_test_pred_labels = le_risk.inverse_transform(y_test_pred)


test_results_df = X_test_scaled.copy()
test_results_df["True_Label"] = le_risk.inverse_transform(y_test)
test_results_df["Predicted_Label"] = y_test_pred_labels


misclassified_df = test_results_df[test_results_df["True_Label"] != test_results_df["Predicted_Label"]]

print(f"[INFO] Number of misclassified samples: {len(misclassified_df)}")


print(misclassified_df.head())
model_dir = "models"
if not os.path.exists(model_dir):
    os.makedirs(model_dir)


# === Save Final Models ===
print("[INFO] Saving stacking model and preprocessing artifacts...")

joblib.dump(stacking_model, "models/stacking_model.pkl")
joblib.dump(scaler, "models/standard_scaler.pkl")
joblib.dump(le_risk, "models/risk_label_encoder.pkl")
joblib.dump(le_gender, "models/gender_label_encoder.pkl")

# Optional: Save base learners if needed for continuous learning
joblib.dump(sgd_model, "models/sgd_continuous_model.pkl")

def plot_feature_importance_lgbm(model, feature_names):
    importances = model.feature_importances_
    fi_dict = dict(zip(feature_names, importances))
    plt.figure(figsize=(9, 6))
    sns.barplot(x=list(fi_dict.values()), y=list(fi_dict.keys()), palette="viridis")
    plt.title("LightGBM Feature Importance")
    plt.xlabel("Importance")
    plt.ylabel("Feature")
    plt.tight_layout()
    plt.savefig("research_figures/lgbm_feature_importance.png", dpi=300)
    plt.show()

def plot_sgd_coefficients(model, feature_names):
    # CalibratedClassifierCV wraps the model, so extract underlying estimator
    if hasattr(model, "base_estimator_"):
        coef = model.base_estimator_.coef_
    else:
        coef = model.coef_
    if coef.ndim == 2:  # multiclass case, shape=(n_classes, n_features)
        # Plot for each class
        plt.figure(figsize=(9, 7))
        for i, class_label in enumerate(le_risk.classes_):
            sns.barplot(x=feature_names, y=coef[i])
            plt.title(f"SGD Coefficients for class '{class_label}'")
            plt.xticks(rotation=45)
            plt.ylabel("Coefficient")
            plt.xlabel("Feature")
            plt.tight_layout()
            plt.savefig(f"research_figures/sgd_coefficients_class_{class_label}.png", dpi=300)
            plt.show()
    else:
        plt.figure(figsize=(9, 6))
        sns.barplot(x=feature_names, y=coef)
        plt.title("SGD Coefficients")
        plt.xticks(rotation=45)
        plt.ylabel("Coefficient")
        plt.xlabel("Feature")
        plt.tight_layout()
        plt.savefig("research_figures/sgd_coefficients.png", dpi=300)
        plt.show()

def plot_permutation_importance(model, X_val, y_val, feature_names):
    print("[INFO] Computing permutation importance for the stacking model...")
    r = permutation_importance(model, X_val, y_val, n_repeats=10, random_state=42, n_jobs=-1)
    perm_importance = dict(zip(feature_names, r.importances_mean))
    sorted_features = sorted(perm_importance.items(), key=lambda x: x[1], reverse=True)
    names, scores = zip(*sorted_features)
    plt.figure(figsize=(9, 7))
    sns.barplot(x=scores, y=names, palette="magma")
    plt.title("Permutation Importance for Stacking Ensemble")
    plt.xlabel("Mean Decrease in Score")
    plt.ylabel("Feature")
    plt.tight_layout()
    plt.savefig("research_figures/stacking_permutation_importance.png", dpi=300)
    plt.show()

def plot_roc_curves(models, model_names, X_val, y_val):
    plt.figure(figsize=(10, 7))
    for model, name in zip(models, model_names):
        if hasattr(model, "predict_proba"):
            y_proba = model.predict_proba(X_val)
            if y_proba.shape[1] == 2:
                y_score = y_proba[:, 1]
                fpr, tpr, _ = roc_curve(y_val, y_score)
                roc_auc = auc(fpr, tpr)
                plt.plot(fpr, tpr, label=f"{name} (AUC = {roc_auc:.3f})")
            else:
                # multiclass ROC: plot macro average or skip
                pass
        else:
            # fallback: skip or use decision_function
            pass
    plt.plot([0, 1], [0, 1], 'k--', label="Random guess")
    plt.title("ROC Curve Comparison")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig("research_figures/roc_curve_comparison.png", dpi=300)
    plt.show()

def plot_precision_recall_curves(models, model_names, X_val, y_val):
    plt.figure(figsize=(9, 7))
    for model, name in zip(models, model_names):
        if hasattr(model, "predict_proba"):
            y_proba = model.predict_proba(X_val)
            if y_proba.shape[1] == 2:
                y_score = y_proba[:, 1]
                precision, recall, _ = precision_recall_curve(y_val, y_score)
                plt.plot(recall, precision, label=f"{name}")
    plt.title("Precision-Recall Curve Comparison")
    plt.xlabel("Recall")
    plt.ylabel("Precision")
    plt.legend(loc="lower left")
    plt.tight_layout()
    plt.savefig("research_figures/pr_curve_comparison.png", dpi=300)
    plt.show()

def plot_shap_summary(model, X_train):
    # SHAP values for LightGBM only (fast and reliable)
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_train)
    plt.figure()
    shap.summary_plot(shap_values, X_train, plot_type="bar", show=False)
    plt.savefig("research_figures/shap_summary_lgbm.png", dpi=300)
    plt.show()

# === Create research_figures folder if not exists ===
import os
os.makedirs("research_figures", exist_ok=True)

# Call the plotting functions

# LightGBM Feature Importance (base learner)
plot_feature_importance_lgbm(lgb_model, feature_cols)

# SGD Coefficients
plot_sgd_coefficients(calibrated_sgd, feature_cols)

# Permutation importance on stacking model (use validation set scaled)
plot_permutation_importance(stacking_model, X_val_scaled, y_val, feature_cols)

# ROC Curves for base learners and stacking
plot_roc_curves(
    models=[calibrated_lgb, calibrated_sgd, stacking_model],
    model_names=["Calibrated LightGBM", "Calibrated SGD", "Stacking Ensemble"],
    X_val=X_val_scaled,
    y_val=y_val
)

# Precision-Recall Curves
plot_precision_recall_curves(
    models=[calibrated_lgb, calibrated_sgd, stacking_model],
    model_names=["Calibrated LightGBM", "Calibrated SGD", "Stacking Ensemble"],
    X_val=X_val_scaled,
    y_val=y_val
)

# Optional: SHAP summary for LightGBM base learner
try:
    plot_shap_summary(lgb_model, X_train_resampled)
except Exception as e:
    print("[WARNING] SHAP plot failed:", e)
    # Indices for High Risk and Low Risk classes
high_risk_idx = np.where(le_risk.classes_ == "High Risk")[0][0]
low_risk_idx = np.where(le_risk.classes_ == "Low Risk")[0][0]

# Filter only High Risk and Low Risk samples in test set
mask = (y_test == high_risk_idx) | (y_test == low_risk_idx)
X_vis = X_test_scaled.iloc[mask]
y_vis = y_test.iloc[mask]
y_pred_vis = y_test_pred[mask]

# Boolean masks for correctly and incorrectly predicted High Risk samples
correct_high_risk_mask = (y_vis == high_risk_idx) & (y_pred_vis == high_risk_idx)
misclassified_high_risk_mask = (y_vis == high_risk_idx) & (y_pred_vis == low_risk_idx)
low_risk_mask = (y_vis == low_risk_idx)

# PCA for visualization
pca = PCA(n_components=2, random_state=42)
X_pca = pca.fit_transform(X_vis)

plt.figure(figsize=(9, 7))

# Plot low risk samples
plt.scatter(
    X_pca[low_risk_mask, 0],
    X_pca[low_risk_mask, 1],
    color='blue',
    alpha=0.5,
    label='Low Risk'
)

# Plot correctly classified high risk samples
plt.scatter(
    X_pca[correct_high_risk_mask, 0],
    X_pca[correct_high_risk_mask, 1],
    color='red',
    alpha=0.7,
    label='Correct High Risk'
)

# Plot misclassified high risk samples (predicted as Low Risk)
plt.scatter(
    X_pca[misclassified_high_risk_mask, 0],
    X_pca[misclassified_high_risk_mask, 1],
    color='orange',
    alpha=0.9,
    marker='x',
    s=100,
    label='Misclassified High Risk (Predicted Low Risk)'
)

plt.title("PCA Visualization: Misclassified High Risk samples resemble Low Risk")
plt.xlabel("PCA Component 1")
plt.ylabel("PCA Component 2")
plt.legend()
plt.show()