import React, { createContext, useContext, useState, useEffect } from 'react';

export const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const initialTasks = {
    pendente: [
      {
        id: '1',
        title: 'Tarefa 1',
        description: 'Descrição da Tarefa 1',
        image: 'https://via.placeholder.com/150',
        user: {
          id: 'user1',
          name: 'João Silva',
          avatar: 'https://via.placeholder.com/50',
        },
        status: 'pendente',
      },
      {
        id: '2',
        title: 'Tarefa 2',
        description: 'Descrição da Tarefa 2',
        image: 'https://via.placeholder.com/150',
        user: {
          id: 'user2',
          name: 'Maria Oliveira',
          avatar: 'https://via.placeholder.com/50',
        },
        status: 'pendente',
      },
    ],
    emProgresso: [
      {
        id: '3',
        title: 'Tarefa 3',
        description: 'Descrição da Tarefa 3',
        image: 'https://via.placeholder.com/150',
        user: {
          id: 'user3',
          name: 'Carlos Santos',
          avatar: 'https://via.placeholder.com/50',
        },
        status: 'emProgresso',
      },
    ],
    concluido: [
      {
        id: '4',
        title: 'Tarefa 4',
        description: 'Descrição da Tarefa 4',
        image: 'https://via.placeholder.com/150',
        user: {
          id: 'user4',
          name: 'Ana Costa',
          avatar: 'https://via.placeholder.com/50',
        },
        status: 'concluido',
      },
    ],
    cancelado: [
      {
        id: '5',
        title: 'Tarefa 5',
        description: 'Descrição da Tarefa 5',
        image: 'https://via.placeholder.com/150',
        user: {
          id: 'user5',
          name: 'José Ferreira',
          avatar: 'https://via.placeholder.com/50',
        },
        status: 'cancelado',
      },
    ],
  };

  const [tasks, setTasks] = useState(initialTasks);
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtual, setColunaAtual] = useState('');

  useEffect(() => {
    // fetchTasks(); // Descomente isso quando for integrar com a API real
  }, []);

  const handleOpenModal = (tarefa = null, coluna = null) => {
    setTarefaEditando(tarefa);
    setColunaAtual(coluna);
    setModalAberto(true);
  };

  const handleCloseModal = () => {
    setModalAberto(false);
    setTarefaEditando(null);
    setColunaAtual('');
  };

  const handleSaveTask = async (tarefa) => {
    const novaTarefa = { ...tarefa, status: colunaAtual };
    try {
      if (tarefa.id) {
        // Atualizar tarefa existente
        setTasks((prevTasks) => {
          const updatedTasks = { ...prevTasks };
          updatedTasks[colunaAtual] = updatedTasks[colunaAtual].map((t) =>
            t.id === tarefa.id ? novaTarefa : t
          );
          return updatedTasks;
        });
      } else {
        // Adicionar nova tarefa
        novaTarefa.id = Date.now().toString();
        setTasks((prevTasks) => {
          const updatedTasks = { ...prevTasks };
          updatedTasks[colunaAtual].push(novaTarefa);
          return updatedTasks;
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar a tarefa:', error);
    }
  };

  const handleDeleteTask = async (tarefaId) => {
    try {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[colunaAtual] = updatedTasks[colunaAtual].filter(
          (t) => t.id !== tarefaId
        );
        return updatedTasks;
      });
    } catch (error) {
      console.error('Erro ao excluir a tarefa:', error);
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceTasks = Array.from(tasks[source.droppableId]);
    const [removed] = sourceTasks.splice(source.index, 1);
    removed.status = destination.droppableId;

    const destinationTasks = Array.from(tasks[destination.droppableId]);
    destinationTasks.splice(destination.index, 0, removed);

    setTasks((prevTasks) => ({
      ...prevTasks,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destinationTasks,
    }));

    try {
      // Atualizar status na API se estiver conectado
      // await axios.put(`/task/${removed.id}`, { status: removed.status });
    } catch (error) {
      console.error('Erro ao mover a tarefa:', error);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        handleOpenModal,
        handleCloseModal,
        handleSaveTask,
        handleDeleteTask,
        handleDragEnd,
        modalAberto,
        tarefaEditando,
        colunaAtual,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
