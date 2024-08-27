import React from 'react';
import Modal from 'react-modal';
import TaskForm from './TaskForm';

Modal.setAppElement('#root'); // Necessário para acessibilidade

function TaskModal({ isOpen, onRequestClose, onSave, editingTask }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={editingTask ? 'Editar Tarefa' : 'Adicionar Tarefa'}
      className='bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-10'
    >
      <TaskForm onSave={onSave} editingTask={editingTask} />
      <button onClick={onRequestClose} className='mt-4 text-red-500'>
        Fechar
      </button>
    </Modal>
  );
}

export default TaskModal;
