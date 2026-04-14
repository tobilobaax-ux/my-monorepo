import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AboutPage from './pages/AboutPage';

const App: React.FC = () => (
  <Router>
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  </Router>
);

export default App;
