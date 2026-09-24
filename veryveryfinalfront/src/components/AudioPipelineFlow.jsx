import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { playUISound } from '../utils/webAudioSynth';

const pipelineSteps = [
  {
    step: '01',
    title: 'PCM Sampling Rate',
    subtitle: '22,050 Hz Nyquist Limit',
    desc: 'Audio signals are converted into 30-second continuous pulse-code modulation (PCM) arrays, capturing frequencies up to 11.025 kHz.',
    metric: '22.05 kHz',
    color: '#06B6D4',
    formula: 'f_nyquist = f_s / 2'
  },
  {
    step: '02',
    title: 'STFT Spectrogram',
    subtitle: 'Short-Time Fourier Transform',
    desc: 'Windowed Hanning FFT splits time-series audio into 2D time-frequency spectrogram heatmaps representing spectral energy.',
    metric: '2048 N_FFT',
    color: '#EC4899',
    formula: 'X(m, ω) = ∑ x[n] w[n-m] e^{-jωn}'
  },
  {
    step: '03',
    title: '13 MFCC Vectors',
    subtitle: 'Mel-Frequency Scale',
    desc: 'Maps linear frequencies onto human auditory perception (Mel Scale) using logarithmic filter banks and Discrete Cosine Transform (DCT).',
    metric: '13 Coefficients',
    color: '#8B5CF6',
    formula: 'M(f) = 2595 log_{10}(1 + f/700)'
  },
  {
    step: '04',
    title: 'Softmax Classifier',
    subtitle: 'Dense Neural Inference',
    desc: 'Deep MLP network with ReLU hidden activations outputs a 10-dimensional probability distribution over GTZAN musical genres.',
    metric: '10 Genre Output',
    color: '#10B981',
    formula: 'σ(z)_i = e^{z_i} / ∑ e^{z_j}'
  }
];

const AudioPipelineFlow = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div style={{ marginTop: '3.5rem', width: '100%' }}>
      
      {/* Section Sub-header with Scroll Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}
      >
        <div>
          <span className="subtitle-caps" style={{ color: '#06B6D4', fontSize: '0.7rem' }}>Neural Signal Pipeline</span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.6rem', color: 'var(--text-primary)' }}>Audio Feature Extraction Architecture</h3>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>Interactive 4-Phase Pipeline</span>
      </motion.div>

      {/* 4 Pipeline Step Cards Grid with Staggered Scroll Animations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
        {pipelineSteps.map((item, idx) => {
          const isSelected = activeStep === idx;

          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 45, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => { playUISound('click'); setActiveStep(idx); }}
              onMouseEnter={() => playUISound('hover')}
              whileHover={{ y: -6, scale: 1.03 }}
              className="glass-card"
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                borderRadius: '14px',
                borderLeft: `4px solid ${item.color}`,
                background: isSelected ? 'rgba(15, 23, 42, 0.95)' : 'var(--glass-bg)',
                borderColor: isSelected ? item.color : 'var(--glass-border)',
                boxShadow: isSelected ? `0 10px 30px rgba(0,0,0,0.4), 0 0 15px ${item.color}40` : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: item.color, fontFamily: 'monospace' }}>
                  PHASE {item.step}
                </span>
                <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: `${item.color}20`, color: item.color, borderRadius: '10px', fontWeight: 700 }}>
                  {item.metric}
                </span>
              </div>

              <h4 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'var(--text-primary)' }}>{item.title}</h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginBottom: '0.8rem', fontWeight: 600 }}>{item.subtitle}</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {item.desc}
              </p>

              {/* Formula Badge */}
              <div style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                padding: '6px 10px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '6px',
                color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                {item.formula}
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

export default AudioPipelineFlow;
