# Planner Intuitivo - PWA

Um planner digital responsivo e intuitivo que pode ser instalado como aplicativo (PWA), com fácil curva de aprendizado e compatível com computadores, tablets e celulares.

## 🚀 Características Principais

### ✨ Interface Intuitiva
- **Design Minimalista**: Interface limpa com foco no conteúdo
- **Cores Profissionais**: Paleta de cores calmas e modernas
- **Tipografia Clara**: Hierarquia visual bem definida
- **Ícones Consistentes**: Lucide Icons para melhor UX

### 📱 PWA (Progressive Web App)
- **Instalação Fácil**: Pode ser instalado como app nativo
- **Funcionamento Offline**: Service Worker para cache inteligente
- **Notificações Push**: Lembretes mesmo com app fechado
- **Performance Otimizada**: Carregamento rápido e responsivo

### 🎯 Funcionalidades Core
- **Dashboard Inteligente**: Visão geral com progresso visual
- **Criação Rápida**: Formulário intuitivo para novas tarefas
- **Categorização**: Trabalho, Pessoal, Saúde, Desenvolvimento, etc.
- **Prioridades**: Alta, Média, Baixa com cores distintivas
- **Busca Avançada**: Filtros por categoria, prioridade e status
- **Estatísticas**: Gráficos de progresso por categoria

### 📊 Experiência do Usuário
- **Responsividade Total**: Adaptação perfeita para todos os dispositivos
- **Navegação Intuitiva**: Bottom nav no mobile, sidebar no desktop
- **Feedback Visual**: Animações suaves e micro-interações
- **Modo Escuro/Claro**: Suporte automático ao tema do sistema

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 com TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Ícones**: Lucide React
- **Build**: Vite para performance otimizada
- **PWA**: Service Worker + Web App Manifest
- **Storage**: LocalStorage para persistência

## 📱 Estrutura de Navegação

```
├── Dashboard (Home)
│   ├── Estatísticas do dia
│   ├── Progresso visual
│   └── Tarefas prioritárias
├── Tarefas
│   ├── Lista completa
│   ├── Filtros avançados
│   ├── Busca inteligente
│   └── Ações (editar/excluir)
├── Calendário
│   └── Vista temporal (futuro)
└── Estatísticas
    ├── Progresso geral
    └── Análise por categoria
```

## 🎨 Design System

### Cores Principais
- **Primária**: #6366F1 (Índigo moderno)
- **Sucesso**: #10B981 (Verde)
- **Alerta**: #F59E0B (Laranja)
- **Neutros**: #F8FAFC, #64748B, #1E293B

### Categorias
- **Trabalho**: Azul (#3B82F6)
- **Saúde**: Verde (#10B981)
- **Pessoal**: Roxo (#8B5CF6)
- **Desenvolvimento**: Laranja (#F97316)
- **Estudos**: Índigo (#6366F1)
- **Casa**: Rosa (#EC4899)

### Prioridades
- **Alta**: Vermelho (#EF4444)
- **Média**: Amarelo (#F59E0B)
- **Baixa**: Verde (#10B981)

## 🚀 Como Usar

### Instalação como PWA
1. Acesse o site no navegador
2. Clique no botão "📱 Instalar App" (aparece automaticamente)
3. Confirme a instalação
4. Use como app nativo!

### Funcionalidades Principais
1. **Criar Tarefa**: Clique em "+" ou "Nova Tarefa"
2. **Marcar como Concluída**: Clique no ícone de check
3. **Editar**: Use o ícone de lápis na lista de tarefas
4. **Filtrar**: Use a busca ou filtros por categoria/prioridade
5. **Acompanhar Progresso**: Veja estatísticas no Dashboard

## 📈 Benefícios

### Para o Usuário
- **Curva de Aprendizado Zero**: Interface auto-explicativa
- **Acesso Offline**: Funciona sem internet
- **Sincronização Local**: Dados salvos no dispositivo
- **Performance Superior**: Carregamento instantâneo

### Para Produtividade
- **Organização Visual**: Categorias e prioridades coloridas
- **Progresso Motivador**: Gráficos de acompanhamento
- **Acesso Rápido**: Instalação como app nativo
- **Notificações**: Lembretes inteligentes

## 🔧 Desenvolvimento

### Comandos Disponíveis
```bash
# Instalar dependências
pnpm install

# Desenvolvimento
pnpm run dev

# Build para produção
pnpm run build

# Preview da build
pnpm run preview
```

### Estrutura do Projeto
```
src/
├── components/
│   ├── ui/           # Componentes shadcn/ui
│   ├── TaskForm.jsx  # Formulário de tarefas
│   └── TaskFilters.jsx # Filtros e busca
├── App.jsx           # Componente principal
├── App.css          # Estilos globais
└── main.jsx         # Entry point

public/
├── manifest.json    # PWA manifest
├── sw.js           # Service worker
├── icon-192.svg    # Ícone PWA 192x192
└── icon-512.svg    # Ícone PWA 512x512
```

## 🎯 Próximas Funcionalidades

- [ ] Calendário interativo
- [ ] Sincronização na nuvem
- [ ] Colaboração em equipe
- [ ] Relatórios avançados
- [ ] Integração com calendários externos
- [ ] Modo escuro/claro manual
- [ ] Temas personalizáveis
- [ ] Backup/restore de dados

## 📄 Licença

Este projeto foi desenvolvido como demonstração de PWA moderno e intuitivo.

---

**Desenvolvido com ❤️ usando React, Tailwind CSS e tecnologias PWA modernas.**

