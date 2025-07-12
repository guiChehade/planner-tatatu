import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { Badge } from './components/ui/badge';
import { TaskForm } from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import { UserHeader } from './components/UserHeader';
import { AuthModal } from './components/AuthModal';
import { CalendarView } from './components/CalendarView';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { useRecurringTasks } from './hooks/useRecurringTasks';
import { useGoogleCalendar } from './hooks/useGoogleCalendar';
import { formatRecurrenceDescription } from './utils/recurrence';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  BarChart3, 
  Plus, 
  Edit2, 
  Trash2,
  Home,
  ListTodo,
  TrendingUp,
  Clock,
  Repeat
} from 'lucide-react';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const { 
    tasks, 
    loading: tasksLoading, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTaskComplete,
    getTaskStats 
  } = useTasks();

  // Hook para gerenciar tarefas recorrentes
  useRecurringTasks();

  // Hook para integração com Google Calendar
  const {
    isAuthorized: isGoogleAuthorized,
    authorize: authorizeGoogle,
    syncTasksToCalendar,
    loading: googleLoading,
    error: googleError,
    hasCredentials: hasGoogleCredentials
  } = useGoogleCalendar();

  // Filtrar tarefas baseado nos filtros ativos
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || task.category === categoryFilter;
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;
      const matchesStatus = !statusFilter || 
                           (statusFilter === 'completed' && task.completed) ||
                           (statusFilter === 'pending' && !task.completed);
      
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [tasks, searchTerm, categoryFilter, priorityFilter, statusFilter]);

  const stats = getTaskStats();

  const handleCreateTask = async (taskData) => {
    try {
      await addTask(taskData);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
      }
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await toggleTaskComplete(taskId, completed);
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
    }
  };

  // Função para sincronização com Google Calendar
  const handleGoogleCalendarSync = async () => {
    if (!hasGoogleCredentials) {
      alert('Configurações do Google Calendar não encontradas. Verifique as variáveis de ambiente REACT_APP_GOOGLE_API_KEY e REACT_APP_GOOGLE_CLIENT_ID.');
      return;
    }

    if (!isGoogleAuthorized) {
      try {
        await authorizeGoogle();
      } catch (error) {
        console.error('Erro na autorização:', error);
        alert('Erro ao autorizar acesso ao Google Calendar: ' + error.message);
      }
      return;
    }

    try {
      const tasksWithDates = tasks.filter(task => task.dueDate && !task.completed);
      const results = await syncTasksToCalendar(tasksWithDates);
      
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      alert(`Sincronização concluída!\n${successful} tarefas sincronizadas com sucesso.\n${failed} tarefas falharam.`);
    } catch (error) {
      console.error('Erro na sincronização:', error);
      alert('Erro ao sincronizar com Google Calendar: ' + error.message);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'média': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Trabalho': return 'bg-blue-100 text-blue-800';
      case 'Pessoal': return 'bg-purple-100 text-purple-800';
      case 'Saúde': return 'bg-green-100 text-green-800';
      case 'Desenvolvimento': return 'bg-orange-100 text-orange-800';
      case 'Estudos': return 'bg-indigo-100 text-indigo-800';
      case 'Casa': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar tela de boas-vindas
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ListTodo className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Planner Intuitivo
            </h1>
            <p className="text-gray-600 mb-8">
              Organize suas tarefas e alcance seus objetivos com facilidade
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Sincronização em tempo real</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Acesso de qualquer dispositivo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Backup automático na nuvem</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Totalmente gratuito</span>
                </div>
              </div>

              <Button 
                className="w-full mt-6" 
                onClick={() => setShowAuthModal(true)}
              >
                Começar Agora
              </Button>
            </CardContent>
          </Card>
        </div>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ListTodo className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Planner Intuitivo</h1>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === 'dashboard' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
              <Badge variant="secondary" className="ml-auto">
                {stats.total}
              </Badge>
            </button>

            <button
              onClick={() => setActiveSection('tasks')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === 'tasks' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ListTodo className="w-5 h-5" />
              <span>Tarefas</span>
              <Badge variant="secondary" className="ml-auto">
                {stats.pending}
              </Badge>
            </button>

            <button
              onClick={() => setActiveSection('calendar')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === 'calendar' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Calendário</span>
              <Badge variant="secondary" className="ml-auto">
                {stats.today}
              </Badge>
            </button>

            <button
              onClick={() => setActiveSection('stats')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === 'stats' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Estatísticas</span>
              <Badge variant="secondary" className="ml-auto">
                {stats.progress}%
              </Badge>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <UserHeader />

        <main className="flex-1 p-6">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Olá! Bem-vindo ao seu Planner
                  </h2>
                  <p className="text-gray-600">
                    Organize suas tarefas e alcance seus objetivos com facilidade
                  </p>
                </div>
                <Button onClick={() => setShowTaskForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </Button>
              </div>

              {/* Cards de estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tarefas Hoje</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.today}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.completed} concluídas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Progresso</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.progress}%</div>
                    <Progress value={stats.progress} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total</CardTitle>
                    <ListTodo className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.completed} concluídas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Próximas</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pending}</div>
                    <p className="text-xs text-muted-foreground">
                      tarefas pendentes
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de tarefas recentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ListTodo className="w-5 h-5" />
                    <span>Tarefas de Hoje</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Suas atividades programadas para hoje
                  </p>
                </CardHeader>
                <CardContent>
                  {tasksLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="text-center py-8">
                      <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Nenhuma tarefa criada ainda</p>
                      <Button onClick={() => setShowTaskForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Criar primeira tarefa
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.slice(0, 5).map(task => (
                        <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <button
                            onClick={() => handleToggleComplete(task.id, !task.completed)}
                            className="flex-shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              {task.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getCategoryColor(task.category)}>
                                {task.category}
                              </Badge>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              {task.recurrence && task.recurrence.type !== 'none' && (
                                <Badge variant="outline" className="text-xs">
                                  <Repeat className="w-3 h-3 mr-1" />
                                  {formatRecurrenceDescription(task.recurrence)}
                                </Badge>
                              )}
                              {task.isRecurringInstance && (
                                <Badge variant="secondary" className="text-xs">
                                  <Repeat className="w-3 h-3 mr-1" />
                                  Instância
                                </Badge>
                              )}
                              {task.dueDate && (
                                <span className="text-xs text-gray-500">
                                  {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {tasks.length > 5 && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setActiveSection('tasks')}
                        >
                          Ver todas as tarefas ({tasks.length})
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'tasks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Todas as Tarefas</h2>
                <Button onClick={() => setShowTaskForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </Button>
              </div>

              <TaskFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />

              {tasksLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredTasks.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      {tasks.length === 0 ? 'Nenhuma tarefa criada ainda' : 'Nenhuma tarefa encontrada com os filtros aplicados'}
                    </p>
                    <Button onClick={() => setShowTaskForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar nova tarefa
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map(task => (
                    <Card key={task.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => handleToggleComplete(task.id, !task.completed)}
                            className="flex-shrink-0 mt-1"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {task.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge className={getCategoryColor(task.category)}>
                                {task.category}
                              </Badge>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              {task.dueDate && (
                                <span className="text-xs text-gray-500">
                                  {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingTask(task);
                                setShowTaskForm(true);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'calendar' && (
            <CalendarView
              tasks={tasks}
              onTaskCreate={handleAddTask}
              onTaskUpdate={handleUpdateTask}
              onTaskDelete={handleDeleteTask}
              onGoogleCalendarSync={handleGoogleCalendarSync}
            />
          )}

          {activeSection === 'stats' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Estatísticas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Progresso Geral</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Concluídas</span>
                      <span className="font-medium">{stats.completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pendentes</span>
                      <span className="font-medium">{stats.pending}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span className="font-medium">{stats.total}</span>
                    </div>
                    <Progress value={stats.progress} className="mt-4" />
                    <p className="text-center text-sm text-gray-600">
                      {stats.progress}% concluído
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stats.categoryStats.map(category => (
                      <div key={category.category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{category.category}</span>
                          <span>{category.completed}/{category.total}</span>
                        </div>
                        <Progress value={category.progress} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          isOpen={showTaskForm}
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialData={editingTask}
        />
      )}
    </div>
  );
}

export default App;

