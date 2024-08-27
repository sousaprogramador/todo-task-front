import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';

function TaskColumn({ status, tasks }) {
  const columnTitles = {
    pending: 'Pendentes',
    'in-progress': 'Em Progresso',
    completed: 'Concluídas',
    cancelled: 'Canceladas',
  };

  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          className='bg-gray-200 p-4 rounded-lg min-w-[250px] flex-grow'
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h2 className='text-xl font-semibold mb-4'>{columnTitles[status]}</h2>
          {tasks.map((task, index) => (
            <Task key={`${task.text}-${index}`} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default TaskColumn;
