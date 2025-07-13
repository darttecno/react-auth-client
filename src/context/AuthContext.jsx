import React, { createContext, useState, useContext, useEffect } from 'react';
import { decodeToken } from '../utils/jwt';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      const decodedUserId = decodeToken(token);
    
      if (decodedUserId) {
        localStorage.setItem('userId', decodedUserId);
        setUserId(decodedUserId);
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setUserId(null);
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
