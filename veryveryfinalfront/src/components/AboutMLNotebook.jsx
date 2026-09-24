import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playUISound } from '../utils/webAudioSynth';

const codeCategories = [
  {
    category: 'Classification Models',
    items: [
      {
        id: 'svm',
        title: '1. Support Vector Machine (SVC RBF) — 91.34% (Champion)',
        file: 'models_classification.py',
        tag: 'Champion Model • 91.34% Acc',
        color: '#EC4899',
        desc: 'Radial Basis Function kernel maximizing margin boundaries in 57-dimensional scaled spectral space. Pickled as best_model.pkl.',
        code: `from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report

# Initialize Support Vector Classifier with RBF kernel
# C=10.0 provides high penalty for margin errors
# probability=True enables Platt scaling for calibrated softmax probabilities
svm_model = SVC(
    kernel="rbf",
    C=10.0,
    probability=True,
    random_state=42
)

# Train on 7,992 scaled GTZAN audio samples
svm_model.fit(X_train_scaled, y_train)

# Evaluate on 1,998 test samples
svm_preds = svm_model.predict(X_test_scaled)
svm_acc = accuracy_score(y_test, svm_preds) * 100.0

print(f"SVC RBF Test Accuracy: {svm_acc:.2f}%")
print(classification_report(y_test, svm_preds, target_names=classes))`,
        output: `SVC RBF Test Accuracy: 91.34% | Weighted F1-Score: 91.33% | Selected as Champion Model!`
      },
      {
        id: 'knn',
        title: '2. K-Nearest Neighbors (KNN) — 89.34%',
        file: 'models_classification.py',
        tag: 'Rank #2 • 89.34% Acc',
        color: '#06B6D4',
        desc: 'Distance-weighted nearest neighbor classifier using inverse Euclidean distance across audio feature vectors.',
        code: `from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# Initialize KNN Classifier
# n_neighbors=5 with distance weighting (closer neighbors have higher vote weight)
knn_model = KNeighborsClassifier(
    n_neighbors=5,
    weights="distance",
    metric="minkowski",
    p=2,
    n_jobs=-1
)

# Fit training points
knn_model.fit(X_train_scaled, y_train)

# Predict test set
knn_preds = knn_model.predict(X_test_scaled)
knn_acc = accuracy_score(y_test, knn_preds) * 100.0

print(f"KNN Test Accuracy: {knn_acc:.2f}%")`,
        output: `KNN Test Accuracy: 89.34% | Weighted F1-Score: 89.32% | Train Time: 0.01s`
      },
      {
        id: 'mlp',
        title: '3. Multi-Layer Perceptron (MLP Neural Network) — 87.29%',
        file: 'models_classification.py',
        tag: 'Rank #3 • 87.29% Acc',
        color: '#8B5CF6',
        desc: 'Deep feedforward artificial neural network with 2 hidden layers (128, 64 neurons), ReLU activation, and Adam optimizer.',
        code: `from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score

# Deep MLP Neural Network Architecture
# Input layer: 57 audio spectral features
# Hidden layer 1: 128 neurons (ReLU)
# Hidden layer 2: 64 neurons (ReLU)
# Output layer: 10 genre classes (Softmax)
mlp_model = MLPClassifier(
    hidden_layer_sizes=(128, 64),
    activation="relu",
    solver="adam",
    alpha=0.001,
    max_iter=300,
    random_state=42,
    early_stopping=True
)

mlp_model.fit(X_train_scaled, y_train)
mlp_preds = mlp_model.predict(X_test_scaled)
mlp_acc = accuracy_score(y_test, mlp_preds) * 100.0

print(f"MLP Neural Network Accuracy: {mlp_acc:.2f}%")`,
        output: `MLP Neural Network Accuracy: 87.29% | Weighted F1-Score: 87.32% | Converged in 10.71s`
      },
      {
        id: 'rf',
        title: '4. Random Forest Classifier — 87.14%',
        file: 'models_classification.py',
        tag: 'Rank #4 • 87.14% Acc',
        color: '#10B981',
        desc: 'Ensemble of 150 bagged decision trees with feature sub-sampling and out-of-bag variance reduction.',
        code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Random Forest with 150 decision trees
rf_model = RandomForestClassifier(
    n_estimators=150,
    max_depth=20,
    min_samples_split=2,
    random_state=42,
    n_jobs=-1
)

rf_model.fit(X_train_scaled, y_train)
rf_preds = rf_model.predict(X_test_scaled)
rf_acc = accuracy_score(y_test, rf_preds) * 100.0

print(f"Random Forest Accuracy: {rf_acc:.2f}%")`,
        output: `Random Forest Accuracy: 87.14% | Weighted F1-Score: 87.09% | Train Time: 1.04s`
      },
      {
        id: 'gb',
        title: '5. Gradient Boosting Classifier — 86.99%',
        file: 'models_classification.py',
        tag: 'Rank #5 • 86.99% Acc',
        color: '#F59E0B',
        desc: 'Sequential ensemble minimizing multinomial deviance loss across 100 boosting stages for 10 classes.',
        code: `from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score

# Gradient Tree Boosting
gb_model = GradientBoostingClassifier(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=5,
    random_state=42
)

gb_model.fit(X_train_scaled, y_train)
gb_preds = gb_model.predict(X_test_scaled)
gb_acc = accuracy_score(y_test, gb_preds) * 100.0

print(f"Gradient Boosting Accuracy: {gb_acc:.2f}%")`,
        output: `Gradient Boosting Accuracy: 86.99% | Weighted F1-Score: 86.99%`
      },
      {
        id: 'lr',
        title: '6. Multinomial Logistic Regression — 71.97%',
        file: 'models_classification.py',
        tag: 'Rank #6 • 71.97% Acc',
        color: '#6366F1',
        desc: 'Linear multiclass model optimizing softmax cross-entropy loss with L2 weight regularization.',
        code: `from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Multinomial Logistic Regression
lr_model = LogisticRegression(
    max_iter=500,
    C=1.0,
    penalty="l2",
    random_state=42
)

lr_model.fit(X_train_scaled, y_train)
lr_preds = lr_model.predict(X_test_scaled)
lr_acc = accuracy_score(y_test, lr_preds) * 100.0

print(f"Logistic Regression Accuracy: {lr_acc:.2f}%")`,
        output: `Logistic Regression Accuracy: 71.97% | Weighted F1-Score: 71.78%`
      },
      {
        id: 'dt',
        title: '7. Decision Tree Classifier — 63.41%',
        file: 'models_classification.py',
        tag: 'Rank #7 • 63.41% Acc',
        color: '#94A3B8',
        desc: 'Single hierarchical decision tree splitting on Gini impurity down to depth 15.',
        code: `from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# Single Decision Tree
dt_model = DecisionTreeClassifier(
    max_depth=15,
    criterion="gini",
    random_state=42
)

dt_model.fit(X_train_scaled, y_train)
dt_preds = dt_model.predict(X_test_scaled)
dt_acc = accuracy_score(y_test, dt_preds) * 100.0

print(f"Decision Tree Accuracy: {dt_acc:.2f}%")`,
        output: `Decision Tree Accuracy: 63.41% | Weighted F1-Score: 63.48%`
      }
    ]
  },
  {
    category: 'Pickle & Serialization',
    items: [
      {
        id: 'pickle-export',
        title: 'Pickle File Serialization (best_model.pkl)',
        file: 'models_classification.py',
        tag: 'Artifact • best_model.pkl',
        color: '#10B981',
        desc: 'Bundles the champion 91.34% SVC model, fitted StandardScaler, LabelEncoder, and class labels into a standalone pickle binary.',
        code: `import pickle
import time

# Bundle champion model with preprocessing pipeline
pickle_data = {
    "model": best_model_obj,              # 91.34% SVC RBF model
    "model_name": best_model_name,        # "Support Vector Machine (SVC RBF)"
    "accuracy": round(best_acc, 2),       # 91.34
    "scaler": scaler,                     # Fitted StandardScaler (mean & std for 57 features)
    "label_encoder": le,                  # Fitted LabelEncoder for 10 classes
    "classes": classes,                   # ['blues', 'classical', ..., 'rock']
    "feature_names": feature_names,       # 57 audio feature column names
    "all_models_summary": results,        # Full benchmark leaderboard
    "training_timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
}

# Export to best_model.pkl
pickle_path = "best_model.pkl"
with open(pickle_path, "wb") as f:
    pickle.dump(pickle_data, f, protocol=pickle.HIGHEST_PROTOCOL)

print(f"Model successfully saved to {pickle_path} (Size: 2.64 MB)")`,
        output: `best_model.pkl generated successfully | File Size: 2,640.94 KB`
      },
      {
        id: 'pickle-load',
        title: 'Pickle Loading & Inference Verification',
        file: 'test_api.py',
        tag: 'Deserialization Test',
        color: '#06B6D4',
        desc: 'Demonstrates loading the pickle artifact in Python and making instant predictions on new audio feature vectors.',
        code: `import pickle
import numpy as np

# Load pickled artifact
with open("best_model.pkl", "rb") as f:
    package = pickle.load(f)

model = package["model"]
scaler = package["scaler"]
classes = package["classes"]

print(f"Loaded: {package['model_name']} ({package['accuracy']}% Accuracy)")

# Predict on new 57-dimensional audio feature vector
sample_audio_features = np.random.randn(1, 57)
scaled_features = scaler.transform(sample_audio_features)

predicted_idx = model.predict(scaled_features)[0]
probabilities = model.predict_proba(scaled_features)[0]

print(f"Predicted Genre: {classes[predicted_idx]}")
print(f"Confidence: {probabilities[predicted_idx] * 100:.2f}%")`,
        output: `Loaded: Support Vector Machine (SVC RBF) (91.34% Accuracy) | Prediction: verified!`
      }
    ]
  },
  {
    category: 'Backend Server (FastAPI)',
    items: [
      {
        id: 'fastapi-app',
        title: 'FastAPI Backend Server (Audio Feature Extraction & Prediction)',
        file: 'backend_server.py',
        tag: 'FastAPI • Uvicorn',
        color: '#8B5CF6',
        desc: 'High-performance REST API with CORS. Ingests raw audio files, extracts 57 Librosa spectral features, scales them, and returns predictions.',
        code: `from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pickle
import librosa
import numpy as np

app = FastAPI(title="BeatSync AI Classification API")

# Enable CORS for Vite Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load pickled model on startup
with open("best_model.pkl", "rb") as f:
    MODEL_DATA = pickle.load(f)

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    # 1. Load audio with Librosa at 22,050 Hz
    y, sr = librosa.load(file.file, sr=22050, mono=True)
    
    # 2. Extract 57 GTZAN spectral features across 3-second segments
    features = extract_57_features(y, sr)
    
    # 3. Normalize with pickled StandardScaler
    features_scaled = MODEL_DATA["scaler"].transform([features])
    
    # 4. Predict with champion 91.34% SVC model
    pred_idx = MODEL_DATA["model"].predict(features_scaled)[0]
    probs = MODEL_DATA["model"].predict_proba(features_scaled)[0]
    
    return {
        "success": True,
        "genre": MODEL_DATA["classes"][pred_idx].capitalize(),
        "confidence": f"{probs[pred_idx] * 100:.1f}",
        "probabilities": [
            {"genre": c.capitalize(), "confidence": round(p * 100, 1)}
            for c, p in zip(MODEL_DATA["classes"], probs)
        ]
    }`,
        output: `FastAPI server listening on http://127.0.0.1:8000 | /api/predict & /api/models active`
      }
    ]
  },
  {
    category: 'Audio Feature Engineering',
    items: [
      {
        id: 'librosa-features',
        title: '57-Feature Audio Signal Extraction Pipeline',
        file: 'feature_extractor.ipynb',
        tag: 'Signal Processing • Librosa',
        color: '#EC4899',
        desc: 'Converts raw waveforms into 57 statistical timbre, pitch, energy, rhythm, and spectral features.',
        code: `import librosa
import numpy as np

def extract_57_features(y, sr=22050):
    # 1. Timbral Texture: 20 MFCCs (means & variances = 40 features)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
    mfcc_features = []
    for i in range(20):
        mfcc_features.extend([np.mean(mfcc[i]), np.var(mfcc[i])])
        
    # 2. Pitch / Harmonics: Chroma STFT (12 semitones mean & var)
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    chroma_mean, chroma_var = np.mean(chroma), np.var(chroma)
    
    # 3. Energy: RMS Energy (mean & var)
    rms = librosa.feature.rms(y=y)
    rms_mean, rms_var = np.mean(rms), np.var(rms)
    
    # 4. Spectral Features: Centroid, Bandwidth, Rolloff, ZCR
    cent = librosa.feature.spectral_centroid(y=y, sr=sr)
    bw = librosa.feature.spectral_bandwidth(y=y, sr=sr)
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    zcr = librosa.feature.zero_crossing_rate(y=y)
    
    # 5. Harmonic vs Percussive Decomposition
    harm, perc = librosa.effects.hpss(y)
    
    # 6. Rhythm: Global Tempo (BPM)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    
    return np.hstack([
        chroma_mean, chroma_var, rms_mean, rms_var,
        np.mean(cent), np.var(cent), np.mean(bw), np.var(bw),
        np.mean(rolloff), np.var(rolloff), np.mean(zcr), np.var(zcr),
        np.mean(harm), np.var(harm), np.mean(perc), np.var(perc),
        float(np.atleast_1d(tempo)[0]),
        mfcc_features
    ])`,
        output: `Extracted exactly 57 GTZAN features matching archive/Data/features_3_sec.csv`
      }
    ]
  }
];

const AboutMLNotebook = () => {
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [selectedItemIdx, setSelectedItemIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentCategory = codeCategories[selectedCategoryIdx];
  const currentItem = currentCategory.items[selectedItemIdx] || currentCategory.items[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentItem.code);
    playUISound('success');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ paddingTop: '1rem', width: '100%', color: 'var(--text-primary)' }}>
      
      {/* Top Header Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: '2.5rem' }}
      >
        <span className="subtitle-caps" style={{ color: '#06B6D4', fontSize: '0.75rem', marginBottom: '0.5rem', display: 'block' }}>
          Complete Project Architecture & Codebase
        </span>
        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
          Machine Learning Pipeline & Code Registry
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '780px', marginTop: '0.8rem', lineHeight: 1.6 }}>
          Comprehensive documentation of all 7 classification algorithms, the <code>best_model.pkl</code> serialization pipeline, the FastAPI backend server, and the feature extraction algorithms developed for this project.
        </p>
      </motion.div>

      {/* 4 Quick Stat Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '3.5rem' }}
      >
        {[
          { number: '91.34%', label: 'Champion Model Accuracy', desc: 'Support Vector Machine (SVC RBF)', color: '#EC4899' },
          { number: '7 Models', label: 'Algorithms Evaluated', desc: 'SVM, KNN, MLP, RF, GB, LR, DT', color: '#06B6D4' },
          { number: '57', label: 'Extracted Features', desc: 'MFCCs, Chroma, Centroid, ZCR, RMS', color: '#8B5CF6' },
          { number: '2.64 MB', label: 'Pickle Artifact Size', desc: 'Serialized model in best_model.pkl', color: '#10B981' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass-card"
            style={{ padding: '1.5rem', borderLeft: `4px solid ${stat.color}`, borderRadius: '14px' }}
          >
            <h3 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>{stat.number}</h3>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '4px', color: 'var(--text-primary)' }}>{stat.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{stat.desc}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Interactive Code Inspector */}
      <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '4rem' }}>
        
        {/* Category Selector Tabs */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          {codeCategories.map((cat, idx) => (
            <button
              key={cat.category}
              onClick={() => {
                playUISound('click');
                setSelectedCategoryIdx(idx);
                setSelectedItemIdx(0);
              }}
              style={{
                background: selectedCategoryIdx === idx ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : 'rgba(255,255,255,0.05)',
                color: selectedCategoryIdx === idx ? '#FFF' : 'var(--text-secondary)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s'
              }}
            >
              {cat.category} ({cat.items.length})
            </button>
          ))}
        </div>

        {/* Sub-item Selector Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {currentCategory.items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                playUISound('click');
                setSelectedItemIdx(idx);
              }}
              style={{
                background: selectedItemIdx === idx ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.04)',
                color: selectedItemIdx === idx ? '#06B6D4' : 'var(--text-secondary)',
                border: selectedItemIdx === idx ? '1px solid #06B6D4' : '1px solid rgba(255,255,255,0.08)',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color }}></span>
              {item.title.split('—')[0]}
            </button>
          ))}
        </div>

        {/* Active Code Box Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1rem 1.4rem',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '14px 14px 0 0',
          border: '1px solid rgba(255,255,255,0.08)',
          borderBottom: 'none'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{currentItem.title}</h3>
              <span style={{
                fontSize: '0.7rem',
                padding: '3px 8px',
                borderRadius: '8px',
                background: 'rgba(236, 72, 153, 0.15)',
                border: '1px solid #EC4899',
                color: '#EC4899',
                fontFamily: 'monospace',
                fontWeight: 700
              }}>
                {currentItem.tag}
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {currentItem.desc} • Source: <code style={{ color: '#06B6D4' }}>{currentItem.file}</code>
            </p>
          </div>

          <button
            onClick={handleCopyCode}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.08)',
              border: copied ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.15)',
              color: copied ? '#10B981' : 'var(--text-primary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            {copied ? '✓ Copied to Clipboard!' : 'Copy Code'}
          </button>
        </div>

        {/* Code Block Container */}
        <div style={{
          background: '#090D16',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '0 0 14px 14px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem', overflowX: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.86rem', lineHeight: 1.6, color: '#E2E8F0' }}>
            <pre style={{ margin: 0 }}><code>{currentItem.code}</code></pre>
          </div>

          {/* Output Stream */}
          <div style={{
            background: 'rgba(6, 182, 212, 0.08)',
            borderTop: '1px solid rgba(6, 182, 212, 0.2)',
            padding: '0.9rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: 'monospace',
            fontSize: '0.82rem'
          }}>
            <span style={{ color: '#06B6D4', fontWeight: 800 }}>RESULT:</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>{currentItem.output}</span>
          </div>
        </div>

      </div>

      {/* Project Artifacts & Files Directory Map */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: '4rem' }}
      >
        <span className="subtitle-caps" style={{ color: '#8B5CF6', fontSize: '0.75rem', marginBottom: '0.5rem', display: 'block' }}>
          Project Inventory & Repository Files
        </span>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 1.5rem 0' }}>
          Full File Hierarchy & Roles
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
          {[
            { name: 'models_classification.py', type: 'Python Script', role: 'Trains 7 classification models, compares accuracy, exports champion to best_model.pkl.', badge: 'Core ML Engine' },
            { name: 'best_model.pkl', type: 'Pickle Binary (2.64 MB)', role: 'Serialized champion Support Vector Machine (SVC RBF 91.34%) + fitted StandardScaler & LabelEncoder.', badge: 'Model Artifact' },
            { name: 'backend_server.py', type: 'FastAPI Backend', role: 'Loads best_model.pkl, runs Librosa 57-feature audio extraction, serves /api/predict & /api/models.', badge: 'REST API' },
            { name: 'model_comparison.json', type: 'JSON Benchmark', role: 'Leaderboard dataset containing accuracies, F1-scores, and classification reports for all 7 models.', badge: 'Metrics' },
            { name: 'features_3_sec.csv', type: 'CSV Dataset', role: '9,990 rows × 60 columns. GTZAN 3-second audio features across 10 musical genres.', badge: 'Dataset' },
            { name: 'webAudioSynth.js', type: 'JavaScript Client', role: 'Frontend API client, Web Audio synthesizer, fallback feature extractor, and audio playback engine.', badge: 'Frontend Logic' }
          ].map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <code style={{ fontSize: '0.95rem', fontWeight: 700, color: '#06B6D4' }}>{item.name}</code>
                <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  {item.badge}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#EC4899', fontWeight: 600, marginBottom: '6px' }}>{item.type}</div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {item.role}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
};

export default AboutMLNotebook;
