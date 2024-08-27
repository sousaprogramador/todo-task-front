import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskForm from '../components/TaskForm';
import TaskColumn from '../components/TaskColumn';

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (text, status) => {
    setTasks([...tasks, { text, status }]);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;

    const updatedTasks = tasks.map((task) => {
      if (`${task.status}-${tasks.indexOf(task)}` === draggableId) {
        return { ...task, status: destinationStatus };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    (acc[task.status] = acc[task.status] || []).push(task);
    return acc;
  }, {});

  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-grow p-6'>
        <h1 className='text-3xl font-bold mb-6 text-gray-900'>
          Lista de Tarefas
        </h1>
        <div className='max-w-7xl mx-auto'>
          <div className='w-full mb-6'>
            <TaskForm onAddTask={handleAddTask} />
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className='flex gap-6 overflow-x-auto'>
              {['pending', 'in-progress', 'completed', 'cancelled'].map(
                (statusKey) => (
                  <TaskColumn
                    key={statusKey}
                    status={statusKey}
                    tasks={groupedTasks[statusKey] || []}
                  />
                )
              )}
            </div>
          </DragDropContext>
        </div>
      </main>
    </div>
  );
}

export default Tasks;
