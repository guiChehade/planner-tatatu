import { addDays, addWeeks, addMonths, addYears, format, isAfter, isBefore, startOfDay } from 'date-fns';

// Tipos de recorrência
export const RECURRENCE_TYPES = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  CUSTOM: 'custom'
};

// Padrões de recorrência
export const RECURRENCE_PATTERNS = {
  DAILY: {
    label: 'Diariamente',
    value: 'daily',
    description: 'Repete todos os dias'
  },
  WEEKLY: {
    label: 'Semanalmente',
    value: 'weekly',
    description: 'Repete toda semana'
  },
  MONTHLY: {
    label: 'Mensalmente',
    value: 'monthly',
    description: 'Repete todo mês'
  },
  YEARLY: {
    label: 'Anualmente',
    value: 'yearly',
    description: 'Repete todo ano'
  },
  WEEKDAYS: {
    label: 'Dias úteis',
    value: 'weekdays',
    description: 'Repete de segunda a sexta'
  },
  CUSTOM: {
    label: 'Personalizado',
    value: 'custom',
    description: 'Configuração personalizada'
  }
};

// Dias da semana
export const WEEKDAYS = [
  { value: 0, label: 'Domingo', short: 'Dom' },
  { value: 1, label: 'Segunda', short: 'Seg' },
  { value: 2, label: 'Terça', short: 'Ter' },
  { value: 3, label: 'Quarta', short: 'Qua' },
  { value: 4, label: 'Quinta', short: 'Qui' },
  { value: 5, label: 'Sexta', short: 'Sex' },
  { value: 6, label: 'Sábado', short: 'Sáb' }
];

/**
 * Calcula a próxima data de ocorrência baseada na configuração de recorrência
 * @param {Date} currentDate - Data atual da tarefa
 * @param {Object} recurrenceConfig - Configuração de recorrência
 * @returns {Date|null} - Próxima data ou null se não há recorrência
 */
export const getNextOccurrence = (currentDate, recurrenceConfig) => {
  if (!recurrenceConfig || recurrenceConfig.type === RECURRENCE_TYPES.NONE) {
    return null;
  }

  const { type, interval = 1, daysOfWeek = [], endDate } = recurrenceConfig;
  let nextDate = new Date(currentDate);

  switch (type) {
    case RECURRENCE_TYPES.DAILY:
      nextDate = addDays(nextDate, interval);
      break;

    case RECURRENCE_TYPES.WEEKLY:
      nextDate = addWeeks(nextDate, interval);
      break;

    case RECURRENCE_TYPES.MONTHLY:
      nextDate = addMonths(nextDate, interval);
      break;

    case RECURRENCE_TYPES.YEARLY:
      nextDate = addYears(nextDate, interval);
      break;

    case 'weekdays':
      // Próximo dia útil
      nextDate = addDays(nextDate, 1);
      while (nextDate.getDay() === 0 || nextDate.getDay() === 6) {
        nextDate = addDays(nextDate, 1);
      }
      break;

    case RECURRENCE_TYPES.CUSTOM:
      if (daysOfWeek && daysOfWeek.length > 0) {
        // Encontrar o próximo dia da semana especificado
        nextDate = addDays(nextDate, 1);
        while (!daysOfWeek.includes(nextDate.getDay())) {
          nextDate = addDays(nextDate, 1);
        }
      } else {
        nextDate = addDays(nextDate, interval);
      }
      break;

    default:
      return null;
  }

  // Verificar se a próxima data não ultrapassa a data de fim
  if (endDate && isAfter(nextDate, new Date(endDate))) {
    return null;
  }

  return nextDate;
};

/**
 * Gera uma lista de ocorrências futuras para uma tarefa recorrente
 * @param {Date} startDate - Data de início
 * @param {Object} recurrenceConfig - Configuração de recorrência
 * @param {number} maxOccurrences - Número máximo de ocorrências a gerar
 * @returns {Array<Date>} - Lista de datas futuras
 */
export const generateOccurrences = (startDate, recurrenceConfig, maxOccurrences = 10) => {
  const occurrences = [];
  let currentDate = new Date(startDate);
  let count = 0;

  while (count < maxOccurrences) {
    const nextDate = getNextOccurrence(currentDate, recurrenceConfig);
    
    if (!nextDate) break;
    
    occurrences.push(new Date(nextDate));
    currentDate = nextDate;
    count++;
  }

  return occurrences;
};

/**
 * Verifica se uma tarefa deve ser criada hoje baseada na recorrência
 * @param {Object} task - Tarefa com configuração de recorrência
 * @param {Date} today - Data de hoje
 * @returns {boolean} - Se deve criar uma nova instância hoje
 */
export const shouldCreateToday = (task, today = new Date()) => {
  if (!task.recurrence || task.recurrence.type === RECURRENCE_TYPES.NONE) {
    return false;
  }

  const taskDate = new Date(task.dueDate || task.createdAt);
  const todayStart = startOfDay(today);
  const taskStart = startOfDay(taskDate);

  // Se a tarefa é para hoje ou no passado, verificar recorrência
  if (isAfter(todayStart, taskStart) || todayStart.getTime() === taskStart.getTime()) {
    const nextOccurrence = getNextOccurrence(taskDate, task.recurrence);
    
    if (nextOccurrence) {
      const nextStart = startOfDay(nextOccurrence);
      return nextStart.getTime() === todayStart.getTime();
    }
  }

  return false;
};

/**
 * Cria uma nova instância de uma tarefa recorrente
 * @param {Object} originalTask - Tarefa original
 * @param {Date} newDate - Nova data para a instância
 * @returns {Object} - Nova tarefa
 */
export const createRecurringInstance = (originalTask, newDate) => {
  return {
    ...originalTask,
    id: undefined, // Será gerado um novo ID
    dueDate: newDate,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    parentTaskId: originalTask.id, // Referência à tarefa original
    isRecurringInstance: true
  };
};

/**
 * Formata a descrição da recorrência para exibição
 * @param {Object} recurrenceConfig - Configuração de recorrência
 * @returns {string} - Descrição formatada
 */
export const formatRecurrenceDescription = (recurrenceConfig) => {
  if (!recurrenceConfig || recurrenceConfig.type === RECURRENCE_TYPES.NONE) {
    return 'Não se repete';
  }

  const { type, interval = 1, daysOfWeek = [], endDate } = recurrenceConfig;

  let description = '';

  switch (type) {
    case RECURRENCE_TYPES.DAILY:
      description = interval === 1 ? 'Diariamente' : `A cada ${interval} dias`;
      break;

    case RECURRENCE_TYPES.WEEKLY:
      description = interval === 1 ? 'Semanalmente' : `A cada ${interval} semanas`;
      break;

    case RECURRENCE_TYPES.MONTHLY:
      description = interval === 1 ? 'Mensalmente' : `A cada ${interval} meses`;
      break;

    case RECURRENCE_TYPES.YEARLY:
      description = interval === 1 ? 'Anualmente' : `A cada ${interval} anos`;
      break;

    case 'weekdays':
      description = 'Dias úteis (Seg-Sex)';
      break;

    case RECURRENCE_TYPES.CUSTOM:
      if (daysOfWeek && daysOfWeek.length > 0) {
        const dayNames = daysOfWeek.map(day => WEEKDAYS[day].short).join(', ');
        description = `Toda ${dayNames}`;
      } else {
        description = `A cada ${interval} dias`;
      }
      break;

    default:
      description = 'Configuração personalizada';
  }

  if (endDate) {
    description += ` até ${format(new Date(endDate), 'dd/MM/yyyy')}`;
  }

  return description;
};

/**
 * Valida uma configuração de recorrência
 * @param {Object} recurrenceConfig - Configuração a validar
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateRecurrence = (recurrenceConfig) => {
  const errors = [];

  if (!recurrenceConfig) {
    return { isValid: true, errors: [] };
  }

  const { type, interval, daysOfWeek, endDate } = recurrenceConfig;

  // Validar tipo
  if (!Object.values(RECURRENCE_TYPES).includes(type) && type !== 'weekdays') {
    errors.push('Tipo de recorrência inválido');
  }

  // Validar intervalo
  if (interval && (interval < 1 || interval > 365)) {
    errors.push('Intervalo deve ser entre 1 e 365');
  }

  // Validar dias da semana para recorrência personalizada
  if (type === RECURRENCE_TYPES.CUSTOM && daysOfWeek) {
    if (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0) {
      errors.push('Selecione pelo menos um dia da semana');
    }
    
    const invalidDays = daysOfWeek.filter(day => day < 0 || day > 6);
    if (invalidDays.length > 0) {
      errors.push('Dias da semana inválidos');
    }
  }

  // Validar data de fim
  if (endDate && isBefore(new Date(endDate), new Date())) {
    errors.push('Data de fim deve ser no futuro');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

