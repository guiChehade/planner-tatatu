import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Home, 
  List, 
  BarChart3, 
  Settings,
  Clock,
  Target,
  TrendingUp,
  Edit,
  Trash2
} from 'lucide-react'
import TaskForm from './components/TaskForm.jsx'
import TaskFilters from './components/TaskFilters.jsx'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: 'Revisar relatório mensal', 
      description: 'Revisar e aprovar o relatório de vendas do mês passado',
      category: 'Trabalho', 
      completed: false, 
      priority: 'alta', 
      dueDate: '2025-07-12' 
    },
    { 
      id: 2, 
      title: 'Exercitar-se por 30 min', 
      description: 'Fazer exercícios cardiovasculares ou musculação',
      category: 'Saúde', 
      completed: true, 
      priority: 'média', 
      dueDate: '2025-07-12' 
    },
    { 
      id: 3, 
      title: 'Comprar ingredientes para jantar', 
      description: 'Lista: tomate, cebola, alho, carne, temperos',
      category: 'Pessoal', 
      completed: false, 
      priority: 'baixa', 
      dueDate: '2025-07-12' 
    },
    { 
      id: 4, 
      title: 'Estudar React PWA', 
      description: 'Aprender sobre service workers e cache strategies',
      category: 'Desenvolvimento', 
      completed: false, 
      priority: 'alta', 
      dueDate: '2025-07-13' 
    }
  ])

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    status: ''
  })

  // Filtrar e buscar tarefas
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Filtro de busca
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Filtros de categoria, prioridade e status
      const matchesCategory = !filters.category || task.category === filters.category
      const matchesPriority = !filters.priority || task.priority === filters.priority
      const matchesStatus = !filters.status || 
                           (filters.status === 'completed' && task.completed) ||
                           (filters.status === 'pending' && !task.completed)
      
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus
    })
  }, [tasks, searchTerm, filters])

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const addTask = (newTask) => {
    setTasks([...tasks, newTask])
  }

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const handleTaskSubmit = (taskData) => {
    if (editingTask) {
      updateTask(taskData)
    } else {
      addTask(taskData)
    }
    setEditingTask(null)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200'
      case 'média': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Trabalho': return 'bg-blue-100 text-blue-800'
      case 'Saúde': return 'bg-green-100 text-green-800'
      case 'Pessoal': return 'bg-purple-100 text-purple-800'
      case 'Desenvolvimento': return 'bg-orange-100 text-orange-800'
      case 'Estudos': return 'bg-indigo-100 text-indigo-800'
      case 'Casa': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const TaskItem = ({ task, showActions = false }) => (
    <div 
      className={`flex items-center justify-between p-3 rounded-lg border transition-all hover:shadow-sm ${
        task.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleTask(task.id)}
          className="p-0 h-auto"
        >
          <CheckCircle2 
            className={`h-5 w-5 ${
              task.completed ? 'text-green-600 fill-green-100' : 'text-gray-400'
            }`}
          />
        </Button>
        <div className="flex-1">
          <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          )}
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className={getCategoryColor(task.category)}>
              {task.category}
            </Badge>
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showActions && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditTask(task)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteTask(task.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
        <div className="text-sm text-gray-500 ml-2">
          {task.dueDate}
        </div>
      </div>
    </div>
  )

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header com saudação */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Olá! Bem-vindo ao seu Planner
        </h1>
        <p className="text-gray-600">
          Organize suas tarefas e alcance seus objetivos com facilidade
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Hoje</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter(task => !task.completed).length}
            </div>
            <p className="text-xs text-muted-foreground">
              tarefas pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de tarefas do dia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Tarefas de Hoje
          </CardTitle>
          <CardDescription>
            Suas atividades programadas para hoje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.slice(0, 5).map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
          
          <Button 
            className="w-full mt-4" 
            variant="outline"
            onClick={() => setShowTaskForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Nova Tarefa
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderTasks = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Todas as Tarefas</h2>
        <Button onClick={() => setShowTaskForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>
      
      <TaskFilters
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        activeFilters={filters}
      />
      
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Nenhuma tarefa encontrada</p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map(task => (
            <Card key={task.id}>
              <CardContent className="p-4">
                <TaskItem task={task} showActions={true} />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )

  const renderCalendar = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Calendário</h2>
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">Vista do calendário será implementada em breve</p>
            <p className="text-sm text-gray-400">
              Aqui você poderá visualizar suas tarefas em formato de calendário
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderStats = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Estatísticas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Progresso Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Concluídas</span>
                <span>{completedTasks}</span>
              </div>
              <div className="flex justify-between">
                <span>Pendentes</span>
                <span>{totalTasks - completedTasks}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{totalTasks}</span>
              </div>
              <Progress value={progressPercentage} className="mt-4" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Trabalho', 'Pessoal', 'Saúde', 'Desenvolvimento'].map(category => {
                const categoryTasks = tasks.filter(task => task.category === category)
                const categoryCompleted = categoryTasks.filter(task => task.completed).length
                const categoryProgress = categoryTasks.length > 0 ? (categoryCompleted / categoryTasks.length) * 100 : 0
                
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{category}</span>
                      <span>{categoryCompleted}/{categoryTasks.length}</span>
                    </div>
                    <Progress value={categoryProgress} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard()
      case 'tasks': return renderTasks()
      case 'calendar': return renderCalendar()
      case 'stats': return renderStats()
      default: return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                📋 Planner Intuitivo
              </h1>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="grid grid-cols-4 h-16">
          {[
            { id: 'dashboard', icon: Home, label: 'Início' },
            { id: 'tasks', icon: List, label: 'Tarefas' },
            { id: 'calendar', icon: Calendar, label: 'Calendário' },
            { id: 'stats', icon: BarChart3, label: 'Stats' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center justify-center space-y-1 ${
                activeTab === id ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:w-64 md:bg-white md:border-r md:flex md:flex-col">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">
              📋 Planner Intuitivo
            </h1>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {[
              { id: 'dashboard', icon: Home, label: 'Dashboard' },
              { id: 'tasks', icon: List, label: 'Tarefas' },
              { id: 'calendar', icon: Calendar, label: 'Calendário' },
              { id: 'stats', icon: BarChart3, label: 'Estatísticas' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeTab === id
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showTaskForm}
        onClose={() => {
          setShowTaskForm(false)
          setEditingTask(null)
        }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
      />

      {/* Adjust main content for desktop sidebar */}
      <style jsx>{`
        @media (min-width: 768px) {
          main {
            margin-left: 16rem;
          }
        }
      `}</style>
    </div>
  )
}

export default App

