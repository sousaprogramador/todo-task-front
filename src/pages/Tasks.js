import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskModal from '../components/TaskModal';

const tarefasIniciais = {
  pendente: [
    {
      id: '1',
      title: 'Tarefa 1',
      description: 'Descrição da Tarefa 1',
      image: 'https://via.placeholder.com/150',
      userId: '123',
      status: 'pendente',
    },
    {
      id: '2',
      title: 'Tarefa 2',
      description: 'Descrição da Tarefa 2',
      image: 'https://via.placeholder.com/150',
      userId: '124',
      status: 'pendente',
    },
  ],
  emProgresso: [
    {
      id: '3',
      title: 'Tarefa 3',
      description: 'Descrição da Tarefa 3',
      image: 'https://via.placeholder.com/150',
      userId: '125',
      status: 'emProgresso',
    },
  ],
  concluido: [
    {
      id: '4',
      title: 'Tarefa 4',
      description: 'Descrição da Tarefa 4',
      image: 'https://via.placeholder.com/150',
      userId: '126',
      status: 'concluido',
    },
  ],
  cancelado: [],
};

function Tasks() {
  const [tarefas, setTarefas] = useState(tarefasIniciais);
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtual, setColunaAtual] = useState(null);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const colunaOrigem = source.droppableId;
    const colunaDestino = destination.droppableId;
    const tarefasOrigem = Array.from(tarefas[colunaOrigem]);
    const tarefasDestino = Array.from(tarefas[colunaDestino]);
    const [tarefaMovida] = tarefasOrigem.splice(source.index, 1);

    tarefaMovida.status = colunaDestino; // Atualiza o status da tarefa

    tarefasDestino.splice(destination.index, 0, tarefaMovida);

    setTarefas({
      ...tarefas,
      [colunaOrigem]: tarefasOrigem,
      [colunaDestino]: tarefasDestino,
    });
  };

  const handleAbrirModal = (tarefa = null, colunaId = null) => {
    if (tarefa) {
      setTarefaEditando(tarefa);
    } else {
      setTarefaEditando(null);
    }
    setColunaAtual(colunaId);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setTarefaEditando(null);
    setColunaAtual(null);
    setModalAberto(false);
  };

  const handleSalvar = (novaTarefa) => {
    if (tarefaEditando) {
      const tarefasAtualizadas = {
        ...tarefas,
        [colunaAtual]: tarefas[colunaAtual].map((tarefa) =>
          tarefa.id === tarefaEditando.id
            ? { ...novaTarefa, status: colunaAtual }
            : tarefa
        ),
      };
      setTarefas(tarefasAtualizadas);
    } else if (colunaAtual) {
      const tarefasAtualizadas = {
        ...tarefas,
        [colunaAtual]: [
          ...tarefas[colunaAtual],
          { ...novaTarefa, id: `${Date.now()}`, status: colunaAtual },
        ],
      };
      setTarefas(tarefasAtualizadas);
    }
    handleFecharModal();
  };

  const handleDeletar = (colunaId, tarefaId) => {
    const tarefasAtualizadas = {
      ...tarefas,
      [colunaId]: tarefas[colunaId].filter((tarefa) => tarefa.id !== tarefaId),
    };
    setTarefas(tarefasAtualizadas);
  };

  return (
    <div className='flex flex-col space-y-4'>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className='flex space-x-4'>
          {Object.keys(tarefas).map((colunaId) => (
            <Droppable key={colunaId} droppableId={colunaId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className='bg-gray-100 p-4 rounded w-1/4 cursor-pointer'
                  onClick={() => handleAbrirModal(null, colunaId)}
                >
                  <h2 className='text-lg font-semibold mb-2 capitalize'>
                    {colunaId}
                  </h2>
                  {tarefas[colunaId].map((tarefa, index) => (
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
                          <div className='mt-2 flex justify-between'>
                            <button
                              onClick={() => handleAbrirModal(tarefa, colunaId)}
                              className='text-blue-500'
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeletar(colunaId, tarefa.id)}
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
        isOpen={modalAberto}
        onRequestClose={handleFecharModal}
        onSave={handleSalvar}
        editingTask={tarefaEditando}
      />
    </div>
  );
}

export default Tasks;
