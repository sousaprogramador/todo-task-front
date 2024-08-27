import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskForm from '../components/TaskForm';
import TaskColumn from '../components/TaskColumn';

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (text, status) => {
    setTasks([...tasks, { text, status }]);
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].status = newStatus;
    setTasks(updatedTasks);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;

    const [sourceStatusKey] = sourceStatus.split('-');
    const [destinationStatusKey] = destinationStatus.split('-');

    const draggedTaskIndex = tasks.findIndex(
      (task) => `${task.status}-${tasks.indexOf(task)}` === draggableId
    );
    const draggedTask = tasks[draggedTaskIndex];

    const updatedTasks = tasks.filter((task) => task !== draggedTask);

    if (sourceStatusKey !== destinationStatusKey) {
      draggedTask.status = destinationStatusKey;
    }

    updatedTasks.splice(destination.index, 0, draggedTask);
    setTasks(updatedTasks);
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    (acc[task.status] = acc[task.status] || []).push(task);
    return acc;
  }, {});

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <h1 className='text-3xl font-bold mb-6 text-gray-900'>
        Lista de Tarefas
      </h1>
      <div className='max-w-7xl mx-auto'>
        {/* Formulário ocupa toda a largura disponível */}
        <div className='w-full mb-6'>
          <TaskForm onAddTask={handleAddTask} />
        </div>
        {/* Alinhamento das colunas com flexbox */}
        <div className='flex gap-6 overflow-x-auto'>
          <DragDropContext onDragEnd={onDragEnd}>
            {['pending', 'in-progress', 'completed', 'cancelled'].map(
              (statusKey) => (
                <TaskColumn
                  key={statusKey}
                  status={statusKey}
                  tasks={groupedTasks[statusKey] || []}
                  onStatusChange={handleStatusChange}
                />
              )
            )}
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default Tasks;
