import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp
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
    
    // Criar query para buscar tarefas do usuário atual
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    // Listener em tempo real
    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Converter timestamps para Date objects
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
          dueDate: doc.data().dueDate?.toDate()
        }));
        
        setTasks(tasksData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Erro ao buscar tarefas:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addTask = async (taskData) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const newTask = {
        ...taskData,
        userId: user.uid,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Converter dueDate para Timestamp se fornecido
        dueDate: taskData.dueDate ? Timestamp.fromDate(new Date(taskData.dueDate)) : null
      };

      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      setError(error.message);
      throw error;
    }
  };

  const updateTask = async (taskId, updates) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const taskRef = doc(db, 'tasks', taskId);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      // Converter dueDate para Timestamp se fornecido
      if (updates.dueDate) {
        updateData.dueDate = Timestamp.fromDate(new Date(updates.dueDate));
      }

      await updateDoc(taskRef, updateData);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      setError(error.message);
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      setError(error.message);
      throw error;
    }
  };

  const toggleTaskComplete = async (taskId, completed) => {
    await updateTask(taskId, { completed });
  };

  // Funções de filtro e estatísticas
  const getTasksByCategory = (category) => {
    return tasks.filter(task => task.category === category);
  };

  const getTasksByPriority = (priority) => {
    return tasks.filter(task => task.priority === priority);
  };

  const getCompletedTasks = () => {
    return tasks.filter(task => task.completed);
  };

  const getPendingTasks = () => {
    return tasks.filter(task => !task.completed);
  };

  const getTodayTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate >= today && taskDate < tomorrow;
    });
  };

  const getOverdueTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate < today;
    });
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = getCompletedTasks().length;
    const pending = getPendingTasks().length;
    const today = getTodayTasks().length;
    const overdue = getOverdueTasks().length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Estatísticas por categoria
    const categories = ['Trabalho', 'Pessoal', 'Saúde', 'Desenvolvimento', 'Estudos', 'Casa'];
    const categoryStats = categories.map(category => {
      const categoryTasks = getTasksByCategory(category);
      const categoryCompleted = categoryTasks.filter(task => task.completed).length;
      const categoryTotal = categoryTasks.length;
      
      return {
        category,
        completed: categoryCompleted,
        total: categoryTotal,
        progress: categoryTotal > 0 ? Math.round((categoryCompleted / categoryTotal) * 100) : 0
      };
    });

    return {
      total,
      completed,
      pending,
      today,
      overdue,
      progress,
      categoryStats
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
    getTasksByCategory,
    getTasksByPriority,
    getCompletedTasks,
    getPendingTasks,
    getTodayTasks,
    getOverdueTasks,
    getTaskStats
  };
};

