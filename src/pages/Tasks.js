import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskModal from '../components/TaskModal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
    openModal(); // Abre o modal sem passar uma tarefa para edição
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
      <DragDropContext onDragEnd={handleSaveTask}>
        <div className='flex flex-grow space-x-4 p-4'>
          {Object.keys(tasks).map((colunaId) => (
            <Droppable key={colunaId} droppableId={colunaId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className='bg-gray-100 flex flex-col rounded w-1/4'
                >
                  <div className='bg-blue-500 text-white p-4 text-center'>
                    <h2 className='text-lg font-semibold capitalize'>
                      {colunaId}
                    </h2>
                  </div>
                  <div className='flex-grow p-4 overflow-y-auto'>
                    {tasks[colunaId].map((tarefa, index) => (
                      <Draggable
                        key={tarefa.id}
                        draggableId={tarefa.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className='bg-white p-4 mb-2 rounded shadow-md'
                            onClick={() => openModal(tarefa)}
                          >
                            <h3 className='text-sm font-semibold'>
                              {tarefa.title}
                            </h3>
                            <p className='text-sm'>{tarefa.description}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

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
