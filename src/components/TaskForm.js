import React, { useState, useEffect } from 'react';

function TaskForm({ onSave, editingTask }) {
  const [taskContent, setTaskContent] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTaskContent(editingTask.content);
    } else {
      setTaskContent('');
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskContent.trim()) {
      onSave(taskContent);
      setTaskContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className='text-xl font-semibold mb-2'>
        {editingTask ? 'Editar Tarefa' : 'Adicionar Tarefa'}
      </h2>
      <input
        type='text'
        value={taskContent}
        onChange={(e) => setTaskContent(e.target.value)}
        className='border border-gray-300 p-2 rounded w-full'
        placeholder='Digite o conteúdo da tarefa'
      />
      <button
        type='submit'
        className='bg-blue-500 text-white px-4 py-2 rounded mt-2'
      >
        {editingTask ? 'Salvar' : 'Adicionar'}
      </button>
    </form>
  );
}

export default TaskForm;
