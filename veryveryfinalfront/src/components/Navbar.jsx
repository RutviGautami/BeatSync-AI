import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { playUISound } from '../utils/webAudioSynth';

const Navbar = ({ theme, onToggleTheme }) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: '1.5rem 0',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '2rem'
      }}
    >
      {/* Brand Logo & Name */}
      <NavLink 
        to="/" 
        onClick={() => playUISound('click')}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}
      >
        <div style={{
          width: '38px', height: '38px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 800, fontSize: '1.2rem',
          boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)'
        }}>
          B
        </div>
        <div>
          <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            BeatSync AI
          </h4>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'monospace', display: 'block' }}>
            GTZAN Audio Studio
          </span>
        </div>
      </NavLink>

      {/* Navigation Routes Tabs */}
      <div style={{
        display: 'flex', background: 'var(--glass-bg)', padding: '4px', borderRadius: '25px', border: '1px solid var(--glass-border)'
      }}>
        <NavLink
          to="/"
          onClick={() => playUISound('click')}
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          style={({ isActive }) => ({
            background: isActive ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : 'transparent',
            color: isActive ? '#FFF' : 'var(--text-secondary)',
            border: 'none', padding: '8px 20px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700,
            textDecoration: 'none', transition: 'all 0.3s'
          })}
        >
          Studio Classifier
        </NavLink>

        <NavLink
          to="/about"
          onClick={() => playUISound('click')}
          style={({ isActive }) => ({
            background: isActive ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : 'transparent',
            color: isActive ? '#FFF' : 'var(--text-secondary)',
            border: 'none', padding: '8px 20px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700,
            textDecoration: 'none', transition: 'all 0.3s'
          })}
        >
          ML Notebooks & About
        </NavLink>
      </div>

      {/* Theme Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleTheme}
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s'
          }}
        >
          {theme === 'dark' ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              <span>Light Editorial</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              <span>Cyber OLED</span>
            </>
          )}
        </button>
      </div>
    </motion.header>
  );
};

export default Navbar;
