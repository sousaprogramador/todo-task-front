import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

function TaskModal({ isOpen, onRequestClose, editingTask, onSave }) {
  const [id, setId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pendente');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTask) {
      setId(editingTask.id || null);
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setStatus(editingTask.status || 'pendente');
    } else {
      setId(null);
      setTitle('');
      setDescription('');
      setStatus('pendente');
    }
    setErrors({});
  }, [editingTask]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('O título é obrigatório'),
    description: Yup.string(),
    status: Yup.string().required('O status é obrigatório'),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const taskData = {
      id,
      title,
      description,
      status,
    };

    try {
      await validationSchema.validate(taskData, { abortEarly: false });
      onSave(taskData);
      toast.success(
        editingTask
          ? 'Tarefa atualizada com sucesso!'
          : 'Tarefa adicionada com sucesso!'
      );
      onRequestClose();
    } catch (err) {
      toast.error(err.message);
      const validationErrors = {};
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  };

  return (
    isOpen && (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
        <div className='bg-white p-8 rounded shadow-md w-full max-w-lg'>
          <h2 className='text-2xl font-bold mb-6'>
            {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='title'
              >
                Título
              </label>
              <input
                id='title'
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Título da tarefa'
                required
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : ''
                }`}
              />
              {errors.title && (
                <p className='text-red-500 text-xs italic'>{errors.title}</p>
              )}
            </div>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='description'
              >
                Descrição
              </label>
              <textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Descrição da tarefa'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='status'
              >
                Status
              </label>
              <select
                id='status'
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.status ? 'border-red-500' : ''
                }`}
              >
                <option value='pendente'>Pendente</option>
                <option value='emProgresso'>Em Progresso</option>
                <option value='concluido'>Concluído</option>
                <option value='cancelado'>Cancelado</option>
              </select>
              {errors.status && (
                <p className='text-red-500 text-xs italic'>{errors.status}</p>
              )}
            </div>
            <div className='flex justify-end'>
              <button
                type='submit'
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                {editingTask ? 'Salvar Alterações' : 'Adicionar Tarefa'}
              </button>
            </div>
          </form>
          <button
            onClick={onRequestClose}
            className='mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
          >
            Fechar
          </button>
        </div>
      </div>
    )
  );
}

export default TaskModal;
