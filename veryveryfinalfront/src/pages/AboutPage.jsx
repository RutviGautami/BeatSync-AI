import React from 'react';
import { motion } from 'framer-motion';
import AboutMLNotebook from '../components/AboutMLNotebook';

const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="section"
      style={{ borderBottom: 'none', paddingTop: '1rem' }}
    >
      <AboutMLNotebook />
    </motion.div>
  );
};

export default AboutPage;
