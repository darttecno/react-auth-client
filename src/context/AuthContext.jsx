import React, { createContext, useState, useContext, useEffect } from 'react';
import { decodeToken } from '../utils/jwt';
import { apiFetch } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      const decodedUserId = decodeToken(token);
    
      if (decodedUserId) {
        localStorage.setItem('userId', decodedUserId);
        setUserId(decodedUserId);
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      setUserId(null);
    }
  }, [token, refreshToken]);

  const login = (newToken, newRefreshToken) => {
    setToken(newToken);
    setRefreshToken(newRefreshToken);
  };

  const logout = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      const currentRefreshToken = localStorage.getItem('refreshToken');

      if (currentToken && currentRefreshToken) {
        await apiFetch('/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`
          },
          body: currentRefreshToken
        });
      }
    } catch (error) {
      console.error("Error al cerrar sesión en el backend:", error);
      // Aunque haya un error en el backend, limpiamos el estado local para asegurar el cierre de sesión en el frontend
    } finally {
      setToken(null);
      setRefreshToken(null);
    }
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
