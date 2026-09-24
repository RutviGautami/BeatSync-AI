import React from 'react';

const RadarChart = ({ 
  trackData = { danceability: 82, energy: 90, brightness: 75, percussive: 65, acoustic: 30, dynamic: 85 }, 
  genreData = { danceability: 70, energy: 75, brightness: 60, percussive: 55, acoustic: 40, dynamic: 70 },
  genreName = 'Benchmark'
}) => {
  const categories = [
    { key: 'danceability', label: 'Rhythm' },
    { key: 'energy', label: 'Energy' },
    { key: 'brightness', label: 'Brightness' },
    { key: 'percussive', label: 'Percussive' },
    { key: 'acoustic', label: 'Acoustic' },
    { key: 'dynamic', label: 'Dynamic' }
  ];

  const size = 300;
  const center = size / 2;
  const radius = 100;
  const total = categories.length;

  const getCoordinates = (index, value) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate Polygon Path Points
  const trackPoints = categories.map((cat, i) => {
    const val = trackData[cat.key] || 50;
    const { x, y } = getCoordinates(i, val);
    return `${x},${y}`;
  }).join(' ');

  const genrePoints = categories.map((cat, i) => {
    const val = genreData[cat.key] || 50;
    const { x, y } = getCoordinates(i, val);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{
      width: '100%',
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#EC4899', fontWeight: 700 }}>
            Acoustic Fingerprint
          </span>
          <h4 style={{ margin: 0, color: '#FFF', fontSize: '1.1rem' }}>Spectral Vector Radar</h4>
        </div>
        
        {/* Legend */}
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EC4899' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#EC4899' }}></span>
            <span>Your Track</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#06B6D4' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#06B6D4' }}></span>
            <span>{genreName} Avg</span>
          </div>
        </div>
      </div>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        
        {/* Concentric Web Rings (20%, 40%, 60%, 80%, 100%) */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((level, ringIdx) => {
          const ringPoints = categories.map((_, i) => {
            const { x, y } = getCoordinates(i, level * 100);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polygon
              key={`ring-${ringIdx}`}
              points={ringPoints}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
              strokeDasharray={ringIdx === 4 ? 'none' : '3 3'}
            />
          );
        })}

        {/* Axis Lines & Labels */}
        {categories.map((cat, i) => {
          const { x, y } = getCoordinates(i, 100);
          const labelCoord = getCoordinates(i, 120);
          return (
            <g key={`axis-${i}`}>
              <line x1={center} y1={center} x2={x} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <text
                x={labelCoord.x}
                y={labelCoord.y + 4}
                fill="rgba(255, 255, 255, 0.7)"
                fontSize="10"
                fontWeight="600"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                {cat.label}
              </text>
            </g>
          );
        })}

        {/* Genre Benchmark Polygon */}
        <polygon
          points={genrePoints}
          fill="rgba(6, 182, 212, 0.15)"
          stroke="#06B6D4"
          strokeWidth="2"
        />

        {/* Track Polygon */}
        <polygon
          points={trackPoints}
          fill="rgba(236, 72, 153, 0.25)"
          stroke="#EC4899"
          strokeWidth="2.5"
        />

        {/* Vertex Dots */}
        {categories.map((cat, i) => {
          const { x, y } = getCoordinates(i, trackData[cat.key] || 50);
          return (
            <circle
              key={`dot-${i}`}
              cx={x} cy={y} r="4"
              fill="#EC4899"
              stroke="#FFF" strokeWidth="1.5"
            />
          );
        })}

      </svg>
    </div>
  );
};

export default RadarChart;
