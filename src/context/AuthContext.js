import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email, senha) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password: senha,
      });
      const token = response.data.token;
      const userData = response.data.user;

      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.Authorization = `Bearer ${token}`;

      setUser(userData);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    api.defaults.headers.Authorization = null;
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
