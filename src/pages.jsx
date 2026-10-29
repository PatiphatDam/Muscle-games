// Entry for the public GitHub Pages site.
// HashRouter (#/games/...) so deep links and refresh work on static hosting without server rewrites.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MuscleGames } from './muscle-games';
import './fonts.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/games/*" element={<MuscleGames />} />
        <Route path="*" element={<Navigate to="/games" replace />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
