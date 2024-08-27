import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded shadow-md w-full max-w-sm'>
        <h2 className='text-2xl font-bold mb-6 text-gray-900'>Login</h2>
        <form>
          <div className='mb-4'>
            <label className='block text-gray-700'>Email</label>
            <input
              type='email'
              className='mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Senha</label>
            <input
              type='password'
              className='mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
          >
            Entrar
          </button>
        </form>
        <div className='mt-4 flex justify-between'>
          <Link to='/register' className='text-blue-500 hover:underline'>
            Registrar-se
          </Link>
          <Link to='/forgot-password' className='text-blue-500 hover:underline'>
            Esqueci Minha Senha
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
