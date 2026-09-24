import React from 'react';
import { motion } from 'framer-motion';

const BackgroundOrbs = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden'
    }}>
      {/* Top Left Violet Glow Orb */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.2, 0.9, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '55vw',
          height: '55vw',
          maxHeight: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)',
          filter: 'blur(90px)',
          mixBlendMode: 'screen'
        }}
      />

      {/* Middle Right Neon Pink Glow Orb */}
      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.9, 1.15, 1]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '30%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          maxHeight: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.20) 0%, rgba(236, 72, 153, 0.04) 50%, transparent 70%)',
          filter: 'blur(90px)',
          mixBlendMode: 'screen'
        }}
      />

      {/* Bottom Left Cyber Cyan Glow Orb */}
      <motion.div
        animate={{
          x: [0, 50, -20, 0],
          y: [0, -30, 50, 0],
          scale: [1, 1.15, 0.95, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '15%',
          width: '45vw',
          height: '45vw',
          maxHeight: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(6, 182, 212, 0.03) 50%, transparent 70%)',
          filter: 'blur(90px)',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
};

export default BackgroundOrbs;
