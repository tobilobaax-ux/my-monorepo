import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyAdmin } from '../utils/api';

interface AuthContextType {
  isAuthorized: boolean;
  login: (passcode: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const savedPasscode = localStorage.getItem('admin_passcode');
      if (savedPasscode) {
        const isValid = await verifyAdmin(savedPasscode);
        setIsAuthorized(isValid);
        if (!isValid) localStorage.removeItem('admin_passcode');
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (passcode: string) => {
    const isValid = await verifyAdmin(passcode);
    if (isValid) {
      localStorage.setItem('admin_passcode', passcode);
      setIsAuthorized(true);
    }
    return isValid;
  };

  const logout = () => {
    localStorage.removeItem('admin_passcode');
    setIsAuthorized(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthorized, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
