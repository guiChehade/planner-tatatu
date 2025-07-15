import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { Badge } from './components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { TaskForm } from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import { UserHeader } from './components/UserHeader';
import { AuthModal } from './components/AuthModal';
import { CalendarView } from './components/CalendarView';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
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
  Menu,
  X
} from 'lucide-react';
import './App.css';

function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      console.error('Erro ao alterar status da tarefa:', error);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Trabalho': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Pessoal': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Saúde': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Desenvolvimento': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Estudos': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Casa': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'alta': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'média': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'baixa': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  // Componente da Sidebar
  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <ListTodo className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Planner Intuitivo</h1>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <button
            onClick={() => {
              setActiveSection('dashboard');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeSection === 'dashboard' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
            <Badge variant="secondary" className="ml-auto">
              {stats.total}
            </Badge>
          </button>

          <button
            onClick={() => {
              setActiveSection('tasks');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeSection === 'tasks' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <ListTodo className="w-5 h-5" />
            <span>Tarefas</span>
            <Badge variant="secondary" className="ml-auto">
              {stats.pending}
            </Badge>
          </button>

          <button
            onClick={() => {
              setActiveSection('calendar');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeSection === 'calendar' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Calendário</span>
            <Badge variant="secondary" className="ml-auto">
              {stats.today}
            </Badge>
          </button>

          <button
            onClick={() => {
              setActiveSection('stats');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeSection === 'stats' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
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
  );

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ListTodo className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Planner Intuitivo</h1>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver logado, mostrar tela de login
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ListTodo className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Planner Intuitivo</h1>
              <p className="text-gray-600 dark:text-gray-400">O melhor app de planner gratuito</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Sincronização em tempo real</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Acesso de qualquer dispositivo</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Backup automático na nuvem</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Totalmente gratuito</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AuthModal isOpen={true} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 flex-col">
        <SidebarContent />
      </div>

      {/* Sidebar Mobile */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Mobile */}
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <ListTodo className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Planner</h1>
          </div>

          <Button 
            size="sm" 
            onClick={() => setShowTaskForm(true)}
            className="px-3"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <UserHeader />

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Olá! Bem-vindo ao seu Planner
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Organize suas tarefas e alcance seus objetivos com facilidade
                  </p>
                </div>
                <Button onClick={() => setShowTaskForm(true)} className="hidden lg:flex">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </Button>
              </div>

              {/* Cards de estatísticas */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hoje</CardTitle>
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
                    <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pending}</div>
                    <p className="text-xs text-muted-foreground">
                      tarefas restantes
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Suas atividades programadas para hoje
                  </p>
                </CardHeader>
                <CardContent>
                  {tasksLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                          <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="text-center py-8">
                      <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhuma tarefa criada ainda</p>
                      <Button onClick={() => setShowTaskForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Criar primeira tarefa
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.slice(0, 5).map(task => (
                        <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
                            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                              {task.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {task.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-1 flex-wrap gap-1">
                              <Badge className={getCategoryColor(task.category)}>
                                {task.category}
                              </Badge>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              {task.dueDate && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Todas as Tarefas</h2>
                <Button onClick={() => setShowTaskForm(true)} className="hidden lg:flex">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </Button>
              </div>

              <TaskFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
              />

              <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchTerm || categoryFilter || priorityFilter || statusFilter 
                          ? 'Nenhuma tarefa encontrada com os filtros aplicados'
                          : 'Nenhuma tarefa criada ainda'
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredTasks.map(task => (
                    <Card key={task.id}>
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 lg:space-x-4 flex-1 min-w-0">
                            <button
                              onClick={() => handleToggleComplete(task.id, !task.completed)}
                              className="flex-shrink-0 mt-1"
                            >
                              {task.completed ? (
                                <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                              ) : (
                                <Circle className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" />
                              )}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className={`text-base lg:text-lg font-medium mb-2 ${
                                task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'
                              }`}>
                                {task.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm lg:text-base">
                                {task.description}
                              </p>
                              
                              <div className="flex items-center space-x-2 mb-2 flex-wrap gap-1">
                                <Badge className={getCategoryColor(task.category)}>
                                  {task.category}
                                </Badge>
                                <Badge className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                              </div>
                              
                              {task.dueDate && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 lg:space-x-2 ml-2 lg:ml-4 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingTask(task);
                                setShowTaskForm(true);
                              }}
                              className="p-1 lg:p-2"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-red-600 hover:text-red-700 p-1 lg:p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {activeSection === 'calendar' && (
            <CalendarView
              tasks={tasks}
              onTaskCreate={handleCreateTask}
              onTaskUpdate={handleUpdateTask}
              onTaskDelete={handleDeleteTask}
            />
          )}

          {activeSection === 'stats' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Estatísticas</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Progresso Geral</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Concluídas</span>
                      <span className="font-medium">{stats.completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Pendentes</span>
                      <span className="font-medium">{stats.pending}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total</span>
                      <span className="font-medium">{stats.total}</span>
                    </div>
                    <Progress value={stats.progress} className="mt-4" />
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                      {stats.progress}% concluído
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(stats.byCategory || {}).map(([category, data]) => (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600 dark:text-gray-400">{category}</span>
                          <span className="text-sm font-medium">
                            {data.completed}/{data.total}
                          </span>
                        </div>
                        <Progress value={(data.completed / data.total) * 100} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal de Formulário de Tarefa */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

