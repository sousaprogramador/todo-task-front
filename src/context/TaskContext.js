import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

export const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState({
    pendente: [],
    emProgresso: [],
    concluido: [],
    cancelado: [],
  });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    const token = localStorage.getItem('authToken');

    try {
      const response = await api.get('/task', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedTasks = response.data;

      const groupedTasks = {
        pendente: [],
        emProgresso: [],
        concluido: [],
        cancelado: [],
      };

      fetchedTasks.forEach((task) => {
        groupedTasks[task.status].push(task);
      });

      setTasks(groupedTasks);
    } catch (error) {
      console.error('Erro ao carregar as tarefas:', error);
    }
  };

  const handleSaveTask = async (taskData) => {
    const token = localStorage.getItem('authToken');
    console.log('handleSaveTask', taskData);
    try {
      if (taskData.id) {
        await api.put(`/task/${taskData.id}`, taskData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        const response = await api.post('/task', taskData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const newTask = response.data;

        setTasks((prevTasks) => ({
          ...prevTasks,
          [newTask.status]: [...prevTasks[newTask.status], newTask],
        }));
      }
      fetchTasks();
    } catch (error) {
      console.error('Erro ao salvar a tarefa:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('authToken');
    try {
      await api.delete(`/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Erro ao excluir a tarefa:', error);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        handleSaveTask,
        handleDeleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
