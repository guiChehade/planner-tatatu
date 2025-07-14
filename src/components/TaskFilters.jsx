import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, X } from 'lucide-react';

const TaskFilters = ({ onFilterChange, onSearchChange, activeFilters = {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleFilterChange = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    onSearchChange('');
    onFilterChange('category', '');
    onFilterChange('priority', '');
    onFilterChange('status', '');
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => value) || searchTerm;

  return (
    <div className="space-y-4">
      {/* Barra de busca */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="dark:border-gray-600 dark:text-gray-300"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {Object.values(activeFilters).filter(v => v).length + (searchTerm ? 1 : 0)}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 dark:text-gray-400"
          >
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Filtros expandidos */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Categoria
            </label>
            <Select
              value={activeFilters.category || ''}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Prioridade
            </label>
            <Select
              value={activeFilters.priority || ''}
              onValueChange={(value) => handleFilterChange('priority', value)}
            >
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Todas as prioridades" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem value="">Todas as prioridades</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="média">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <Select
              value={activeFilters.status || ''}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem value="">Todos os status</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Tags de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Busca: "{searchTerm}"
              <button
                onClick={() => handleSearchChange('')}
                className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {activeFilters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Categoria: {activeFilters.category}
              <button
                onClick={() => handleFilterChange('category', '')}
                className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {activeFilters.priority && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Prioridade: {activeFilters.priority}
              <button
                onClick={() => handleFilterChange('priority', '')}
                className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {activeFilters.status && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {activeFilters.status === 'pending' ? 'Pendentes' : 'Concluídas'}
              <button
                onClick={() => handleFilterChange('status', '')}
                className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;

