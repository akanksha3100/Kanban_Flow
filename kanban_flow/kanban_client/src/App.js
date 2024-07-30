import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './assets/css/App.css';
import KanbanBoard from './components.js/KanbanBoard';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <p>
            Kanban Flow Application
          </p>
        </header>
        <Routes>
          <Route path="/" element={<KanbanBoard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
