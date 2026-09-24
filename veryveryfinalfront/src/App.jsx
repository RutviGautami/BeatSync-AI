import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import CursorEffects from './components/CursorEffects';
import BackgroundOrbs from './components/BackgroundOrbs';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const [theme, setTheme] = useState('dark');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const { scrollYProgress } = useScroll();
  const progressSpring = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <SmoothScroll>
      
      {/* Top Glowing Scroll Progress Bar */}
      <motion.div
        style={{
          scaleX: progressSpring,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #EC4899, #8B5CF6, #06B6D4)',
          transformOrigin: '0%',
          zIndex: 10000,
          boxShadow: '0 0 12px #EC4899'
        }}
      />

      {/* Floating Animated Ambient Color Mesh Orbs */}
      <BackgroundOrbs />

      {/* Interactive Cursor Particle Trail */}
      <CursorEffects />

      {/* Dynamic Cursor Ambient Background Glow */}
      <motion.div
        className="cursor-glow"
        animate={{
          x: mousePosition.x - 200,
          y: mousePosition.y - 200,
          filter: `blur(80px) hue-rotate(${Math.floor((mousePosition.x + mousePosition.y) * 0.4) % 360}deg)`
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 150, mass: 0.5 }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Sticky Navbar */}
        <Navbar theme={theme} onToggleTheme={toggleTheme} />

        {/* Page Route Views */}
        <main>
          <AnimatedRoutes />
        </main>

        <footer style={{
          padding: '3rem 0',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem'
        }}>
          <div>BeatSync AI Studio © 2026. Built for Machine Learning & Audio Signal Processing.</div>
          <div style={{ fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>GTZAN Dataset Model • 10 Classes</div>
        </footer>

      </div>
    </SmoothScroll>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
