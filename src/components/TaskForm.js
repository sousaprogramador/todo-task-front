import React, { useState } from 'react';

function TaskForm({ onAddTask }) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text, status);
      setText('');
      setStatus('pending');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='bg-white p-6 rounded shadow'>
      <h2 className='text-2xl font-semibold mb-4'>Adicionar Tarefa</h2>
      <input
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Nome da tarefa'
        className='border p-2 mb-4 w-full'
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className='border p-2 mb-4 w-full'
      >
        <option value='pending'>Pendentes</option>
        <option value='in-progress'>Em Progresso</option>
        <option value='completed'>Concluídas</option>
        <option value='cancelled'>Canceladas</option>
      </select>
      <button
        type='submit'
        className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full'
      >
        Adicionar
      </button>
    </form>
  );
}

export default TaskForm;
