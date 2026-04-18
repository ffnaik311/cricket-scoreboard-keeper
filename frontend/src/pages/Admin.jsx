import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '../App';
import { Settings, UserPlus, Play } from 'lucide-react';

export default function Admin() {
  const [step, setStep] = useState(1); // 1: Initial rules, 2: Openers, 3: Dashboard
  const [state, setState] = useState({
    teams: { team1: 'CS', team2: 'IT' },
    rules: { overs: 5, players: 6 }, // Custom Overs/Players
    batting: 'team1',
    bowling: 'team2',
    score: { runs: 0, wickets: 0, balls: 0 },
    extras: { wide: 0, noBall: 0 },
    striker: { name: '', runs: 0, balls: 0, active: false },
    nonStriker: { name: '', runs: 0, balls: 0, active: false },
    bowler: { name: '', runs: 0, wickets: 0, balls: 0, overs: 0.0, active: false },
    recentBalls: [],
    status: 'setup' // setup, live, end
  });

  const [formValues, setFormValues] = useState({
    striker: '', nonStriker: '', bowler: ''
  });

  // Sync to backend whenever state changes in LIVE mode
  useEffect(() => {
    if (state.status !== 'setup') {
      socket.emit('syncState', state);
    }
  }, [state]);

  const startMatch = () => {
    setState(prev => ({
      ...prev,
      striker: { ...prev.striker, name: formValues.striker, active: true },
      nonStriker: { ...prev.nonStriker, name: formValues.nonStriker, active: true },
      bowler: { ...prev.bowler, name: formValues.bowler, active: true },
      status: 'live'
    }));
    setStep(3);
  };

  const addRun = (runs, extraType = null) => {
    setState(prev => {
      let runScored = runs;
      let isExtra = !!extraType;
      let newExtra = { ...prev.extras };
      let newScoreRuns = prev.score.runs + runs;
      let newScoreBalls = prev.score.balls;
      let newStriker = { ...prev.striker };
      let newBowler = { ...prev.bowler };
      let updatedRecent = [...prev.recentBalls];

      if (extraType === 'wide') {
        newExtra.wide += 1;
        newScoreRuns += 1;
        newBowler.runs += 1 + runScored;
        updatedRecent.push('Wd' + (runScored > 0 ? '+'+runScored : ''));
      } else if (extraType === 'noBall') {
        newExtra.noBall += 1;
        newScoreRuns += 1;
        newBowler.runs += 1 + runScored;
        newStriker.runs += runScored;
        newStriker.balls += 1; // NB balls faced usually count
        updatedRecent.push('Nb' + (runScored > 0 ? '+'+runScored : ''));
      } else {
        // Legal ball
        newScoreBalls += 1;
        newStriker.runs += runScored;
        newStriker.balls += 1;
        newBowler.runs += runScored;
        newBowler.balls += 1;
        
        // Convert bowler balls to overs (1 over = 6 balls usually, but for simple app using full numbers)
        newBowler.overs = Math.floor(newBowler.balls / 6) + (newBowler.balls % 6) / 10;
        updatedRecent.push(runScored.toString());
      }

      // Check max overs
      const maxBalls = prev.rules.overs * 6;
      let newStatus = prev.status;
      if (newScoreBalls >= maxBalls) {
        newStatus = 'overComplete'; // trigger end of innings logic later
      }

      // Strike rotation logic
      let strikeRotated = runScored % 2 !== 0; // odd runs change strike
      // Over finished changes strike too
      if (newScoreBalls % 6 === 0 && !isExtra) {
        strikeRotated = !strikeRotated;
      }

      return {
        ...prev,
        score: { ...prev.score, runs: newScoreRuns, balls: newScoreBalls },
        extras: newExtra,
        striker: strikeRotated ? prev.nonStriker : newStriker, // Swap roles if rotated
        nonStriker: strikeRotated ? newStriker : prev.nonStriker,
        bowler: newBowler,
        recentBalls: updatedRecent.slice(-6), // Keep last 6 balls
        status: newStatus
      };
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Setup Step 1: Teams & Rules */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">
            <h2 className="text-xl font-bold border-b border-white/10 pb-2">Match Rules</h2>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ios-gray">Batting Team</label>
              <input type="text" className="ios-input" value={state.teams.team1} onChange={e => setState({ ...state, teams: { ...state.teams, team1: e.target.value }})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ios-gray">Bowling Team</label>
              <input type="text" className="ios-input" value={state.teams.team2} onChange={e => setState({ ...state, teams: { ...state.teams, team2: e.target.value }})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ios-gray">Number of Overs</label>
              <input type="number" className="ios-input" value={state.rules.overs} onChange={e => setState({ ...state, rules: { ...state.rules, overs: Number(e.target.value) }})} />
            </div>
            <button onClick={() => setStep(2)} className="ios-btn ios-btn-primary w-full mt-4">Next Step: Players <Play size={16} className="ml-2" /></button>
          </motion.div>
        )}

        {/* Setup Step 2: Players */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">
            <h2 className="text-xl font-bold border-b border-white/10 pb-2">Opening Players</h2>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ios-gray">Striker</label>
              <input type="text" className="ios-input" value={formValues.striker} onChange={e => setFormValues({ ...formValues, striker: e.target.value })} placeholder="E.g., Shoaib" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ios-gray">Non-Striker</label>
              <input type="text" className="ios-input" value={formValues.nonStriker} onChange={e => setFormValues({ ...formValues, nonStriker: e.target.value })} placeholder="E.g., Babar" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ios-gray">Opening Bowler</label>
              <input type="text" className="ios-input" value={formValues.bowler} onChange={e => setFormValues({ ...formValues, bowler: e.target.value })} placeholder="E.g., Shaheen" />
            </div>
            <button onClick={startMatch} className="ios-btn ios-btn-success w-full mt-4 !mt-8">Start Match <UserPlus size={16} className="ml-2" /></button>
          </motion.div>
        )}

        {/* Dashboard */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col p-4">
            {/* Scorecard Widget */}
            <div className="bg-gradient-to-br from-ios-card to-black rounded-2xl p-4 shadow-lg border border-white/10 mb-4">
              <div className="flex justify-between items-end mb-2">
                <h1 className="text-4xl font-extrabold">{state.score.runs}/{state.score.wickets}</h1>
                <span className="text-ios-gray font-medium mb-1">Overs: {Math.floor(state.score.balls/6)}.{state.score.balls%6} / {state.rules.overs}</span>
              </div>
              <div className="flex justify-between text-sm mt-4">
                <div>
                  <div className="font-semibold text-ios-blue">Striker ( {state.striker.name} )</div>
                  <div className="text-white">{state.striker.runs} ({state.striker.balls})</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-ios-gray">Bowler ( {state.bowler.name} )</div>
                  <div className="text-white">{state.bowler.runs} / {state.bowler.wickets}</div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-4 gap-3 mb-4 mt-auto">
              {[0, 1, 2, 3, 4, 6].map(r => (
                <button key={r} onClick={() => addRun(r)} className="score-btn">{r}</button>
              ))}
              <button className="score-btn ios-btn-danger text-base">OUT</button>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-8">
              <button onClick={() => addRun(0, 'wide')} className="ios-btn ios-btn-secondary">Wide</button>
              <button onClick={() => addRun(0, 'noBall')} className="ios-btn ios-btn-secondary">No Ball</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
