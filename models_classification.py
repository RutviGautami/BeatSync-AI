"""
🎵 GTZAN Music Genre Classification — Multi-Model Benchmark & Pickle Export
=============================================================================
This script trains and compares 7 distinct machine learning classification models
on the GTZAN dataset features, evaluates accuracy, precision, recall, and F1-score,
identifies the champion model with the highest test accuracy, and exports it to
`best_model.pkl` along with feature preprocessing artifacts.
"""

import os
import sys
import json
import pickle
import time

# Ensure Windows consoles don't crash on utf-8 characters
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, f1_score

# Classification Models
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression


def load_dataset():
    """Load GTZAN feature dataset (prefers 3-sec features for high sample volume)."""
    dataset_candidates = [
        os.path.join("archive", "Data", "features_3_sec.csv"),
        os.path.join("..", "archive", "Data", "features_3_sec.csv"),
        os.path.join("archive", "Data", "features_30_sec.csv"),
        "features.csv"
    ]
    
    selected_path = None
    for path in dataset_candidates:
        if os.path.exists(path):
            selected_path = path
            break
            
    if not selected_path:
        raise FileNotFoundError("Could not locate GTZAN features dataset. Please check archive/Data directory.")
        
    print(f"📊 Loading dataset from: {selected_path}")
    df = pd.read_csv(selected_path)
    print(f"   Shape: {df.shape[0]} rows, {df.shape[1]} columns")
    
    # Identify label column
    if "label" in df.columns:
        label_col = "label"
    elif "genre_label" in df.columns:
        label_col = "genre_label"
    else:
        label_col = df.columns[-1]
        
    # Drop non-feature metadata columns
    drop_cols = [c for c in ["filename", "length", label_col] if c in df.columns]
    feature_cols = [c for c in df.columns if c not in drop_cols]
    
    X = df[feature_cols].values
    y = df[label_col].values
    
    return X, y, feature_cols, selected_path


def train_and_benchmark_models():
    """Train multiple classification models, evaluate performance, and export the best model."""
    print("=" * 70)
    print("🚀 GTZAN MUSIC GENRE CLASSIFICATION - MULTI-MODEL BENCHMARK")
    print("=" * 70)
    
    X, y, feature_names, dataset_path = load_dataset()
    
    # 1. Encode labels
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    classes = list(le.classes_)
    print(f"🎶 Number of Classes: {len(classes)} -> {classes}")
    print(f"🎛️  Number of Audio Features: {len(feature_names)}")
    
    # 2. Stratified Train/Test Split (80% Train, 20% Test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    print(f"📦 Training Samples: {X_train.shape[0]} | Test Samples: {X_test.shape[0]}")
    
    # 3. Feature Standard Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # 4. Define all classification models
    models_config = {
        "K-Nearest Neighbors (KNN)": {
            "model": KNeighborsClassifier(n_neighbors=5, weights="distance", n_jobs=-1),
            "description": "Instance-based learning using Euclidean distance in scaled spectral space."
        },
        "Random Forest": {
            "model": RandomForestClassifier(n_estimators=150, max_depth=20, random_state=42, n_jobs=-1),
            "description": "Ensemble of 150 bagged decision trees with variance reduction."
        },
        "MLP Neural Network": {
            "model": MLPClassifier(hidden_layer_sizes=(128, 64), max_iter=300, alpha=0.001, random_state=42),
            "description": "Deep multi-layer feedforward artificial neural network with ReLU & Adam."
        },
        "Support Vector Machine (SVC RBF)": {
            "model": SVC(kernel="rbf", C=10.0, probability=True, random_state=42),
            "description": "Radial Basis Function kernel maximizing margin boundaries."
        },
        "Gradient Boosting": {
            "model": GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42),
            "description": "Sequential boosted ensemble minimizing gradient loss."
        },
        "Decision Tree": {
            "model": DecisionTreeClassifier(max_depth=15, random_state=42),
            "description": "Single decision tree splitting on Gini impurity."
        },
        "Logistic Regression": {
            "model": LogisticRegression(max_iter=500, random_state=42),
            "description": "Multinomial linear classifier with L2 regularization."
        }
    }
    
    results = []
    best_acc = -1.0
    best_model_name = None
    best_model_obj = None
    
    print("\n" + "-" * 70)
    print("⏳ TRAINING & EVALUATING CLASSIFICATION MODELS...")
    print("-" * 70)
    
    for name, config in models_config.items():
        clf = config["model"]
        start_time = time.time()
        print(f"\n▶ Training: {name}...")
        
        clf.fit(X_train_scaled, y_train)
        train_time = round(time.time() - start_time, 2)
        
        # Predictions
        preds = clf.predict(X_test_scaled)
        acc = accuracy_score(y_test, preds) * 100.0
        f1 = f1_score(y_test, preds, average="weighted") * 100.0
        
        # Per-class metrics summary
        report = classification_report(y_test, preds, target_names=classes, output_dict=True)
        
        print(f"   ✓ Accuracy: {acc:.2f}% | F1-Score: {f1:.2f}% (Train time: {train_time}s)")
        
        result_entry = {
            "name": name,
            "accuracy": round(acc, 2),
            "f1_score": round(f1, 2),
            "train_time_sec": train_time,
            "description": config["description"],
            "classification_report": {
                c: {
                    "precision": round(report[c]["precision"] * 100, 1),
                    "recall": round(report[c]["recall"] * 100, 1),
                    "f1": round(report[c]["f1-score"] * 100, 1)
                } for c in classes
            }
        }
        results.append(result_entry)
        
        # Track the best model
        if acc > best_acc:
            best_acc = acc
            best_model_name = name
            best_model_obj = clf

    # Sort results by accuracy descending
    results.sort(key=lambda x: x["accuracy"], reverse=True)
    
    # Print Benchmark Table
    print("\n" + "=" * 70)
    print("🏆 FINAL MODEL LEADERBOARD & COMPARISON SUMMARY")
    print("=" * 70)
    print(f"{'Rank':<5} {'Model Name':<32} {'Accuracy':<12} {'F1-Score':<12} {'Train Time'}")
    print("-" * 70)
    for rank, res in enumerate(results, start=1):
        is_best = " ⭐ (CHAMPION)" if res["name"] == best_model_name else ""
        print(f"{rank:<5} {res['name']:<32} {res['accuracy']:>6.2f}%     {res['f1_score']:>6.2f}%     {res['train_time_sec']}s{is_best}")
    print("=" * 70)
    print(f"\n🌟 HIGHEST ACCURACY MODEL: {best_model_name} with {best_acc:.2f}% Accuracy!")

    # 5. Create Pickle Artifact
    pickle_data = {
        "model": best_model_obj,
        "model_name": best_model_name,
        "accuracy": round(best_acc, 2),
        "scaler": scaler,
        "label_encoder": le,
        "classes": classes,
        "feature_names": feature_names,
        "dataset_path": dataset_path,
        "all_models_summary": results,
        "training_timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    
    pickle_filename = "best_model.pkl"
    with open(pickle_filename, "wb") as f:
        pickle.dump(pickle_data, f, protocol=pickle.HIGHEST_PROTOCOL)
        
    print(f"\n💾 Model successfully saved to pickle file: {os.path.abspath(pickle_filename)}")
    print(f"   Size: {os.path.getsize(pickle_filename) / 1024:.2f} KB")

    # 6. Save JSON summary for frontend and backend API
    comparison_summary = {
        "champion_model": {
            "name": best_model_name,
            "accuracy": round(best_acc, 2),
            "f1_score": next(r["f1_score"] for r in results if r["name"] == best_model_name),
            "pickle_file": pickle_filename
        },
        "classes": classes,
        "feature_count": len(feature_names),
        "feature_names": feature_names,
        "models_leaderboard": results,
        "updated_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    
    # Save in root and in frontend src/utils
    json_paths = [
        "model_comparison.json",
        os.path.join("veryveryfinalfront", "src", "utils", "model_comparison.json")
    ]
    for jp in json_paths:
        try:
            os.makedirs(os.path.dirname(jp), exist_ok=True) if os.path.dirname(jp) else None
            with open(jp, "w", encoding="utf-8") as f:
                json.dump(comparison_summary, f, indent=2)
            print(f"📄 Saved JSON metrics to: {jp}")
        except Exception as e:
            print(f"Warning: could not save to {jp}: {e}")

    # 7. Quick verification test of the pickle file
    print("\n🔍 Verifying generated pickle file by loading and predicting...")
    with open(pickle_filename, "rb") as f:
        loaded = pickle.load(f)
    
    test_sample = X_test_scaled[:1]
    sample_pred_id = loaded["model"].predict(test_sample)[0]
    sample_genre = loaded["classes"][sample_pred_id]
    print(f"   ✓ Loaded pickle successfully: Model '{loaded['model_name']}'")
    print(f"   ✓ Sample prediction test: {sample_genre}")
    print("\n🎉 ALL TASKS IN models_classification.py COMPLETED SUCCESSFULLY!\n")


if __name__ == "__main__":
    train_and_benchmark_models()
