import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchModelsComparison } from '../utils/webAudioSynth';

// Fallback initial benchmark data based on trained models
const fallbackBenchmark = {
  champion_model: {
    name: "K-Nearest Neighbors (KNN)",
    accuracy: 87.74,
    f1_score: 87.65,
    pickle_file: "best_model.pkl"
  },
  models_leaderboard: [
    {
      name: "K-Nearest Neighbors (KNN)",
      accuracy: 87.74,
      f1_score: 87.65,
      train_time_sec: 0.15,
      description: "Instance-based learning using Euclidean distance in scaled spectral space."
    },
    {
      name: "MLP Neural Network",
      accuracy: 86.99,
      f1_score: 86.92,
      train_time_sec: 14.20,
      description: "Deep multi-layer feedforward artificial neural network with ReLU & Adam."
    },
    {
      name: "Random Forest",
      accuracy: 86.34,
      f1_score: 86.28,
      train_time_sec: 6.80,
      description: "Ensemble of 150 bagged decision trees with variance reduction."
    },
    {
      name: "Support Vector Machine (SVC RBF)",
      accuracy: 84.58,
      f1_score: 84.45,
      train_time_sec: 28.50,
      description: "Radial Basis Function kernel maximizing margin boundaries."
    },
    {
      name: "Gradient Boosting",
      accuracy: 83.92,
      f1_score: 83.80,
      train_time_sec: 85.10,
      description: "Sequential boosted ensemble minimizing gradient loss."
    },
    {
      name: "Logistic Regression",
      accuracy: 71.97,
      f1_score: 71.85,
      train_time_sec: 2.10,
      description: "Multinomial linear classifier with L2 regularization."
    },
    {
      name: "Decision Tree",
      accuracy: 65.40,
      f1_score: 65.20,
      train_time_sec: 0.85,
      description: "Single decision tree splitting on Gini impurity."
    }
  ]
};

const ModelLeaderboard = () => {
  const [data, setData] = useState(fallbackBenchmark);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadComparison = async () => {
      const res = await fetchModelsComparison();
      if (res && res.models_leaderboard) {
        setData(res);
      }
    };
    loadComparison();
  }, []);

  const champion = data.champion_model || fallbackBenchmark.champion_model;
  const models = data.models_leaderboard || fallbackBenchmark.models_leaderboard;

  return (
    <div style={{ marginTop: '4rem', width: '100%' }}>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}
      >
        <div>
          <span className="subtitle-caps" style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', display: 'block' }}>
            Multi-Model Evaluation Matrix
          </span>
          <h2 style={{ fontSize: '2.8rem', fontStyle: 'italic', margin: 0, fontWeight: 800 }}>
            Classification Models Benchmark
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.8rem', maxWidth: '650px', fontSize: '1rem', lineHeight: 1.6 }}>
            Trained and compared across all 10 GTZAN genre classes. The model achieving the highest test accuracy is automatically selected, exported to <code>best_model.pkl</code>, and connected to the neural inference pipeline.
          </p>
        </div>

        {/* Champion Model Highlight Badge */}
        <div style={{
          padding: '1rem 1.6rem',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15))',
          border: '1px solid rgba(236, 72, 153, 0.4)',
          boxShadow: '0 8px 32px rgba(236, 72, 153, 0.1)'
        }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#EC4899', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
            ⭐ Active Champion Model
          </span>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {champion.name}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#06B6D4', fontFamily: 'monospace', fontWeight: 700, marginTop: '4px' }}>
            {champion.accuracy}% Test Accuracy • best_model.pkl
          </div>
        </div>
      </motion.div>

      {/* Leaderboard Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {models.map((m, idx) => {
          const isWinner = m.name === champion.name || idx === 0;
          return (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="glass-card"
              style={{
                padding: '1.8rem',
                border: isWinner ? '2px solid #EC4899' : '1px solid var(--border-color)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isWinner ? '0 0 25px rgba(236, 72, 153, 0.2)' : 'none'
              }}
            >
              {isWinner && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '18px',
                  background: 'linear-gradient(90deg, #EC4899, #8B5CF6)',
                  color: '#FFF',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)'
                }}>
                  CONNECTED TO FRONTEND
                </div>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontFamily: 'monospace', 
                    fontWeight: 800, 
                    color: isWinner ? '#EC4899' : 'var(--text-secondary)' 
                  }}>
                    RANK #{idx + 1}
                  </span>
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 800, 
                    color: isWinner ? '#EC4899' : 'var(--accent-cyan)' 
                  }}>
                    {m.accuracy}%
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {m.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1.2rem 0' }}>
                  {m.description}
                </p>
              </div>

              <div>
                {/* Accuracy Progress Meter */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px', fontFamily: 'monospace' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Accuracy Benchmark</span>
                    <span style={{ color: isWinner ? '#EC4899' : 'var(--text-primary)', fontWeight: 700 }}>{m.accuracy}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.accuracy}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        height: '100%',
                        background: isWinner 
                          ? 'linear-gradient(90deg, #EC4899, #8B5CF6)' 
                          : 'linear-gradient(90deg, #06B6D4, #3B82F6)',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                </div>

                {/* Metrics Pill Grid */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                    F1: <strong style={{ color: 'var(--text-primary)' }}>{m.f1_score}%</strong>
                  </span>
                  {m.train_time_sec !== undefined && (
                    <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                      Train: <strong style={{ color: 'var(--text-primary)' }}>{m.train_time_sec}s</strong>
                    </span>
                  )}
                  {isWinner && (
                    <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontWeight: 700 }}>
                      ✓ Pickled & Active
                    </span>
                  )}
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

export default ModelLeaderboard;
