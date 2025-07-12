# Configuração do Firebase para o Planner Intuitivo

## Passo 1: Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Digite o nome do projeto (ex: "planner-intuitivo")
4. Desabilite o Google Analytics (opcional)
5. Clique em "Criar projeto"

## Passo 2: Configurar Authentication

1. No painel do Firebase, vá para "Authentication"
2. Clique em "Começar"
3. Na aba "Sign-in method", habilite:
   - **Email/Password**: Clique e habilite
   - **Google**: Clique, habilite e configure o email de suporte

## Passo 3: Configurar Firestore Database

1. No painel do Firebase, vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Começar no modo de teste" (por enquanto)
4. Selecione uma localização próxima (ex: southamerica-east1)

## Passo 4: Configurar Web App

1. No painel do Firebase, clique no ícone de engrenagem > "Configurações do projeto"
2. Na seção "Seus apps", clique no ícone "</>" (Web)
3. Digite o nome do app (ex: "planner-intuitivo-web")
4. **NÃO** marque "Configurar também o Firebase Hosting"
5. Clique em "Registrar app"
6. Copie as configurações que aparecem

## Passo 5: Atualizar Configurações no Código

1. Abra o arquivo `src/lib/firebase.js`
2. Substitua as configurações de exemplo pelas suas configurações reais:

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789",
  measurementId: "G-XXXXXXXXXX" // opcional
};
```

## Passo 6: Configurar Regras de Segurança do Firestore

1. No Firestore Database, vá para "Regras"
2. Substitua as regras padrão por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para a coleção de tarefas
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Regras para perfis de usuário (futuro)
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Clique em "Publicar"

## Passo 7: Testar a Aplicação

1. Execute `pnpm run dev` no terminal
2. Acesse http://localhost:5173
3. Teste o registro de novo usuário
4. Teste o login
5. Teste a criação de tarefas
6. Verifique se os dados aparecem no Firestore Console

## Estrutura de Dados no Firestore

### Coleção: `tasks`
```javascript
{
  id: "documento-id-automatico",
  userId: "uid-do-usuario",
  title: "Título da tarefa",
  description: "Descrição detalhada",
  category: "Trabalho", // Trabalho, Pessoal, Saúde, etc.
  priority: "alta", // alta, média, baixa
  completed: false,
  dueDate: timestamp, // opcional
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Coleção: `users` (futuro)
```javascript
{
  id: "uid-do-usuario",
  email: "usuario@email.com",
  displayName: "Nome do Usuário",
  preferences: {
    theme: "light",
    notifications: true
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Funcionalidades Implementadas

✅ **Autenticação**
- Registro com email/senha
- Login com email/senha
- Login com Google
- Logout
- Persistência de sessão

✅ **Gerenciamento de Tarefas**
- Criar tarefas
- Editar tarefas
- Excluir tarefas
- Marcar como concluída
- Categorização
- Prioridades
- Datas de vencimento

✅ **Sincronização em Tempo Real**
- Atualizações automáticas
- Dados sincronizados entre dispositivos
- Backup automático na nuvem

✅ **Interface Responsiva**
- Funciona em desktop, tablet e mobile
- PWA instalável
- Offline-first com cache

## Próximos Passos

1. **Recorrência de Tarefas**: Implementar tarefas que se repetem
2. **Calendário**: Visualização de tarefas em calendário
3. **Google Calendar**: Integração com Google Calendar
4. **Notificações**: Push notifications para lembretes
5. **Colaboração**: Compartilhamento de tarefas
6. **Relatórios**: Análises avançadas de produtividade

## Troubleshooting

### Erro: "Firebase: Error (auth/configuration-not-found)"
- Verifique se as configurações do Firebase estão corretas
- Certifique-se de que o Authentication está habilitado

### Erro: "Missing or insufficient permissions"
- Verifique as regras de segurança do Firestore
- Certifique-se de que o usuário está autenticado

### Tarefas não aparecem
- Verifique se o usuário está logado
- Verifique as regras de segurança
- Verifique o console do navegador para erros

### Login com Google não funciona
- Verifique se o Google Sign-in está habilitado
- Configure o email de suporte nas configurações
- Verifique se o domínio está autorizado

