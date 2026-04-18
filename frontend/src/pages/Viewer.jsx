import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { socket } from '../App';
import { useNavigate } from 'react-router-dom';

export default function Viewer() {
  const [state, setState] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for updates from backend
    socket.on('matchStateUpdated', (newState) => {
      setState(newState);
    });

    return () => {
      socket.off('matchStateUpdated');
    };
  }, []);

  if (!state || state.status === 'setup') {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-10 h-10 border-4 border-ios-blue border-t-transparent rounded-full"></motion.div>
        <p className="text-ios-gray">Waiting for match to start...</p>
        <button onClick={() => navigate('/')} className="text-ios-blue text-sm">Cancel</button>
      </div>
    );
  }

  // Live Scoreboard
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full p-4 overflow-y-auto w-full">
      <div className="flex justify-between items-center bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-3xl mb-6 shadow-2xl">
        <div className="text-center">
          <div className="text-sm text-ios-gray uppercase font-bold tracking-widest">{state.teams.team1}</div>
          <div className="text-5xl font-black mt-1 tracking-tighter">
            {state.score.runs}<span className="text-ios-gray/50 text-3xl">/</span>{state.score.wickets}
          </div>
          <div className="text-sm font-semibold text-ios-gray mt-2 bg-white/5 rounded-full px-3 py-1 inline-block">
            {Math.floor(state.score.balls/6)}.{state.score.balls%6} <span className="text-gray-500 font-normal">/ {state.rules.overs}.0 target</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-ios-blue shadow-[0_4px_20px_rgba(10,132,255,0.4)]">
           <span className="text-xs font-bold uppercase tracking-wider mb-1">CRR</span>
           <span className="text-xl font-bold">
              {state.score.balls > 0 ? ((state.score.runs / state.score.balls) * 6).toFixed(1) : '0.0'}
           </span>
        </div>
      </div>

      <div className="bg-ios-card/50 rounded-2xl p-4 shadow-sm border border-white/5 space-y-4">
        {/* Batsmen */}
        <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-ios-text font-bold text-base flex items-center">
              {state.striker.name}
              <div className="w-2 h-2 rounded-full bg-ios-blue ml-2 animate-pulse shadow-[0_0_8px_rgba(10,132,255,0.8)]"></div>
            </span>
          </div>
          <div className="text-right text-base font-bold">
            {state.striker.runs} <span className="text-ios-gray text-xs font-normal">({state.striker.balls})</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="text-ios-gray font-medium">
             {state.nonStriker.name}
          </div>
          <div className="text-right text-ios-gray/80">
            {state.nonStriker.runs} <span className="text-xs">({state.nonStriker.balls})</span>
          </div>
        </div>
      </div>

      {/* Bowler */}
      <div className="bg-ios-card/50 rounded-2xl p-4 shadow-sm border border-white/5 mt-4 flex justify-between items-center">
        <div>
          <div className="text-xs text-ios-gray uppercase font-bold tracking-widest mb-1">Bowling</div>
          <div className="text-base font-semibold">{state.bowler.name}</div>
        </div>
        <div className="text-right">
           <div className="text-lg font-bold">{state.bowler.wickets} - {state.bowler.runs}</div>
           <div className="text-xs text-ios-gray font-medium">{Math.floor(state.bowler.balls/6)}.{state.bowler.balls%6} overs</div>
        </div>
      </div>

      {/* Recent Balls */}
      {state.recentBalls.length > 0 && (
      <div className="mt-6 flex flex-col space-y-3">
        <h3 className="text-xs text-ios-gray uppercase font-bold tracking-widest">This Over</h3>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {state.recentBalls.map((b, i) => (
            <motion.div 
              key={i} 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-full text-sm font-bold shadow-md
                ${b === 'W' ? 'bg-ios-red text-white' : 
                  b === '4' || b === '6' ? 'bg-ios-blue text-white' : 'bg-white/10 text-white'}`}
            >
              {b}
            </motion.div>
          ))}
        </div>
      </div>
      )}
    </motion.div>
  );
}
