import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

function Task({ task, index }) {
  return (
    <Draggable draggableId={`${task.status}-${index}`} index={index}>
      {(provided) => (
        <div
          className='bg-white p-4 mb-2 rounded shadow'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {task.text}
        </div>
      )}
    </Draggable>
  );
}

export default Task;
