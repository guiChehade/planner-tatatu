import { useState, useMemo, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { TaskForm } from './TaskForm';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ExternalLink,
  RefreshCw,
  Settings
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Configurar moment para português
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

export const CalendarView = ({ 
  tasks = [], 
  onTaskCreate, 
  onTaskUpdate, 
  onTaskDelete,
  onGoogleCalendarRefreshCw 
}) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  // Converter tarefas para eventos do calendário
  const events = useMemo(() => {
    return tasks.map(task => {
      const startDate = task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt);
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1); // Duração padrão de 1 hora

      return {
        id: task.id,
        title: task.title,
        start: startDate,
        end: endDate,
        resource: task,
        allDay: !task.dueDate || !task.dueDate.includes('T'), // Se não tem horário específico, é dia inteiro
      };
    });
  }, [tasks]);

  // Cores para diferentes categorias
  const getCategoryColor = (category) => {
    const colors = {
      'Trabalho': '#3b82f6',
      'Pessoal': '#10b981',
      'Saúde': '#f59e0b',
      'Desenvolvimento': '#8b5cf6',
      'Estudos': '#ef4444',
      'Casa': '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  // Estilo personalizado para eventos
  const eventStyleGetter = useCallback((event) => {
    const task = event.resource;
    const backgroundColor = getCategoryColor(task.category);
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: task.completed ? 0.6 : 1,
        color: 'white',
        border: 'none',
        fontSize: '12px',
        textDecoration: task.completed ? 'line-through' : 'none'
      }
    };
  }, []);

  // Manipular seleção de evento
  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  // Manipular seleção de slot (data/horário vazio)
  const handleSelectSlot = useCallback(({ start, end }) => {
    setSelectedDate(start);
    setShowTaskForm(true);
  }, []);

  // Manipular criação de tarefa
  const handleTaskCreate = async (taskData) => {
    const newTask = {
      ...taskData,
      dueDate: selectedDate || taskData.dueDate,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await onTaskCreate(newTask);
    setShowTaskForm(false);
    setSelectedDate(null);
  };

  // Manipular atualização de tarefa
  const handleTaskUpdate = async (taskData) => {
    if (selectedEvent) {
      await onTaskUpdate(selectedEvent.resource.id, taskData);
      setSelectedEvent(null);
    }
  };

  // Manipular exclusão de tarefa
  const handleTaskDelete = async () => {
    if (selectedEvent) {
      await onTaskDelete(selectedEvent.resource.id);
      setSelectedEvent(null);
    }
  };

  // Componentes personalizados do calendário
  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('PREV')}
        >
          ←
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('TODAY')}
        >
          Hoje
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('NEXT')}
        >
          →
        </Button>
      </div>
      
      <h3 className="text-lg font-semibold">{label}</h3>
      
      <div className="flex items-center space-x-2">
        <Button
          variant={view === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onView('month')}
        >
          Mês
        </Button>
        <Button
          variant={view === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onView('week')}
        >
          Semana
        </Button>
        <Button
          variant={view === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onView('day')}
        >
          Dia
        </Button>
      </div>
    </div>
  );

  // Mensagens personalizadas em português
  const messages = {
    allDay: 'Dia inteiro',
    previous: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há eventos neste período',
    showMore: total => `+ ${total} mais`
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="w-6 h-6" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Calendário</h2>
            <p className="text-gray-600">Visualize suas tarefas em formato de calendário</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={onGoogleCalendarRefreshCw}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sincronizar Google Calendar</span>
          </Button>
          
          <Button
            onClick={() => setShowTaskForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Tarefa</span>
          </Button>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Tarefas</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Este Mês</p>
                <p className="text-2xl font-bold">
                  {tasks.filter(task => {
                    const taskDate = new Date(task.dueDate || task.createdAt);
                    const now = new Date();
                    return taskDate.getMonth() === now.getMonth() && 
                           taskDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <CalendarIcon className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold">
                  {tasks.filter(task => task.completed).length}
                </p>
              </div>
              <CalendarIcon className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold">
                  {tasks.filter(task => !task.completed).length}
                </p>
              </div>
              <CalendarIcon className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendário */}
      <Card>
        <CardContent className="p-6">
          <div style={{ height: '600px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              eventPropGetter={eventStyleGetter}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              messages={messages}
              components={{
                toolbar: CustomToolbar
              }}
              formats={{
                dayFormat: 'DD',
                dayHeaderFormat: 'dddd',
                monthHeaderFormat: 'MMMM YYYY',
                dayRangeHeaderFormat: ({ start, end }) => 
                  `${moment(start).format('DD MMM')} - ${moment(end).format('DD MMM YYYY')}`
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalhes da tarefa */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes da Tarefa</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedEvent.resource.title}</h3>
                <p className="text-gray-600">{selectedEvent.resource.description}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className={getCategoryColor(selectedEvent.resource.category)}>
                  {selectedEvent.resource.category}
                </Badge>
                <Badge variant="outline">
                  {selectedEvent.resource.priority}
                </Badge>
                {selectedEvent.resource.completed && (
                  <Badge variant="secondary">Concluída</Badge>
                )}
              </div>
              
              {selectedEvent.resource.dueDate && (
                <div>
                  <p className="text-sm text-gray-600">Data de vencimento:</p>
                  <p className="font-medium">
                    {format(new Date(selectedEvent.resource.dueDate), 'PPP', { locale: ptBR })}
                  </p>
                </div>
              )}
              
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTaskForm(true);
                    // Preparar para edição
                  }}
                  className="flex-1"
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleTaskDelete}
                  className="flex-1"
                >
                  Excluir
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de criação/edição de tarefa */}
      <TaskForm
        isOpen={showTaskForm}
        onClose={() => {
          setShowTaskForm(false);
          setSelectedDate(null);
        }}
        onSubmit={handleTaskCreate}
        initialData={selectedDate ? { dueDate: selectedDate } : null}
      />
    </div>
  );
};

