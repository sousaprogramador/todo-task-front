import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskModal from '../components/TaskModal';
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
    colunaAtual,
  } = useTasks();

  const colunaTitulos = {
    pendente: 'Pendente',
    emProgresso: 'Em Progresso',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .join('');
  };

  return (
    <div className='flex flex-col h-screen'>
      <DragDropContext onDragEnd={handleDragEnd}>
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
                    <h2 className='text-lg font-semibold'>
                      {colunaTitulos[colunaId]}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal(tarefa, colunaId);
                            }}
                          >
                            <div className='flex justify-between items-start'>
                              <h3 className='text-sm font-semibold'>
                                {tarefa.title}
                              </h3>
                              <div className='flex flex-col items-center ml-2'>
                                {tarefa.user.avatar ? (
                                  <img
                                    src={tarefa.user.avatar}
                                    alt={tarefa.user.name}
                                    className='w-8 h-8 rounded-full ml-auto'
                                  />
                                ) : (
                                  <div className='w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center ml-auto'>
                                    {getInitials(tarefa.user.name)}
                                  </div>
                                )}
                                <span className='mt-1 text-xs text-gray-700'>
                                  {tarefa.user.name}
                                </span>
                              </div>
                            </div>
                            <p className='text-sm'>{tarefa.description}</p>
                            {tarefa.image && (
                              <img
                                src={tarefa.image}
                                alt='Imagem da tarefa'
                                className='w-full h-32 object-cover mt-2 rounded'
                              />
                            )}
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

      <TaskModal
        isOpen={modalAberto}
        onRequestClose={handleCloseModal}
        onSave={handleSaveTask}
        editingTask={tarefaEditando}
        colunaAtual={colunaAtual}
      />
    </div>
  );
}

export default Tasks;
