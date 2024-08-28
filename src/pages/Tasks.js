import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskModal from '../components/TaskModal';

function Tasks() {
  const { tasks, handleSaveTask, handleDeleteTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const openModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleAddTaskClick = () => {
    openModal();
  };

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex justify-end p-4'>
        <button
          onClick={handleAddTaskClick}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Nova Tarefa
        </button>
      </div>
      <div className='flex flex-grow space-x-4 p-4'>
        {Object.keys(tasks).map((colunaId) => (
          <div
            key={colunaId}
            className='bg-gray-100 flex flex-col rounded w-1/4'
          >
            <div className='bg-blue-500 text-white p-4 text-center'>
              <h2 className='text-lg font-semibold capitalize'>{colunaId}</h2>
            </div>
            <div className='flex-grow p-4 overflow-y-auto'>
              {tasks[colunaId].map((tarefa) => (
                <div
                  key={tarefa.id}
                  className='bg-white p-4 mb-2 rounded shadow-md'
                >
                  <h3 className='text-sm font-semibold'>{tarefa.title}</h3>
                  <p className='text-sm'>{tarefa.description}</p>
                  <div className='flex justify-between items-center mt-4'>
                    <button
                      onClick={() => openModal(tarefa)}
                      className='text-blue-500 hover:text-blue-700'
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteTask(tarefa.id)}
                      className='text-red-500 hover:text-red-700'
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          editingTask={editingTask}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}

export default Tasks;
