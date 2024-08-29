import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

const RegistrationContext = createContext();

export const useRegistration = () => useContext(RegistrationContext);

export const RegistrationProvider = ({ children }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const registerUser = async () => {
    try {
      await api.post('/user', { name, email, password });
      return true;
    } catch (err) {
      setError('Erro ao registrar, tente novamente.');
      return false;
    }
  };

  return (
    <RegistrationContext.Provider
      value={{
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        error,
        registerUser,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};
