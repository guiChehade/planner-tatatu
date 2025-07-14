import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus
} from 'lucide-react';

export const CalendarView = ({ tasks, onTaskCreate, onTaskUpdate, onTaskDelete }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day

  // Navegar entre meses
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Obter dias do mês atual
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Dias do mês anterior (para completar a primeira semana)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        tasks: getTasksForDate(prevDate)
      });
    }
    
    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        tasks: getTasksForDate(date)
      });
    }
    
    // Dias do próximo mês (para completar a última semana)
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        tasks: getTasksForDate(nextDate)
      });
    }
    
    return days;
  };

  // Obter tarefas para uma data específica
  const getTasksForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateString);
  };

  // Cores das categorias
  const getCategoryColor = (category) => {
    const colors = {
      'Trabalho': 'bg-blue-500',
      'Pessoal': 'bg-purple-500',
      'Saúde': 'bg-green-500',
      'Desenvolvimento': 'bg-orange-500',
      'Estudos': 'bg-yellow-500',
      'Casa': 'bg-pink-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const days = getDaysInMonth();
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Calendário</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView(view === 'month' ? 'week' : 'month')}
            className="dark:border-gray-600 dark:text-gray-300"
          >
            {view === 'month' ? 'Visão Semanal' : 'Visão Mensal'}
          </Button>
        </div>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <CalendarIcon className="w-5 h-5 mr-2" />
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(-1)}
                className="dark:border-gray-600 dark:text-gray-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
                className="dark:border-gray-600 dark:text-gray-300"
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(1)}
                className="dark:border-gray-600 dark:text-gray-300"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Grade do calendário */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isToday = day.date.toDateString() === new Date().toDateString();
              const hasEvents = day.tasks.length > 0;
              
              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors ${
                    day.isCurrentMonth 
                      ? 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' 
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                  } ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${
                      isToday ? 'text-indigo-600 dark:text-indigo-400' : 
                      day.isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                    }`}>
                      {day.date.getDate()}
                    </span>
                    {day.isCurrentMonth && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-5 h-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                        onClick={() => {
                          // Criar nova tarefa para esta data
                          const taskData = {
                            title: '',
                            description: '',
                            category: 'Pessoal',
                            priority: 'média',
                            dueDate: day.date.toISOString().split('T')[0]
                          };
                          onTaskCreate(taskData);
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Tarefas do dia */}
                  <div className="space-y-1">
                    {day.tasks.slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        className={`text-xs p-1 rounded truncate ${getCategoryColor(task.category)} text-white`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                    {day.tasks.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{day.tasks.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lista de tarefas do dia selecionado */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Tarefas de Hoje ({new Date().toLocaleDateString('pt-BR')})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const todayTasks = getTasksForDate(new Date());
            return todayTasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Nenhuma tarefa programada para hoje
              </p>
            ) : (
              <div className="space-y-3">
                {todayTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getCategoryColor(task.category)} text-white`}>
                        {task.category}
                      </Badge>
                      <Badge variant={task.priority === 'alta' ? 'destructive' : 'secondary'}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
};

