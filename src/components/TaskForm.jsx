import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { X } from 'lucide-react';

export const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Pessoal',
    priority: 'média',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  // Preencher formulário quando editando
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || 'Pessoal',
        priority: task.priority || 'média',
        dueDate: task.dueDate || new Date().toISOString().split('T')[0]
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação simples
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submeter dados
    onSubmit(formData);
    
    // Resetar formulário
    setFormData({
      title: '',
      description: '',
      category: 'Pessoal',
      priority: 'média',
      dueDate: new Date().toISOString().split('T')[0]
    });
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-gray-900 dark:text-white">
              {task ? 'Editar Tarefa' : 'Nova Tarefa'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {task ? 'Edite os detalhes da tarefa' : 'Adicione uma nova tarefa ao seu planner'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-900 dark:text-white">
              Título *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ex: Revisar relatório mensal"
              className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.title ? 'border-red-500' : ''
              }`}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-900 dark:text-white">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Detalhes adicionais sobre a tarefa..."
              rows={3}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Categoria e Prioridade */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-white">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
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
              <Label className="text-gray-900 dark:text-white">Prioridade</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleChange('priority', value)}
              >
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="média">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Data de Vencimento */}
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-gray-900 dark:text-white">
              Data de Vencimento
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {task ? 'Salvar Alterações' : 'Criar Tarefa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

