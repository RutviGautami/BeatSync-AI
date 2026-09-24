import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEMO_TRACKS, analyzeAudioBuffer, playUISound } from '../utils/webAudioSynth';

const AudioUploader = ({ file, onUpload, onReset, selectedDemo, onSelectDemo }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [analyzingFile, setAnalyzingFile] = useState(false);
  const [extractedDetails, setExtractedDetails] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processAudioFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processAudioFile(e.target.files[0]);
    }
  };

  const processAudioFile = async (uploadedFile) => {
    if (uploadedFile.type.startsWith('audio/') || uploadedFile.name.endsWith('.mp3') || uploadedFile.name.endsWith('.wav') || uploadedFile.name.endsWith('.ogg')) {
      playUISound('success');
      setAnalyzingFile(true);
      onUpload(uploadedFile);

      try {
        const details = await analyzeAudioBuffer(uploadedFile);
        setExtractedDetails(details);
      } catch (err) {
        console.warn("Audio buffer decoding info:", err);
      } finally {
        setAnalyzingFile(false);
      }
    } else {
      alert('Please upload a valid audio file (.mp3, .wav, .ogg)');
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {!file && !selectedDemo ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
          
          {/* Main Dropzone */}
          <div 
            className={`elegant-dropzone ${isDragging ? 'active' : ''}`}
            style={{ flex: 1, minHeight: '260px' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => { playUISound('click'); fileInputRef.current.click(); }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="audio/*"
              onChange={handleFileInput}
            />
            
            <div className="icon-pulse" style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(236, 72, 153, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem', color: 'var(--accent-color)'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem', fontWeight: 700 }}>
              Drop Audio File Here
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Supports MP3, WAV, FLAC, OGG waveforms up to 50MB
            </p>
            <span style={{ fontSize: '0.75rem', padding: '4px 12px', background: 'rgba(0,0,0,0.05)', borderRadius: '20px', color: 'var(--text-secondary)' }}>
              Or click to browse local files
            </span>
          </div>

          {/* Quick Preset Selector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span className="subtitle-caps" style={{ fontSize: '0.7rem' }}>Or Test Instant Presets</span>
              <span style={{ fontSize: '0.75rem', color: '#06B6D4', fontWeight: 600 }}>1-Click Analysis</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {DEMO_TRACKS.map(demo => (
                <button
                  key={demo.id}
                  onClick={() => { playUISound('click'); onSelectDemo(demo); }}
                  style={{
                    background: 'rgba(0, 0, 0, 0.03)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={() => playUISound('hover')}
                >
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: demo.color }}>{demo.genre}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {demo.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Loaded File State Card */
        <div style={{ 
          height: '100%', padding: '2rem',
          display: 'flex', flexDirection: 'column',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#FFF'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#EC4899', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Waveform Attached
              </span>
              <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#FFF', wordBreak: 'break-all', maxWidth: '240px' }}>
                {file ? file.name : selectedDemo?.title}
              </h3>
            </div>
            <button 
              onClick={() => { playUISound('click'); onReset(); setExtractedDetails(null); }}
              style={{ 
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF',
                padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem',
                borderRadius: '20px', fontWeight: 600, transition: 'all 0.3s'
              }}
            >
              Clear
            </button>
          </div>

          {/* Extracted Details Snapshot */}
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#06B6D4', fontWeight: 700, display: 'block', marginBottom: '0.8rem' }}>
              Extracted Signal Properties
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem', fontFamily: 'monospace' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>Duration</div>
                <div style={{ color: '#FFF', fontWeight: 700 }}>{extractedDetails ? `${extractedDetails.duration}s` : (selectedDemo ? selectedDemo.duration : '0:30')}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>Sample Rate</div>
                <div style={{ color: '#FFF', fontWeight: 700 }}>{extractedDetails ? `${extractedDetails.sampleRate} Hz` : '22050 Hz'}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>Centroid</div>
                <div style={{ color: '#06B6D4', fontWeight: 700 }}>{extractedDetails ? extractedDetails.centroid : (selectedDemo ? `${selectedDemo.features.centroid} Hz` : '1850 Hz')}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>RMS Energy</div>
                <div style={{ color: '#EC4899', fontWeight: 700 }}>{extractedDetails ? extractedDetails.rms : (selectedDemo ? selectedDemo.features.rms : '0.3400')}</div>
              </div>
            </div>

            {/* Waveform Micro Visualizer */}
            <div style={{ marginTop: '1rem', width: '100%', height: '40px', display: 'flex', alignItems: 'center', gap: '3px' }}>
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${Math.sin(i * 0.4) * 40 + 50}%`,
                    background: 'linear-gradient(to top, #EC4899, #06B6D4)',
                    borderRadius: '2px',
                    opacity: 0.8
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AudioUploader;
