# 📅 Planner Intuitivo - O Melhor App de Planner Gratuito

Um aplicativo de planejamento completo, moderno e intuitivo, desenvolvido com React e tecnologias de ponta. Organize sua vida com facilidade e sincronize com seus serviços favoritos.

## ✨ Funcionalidades Principais

### 🎯 Gerenciamento de Tarefas
- ✅ Criar, editar e excluir tarefas
- 🏷️ Categorização por cores (Trabalho, Pessoal, Saúde, etc.)
- ⭐ Sistema de prioridades (Alta, Média, Baixa)
- 📅 Datas de vencimento
- ✔️ Marcar como concluída
- 🔍 Busca e filtros avançados

### 🔄 Tarefas Recorrentes
- 📆 Recorrência diária, semanal, mensal e anual
- 🗓️ Dias específicos da semana
- 📋 Configurações personalizadas
- 🔁 Criação automática de instâncias
- ⏰ Controle de data de fim

### 📊 Dashboard e Estatísticas
- 📈 Progresso visual das tarefas
- 📊 Estatísticas por categoria
- 🎯 Metas e objetivos
- 📉 Análise de produtividade

### 📅 Visualização de Calendário
- 🗓️ Calendário mensal, semanal e diário
- 🎨 Eventos coloridos por categoria
- 📱 Interface responsiva
- 🖱️ Criação de tarefas por clique

### 🔗 Integrações
- 🔥 **Firebase**: Autenticação e banco de dados em tempo real
- 📧 Login com email/senha e Google
- ☁️ Sincronização automática entre dispositivos
- 📱 **Google Calendar**: Sincronização bidirecional
- 🔄 Backup automático na nuvem

### 📱 PWA (Progressive Web App)
- 📲 Instalável como app nativo
- 🌐 Funciona offline
- 🔔 Notificações push (futuro)
- 📱 Totalmente responsivo

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS, Shadcn/UI
- **Ícones**: Lucide React
- **Calendário**: React Big Calendar
- **Datas**: date-fns, moment.js
- **Backend**: Firebase (Firestore + Auth)
- **PWA**: Service Worker, Web App Manifest
- **Deploy**: Vercel/Netlify ready

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- pnpm (recomendado) ou npm

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/planner-intuitivo.git
cd planner-intuitivo
```

### 2. Instale as dependências
```bash
pnpm install
# ou
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=sua_api_key_aqui
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456789

# Google Calendar API Configuration
REACT_APP_GOOGLE_API_KEY=sua_google_api_key
REACT_APP_GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
```

### 4. Execute o projeto
```bash
pnpm dev
# ou
npm run dev
```

Acesse http://localhost:5173

## 🔧 Configuração do Firebase

### 1. Criar Projeto Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Siga o assistente de configuração

### 2. Configurar Authentication
1. Vá para "Authentication" > "Sign-in method"
2. Habilite "Email/Password" e "Google"
3. Configure o domínio autorizado

### 3. Configurar Firestore
1. Vá para "Firestore Database"
2. Crie o banco em modo de teste
3. Configure as regras de segurança:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 🔗 Configuração do Google Calendar API

### 1. Criar Projeto no Google Cloud Console
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione existente
3. Habilite a "Google Calendar API"

### 2. Criar Credenciais
1. Vá para "APIs & Services" > "Credentials"
2. Crie uma "API Key" e um "OAuth 2.0 Client ID"
3. Configure os domínios autorizados

### 3. Configurar OAuth Consent Screen
1. Configure a tela de consentimento
2. Adicione os escopos necessários
3. Adicione usuários de teste (se em desenvolvimento)

## 📦 Build e Deploy

### Build para Produção
```bash
pnpm build
# ou
npm run build
```

### Deploy na Vercel
1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Deploy na Netlify
1. Conecte seu repositório à Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Publish directory: `dist`

## 🎨 Personalização

### Cores e Temas
As cores podem ser personalizadas no arquivo `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### Categorias de Tarefas
Edite as categorias em `src/components/TaskForm.jsx`:

```javascript
const categories = [
  'Trabalho',
  'Pessoal', 
  'Saúde',
  'Desenvolvimento',
  'Estudos',
  'Casa',
  'Sua Nova Categoria'
];
```

## 🔮 Próximas Funcionalidades

- [ ] 🔔 Notificações push
- [ ] 👥 Colaboração em tarefas
- [ ] 📊 Relatórios avançados
- [ ] 🎯 Sistema de metas
- [ ] 📱 App mobile nativo
- [ ] 🌙 Modo escuro
- [ ] 🌍 Múltiplos idiomas
- [ ] 📎 Anexos em tarefas
- [ ] ⏱️ Pomodoro timer
- [ ] 🏆 Sistema de gamificação

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a [documentação](#-instalação-e-configuração)
2. Procure em [Issues existentes](https://github.com/seu-usuario/planner-intuitivo/issues)
3. Crie uma [nova issue](https://github.com/seu-usuario/planner-intuitivo/issues/new)

## 🙏 Agradecimentos

- [React](https://reactjs.org/) - Framework principal
- [Firebase](https://firebase.google.com/) - Backend e autenticação
- [Tailwind CSS](https://tailwindcss.com/) - Estilização
- [Shadcn/UI](https://ui.shadcn.com/) - Componentes UI
- [Lucide](https://lucide.dev/) - Ícones
- [React Big Calendar](https://github.com/jquense/react-big-calendar) - Componente de calendário

---

⭐ **Se este projeto te ajudou, considere dar uma estrela no GitHub!**

Desenvolvido com ❤️ para ajudar você a ser mais produtivo.

