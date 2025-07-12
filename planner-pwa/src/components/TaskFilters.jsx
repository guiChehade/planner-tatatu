import { useState } from 'react'
import { Input } from '@/components/ui/input.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Search, Filter, X } from 'lucide-react'

const TaskFilters = ({ onFilterChange, onSearchChange, activeFilters = {} }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    onSearchChange(value)
  }

  const handleFilterChange = (filterType, value) => {
    onFilterChange(filterType, value)
  }

  const clearFilter = (filterType) => {
    onFilterChange(filterType, '')
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    onSearchChange('')
    Object.keys(activeFilters).forEach(filter => {
      onFilterChange(filter, '')
    })
  }

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar tarefas..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Botão de filtros */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Filtros ativos */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Categoria: {activeFilters.category}
              <button onClick={() => clearFilter('category')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {activeFilters.priority && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Prioridade: {activeFilters.priority}
              <button onClick={() => clearFilter('priority')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {activeFilters.status && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {activeFilters.status}
              <button onClick={() => clearFilter('status')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Painel de filtros */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select value={activeFilters.category || ''} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                <SelectItem value="Trabalho">Trabalho</SelectItem>
                <SelectItem value="Pessoal">Pessoal</SelectItem>
                <SelectItem value="Saúde">Saúde</SelectItem>
                <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                <SelectItem value="Estudos">Estudos</SelectItem>
                <SelectItem value="Casa">Casa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Prioridade</label>
            <Select value={activeFilters.priority || ''} onValueChange={(value) => handleFilterChange('priority', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as prioridades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as prioridades</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="média">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={activeFilters.status || ''} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskFilters

