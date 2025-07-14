// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';

// Verificar se todas as variáveis de ambiente necessárias estão definidas
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variáveis de ambiente Firebase não configuradas:', missingVars);
  console.error('📝 Configure as seguintes variáveis no arquivo .env:');
  missingVars.forEach(varName => {
    console.error(`   ${varName}=sua_configuracao_aqui`);
  });
}

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // Opcional
};

// Função para verificar se o Firebase está configurado
export const isFirebaseConfigured = () => {
  return missingVars.length === 0 && firebaseConfig.apiKey && firebaseConfig.projectId;
};

// Initialize Firebase apenas se estiver configurado
let app = null;
let auth = null;
let db = null;
let storage = null;
let googleProvider = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Configure Google Auth Provider
    googleProvider = new GoogleAuthProvider();
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    
    console.log('✅ Firebase inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
  }
} else {
  console.warn('⚠️ Firebase não configurado. Algumas funcionalidades não estarão disponíveis.');
}

export { app, auth, db, storage, googleProvider };

// Regras de segurança sugeridas para o Firestore
export const firestoreSecurityRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para tarefas - usuários só podem acessar suas próprias tarefas
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Regras para perfis de usuário
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regras para anexos
    match /attachments/{attachmentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
`;

// Configuração de Storage Security Rules
export const storageSecurityRules = `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Regras para anexos de tarefas
    match /attachments/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regras para avatars de usuário
    match /avatars/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
`;

// Função para verificar conectividade com Firebase
export const testFirebaseConnection = async () => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase não configurado');
  }

  try {
    // Teste simples de conectividade
    const testDoc = doc(db, 'test', 'connection');
    await getDoc(testDoc);
    return true;
  } catch (error) {
    console.error('Erro de conectividade Firebase:', error);
    throw error;
  }
};

// Configurações de desenvolvimento
if (import.meta.env.DEV) {
  console.log('🔧 Modo de desenvolvimento ativo');
  console.log('📋 Configuração Firebase:', {
    configured: isFirebaseConfigured(),
    projectId: firebaseConfig.projectId || 'NÃO CONFIGURADO',
    authDomain: firebaseConfig.authDomain || 'NÃO CONFIGURADO'
  });
}

