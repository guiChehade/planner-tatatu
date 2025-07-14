import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { Badge } from './components/ui/badge';
import { TaskForm } from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import { CalendarView } from './components/CalendarView';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Edit2, 
  Trash2, 
  BarChart3,
  Calendar as CalendarIcon,
  ListTodo,
  Home,
  Moon,
  Sun
} from 'lucide-react';

function App() {
  // Estados principais
  const [activeSection, setActiveSection] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  // Carregar tarefas do localStorage na inicialização
  useEffect(() => {
    const savedTasks = localStorage.getItem('planner-tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        // Se houver erro, inicializar com tarefas de exemplo
        initializeExampleTasks();
      }
    } else {
      // Primeira vez, criar tarefas de exemplo
      initializeExampleTasks();
    }

    // Carregar tema
    const savedTheme = localStorage.getItem('planner-theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Salvar tarefas no localStorage sempre que mudarem
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('planner-tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Função para inicializar tarefas de exemplo
  const initializeExampleTasks = () => {
    const exampleTasks = [
      {
        id: '1',
        title: 'Revisar relatório mensal',
        description: 'Revisar e aprovar o relatório de vendas do mês passado',
        category: 'Trabalho',
        priority: 'alta',
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Exercitar-se por 30 min',
        description: 'Fazer exercícios cardiovasculares ou musculação',
        category: 'Saúde',
        priority: 'média',
        completed: true,
        dueDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Comprar ingredientes para jantar',
        description: 'Lista: tomate, cebola, alho, carne, temperos',
        category: 'Pessoal',
        priority: 'baixa',
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        title: 'Estudar React PWA',
        description: 'Aprender sobre service workers e cache strategies',
        category: 'Desenvolvimento',
        priority: 'alta',
        completed: false,
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      }
    ];
    setTasks(exampleTasks);
  };

  // Função para alternar tema
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('planner-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('planner-theme', 'light');
    }
  };

  // Funções de manipulação de tarefas
  const handleAddTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    setShowTaskForm(false);
  };

  const handleUpdateTask = (taskData) => {
    setTasks(prev => prev.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
        : task
    ));
    setEditingTask(null);
    setShowTaskForm(false);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleToggleComplete = (taskId) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId 
        ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null }
        : task
    ));
  };

  // Filtrar tarefas
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Filtro de busca
      if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !task.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filtros de categoria, prioridade, etc.
      if (filters.category && task.category !== filters.category) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.status === 'completed' && !task.completed) return false;
      if (filters.status === 'pending' && task.completed) return false;
      
      return true;
    });
  }, [tasks, searchTerm, filters]);

  // Estatísticas
  const stats = useMemo(() => {
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

    return { total, completed, pending, progress, byCategory };
  }, [tasks]);

  // Tarefas de hoje
  const todayTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === today);
  }, [tasks]);

  // Cores das categorias
  const getCategoryColor = (category) => {
    const colors = {
      'Trabalho': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Pessoal': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Saúde': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Desenvolvimento': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Estudos': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Casa': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'alta': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'média': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'baixa': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📋</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planner Intuitivo</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="text-gray-600 dark:text-gray-300"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
                
                <Button
                  onClick={() => {
                    setEditingTask(null);
                    setShowTaskForm(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="w-64 space-y-2">
              <nav className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: Home },
                  { id: 'tasks', label: 'Tarefas', icon: ListTodo, count: tasks.filter(t => !t.completed).length },
                  { id: 'calendar', label: 'Calendário', icon: CalendarIcon },
                  { id: 'stats', label: 'Estatísticas', icon: BarChart3 }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === item.id
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </div>
                    {item.count !== undefined && (
                      <Badge variant="secondary" className="ml-2">
                        {item.count}
                      </Badge>
                    )}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Dashboard */}
              {activeSection === 'dashboard' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Olá! Bem-vindo ao seu Planner
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Organize suas tarefas e alcance seus objetivos com facilidade
                    </p>
                  </div>

                  {/* Cards de Estatísticas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tarefas Hoje</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{todayTasks.length}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {todayTasks.filter(t => t.completed).length} concluídas
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <ListTodo className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progresso</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.progress}%</p>
                            <Progress value={stats.progress} className="mt-2" />
                          </div>
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Próximas</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">tarefas pendentes</p>
                          </div>
                          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tarefas de Hoje */}
                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center text-gray-900 dark:text-white">
                        <ListTodo className="w-5 h-5 mr-2" />
                        Tarefas de Hoje
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Suas atividades programadas para hoje
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {todayTasks.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                          Nenhuma tarefa programada para hoje
                        </p>
                      ) : (
                        todayTasks.map(task => (
                          <div key={task.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <button
                              onClick={() => handleToggleComplete(task.id)}
                              className="flex-shrink-0"
                            >
                              {task.completed ? (
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                              ) : (
                                <Circle className="w-6 h-6 text-gray-400" />
                              )}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                {task.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {task.description}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Badge className={getCategoryColor(task.category)}>
                                {task.category}
                              </Badge>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Seção de Tarefas */}
              {activeSection === 'tasks' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Todas as Tarefas</h2>
                    <Button
                      onClick={() => {
                        setEditingTask(null);
                        setShowTaskForm(true);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Tarefa
                    </Button>
                  </div>

                  {/* Filtros */}
                  <TaskFilters
                    onSearchChange={setSearchTerm}
                    onFilterChange={(type, value) => setFilters(prev => ({ ...prev, [type]: value }))}
                    activeFilters={filters}
                  />

                  {/* Lista de Tarefas */}
                  <div className="space-y-4">
                    {filteredTasks.length === 0 ? (
                      <Card className="dark:bg-gray-800 dark:border-gray-700">
                        <CardContent className="p-8 text-center">
                          <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400">
                            {searchTerm || Object.keys(filters).length > 0 
                              ? 'Nenhuma tarefa encontrada com os filtros aplicados'
                              : 'Nenhuma tarefa criada ainda'
                            }
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      filteredTasks.map(task => (
                        <Card key={task.id} className="dark:bg-gray-800 dark:border-gray-700">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4 flex-1">
                                <button
                                  onClick={() => handleToggleComplete(task.id)}
                                  className="flex-shrink-0 mt-1"
                                >
                                  {task.completed ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                  ) : (
                                    <Circle className="w-6 h-6 text-gray-400" />
                                  )}
                                </button>
                                
                                <div className="flex-1 min-w-0">
                                  <h3 className={`text-lg font-medium mb-2 ${
                                    task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'
                                  }`}>
                                    {task.title}
                                  </h3>
                                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                                    {task.description}
                                  </p>
                                  
                                  <div className="flex items-center space-x-2 mb-2">
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
                              
                              <div className="flex items-center space-x-2 ml-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingTask(task);
                                    setShowTaskForm(true);
                                  }}
                                  className="text-gray-600 dark:text-gray-400"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-red-600 dark:text-red-400"
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

              {/* Seção de Calendário */}
              {activeSection === 'calendar' && (
                <CalendarView
                  tasks={tasks}
                  onTaskCreate={handleAddTask}
                  onTaskUpdate={handleUpdateTask}
                  onTaskDelete={handleDeleteTask}
                />
              )}

              {/* Seção de Estatísticas */}
              {activeSection === 'stats' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Estatísticas</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-white">Progresso Geral</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Concluídas</span>
                          <span className="font-medium text-gray-900 dark:text-white">{stats.completed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Pendentes</span>
                          <span className="font-medium text-gray-900 dark:text-white">{stats.pending}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total</span>
                          <span className="font-medium text-gray-900 dark:text-white">{stats.total}</span>
                        </div>
                        <Progress value={stats.progress} className="mt-4" />
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                          {stats.progress}% concluído
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-white">Por Categoria</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {Object.entries(stats.byCategory).map(([category, data]) => (
                          <div key={category}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-600 dark:text-gray-400">{category}</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
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
        </div>

        {/* Modal de Formulário de Tarefa */}
        {showTaskForm && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleAddTask}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;

