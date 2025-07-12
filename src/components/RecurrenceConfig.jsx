import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { 
  RECURRENCE_PATTERNS, 
  RECURRENCE_TYPES, 
  WEEKDAYS, 
  formatRecurrenceDescription,
  validateRecurrence 
} from '../utils/recurrence';
import { CalendarIcon, Repeat, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const RecurrenceConfig = ({ value, onChange, className = '' }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [config, setConfig] = useState({
    type: RECURRENCE_TYPES.DAILY,
    interval: 1,
    daysOfWeek: [],
    endDate: null
  });

  useEffect(() => {
    if (value && value.type !== RECURRENCE_TYPES.NONE) {
      setIsEnabled(true);
      setConfig(value);
    } else {
      setIsEnabled(false);
      setConfig({
        type: RECURRENCE_TYPES.DAILY,
        interval: 1,
        daysOfWeek: [],
        endDate: null
      });
    }
  }, [value]);

  const handleToggle = (enabled) => {
    setIsEnabled(enabled);
    if (enabled) {
      onChange(config);
    } else {
      onChange({ type: RECURRENCE_TYPES.NONE });
    }
  };

  const handleConfigChange = (newConfig) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    
    if (isEnabled) {
      onChange(updatedConfig);
    }
  };

  const handleDayToggle = (dayValue) => {
    const newDaysOfWeek = config.daysOfWeek.includes(dayValue)
      ? config.daysOfWeek.filter(day => day !== dayValue)
      : [...config.daysOfWeek, dayValue].sort();
    
    handleConfigChange({ daysOfWeek: newDaysOfWeek });
  };

  const validation = validateRecurrence(isEnabled ? config : null);

  return (
    <div className={className}>
      <div className="flex items-center space-x-2 mb-4">
        <Repeat className="w-4 h-4" />
        <Label htmlFor="recurrence-toggle">Repetir tarefa</Label>
        <Switch
          id="recurrence-toggle"
          checked={isEnabled}
          onCheckedChange={handleToggle}
        />
      </div>

      {isEnabled && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Configuração de Recorrência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tipo de recorrência */}
            <div className="space-y-2">
              <Label>Padrão</Label>
              <Select 
                value={config.type} 
                onValueChange={(value) => handleConfigChange({ type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o padrão" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RECURRENCE_PATTERNS).map(pattern => (
                    <SelectItem key={pattern.value} value={pattern.value}>
                      <div>
                        <div className="font-medium">{pattern.label}</div>
                        <div className="text-xs text-gray-500">{pattern.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Intervalo para tipos básicos */}
            {[RECURRENCE_TYPES.DAILY, RECURRENCE_TYPES.WEEKLY, RECURRENCE_TYPES.MONTHLY, RECURRENCE_TYPES.YEARLY].includes(config.type) && (
              <div className="space-y-2">
                <Label>Intervalo</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">A cada</span>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={config.interval}
                    onChange={(e) => handleConfigChange({ interval: parseInt(e.target.value) || 1 })}
                    className="w-20"
                  />
                  <span className="text-sm">
                    {config.type === RECURRENCE_TYPES.DAILY && (config.interval === 1 ? 'dia' : 'dias')}
                    {config.type === RECURRENCE_TYPES.WEEKLY && (config.interval === 1 ? 'semana' : 'semanas')}
                    {config.type === RECURRENCE_TYPES.MONTHLY && (config.interval === 1 ? 'mês' : 'meses')}
                    {config.type === RECURRENCE_TYPES.YEARLY && (config.interval === 1 ? 'ano' : 'anos')}
                  </span>
                </div>
              </div>
            )}

            {/* Dias da semana para recorrência personalizada */}
            {config.type === RECURRENCE_TYPES.CUSTOM && (
              <div className="space-y-2">
                <Label>Dias da semana</Label>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map(day => (
                    <Button
                      key={day.value}
                      type="button"
                      variant={config.daysOfWeek.includes(day.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDayToggle(day.value)}
                      className="text-xs"
                    >
                      {day.short}
                    </Button>
                  ))}
                </div>
                {config.daysOfWeek.length === 0 && (
                  <p className="text-xs text-red-500">Selecione pelo menos um dia</p>
                )}
              </div>
            )}

            {/* Data de fim */}
            <div className="space-y-2">
              <Label>Data de fim (opcional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {config.endDate ? (
                      format(new Date(config.endDate), "PPP", { locale: ptBR })
                    ) : (
                      <span>Sem data de fim</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={config.endDate ? new Date(config.endDate) : undefined}
                    onSelect={(date) => handleConfigChange({ endDate: date })}
                    initialFocus
                  />
                  {config.endDate && (
                    <div className="p-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfigChange({ endDate: null })}
                        className="w-full"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remover data de fim
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            {/* Preview da recorrência */}
            <div className="pt-2 border-t">
              <Label className="text-xs text-gray-500">Resumo</Label>
              <div className="mt-1">
                <Badge variant="secondary" className="text-xs">
                  {formatRecurrenceDescription(config)}
                </Badge>
              </div>
            </div>

            {/* Erros de validação */}
            {!validation.isValid && (
              <div className="text-xs text-red-500 space-y-1">
                {validation.errors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isEnabled && (
        <div className="text-sm text-gray-500 mt-2">
          Esta tarefa não se repetirá
        </div>
      )}
    </div>
  );
};

