import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 py-10">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-6xl mb-4 block">🏏</span>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-ios-blue to-ios-green text-transparent bg-clip-text">
          Gully Cricket Live
        </h1>
        <p className="text-ios-gray mt-2 text-sm">Real-time stats for your college games</p>
      </motion.div>

      <motion.div 
        className="flex flex-col space-y-4 w-full px-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button 
          onClick={() => navigate('/viewer')}
          className="ios-btn ios-btn-primary"
        >
          Watch Live Match
        </button>
        <button 
          onClick={() => navigate('/admin')}
          className="ios-btn ios-btn-secondary"
        >
          Start New Match (Admin)
        </button>
      </motion.div>
    </div>
  );
}

export default Landing;
