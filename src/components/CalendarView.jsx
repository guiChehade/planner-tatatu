import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Clock
} from 'lucide-react';

export const CalendarView = ({ tasks = [], onTaskCreate, onTaskUpdate, onTaskDelete }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  // Obter tarefas da data selecionada
  const selectedDateTasks = useMemo(() => {
    return getTasksForDate(selectedDate);
  }, [selectedDate, tasks]);

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
        <h2 className="text-2xl font-bold text-gray-900">Calendário</h2>
        <Button onClick={() => onTaskCreate && onTaskCreate({})}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(-1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Hoje
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(1)}
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
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grade do calendário */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const isToday = day.date.toDateString() === new Date().toDateString();
                  const isSelected = day.date.toDateString() === selectedDate.toDateString();
                  const hasEvents = day.tasks.length > 0;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day.date)}
                      className={`min-h-[80px] p-2 border border-gray-200 rounded-lg transition-all text-left ${
                        day.isCurrentMonth 
                          ? 'bg-white hover:bg-gray-50' 
                          : 'bg-gray-50 text-gray-400'
                      } ${isToday ? 'ring-2 ring-indigo-500' : ''} ${
                        isSelected ? 'bg-indigo-50 border-indigo-300' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${
                          isToday ? 'text-indigo-600' : 
                          day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {day.date.getDate()}
                        </span>
                        {hasEvents && (
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        )}
                      </div>
                      
                      {/* Tarefas do dia */}
                      <div className="space-y-1">
                        {day.tasks.slice(0, 2).map(task => (
                          <div
                            key={task.id}
                            className={`text-xs p-1 rounded truncate ${getCategoryColor(task.category)} text-white`}
                            title={task.title}
                          >
                            {task.title}
                          </div>
                        ))}
                        {day.tasks.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{day.tasks.length - 2} mais
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel lateral com tarefas do dia selecionado */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Tarefas do Dia
              </CardTitle>
              <p className="text-sm text-gray-600">
                {selectedDate.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </CardHeader>
            <CardContent>
              {selectedDateTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    Nenhuma tarefa para este dia
                  </p>
                  <Button 
                    size="sm" 
                    onClick={() => onTaskCreate && onTaskCreate({
                      dueDate: selectedDate.toISOString().split('T')[0]
                    })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Tarefa
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateTasks.map(task => (
                    <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={`${getCategoryColor(task.category)} text-white text-xs`}>
                              {task.category}
                            </Badge>
                            <Badge variant={task.priority === 'alta' ? 'destructive' : 'secondary'} className="text-xs">
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onTaskCreate && onTaskCreate({
                      dueDate: selectedDate.toISOString().split('T')[0]
                    })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Tarefa
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

