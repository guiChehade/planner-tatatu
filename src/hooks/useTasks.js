import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

export const useTasks = (userId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured() || !userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Query para buscar apenas as tarefas do usuário atual
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        tasksQuery,
        (snapshot) => {
          const tasksData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Converter timestamps para strings se necessário
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
            updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
            completedAt: doc.data().completedAt?.toDate?.()?.toISOString() || doc.data().completedAt
          }));
          
          setTasks(tasksData);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('Erro ao carregar tarefas:', error);
          setError('Erro ao carregar tarefas. Verifique sua conexão.');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Erro ao configurar listener de tarefas:', error);
      setError('Erro ao configurar sincronização de tarefas.');
      setLoading(false);
    }
  }, [userId]);

  const addTask = async (taskData) => {
    if (!isFirebaseConfigured() || !userId) {
      throw new Error('Firebase não configurado ou usuário não autenticado');
    }

    try {
      const newTask = {
        ...taskData,
        userId, // Garantir que a tarefa pertence ao usuário atual
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      throw new Error('Erro ao adicionar tarefa. Tente novamente.');
    }
  };

  const updateTask = async (taskId, updates) => {
    if (!isFirebaseConfigured() || !userId) {
      throw new Error('Firebase não configurado ou usuário não autenticado');
    }

    try {
      const taskRef = doc(db, 'tasks', taskId);
      
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(taskRef, updateData);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw new Error('Erro ao atualizar tarefa. Tente novamente.');
    }
  };

  const deleteTask = async (taskId) => {
    if (!isFirebaseConfigured() || !userId) {
      throw new Error('Firebase não configurado ou usuário não autenticado');
    }

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      throw new Error('Erro ao excluir tarefa. Tente novamente.');
    }
  };

  const toggleTaskComplete = async (taskId) => {
    if (!isFirebaseConfigured() || !userId) {
      throw new Error('Firebase não configurado ou usuário não autenticado');
    }

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Tarefa não encontrada');
      }

      const taskRef = doc(db, 'tasks', taskId);
      
      const updateData = {
        completed: !task.completed,
        updatedAt: serverTimestamp()
      };

      // Se estiver marcando como concluída, adicionar timestamp
      if (!task.completed) {
        updateData.completedAt = serverTimestamp();
      } else {
        // Se estiver desmarcando, remover timestamp de conclusão
        updateData.completedAt = null;
      }

      await updateDoc(taskRef, updateData);
    } catch (error) {
      console.error('Erro ao alterar status da tarefa:', error);
      throw new Error('Erro ao alterar status da tarefa. Tente novamente.');
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const byCategory = tasks.reduce((acc, task) => {
      acc[task.category] = acc[task.category] || { total: 0, completed: 0 };
      acc[task.category].total++;
      if (task.completed) acc[task.category].completed++;
      return acc;
    }, {});

    const byPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = acc[task.priority] || { total: 0, completed: 0 };
      acc[task.priority].total++;
      if (task.completed) acc[task.priority].completed++;
      return acc;
    }, {});

    return { 
      total, 
      completed, 
      pending, 
      progress, 
      byCategory, 
      byPriority 
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
    getTaskStats,
    isConfigured: isFirebaseConfigured()
  };
};

