import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        }));
        
        setTasks(tasksData);
        setLoading(false);
        setError(null);
      }, (error) => {
        console.error('Erro ao carregar tarefas:', error);
        setError(error.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Erro ao configurar listener:', error);
      setError(error.message);
      setLoading(false);
    }
  }, [user]);

  const addTask = async (taskData) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const newTask = {
        ...taskData,
        userId: user.uid,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'tasks'), newTask);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  };

  const updateTask = async (taskId, updates) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      throw error;
    }
  };

  const toggleTaskComplete = async (taskId, completed) => {
    await updateTask(taskId, { completed });
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Tarefas de hoje
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => task.dueDate === today);
    
    // Por categoria
    const byCategory = {};
    tasks.forEach(task => {
      if (!byCategory[task.category]) {
        byCategory[task.category] = { total: 0, completed: 0 };
      }
      byCategory[task.category].total++;
      if (task.completed) {
        byCategory[task.category].completed++;
      }
    });

    return {
      total,
      completed,
      pending,
      progress,
      today: todayTasks.length,
      byCategory
    };
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    getTaskStats
  };
};

