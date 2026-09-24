import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playGenreMusicLoop, playUISound } from '../utils/webAudioSynth';

const genresData = [
  { id: 'blues', name: 'Blues', color: '#3B82F6', tag: 'Acoustic', bpm: '70 - 110', desc: 'Rooted in African-American musical traditions. Marked by 12-bar progressions, pitch bends, and emotive vocals.', features: ['MFCC: High Variance', 'Centroid: 1,400 Hz', 'ZCR: 0.038'] },
  { id: 'classical', name: 'Classical', color: '#06B6D4', tag: 'Orchestral', bpm: '60 - 140', desc: 'Complex multi-instrument orchestrations rooted in European traditions with wide dynamic acoustic range.', features: ['Chroma: High Variance', 'Roll-off: Low', 'ZCR: 0.021'] },
  { id: 'country', name: 'Country', color: '#F59E0B', tag: 'Acoustic', bpm: '84 - 120', desc: 'Storytelling traditions accompanied by acoustic guitars, steel guitars, fiddles, and vocal harmonies.', features: ['MFCC: Vocal Frequency', 'Harmonic Ratio: High', 'ZCR: 0.045'] },
  { id: 'disco', name: 'Disco', color: '#EC4899', tag: 'Dance', bpm: '115 - 130', desc: 'Four-on-the-floor kick beat, syncopated basslines, string sections, and upbeat rhythmic electric guitars.', features: ['Beat: 120 BPM Peak', 'Spectral Flux: High', 'RMS: 0.420'] },
  { id: 'hiphop', name: 'Hip-Hop', color: '#10B981', tag: 'Beat', bpm: '85 - 105', desc: 'Prominent 808 basslines, looped drum breaks, rhyming vocals, and rhythmic syncopated percussion.', features: ['RMS Energy: Heavy', 'Low Frequency Power', 'Beat: Strong'] },
  { id: 'jazz', name: 'Jazz', color: '#8B5CF6', tag: 'Complex', bpm: '90 - 160', desc: 'Sophisticated swing feel, extended 7th & 9th chords, syncopation, and spontaneous solos.', features: ['Chroma: Complex 12-Tone', 'Flux: Very High', 'ZCR: 0.034'] },
  { id: 'metal', name: 'Metal', color: '#EF4444', tag: 'Energy', bpm: '110 - 190', desc: 'Aggressive amplified distortion, double-kick drums, fast power chord progressions, and shred solos.', features: ['Zero Crossing: High', 'Centroid: 2,800 Hz', 'RMS: 0.480'] },
  { id: 'pop', name: 'Pop', color: '#F43F5E', tag: 'Dance', bpm: '100 - 130', desc: 'Accessible verse-chorus structures, polished vocal production, synthesized hooks, and dance rhythms.', features: ['Vocal Isolation', 'High Roll-off', 'Rhythm: Steady'] },
  { id: 'reggae', name: 'Reggae', color: '#10B981', tag: 'Beat', bpm: '75 - 95', desc: 'Offbeat staccato guitar chops (skank), deep bass guitarlines, and laid-back syncopated drumming.', features: ['Offbeat Accent', 'Sub-Bass Energy', 'Centroid: Mid-Low'] },
  { id: 'rock', name: 'Rock', color: '#6366F1', tag: 'Energy', bpm: '110 - 150', desc: 'Centered on the electric guitar, bass guitar, drum kit, driving backbeat, and raw vocal energy.', features: ['Centroid: 2,400 Hz', 'Zero Crossing Rate: High', 'Distortion Factor'] }
];

const Waveform = ({ color, isPlaying }) => (
  <svg width="100%" height="35" viewBox="0 0 200 35" preserveAspectRatio="none" style={{ opacity: isPlaying ? 1 : 0.7 }}>
    <motion.path 
      animate={{
        d: isPlaying 
          ? ["M0,17 Q10,2 20,17 T40,17 T60,2 T80,32 T100,17 T120,35 T140,0 T160,17 T180,17 T200,17",
             "M0,17 Q10,32 20,17 T40,2 T60,30 T80,2 T100,17 T120,5 T140,32 T160,17 T180,17 T200,17",
             "M0,17 Q10,2 20,17 T40,17 T60,2 T80,32 T100,17 T120,35 T140,0 T160,17 T180,17 T200,17"]
          : "M0,17 Q10,2 20,17 T40,17 T60,5 T80,30 T100,17 T120,32 T140,2 T160,17 T180,17 T200,17"
      }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      fill="none" stroke={color || "#EC4899"} strokeWidth={isPlaying ? "2.5" : "1.5"} vectorEffect="non-scaling-stroke"
    />
  </svg>
);

const DatasetInfo = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const [playingId, setPlayingId] = useState(null);
  const audioCtrlRef = useRef(null);

  const filters = ['All', 'Dance', 'Energy', 'Acoustic', 'Beat', 'Complex'];

  const filteredGenres = activeFilter === 'All' 
    ? genresData 
    : genresData.filter(g => g.tag === activeFilter);

  // Stop music on unmount
  useEffect(() => {
    return () => {
      if (audioCtrlRef.current) {
        audioCtrlRef.current.stop();
        audioCtrlRef.current = null;
      }
    };
  }, []);

  const handleTogglePlaySynth = (genreId) => {
    playUISound('click');

    if (playingId === genreId) {
      if (audioCtrlRef.current) {
        audioCtrlRef.current.stop();
        audioCtrlRef.current = null;
      }
      setPlayingId(null);
    } else {
      if (audioCtrlRef.current) {
        audioCtrlRef.current.stop();
        audioCtrlRef.current = null;
      }
      const ctrl = playGenreMusicLoop(genreId);
      audioCtrlRef.current = ctrl;
      setPlayingId(genreId);
    }
  };

  return (
    <div style={{ paddingTop: '2rem', width: '100%' }}>
      
      {/* Header & Filter Chips */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}
      >
        <div>
          <span className="subtitle-caps" style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', display: 'block' }}>
            Interactive Knowledge Base
          </span>
          <h2 style={{ fontSize: '2.8rem', fontStyle: 'italic', margin: 0, fontWeight: 800 }}>
            Archive of GTZAN Frequencies
          </h2>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => { playUISound('hover'); setActiveFilter(filter); setActiveIndex(0); }}
              style={{
                background: activeFilter === filter ? 'var(--text-primary)' : 'rgba(0,0,0,0.04)',
                color: activeFilter === filter ? 'var(--bg-color)' : 'var(--text-primary)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Horizontal Interactive Accordion Showcase */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', width: '100%', height: '600px', gap: '6px', borderRadius: '16px', overflow: 'hidden' }}
      >
        
        {filteredGenres.map((genre, index) => {
          const isActive = activeIndex === index;
          const isPlaying = playingId === genre.id;

          return (
            <motion.div
              layout
              key={genre.id}
              onClick={() => { playUISound('hover'); setActiveIndex(index); }}
              initial={false}
              animate={{ 
                flex: isActive ? 6 : 1,
              }}
              transition={{ type: 'spring', bounce: 0, duration: 0.7 }}
              style={{
                height: '100%',
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: '12px',
                background: isActive ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.85)',
                border: isActive ? `2px solid ${genre.color}` : '1px solid rgba(255,255,255,0.08)',
                color: '#FFF'
              }}
            >
              
              {/* Vertical Title Bar (Shown when collapsed) */}
              <AnimatePresence>
                {!isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%) rotate(-90deg)',
                      whiteSpace: 'nowrap',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '1rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <span style={{ color: genre.color }}>●</span>
                    <span>{String(index + 1).padStart(2, '0')} - {genre.name}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Full Content (Shown when expanded) */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      padding: '2.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    
                    {/* Top Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '0.7rem', padding: '4px 10px', background: genre.color, color: '#FFF', borderRadius: '12px', fontWeight: 700 }}>
                            {genre.tag}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
                            BPM: {genre.bpm}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '3.5rem', fontStyle: 'italic', lineHeight: 1, margin: '1rem 0', fontWeight: 800, color: '#FFF' }}>
                          {genre.name}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '85%', lineHeight: 1.6, fontSize: '0.95rem' }}>
                          {genre.desc}
                        </p>
                      </div>

                      {/* Play / Pause Synthesized Music Preview Button */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleTogglePlaySynth(genre.id); }}
                        title={isPlaying ? `Pause ${genre.name} music` : `Play ${genre.name} GTZAN music preview`}
                        style={{
                          width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
                          background: isPlaying ? genre.color : 'rgba(255,255,255,0.1)',
                          border: `2px solid ${genre.color}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', transition: 'all 0.3s',
                          color: '#FFF',
                          boxShadow: isPlaying ? `0 0 24px ${genre.color}` : 'none'
                        }}
                      >
                        {isPlaying ? (
                          <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '16px' }}>
                            <div className="equalizer-bar" style={{ animationDelay: '0s' }}></div>
                            <div className="equalizer-bar" style={{ animationDelay: '0.2s' }}></div>
                            <div className="equalizer-bar" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '3px' }}>
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Bottom Features Snapshot */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: genre.color, fontWeight: 700 }}>
                          Spectral Profile Snapshot
                        </span>
                        {isPlaying && (
                          <span style={{ fontSize: '0.75rem', color: genre.color, fontWeight: 700, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: genre.color, display: 'inline-block', animation: 'pulse 1s infinite' }}></span>
                            LISTENING TO {genre.name.toUpperCase()} AUDIO FREQUENCIES
                          </span>
                        )}
                      </div>
                      
                      <div style={{ width: '100%', marginBottom: '1.2rem' }}>
                        <Waveform color={genre.color} isPlaying={isPlaying} />
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {genre.features.map((feature, i) => (
                          <span key={i} style={{ 
                            fontSize: '0.75rem', padding: '6px 12px', 
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px',
                            fontFamily: 'monospace', color: 'rgba(255,255,255,0.85)'
                          }}>
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          );
        })}
      </motion.div>

    </div>
  );
};

export default DatasetInfo;
