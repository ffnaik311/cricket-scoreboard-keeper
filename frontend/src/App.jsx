import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Admin from './pages/Admin';
import Viewer from './pages/Viewer';

// Global Socket instance export
import { io } from 'socket.io-client';
// Use environment variable if deployed, otherwise fallback to local hostname for testing
const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:3001`;
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
