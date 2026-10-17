// Standalone entry for sharing the games as a single HTML page (Claude Artifact).
// MemoryRouter keeps navigation inside the page, since the host frame owns the real URL.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MuscleGames } from './muscle-games';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MemoryRouter initialEntries={['/games']}>
      <Routes>
        <Route path="/games/*" element={<MuscleGames />} />
        <Route path="*" element={<Navigate to="/games" replace />} />
      </Routes>
    </MemoryRouter>
  </React.StrictMode>
);
