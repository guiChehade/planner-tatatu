# 🔥 Guia Completo de Configuração Firebase

## 🎯 **OBJETIVO**
Configurar o Firebase para que o Planner funcione com:
- ✅ Autenticação (Email/Senha + Google)
- ✅ Firestore (Banco de dados)
- ✅ Storage (Anexos de arquivos)
- ✅ Tarefas privadas por usuário
- ✅ Sincronização em tempo real

---

## 📋 **PASSO A PASSO COMPLETO**

### **1. Criar Projeto Firebase**

1. **Acesse:** https://console.firebase.google.com
2. **Clique:** "Criar um projeto"
3. **Nome:** `planner-intuitivo` (ou o nome que preferir)
4. **Google Analytics:** Pode desabilitar se quiser
5. **Clique:** "Criar projeto"

### **2. Configurar Authentication**

1. **No console Firebase, vá em:** Authentication
2. **Clique:** "Vamos começar"
3. **Aba "Sign-in method":**
   - **Email/senha:** Ativar
   - **Google:** Ativar
4. **Para Google:**
   - Escolha um email de suporte
   - Anote o **Client ID** que aparece

### **3. Configurar Firestore Database**

1. **No console Firebase, vá em:** Firestore Database
2. **Clique:** "Criar banco de dados"
3. **Modo:** "Produção" (vamos configurar as regras depois)
4. **Local:** Escolha o mais próximo (ex: southamerica-east1)

### **4. Configurar Storage**

1. **No console Firebase, vá em:** Storage
2. **Clique:** "Vamos começar"
3. **Regras:** Aceite as padrão por enquanto
4. **Local:** Mesmo que escolheu no Firestore

### **5. Obter Configurações**

1. **No console Firebase, vá em:** Configurações do projeto (ícone de engrenagem)
2. **Role até:** "Seus apps"
3. **Clique:** "Adicionar app" > Ícone da web `</>`
4. **Nome:** `planner-web`
5. **Marque:** "Configurar também o Firebase Hosting" (opcional)
6. **Copie** todas as configurações que aparecem

---

## 🔧 **CONFIGURAR VARIÁVEIS DE AMBIENTE**

### **1. Criar arquivo .env**

Na raiz do seu projeto, crie o arquivo `.env`:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=planner-intuitivo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=planner-intuitivo
VITE_FIREBASE_STORAGE_BUCKET=planner-intuitivo.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456

# Google OAuth (opcional - para login com Google)
VITE_GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
```

### **2. Onde encontrar cada valor:**

- **API_KEY:** Na configuração do app web
- **AUTH_DOMAIN:** `[PROJECT_ID].firebaseapp.com`
- **PROJECT_ID:** ID do seu projeto Firebase
- **STORAGE_BUCKET:** `[PROJECT_ID].appspot.com`
- **MESSAGING_SENDER_ID:** Na configuração do app web
- **APP_ID:** Na configuração do app web
- **GOOGLE_CLIENT_ID:** Em Authentication > Sign-in method > Google

---

## 🔒 **CONFIGURAR REGRAS DE SEGURANÇA**

### **1. Regras do Firestore**

No console Firebase, vá em **Firestore Database > Regras** e cole:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tarefas - usuários só veem suas próprias tarefas
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Perfis de usuário
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anexos
    match /attachments/{attachmentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### **2. Regras do Storage**

No console Firebase, vá em **Storage > Rules** e cole:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Anexos por usuário
    match /attachments/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Avatars por usuário
    match /avatars/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🌐 **CONFIGURAR DOMÍNIOS AUTORIZADOS**

### **1. Para desenvolvimento local:**

1. **No console Firebase:** Authentication > Settings
2. **Authorized domains:** Adicione `localhost`

### **2. Para produção (Vercel/Netlify):**

1. **Adicione seu domínio:** `seuapp.vercel.app`
2. **Para Google OAuth:** Também configure no Google Cloud Console

---

## 🔍 **DIAGNÓSTICO DE PROBLEMAS**

### **❌ Página em branco no localhost**

**Possíveis causas:**

1. **Variáveis .env não carregadas:**
   ```bash
   # Verifique se o arquivo .env está na raiz
   # Reinicie o servidor: npm run dev
   ```

2. **Prefixo VITE_ ausente:**
   ```bash
   # ❌ Errado
   FIREBASE_API_KEY=...
   
   # ✅ Correto
   VITE_FIREBASE_API_KEY=...
   ```

3. **Erro de importação:**
   ```bash
   # Limpe cache e reinstale
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

### **❌ Firebase não configurado**

**Verificações:**

1. **Console do navegador (F12):**
   - Procure por erros Firebase
   - Verifique se as variáveis estão definidas

2. **Teste de conectividade:**
   ```javascript
   // No console do navegador
   console.log(import.meta.env.VITE_FIREBASE_API_KEY);
   ```

### **❌ Login com Google não funciona**

**Verificações:**

1. **Google Cloud Console:**
   - Acesse: https://console.cloud.google.com
   - Vá em: APIs & Services > Credentials
   - Configure OAuth 2.0 Client ID
   - Adicione origens autorizadas:
     - `http://localhost:5173`
     - `https://seudominio.com`

2. **Domínios autorizados no Firebase:**
   - Authentication > Settings
   - Authorized domains

---

## 🚀 **TESTE FINAL**

### **1. Verificar configuração:**

```bash
# Iniciar servidor
npm run dev

# Abrir navegador em http://localhost:5173
# Verificar console (F12) para erros
```

### **2. Testar funcionalidades:**

1. **✅ Criar conta** com email/senha
2. **✅ Login** com email/senha
3. **✅ Login** com Google
4. **✅ Criar tarefa** e verificar se salva
5. **✅ Logout** e login novamente
6. **✅ Verificar** se tarefas persistem

---

## 📱 **DEPLOY EM PRODUÇÃO**

### **1. Vercel/Netlify:**

1. **Adicione as variáveis de ambiente** no painel da plataforma
2. **Configure domínios autorizados** no Firebase
3. **Teste** todas as funcionalidades

### **2. Variáveis de ambiente em produção:**

```bash
# No painel da Vercel/Netlify, adicione:
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_GOOGLE_CLIENT_ID=...
```

---

## 🆘 **SOLUÇÃO DE PROBLEMAS COMUNS**

### **Erro: "Firebase not configured"**
- ✅ Verifique arquivo .env na raiz
- ✅ Confirme prefixo VITE_
- ✅ Reinicie servidor

### **Erro: "Permission denied"**
- ✅ Verifique regras do Firestore
- ✅ Confirme se usuário está logado
- ✅ Verifique se userId está correto

### **Erro: "Google sign-in failed"**
- ✅ Configure Google Cloud Console
- ✅ Adicione domínios autorizados
- ✅ Verifique Client ID

### **Tarefas não aparecem**
- ✅ Verifique regras de segurança
- ✅ Confirme se userId está sendo salvo
- ✅ Verifique console para erros

---

## 📞 **PRECISA DE AJUDA?**

Se ainda tiver problemas:

1. **Abra o console do navegador (F12)**
2. **Copie todos os erros** que aparecem
3. **Verifique se todas as variáveis** estão configuradas
4. **Teste em modo incógnito** para descartar cache

**O planner está configurado para funcionar 100% com Firebase e ser totalmente privado por usuário! 🎉**

