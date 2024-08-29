import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className='bg-blue-500 text-white p-4 flex justify-between items-center'>
      <h1>My Task</h1>
      <button
        onClick={handleLogout}
        className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
      >
        Logout
      </button>
    </header>
  );
}

export default Header;
