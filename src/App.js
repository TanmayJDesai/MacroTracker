import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Calendar from './components/Calendar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Add Meals</Link>
          <Link to="/calendar" className="nav-link">View Calendar</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;