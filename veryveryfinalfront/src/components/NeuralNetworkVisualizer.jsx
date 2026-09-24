import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const NeuralNetworkVisualizer = ({ isAnalyzing = false, topGenre = 'Rock', metrics = null }) => {
  const genres = ['Blues', 'Classical', 'Country', 'Disco', 'Hiphop', 'Jazz', 'Metal', 'Pop', 'Reggae', 'Rock'];

  // Active glowing signals
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 100);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const targetIndex = genres.findIndex(g => g.toLowerCase() === topGenre.toLowerCase());
  const winIdx = targetIndex >= 0 ? targetIndex : 9;

  // Active prediction neurons for the winning genre
  const activeL1 = [(winIdx * 2) % 8, (winIdx * 2 + 1) % 8, (winIdx * 3 + 3) % 8];
  const activeL2 = [winIdx % 6, (winIdx + 3) % 6];

  const inputFeatures = [
    { key: 'mfcc', label: '13 MFCC Coefficients', value: metrics?.mfcc ? (Array.isArray(metrics.mfcc) ? metrics.mfcc.slice(0, 3).join(', ') : metrics.mfcc) : '[-1.42, 2.10...]' },
    { key: 'centroid', label: 'Spectral Centroid (Hz)', value: metrics?.centroid || '1,950 Hz' },
    { key: 'zcr', label: 'Zero-Crossing Rate (ZCR)', value: metrics?.zcr || '0.0520' },
    { key: 'chroma', label: 'Chroma Pitch Energy', value: metrics?.chroma || '0.7400' },
    { key: 'rms', label: 'RMS Signal Energy', value: metrics?.rms || '0.3800' }
  ];

  const hiddenLayer1Labels = [
    'Tempo Sync',
    'Brightness',
    'Transient Pulse',
    'Sub-Bass Energy',
    'Distortion Drive',
    'Vocal Formant',
    'Attack Impulse',
    'Spectral Roll-Off'
  ];

  const hiddenLayer2Labels = [
    'Rhythm Texture',
    'Acoustic Resonance',
    'Melodic Contour',
    'Timbral Density',
    'Dynamic Range',
    'Softmax Projection'
  ];

  return (
    <div style={{
      width: '100%',
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#06B6D4', fontWeight: 700 }}>
            Deep Neural Network Flow
          </span>
          <h3 style={{ margin: 0, color: '#FFF', fontSize: '1.4rem' }}>Multilayer Perceptron Topology</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: isAnalyzing ? '#EC4899' : '#10B981',
            boxShadow: isAnalyzing ? '0 0 12px #EC4899' : '0 0 12px #10B981'
          }}></span>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
            {isAnalyzing ? 'PROPAGATING SIGNAL...' : `CLASSIFIED: ${topGenre.toUpperCase()}`}
          </span>
        </div>
      </div>

      {/* Layer Labels & Key Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#06B6D4', boxShadow: '0 0 8px #06B6D4' }}></span>
          <div>
            <strong style={{ display: 'block', fontSize: '0.75rem', color: '#FFF' }}>Input Layer (5 Features)</strong>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>Acoustic Metrics (MFCC, ZCR, RMS)</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EC4899', boxShadow: '0 0 8px #EC4899' }}></span>
          <div>
            <strong style={{ display: 'block', fontSize: '0.75rem', color: '#FFF' }}>Hidden Layer 1 (8 Neurons)</strong>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>Harmonic Pattern Extractors</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#8B5CF6', boxShadow: '0 0 8px #8B5CF6' }}></span>
          <div>
            <strong style={{ display: 'block', fontSize: '0.75rem', color: '#FFF' }}>Hidden Layer 2 (6 Neurons)</strong>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>Genre Abstraction Neurons</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }}></span>
          <div>
            <strong style={{ display: 'block', fontSize: '0.75rem', color: '#FFF' }}>Output Layer ({topGenre})</strong>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>10 Softmax Target Classes</span>
          </div>
        </div>
      </div>

      {/* Active Prediction Flow Trajectory Badge */}
      <div style={{ marginBottom: '1rem', background: 'rgba(16, 185, 129, 0.08)', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></span>
          NEURAL PATHWAY ACTIVATION TRACE
        </span>
        <span style={{ fontSize: '0.8rem', color: '#FFF', fontWeight: 600, fontFamily: 'monospace' }}>
          Features ➔ [Hidden 1: #{activeL1.map(i => hiddenLayer1Labels[i]).join(', ')}] ➔ [Hidden 2: #{activeL2.map(i => hiddenLayer2Labels[i]).join(', ')}] ➔ <strong style={{ color: '#10B981' }}>{topGenre.toUpperCase()} ★</strong>
        </span>
      </div>

      {/* Interactive SVG Network */}
      <div style={{ width: '100%', height: '340px', position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 820 315" preserveAspectRatio="xMidYMid meet">
          
          {/* Background Grid Lines */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* SVG Column Layer Header Titles */}
          <text x="90" y="15" fill="#06B6D4" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="monospace">INPUT FEATURES</text>
          <text x="290" y="15" fill="#EC4899" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="monospace">HIDDEN 1 (DENSE)</text>
          <text x="500" y="15" fill="#8B5CF6" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="monospace">HIDDEN 2 (DENSE)</text>
          <text x="710" y="15" fill="#10B981" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="monospace">SOFTMAX CLASSES</text>

          {/* Connections between Layers */}
          {/* Layer 0 to 1 */}
          {Array.from({ length: 5 }).map((_, i) => (
            Array.from({ length: 8 }).map((_, j) => {
              const y1 = 45 + i * 50;
              const y2 = 35 + j * 34;
              const isActivePath = activeL1.includes(j);
              return (
                <g key={`l01-group-${i}-${j}`}>
                  <line
                    x1={90} y1={y1}
                    x2={290} y2={y2}
                    stroke={isActivePath ? '#06B6D4' : 'rgba(255,255,255,0.04)'}
                    strokeWidth={isActivePath ? 1.8 : 0.5}
                    opacity={isActivePath ? 0.95 : 0.25}
                    filter={isActivePath ? 'url(#glow)' : 'none'}
                  />
                  {isActivePath && (
                    <motion.circle
                      r="3"
                      fill="#06B6D4"
                      animate={{
                        cx: [90, 290],
                        cy: [y1, y2],
                        opacity: [0.2, 1, 0.2]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: (i + j) * 0.1,
                        ease: 'easeInOut'
                      }}
                    />
                  )}
                </g>
              );
            })
          ))}

          {/* Layer 1 to 2 */}
          {Array.from({ length: 8 }).map((_, i) => (
            Array.from({ length: 6 }).map((_, j) => {
              const y1 = 35 + i * 34;
              const y2 = 50 + j * 42;
              const isActivePath = activeL1.includes(i) && activeL2.includes(j);
              return (
                <g key={`l12-group-${i}-${j}`}>
                  <line
                    x1={290} y1={y1}
                    x2={500} y2={y2}
                    stroke={isActivePath ? '#EC4899' : 'rgba(255,255,255,0.04)'}
                    strokeWidth={isActivePath ? 2.2 : 0.5}
                    opacity={isActivePath ? 0.95 : 0.25}
                    filter={isActivePath ? 'url(#glow)' : 'none'}
                  />
                  {isActivePath && (
                    <motion.circle
                      r="3.5"
                      fill="#EC4899"
                      animate={{
                        cx: [290, 500],
                        cy: [y1, y2],
                        opacity: [0.2, 1, 0.2]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0.5 + (i + j) * 0.12,
                        ease: 'easeInOut'
                      }}
                    />
                  )}
                </g>
              );
            })
          ))}

          {/* Layer 2 to Output Layer (Layer 3) */}
          {Array.from({ length: 6 }).map((_, i) => (
            genres.map((g, j) => {
              const y1 = 50 + i * 42;
              const y2 = 28 + j * 27;
              const isWinnerPath = activeL2.includes(i) && j === winIdx;
              return (
                <g key={`l23-group-${i}-${j}`}>
                  <line
                    x1={500} y1={y1}
                    x2={710} y2={y2}
                    stroke={isWinnerPath ? '#10B981' : 'rgba(255,255,255,0.04)'}
                    strokeWidth={isWinnerPath ? 2.8 : 0.4}
                    opacity={isWinnerPath ? 1.0 : 0.2}
                    filter={isWinnerPath ? 'url(#glow)' : 'none'}
                  />
                  {isWinnerPath && (
                    <motion.circle
                      r="4"
                      fill="#10B981"
                      animate={{
                        cx: [500, 710],
                        cy: [y1, y2],
                        opacity: [0.2, 1, 0.2]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 1.0 + i * 0.15,
                        ease: 'easeInOut'
                      }}
                    />
                  )}
                </g>
              );
            })
          ))}

          {/* Layer 0 Nodes (Feature Inputs with Full Labels & Live Metric Values) */}
          {inputFeatures.map((feat, i) => (
            <g key={`n0-${i}`} transform={`translate(90, ${45 + i * 50})`}>
              <circle r="12" fill="#090D16" stroke="#06B6D4" strokeWidth="2.5" filter="url(#glow)" />
              <circle r="4" fill="#06B6D4" />
              <text x="-16" y="-2" fill="#FFF" fontSize="9" textAnchor="end" fontFamily="sans-serif" fontWeight="700">
                {feat.label}
              </text>
              <text x="-16" y="9" fill="#06B6D4" fontSize="8" textAnchor="end" fontFamily="monospace" fontWeight="600">
                {feat.value}
              </text>
            </g>
          ))}

          {/* Layer 1 Nodes (Dense Hidden 1 - 8 Neurons with Labels) */}
          {hiddenLayer1Labels.map((label, i) => {
            const isActive = activeL1.includes(i);
            return (
              <g key={`n1-${i}`} transform={`translate(290, ${35 + i * 34})`}>
                <circle 
                  r={isActive ? "10" : "7.5"} 
                  fill={isActive ? "#EC4899" : "#090D16"} 
                  stroke={isActive ? "#F472B6" : "rgba(255,255,255,0.3)"} 
                  strokeWidth="2" 
                  filter={isActive ? "url(#glow)" : "none"}
                />
                <circle r="3" fill={isActive ? "#FFF" : "#EC4899"} />
                <text 
                  x="14" y="3.5" 
                  fill={isActive ? "#F472B6" : "rgba(255,255,255,0.6)"} 
                  fontSize={isActive ? "8.5" : "7.5"} 
                  fontWeight={isActive ? "700" : "500"}
                  fontFamily="sans-serif"
                >
                  N1.{i + 1} {label}
                </text>
              </g>
            );
          })}

          {/* Layer 2 Nodes (Dense Hidden 2 - 6 Neurons with Labels) */}
          {hiddenLayer2Labels.map((label, i) => {
            const isActive = activeL2.includes(i);
            return (
              <g key={`n2-${i}`} transform={`translate(500, ${50 + i * 42})`}>
                <circle 
                  r={isActive ? "11" : "8"} 
                  fill={isActive ? "#8B5CF6" : "#090D16"} 
                  stroke={isActive ? "#A78BFA" : "rgba(255,255,255,0.3)"} 
                  strokeWidth="2" 
                  filter={isActive ? "url(#glow)" : "none"}
                />
                <circle r="3.5" fill={isActive ? "#FFF" : "#8B5CF6"} />
                <text 
                  x="15" y="3.5" 
                  fill={isActive ? "#A78BFA" : "rgba(255,255,255,0.6)"} 
                  fontSize={isActive ? "8.5" : "7.5"} 
                  fontWeight={isActive ? "700" : "500"}
                  fontFamily="sans-serif"
                >
                  N2.{i + 1} {label}
                </text>
              </g>
            );
          })}

          {/* Layer 3 Nodes (Softmax Output Genres) */}
          {genres.map((g, i) => {
            const isWinner = i === winIdx;
            return (
              <g key={`n3-${i}`} transform={`translate(710, ${28 + i * 27})`}>
                <circle 
                  r={isWinner ? "12" : "6"} 
                  fill={isWinner ? "#10B981" : "#090D16"} 
                  stroke={isWinner ? "#6EE7B7" : "rgba(255,255,255,0.2)"} 
                  strokeWidth="2.5"
                  filter={isWinner ? "url(#glow)" : "none"}
                />
                <text 
                  x="18" y="4" 
                  fill={isWinner ? "#10B981" : "rgba(255,255,255,0.5)"} 
                  fontSize={isWinner ? "13" : "10"} 
                  fontWeight={isWinner ? "800" : "400"}
                  fontFamily="sans-serif"
                >
                  {g} {isWinner ? '★' : ''}
                </text>
              </g>
            );
          })}

        </svg>
      </div>
    </div>
  );
};

export default NeuralNetworkVisualizer;
