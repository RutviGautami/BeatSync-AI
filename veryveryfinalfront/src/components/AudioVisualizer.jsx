import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getAudioContext, playUISound } from '../utils/webAudioSynth';

const AudioVisualizer = ({ audioUrl, isPlaying, onTogglePlay, trackName = 'Source Audio' }) => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [vizMode, setVizMode] = useState('bars'); // 'bars', 'radial', 'wave', 'matrix'
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Set up AudioContext & AnalyserNode
  useEffect(() => {
    if (!audioRef.current) return;

    try {
      const ctx = getAudioContext();
      if (!analyserRef.current) {
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.85;
        analyserRef.current = analyser;

        if (!sourceRef.current) {
          const source = ctx.createMediaElementSource(audioRef.current);
          source.connect(analyser);
          analyser.connect(ctx.destination);
          sourceRef.current = source;
        }
      }
    } catch (e) {
      console.warn("AudioContext source already created or restricted:", e);
    }
  }, [audioUrl]);

  // Audio Playback trigger
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        getAudioContext().resume();
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Canvas render loop for visualizers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      const width = canvas.width = canvas.parentElement.clientWidth;
      const height = canvas.height = canvas.parentElement.clientHeight || 200;

      ctx.clearRect(0, 0, width, height);

      let dataArray = new Uint8Array(64);
      if (analyserRef.current && isPlaying) {
        dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
      } else {
        // Fallback pulsing ambient wave when idle
        const time = Date.now() * 0.003;
        for (let i = 0; i < 64; i++) {
          dataArray[i] = Math.floor(Math.sin(time + i * 0.2) * 30 + 35);
        }
      }

      if (vizMode === 'bars') {
        // Futuristic Gradient Spectrum Bars
        const barWidth = (width / dataArray.length) * 1.5;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const barHeight = (dataArray[i] / 255) * (height * 0.85);

          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, '#8B5CF6');
          gradient.addColorStop(0.5, '#EC4899');
          gradient.addColorStop(1, '#06B6D4');

          ctx.fillStyle = gradient;
          ctx.shadowColor = 'rgba(236, 72, 153, 0.4)';
          ctx.shadowBlur = 8;
          ctx.fillRect(x, height - barHeight, barWidth - 3, barHeight);

          x += barWidth + 2;
        }
      } else if (vizMode === 'radial') {
        // Radial Sonic Ring Visualizer
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) * 0.45;

        ctx.save();
        ctx.translate(centerX, centerY);

        for (let i = 0; i < dataArray.length; i++) {
          const angle = (i / dataArray.length) * Math.PI * 2;
          const amplitude = (dataArray[i] / 255) * 60;

          const x1 = Math.cos(angle) * radius;
          const y1 = Math.sin(angle) * radius;
          const x2 = Math.cos(angle) * (radius + amplitude);
          const y2 = Math.sin(angle) * (radius + amplitude);

          ctx.strokeStyle = `hsl(${(i * 5 + Date.now() * 0.05) % 360}, 90%, 65%)`;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
          ctx.shadowBlur = 10;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        ctx.restore();
      } else if (vizMode === 'wave') {
        // Oscilloscope Waveform Line
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#06B6D4';
        ctx.shadowColor = '#06B6D4';
        ctx.shadowBlur = 12;

        const sliceWidth = width / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);

          x += sliceWidth;
        }
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      } else if (vizMode === 'matrix') {
        // Spectrogram Cyber Grid Matrix
        const cols = 16;
        const rows = 8;
        const cellW = width / cols;
        const cellH = height / rows;

        for (let c = 0; c < cols; c++) {
          const val = dataArray[c % dataArray.length] / 255;
          const activeRows = Math.floor(val * rows);

          for (let r = 0; r < rows; r++) {
            const isLit = r >= rows - activeRows;
            ctx.fillStyle = isLit 
              ? `hsl(${180 + (r / rows) * 120}, 100%, 60%)` 
              : 'rgba(255, 255, 255, 0.03)';
            ctx.fillRect(c * cellW + 2, r * cellH + 2, cellW - 4, cellH - 4);
          }
        }
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [vizMode, isPlaying]);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{
      width: '100%',
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Hidden HTML Audio Element */}
      <audio 
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={() => onTogglePlay(false)}
      />

      {/* Visualizer Canvas Area */}
      <div style={{ width: '100%', height: '180px', position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#090D16' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        
        {/* Mode Selector Chips */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.6)', padding: '4px', borderRadius: '20px', backdropFilter: 'blur(8px)'
        }}>
          {[
            { id: 'bars', label: 'Bars' },
            { id: 'radial', label: 'Radial' },
            { id: 'wave', label: 'Wave' },
            { id: 'matrix', label: 'Matrix' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => { playUISound('hover'); setVizMode(m.id); }}
              style={{
                background: vizMode === m.id ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : 'transparent',
                color: vizMode === m.id ? '#FFF' : 'rgba(255,255,255,0.6)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '14px',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Track Title Overlay */}
        <div style={{ position: 'absolute', bottom: '12px', left: '16px', pointerEvents: 'none' }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#06B6D4', fontWeight: 700 }}>
            Live Spectrum
          </span>
          <h4 style={{ margin: 0, color: '#FFF', fontSize: '0.95rem', fontWeight: 600 }}>{trackName}</h4>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div style={{ marginTop: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* Play / Pause Toggle Button */}
        <button
          onClick={() => { playUISound('click'); onTogglePlay(!isPlaying); }}
          style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: isPlaying ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : '#FFF',
            color: isPlaying ? '#FFF' : '#0F172A',
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"></rect>
              <rect x="14" y="4" width="4" height="16" rx="1"></rect>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '3px' }}>
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>

        {/* Time Progress Scrubber */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => {
              const newTime = parseFloat(e.target.value);
              setCurrentTime(newTime);
              if (audioRef.current) audioRef.current.currentTime = newTime;
            }}
            style={{
              width: '100%', height: '4px', appearance: 'none', background: 'rgba(255,255,255,0.15)',
              borderRadius: '2px', outline: 'none', cursor: 'pointer', accentColor: '#EC4899'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Mute Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
          >
            {isMuted || volume === 0 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v6a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
            style={{ width: '60px', height: '4px', accentColor: '#06B6D4', cursor: 'pointer' }}
          />
        </div>

      </div>
    </div>
  );
};

export default AudioVisualizer;
