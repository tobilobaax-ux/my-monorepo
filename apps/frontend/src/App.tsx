import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';

import { trackEvent, EVENTS } from './utils/analytics';

import CookieConsent from './components/CookieConsent';

import ChatWidget from './components/chatbot/ChatWidget';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    trackEvent(EVENTS.VIEWED, { path: location.pathname });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <CookieConsent />
      {!isDashboard && <Navbar />}
      {children}
      <ChatWidget />
      {!isDashboard && <Footer />}
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Layout>
  </Router>
);

export default App;
