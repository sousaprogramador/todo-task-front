import React from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded shadow-md w-full max-w-sm'>
        <h2 className='text-2xl font-bold mb-6 text-gray-900'>
          Recuperar Senha
        </h2>
        <form>
          <div className='mb-4'>
            <label className='block text-gray-700'>Email</label>
            <input
              type='email'
              className='mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600'
          >
            Enviar Email de Recuperação
          </button>
        </form>
        <div className='mt-4 text-center'>
          <Link to='/' className='text-blue-500 hover:underline'>
            Voltar para Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
