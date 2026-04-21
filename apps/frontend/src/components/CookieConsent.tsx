import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('tx_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('tx_cookie_consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('tx_cookie_consent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
      <div className="bg-white/80 backdrop-blur-2xl border border-gray-100 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-8 duration-700">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shrink-0">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 7v5l3 3"/></svg>
          </div>
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Privacy Controls</h4>
            <p className="text-sm font-bold text-gray-900 leading-tight">I value your interaction patterns, but I value your privacy more.</p>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 font-medium mb-6 leading-relaxed">
          I use minimal tracking to improve this architectural experience. No personal data is ever collected.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleAccept}
            className="bg-gray-900 text-white rounded-xl py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
          >
            I Accept
          </button>
          <button 
            onClick={handleDecline}
            className="bg-gray-50 text-gray-900 border border-gray-100 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
