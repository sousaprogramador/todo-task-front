import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  password: Yup.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
});

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/register', data);
      toast.success('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message?.message ||
        'Erro ao registrar. Tente novamente.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded shadow-md w-full max-w-sm'>
        <h2 className='text-2xl font-bold mb-6 text-gray-900'>Registrar-se</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'>
            <label className='block text-gray-700'>Nome</label>
            <input
              type='text'
              {...register('name')}
              className='mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.name && (
              <p className='text-red-500'>{errors.name.message}</p>
            )}
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Email</label>
            <input
              type='email'
              {...register('email')}
              className='mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.email && (
              <p className='text-red-500'>{errors.email.message}</p>
            )}
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Senha</label>
            <input
              type='password'
              {...register('password')}
              className='mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.password && (
              <p className='text-red-500'>{errors.password.message}</p>
            )}
          </div>
          <button
            type='submit'
            className='w-full bg-green-500 text-white p-2 rounded hover:bg-green-600'
          >
            Registrar
          </button>
        </form>
        <div className='mt-4 text-center'>
          <a href='/login' className='text-blue-500 hover:underline'>
            Voltar para Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;
