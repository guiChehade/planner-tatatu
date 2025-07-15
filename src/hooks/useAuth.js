import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase não configurado');
    }

    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Erro no login:', error);
      setError(getErrorMessage(error.code));
      throw error;
    }
  };

  const register = async (email, password, name) => {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase não configurado');
    }

    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      if (name) {
        await updateProfile(result.user, { displayName: name });
      }
      
      return result.user;
    } catch (error) {
      console.error('Erro no registro:', error);
      setError(getErrorMessage(error.code));
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase não configurado');
    }

    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Erro no login com Google:', error);
      setError(getErrorMessage(error.code));
      throw error;
    }
  };

  const logout = async () => {
    if (!isFirebaseConfigured()) {
      return;
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro no logout:', error);
      setError('Erro ao fazer logout');
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/email-already-in-use':
        return 'Email já está em uso';
      case 'auth/weak-password':
        return 'Senha muito fraca';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/popup-closed-by-user':
        return 'Login cancelado pelo usuário';
      default:
        return 'Erro de autenticação';
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    isConfigured: isFirebaseConfigured()
  };
};

