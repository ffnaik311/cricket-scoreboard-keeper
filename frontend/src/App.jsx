import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Admin from './pages/Admin';
import Viewer from './pages/Viewer';

// Global Socket instance export
import { io } from 'socket.io-client';
// Use the live Render backend URL for remote viewing!
const backendUrl = "https://cricket-scoreboard-keeper.onrender.com";
export const socket = io(backendUrl);

function App() {
  return (
    <div className="min-h-screen bg-ios-bg text-ios-text font-sans antialiased overflow-hidden flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md h-full min-h-[90vh] glass-panel relative">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/viewer" element={<Viewer />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
