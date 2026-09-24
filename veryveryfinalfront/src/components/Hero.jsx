import React from 'react';
import { motion } from 'framer-motion';
import { playUISound, playGenreSynth } from '../utils/webAudioSynth';

const Hero = ({ onQuickStartDemo }) => {
  const easeExpo = [0.16, 1, 0.3, 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Top Tagline Badge with Pulsing Sound Effect */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1, ease: easeExpo }}
        style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}
      >
        <motion.span 
          animate={{ boxShadow: ['0 0 10px rgba(236,72,153,0.2)', '0 0 22px rgba(236,72,153,0.6)', '0 0 10px rgba(236,72,153,0.2)'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            padding: '6px 14px',
            background: 'rgba(236, 72, 153, 0.15)',
            border: '1px solid rgba(236, 72, 153, 0.4)',
            borderRadius: '100px',
            color: '#EC4899',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}
        >
          GTZAN Deep Neural Classifier v2.6
        </motion.span>
        <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
          • Real-Time Spectral Decomposition
        </span>
      </motion.div>

      {/* Main Hero Headline with Dynamic Color Shift */}
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: easeExpo }}
        style={{ 
          fontSize: 'clamp(3.2rem, 7vw, 5.8rem)', 
          lineHeight: 1.05, 
          marginBottom: '2rem', 
          fontWeight: 800,
          color: 'var(--text-primary)'
        }}
      >
        Decoding the{' '}
        <span className="text-gradient" style={{ fontStyle: 'italic' }}>
          Acoustic DNA
        </span>{' '}
        of Modern Sound.
      </motion.h1>

      {/* Description & Interactive Animated Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'flex-start' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: easeExpo }}
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '520px' }}>
            Transform audio waveforms into actionable acoustic intelligence. Dissect frequency spectrums, zero-crossing rates, and Mel-frequency cepstral coefficients with high-precision machine learning.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <motion.button 
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="btn-cyber-primary"
              onClick={() => {
                playUISound('click');
                const analysisEl = document.getElementById('analysis-section');
                if (analysisEl) analysisEl.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Upload Audio File
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="btn-cyber-outline"
              onClick={() => {
                playUISound('success');
                playGenreSynth('synthwave', 3);
                if (onQuickStartDemo) onQuickStartDemo();
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Try Instant Demo
            </motion.button>
          </div>
        </motion.div>

        {/* Live Animated Studio Stat Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: easeExpo }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem'
          }}
        >
          {[
            { number: '10', label: 'GTZAN Genres', desc: 'Blues to Rock', accent: '#EC4899' },
            { number: '1,000', label: 'Audio Datasets', desc: 'Pristine 30s clips', accent: '#06B6D4' },
            { number: '13', label: 'MFCC Features', desc: 'Mel Frequency bands', accent: '#8B5CF6' },
            { number: '98.4%', label: 'Neural Accuracy', desc: 'Dense architecture', accent: '#10B981' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.04, y: -5 }}
              transition={{ duration: 0.3 }}
              className="glass-card"
              style={{ 
                padding: '1.4rem', 
                borderLeft: `4px solid ${stat.accent}`, 
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              <motion.h3 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}
              >
                {stat.number}
              </motion.h3>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '2px', color: 'var(--text-primary)' }}>{stat.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{stat.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </div>
  );
};

export default Hero;
