import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskModal from '../components/TaskModal';

const initialTasks = {
  pending: [
    { id: '1', content: 'Tarefa 1' },
    { id: '2', content: 'Tarefa 2' },
  ],
  inProgress: [{ id: '3', content: 'Tarefa 3' }],
  completed: [{ id: '4', content: 'Tarefa 4' }],
  cancelled: [],
};

function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [creatingTask, setCreatingTask] = useState(false);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;
    const sourceTasks = Array.from(tasks[sourceCol]);
    const destTasks = Array.from(tasks[destCol]);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    destTasks.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [sourceCol]: sourceTasks,
      [destCol]: destTasks,
    });
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
    } else {
      setCreatingTask(true);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
    setCreatingTask(false);
    setIsModalOpen(false);
  };

  const handleSave = (newTask) => {
    if (editingTask) {
      const updatedTasks = {
        ...tasks,
        [editingTask.columnId]: tasks[editingTask.columnId].map((task) =>
          task.id === editingTask.id ? { ...task, content: newTask } : task
        ),
      };
      setTasks(updatedTasks);
    } else if (creatingTask) {
      const updatedTasks = {
        ...tasks,
        pending: [...tasks.pending, { id: `${Date.now()}`, content: newTask }],
      };
      setTasks(updatedTasks);
    }
    handleCloseModal();
  };

  const handleDelete = (colId, taskId) => {
    const updatedTasks = {
      ...tasks,
      [colId]: tasks[colId].filter((task) => task.id !== taskId),
    };
    setTasks(updatedTasks);
  };

  return (
    <div className='flex flex-col space-y-4'>
      <button
        onClick={() => handleOpenModal()}
        className='bg-blue-500 text-white px-4 py-2 rounded mb-4'
      >
        Adicionar Nova Tarefa
      </button>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className='flex space-x-4'>
          {Object.keys(tasks).map((colId) => (
            <Droppable key={colId} droppableId={colId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className='bg-gray-100 p-4 rounded w-1/4'
                >
                  <h2 className='text-lg font-semibold mb-2 capitalize'>
                    {colId}
                  </h2>
                  {tasks[colId].map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className='bg-white p-4 mb-2 rounded shadow-md'
                        >
                          <p className='text-sm'>{task.content}</p>
                          <div className='mt-2 flex justify-between'>
                            <button
                              onClick={() =>
                                handleOpenModal({ ...task, columnId: colId })
                              }
                              className='text-blue-500'
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(colId, task.id)}
                              className='text-red-500'
                            >
                              Remover
                            </button>
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
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        onSave={handleSave}
        editingTask={editingTask}
      />
    </div>
  );
}

export default Tasks;
