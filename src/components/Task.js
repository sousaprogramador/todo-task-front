import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskModal from './TaskModal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Tasks() {
  const {
    tasks,
    handleOpenModal,
    handleDragEnd,
    modalAberto,
    handleCloseModal,
    handleSaveTask,
    tarefaEditando,
  } = useTasks();

  return (
    <div className='flex flex-col space-y-4'>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className='flex space-x-4'>
          {Object.keys(tasks).map((colunaId) => (
            <Droppable key={colunaId} droppableId={colunaId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className='bg-gray-100 p-4 rounded w-1/4 cursor-pointer'
                  onClick={() => handleOpenModal(null, colunaId)}
                >
                  <h2 className='text-lg font-semibold mb-2 capitalize'>
                    {colunaId}
                  </h2>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(tarefa, colunaId);
                          }}
                        >
                          <h3 className='text-sm font-semibold'>
                            {tarefa.title}
                          </h3>
                          <p className='text-sm'>{tarefa.description}</p>
                          {tarefa.image && (
                            <img
                              src={tarefa.image}
                              alt='Imagem da tarefa'
                              className='w-full h-32 object-cover mt-2 rounded'
                            />
                          )}
                          <div className='text-xs text-gray-500 mt-2'>
                            User ID: {tarefa.userId}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={modalAberto}
        onRequestClose={handleCloseModal}
        onSave={handleSaveTask}
        editingTask={tarefaEditando}
      />
    </div>
  );
}

export default Tasks;
