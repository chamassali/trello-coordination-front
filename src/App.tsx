// src/App.tsx or your routing configuration file
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TrelloPage from './Components/TrelloPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/trello" element={<TrelloPage />} />
        {/* Add other routes for different pages if needed */}
      </Routes>
    </Router>
  );
}

export default App;
