import React from 'react';

function Header() {
  return (
    <header className='bg-gray-800 text-white p-4'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>MedCof - Task</h1>
        <nav>
          <a href='/tasks' className='text-gray-400 hover:text-white mx-2'>
            Tarefas
          </a>
          <a href='/profile' className='text-gray-400 hover:text-white mx-2'>
            Perfil
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
