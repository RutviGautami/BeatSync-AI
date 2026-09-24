# 🎵 BeatSync AI — GTZAN Music Genre Classification

> **An end-to-end Machine Learning web application that classifies music audio into 10 genres using 57 spectral audio features, champion-model serialization (`best_model.pkl`), a FastAPI backend, and an interactive React 19 frontend.**

---

## 🚀 Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │    React 19 + Vite Frontend (SPA)    │
                      │         (Deployed on Vercel)         │
                      └──────────────────┬───────────────────┘
                                         │
                        HTTP / multipart │ Audio Uploads / Presets
                                         ▼
                      ┌──────────────────────────────────────┐
                      │      FastAPI Python Server API       │
                      │         (Deployed on Render)         │
                      └──────────────────┬───────────────────┘
                                         │
                      ┌──────────────────┴───────────────────┐
                      │                                      │
                      ▼                                      ▼
            ┌───────────────────┐                  ┌───────────────────┐
            │  Librosa Feature  │                  │  best_model.pkl   │
            │  Extractor (57)   │                  │  Champion Model   │
            └───────────────────┘                  └───────────────────┘
```

---

## ✨ Features

- **Champion ML Model**: Evaluates 7 classification algorithms (SVM RBF, Random Forest, XGBoost, KNN, Logistic Regression, Decision Trees, Naive Bayes) across the 10 GTZAN genre classes. The champion model (SVM RBF with 91.34% accuracy) is serialized with its `StandardScaler` into `best_model.pkl`.
- **57 Spectral Feature Pipeline**: Extracts MFCCs, Chroma STFT, Spectral Centroid, Bandwidth, Rolloff, Zero-Crossing Rate, and RMS energy via `librosa`.
- **FastAPI Real-Time API**: High-performance backend providing `/api/predict`, `/api/models`, and `/api/status`.
- **Modern Interactive UI**: Built with React 19, Vite, Framer Motion, and Lenis smooth scrolling, featuring waveform visualization, real-time genre radar charts, and model benchmark leaderboards.
- **Client-Side Fallback**: Built-in Web Audio API synthesizer and in-browser inference fallback when backend is sleeping or offline.

---

## 📁 Repository Structure

```
.
├── backend_server.py           # FastAPI server serving best_model.pkl and Librosa pipeline
├── best_model.pkl              # Serialized champion model + scaler
├── model_comparison.json       # Benchmark metrics across all 7 evaluated ML models
├── models_classification.py    # Training & evaluation script for all models
├── requirements.txt            # Python dependencies for Render / cloud deployment
├── Procfile                    # Web service process configuration
├── render.yaml                 # Infrastructure configuration for Render Blueprint
├── .gitignore                  # Git ignore rules (excludes large 1.3GB audio dataset)
├── notebook/                   # Research, EDA, and model exploration notebooks
└── veryveryfinalfront/         # React 19 + Vite frontend application
    ├── src/                    # Components, pages, and audio utilities
    ├── package.json            # Node.js dependencies
    ├── vercel.json             # SPA routing rewrite rules for Vercel
    └── vite.config.js          # Vite build & proxy settings
```

---

## 🛠️ Local Development

### 1. Backend Setup (FastAPI)

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run the FastAPI server
python backend_server.py
# Server will start at http://127.0.0.1:8000
```

Interactive Swagger API documentation is available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup (React + Vite)

```bash
# Navigate to frontend directory
cd veryveryfinalfront

# Install npm dependencies
npm install

# Start development server
npm run dev
# App will run at http://localhost:5173
```

---

## 🌐 Cloud Deployment Guide

### A. Deploy Backend to Render (Free)

1. Create a free account at [render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Fill in the following settings:
   - **Name**: `beatsync-ai-backend`
   - **Environment**: `Python`
   - **Region**: Any close to you (e.g., Oregon / Frankfurt / Singapore)
   - **Branch**: `main`
   - **Root Directory**: Leave blank (root `.`)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend_server:app --host 0.0.0.0 --port $PORT`
5. Click **Create Web Service**.
6. Once deployed, copy your backend URL (e.g., `https://beatsync-ai-backend.onrender.com`).

---

### B. Deploy Frontend to Vercel (Free)

1. Create a free account at [vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. In the project configuration:
   - **Root Directory**: Click `Edit` and select `veryveryfinalfront`.
   - **Framework Preset**: `Vite` (automatically detected).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render backend URL (e.g., `https://beatsync-ai-backend.onrender.com`)
6. Click **Deploy**.

Your application will be live with full SSL, global CDN, and real-time ML classification!

---

## 📄 License

This project is open-source under the MIT License.
