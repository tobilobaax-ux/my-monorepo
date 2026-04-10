import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AboutPage from './pages/AboutPage';

const App: React.FC = () => (
 <Router>
   <Routes>
     <Route path="/" element={<Dashboard />} />
     <Route path="/about" element={<AboutPage />} />
   </Routes>
 </Router>
);

export default App;
