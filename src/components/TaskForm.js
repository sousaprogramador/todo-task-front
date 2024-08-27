import React, { useState } from 'react';

function TaskForm({ onAddTask }) {
  const [taskText, setTaskText] = useState('');
  const [status, setStatus] = useState('pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAddTask(taskText, status);
      setTaskText('');
    }
  };

  return (
    <div className='bg-white p-4 rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold mb-4'>Adicionar Tarefa</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='taskText' className='block text-gray-700'>
            Descrição
          </label>
          <input
            id='taskText'
            type='text'
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded'
            placeholder='Digite a descrição da tarefa'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='status' className='block text-gray-700'>
            Status
          </label>
          <select
            id='status'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded'
          >
            <option value='pending'>Pendentes</option>
            <option value='in-progress'>Em Progresso</option>
            <option value='completed'>Concluídas</option>
            <option value='cancelled'>Canceladas</option>
          </select>
        </div>
        <button
          type='submit'
          className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
        >
          Adicionar
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
