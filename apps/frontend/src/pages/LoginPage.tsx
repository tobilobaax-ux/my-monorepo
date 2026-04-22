import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');
    
    const success = await login(passcode);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('ACCESS DENIED: INVALID PASSCODE');
    }
    setIsVerifying(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl p-10 space-y-8 animate-in fade-in zoom-in duration-500">
         <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto text-white shadow-xl rotate-3">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
               </svg>
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter text-gray-900 pt-4 uppercase">Identity Required</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enterprise Analytics Access</p>
         </div>
         
         <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
               <input 
                  type="password"
                  placeholder="ENTER PASSCODE"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  disabled={isVerifying}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold tracking-widest placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/5 transition-all text-center"
               />
               {error && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest text-center mt-2">{error}</p>}
            </div>
            <button 
              type="submit"
              disabled={isVerifying}
              className="w-full bg-gray-900 text-white rounded-2xl py-4 text-xs font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-200 disabled:opacity-50"
            >
              {isVerifying ? 'VERIFYING...' : 'VIEW ANALYTICS'}
            </button>
         </form>
         
         <div className="pt-4 border-t border-gray-50 text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-[9px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-all"
            >
              RETURN TO GRID
            </button>
         </div>
      </div>
    </div>
  );
};

export default LoginPage;
