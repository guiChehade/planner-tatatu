import { useEffect } from 'react';
import { useTasks } from './useTasks';
import { useAuth } from './useAuth';
import { 
  shouldCreateToday, 
  createRecurringInstance, 
  getNextOccurrence,
  RECURRENCE_TYPES 
} from '../utils/recurrence';
import { startOfDay, isToday } from 'date-fns';

export const useRecurringTasks = () => {
  const { tasks, addTask } = useTasks();
  const { user } = useAuth();

  // Função para processar tarefas recorrentes
  const processRecurringTasks = async () => {
    if (!user || !tasks.length) return;

    const today = new Date();
    const todayStart = startOfDay(today);

    // Filtrar tarefas que têm recorrência configurada
    const recurringTasks = tasks.filter(task => 
      task.recurrence && 
      task.recurrence.type !== RECURRENCE_TYPES.NONE &&
      !task.isRecurringInstance // Apenas tarefas originais, não instâncias
    );

    for (const task of recurringTasks) {
      try {
        // Verificar se já existe uma instância para hoje
        const existingInstanceToday = tasks.find(t => 
          t.parentTaskId === task.id && 
          t.dueDate && 
          isToday(new Date(t.dueDate))
        );

        if (existingInstanceToday) {
          continue; // Já existe uma instância para hoje
        }

        // Verificar se deve criar uma nova instância hoje
        if (shouldCreateToday(task, today)) {
          const nextOccurrence = getNextOccurrence(
            new Date(task.dueDate || task.createdAt), 
            task.recurrence
          );

          if (nextOccurrence && startOfDay(nextOccurrence).getTime() === todayStart.getTime()) {
            // Criar nova instância da tarefa
            const newInstance = createRecurringInstance(task, nextOccurrence);
            await addTask(newInstance);
            
            console.log(`Nova instância criada para tarefa recorrente: ${task.title}`);
          }
        }
      } catch (error) {
        console.error(`Erro ao processar tarefa recorrente ${task.id}:`, error);
      }
    }
  };

  // Função para limpar instâncias antigas (opcional)
  const cleanupOldInstances = async () => {
    if (!user || !tasks.length) return;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Encontrar instâncias antigas e concluídas
    const oldInstances = tasks.filter(task => 
      task.isRecurringInstance &&
      task.completed &&
      task.dueDate &&
      new Date(task.dueDate) < thirtyDaysAgo
    );

    // Aqui você pode implementar lógica para arquivar ou deletar instâncias antigas
    // Por enquanto, apenas logamos
    if (oldInstances.length > 0) {
      console.log(`Encontradas ${oldInstances.length} instâncias antigas para limpeza`);
    }
  };

  // Executar processamento quando as tarefas mudarem
  useEffect(() => {
    if (user && tasks.length > 0) {
      // Pequeno delay para evitar execução excessiva
      const timer = setTimeout(() => {
        processRecurringTasks();
        cleanupOldInstances();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user, tasks.length]);

  // Executar processamento diário
  useEffect(() => {
    if (!user) return;

    // Verificar a cada hora se há novas tarefas recorrentes para criar
    const interval = setInterval(() => {
      processRecurringTasks();
    }, 60 * 60 * 1000); // 1 hora

    return () => clearInterval(interval);
  }, [user]);

  return {
    processRecurringTasks,
    cleanupOldInstances
  };
};

