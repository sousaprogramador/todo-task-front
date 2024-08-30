import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className='bg-blue-500 text-white p-4 flex justify-between items-center'>
      <h1>My Task</h1>
      <div className='relative'>
        <div
          className='flex items-center cursor-pointer'
          onClick={toggleDropdown}
        >
          <div className='w-10 h-10 bg-gray-300 rounded-full flex justify-center items-center'>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt='Avatar'
                className='w-10 h-10 rounded-full object-cover'
              />
            ) : (
              <span className='text-xl font-semibold'>
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className='ml-3'>{user?.name}</span>
        </div>
        {isDropdownOpen && (
          <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10'>
            <button
              onClick={handleLogout}
              className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
