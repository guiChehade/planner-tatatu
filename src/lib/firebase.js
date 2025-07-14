// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Verificar se as variáveis de ambiente estão configuradas
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && 
         firebaseConfig.authDomain && 
         firebaseConfig.projectId;
};

// Initialize Firebase apenas se estiver configurado
let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    
    console.log('Firebase inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
  }
} else {
  console.warn('Firebase não configurado - usando modo offline');
}

export { 
  auth, 
  db, 
  googleProvider,
  isFirebaseConfigured
};

