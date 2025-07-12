import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

// Configurações do Google Calendar API
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

export const useGoogleCalendar = () => {
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);
  const [isGisLoaded, setIsGisLoaded] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();

  // Configurações do Google API (devem ser configuradas pelo usuário)
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || '';
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

  // Inicializar Google API
  useEffect(() => {
    const initializeGapi = async () => {
      if (!window.gapi) {
        // Carregar Google API dinamicamente
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          window.gapi.load('client', async () => {
            await window.gapi.client.init({
              apiKey: API_KEY,
              discoveryDocs: [DISCOVERY_DOC],
            });
            setIsGapiLoaded(true);
          });
        };
        document.head.appendChild(script);
      } else {
        setIsGapiLoaded(true);
      }
    };

    const initializeGis = () => {
      if (!window.google) {
        // Carregar Google Identity Services
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => {
          if (CLIENT_ID) {
            const client = window.google.accounts.oauth2.initTokenClient({
              client_id: CLIENT_ID,
              scope: SCOPES,
              callback: (response) => {
                if (response.error) {
                  setError('Erro na autorização: ' + response.error);
                  return;
                }
                setIsAuthorized(true);
                setError(null);
              },
            });
            setTokenClient(client);
          }
          setIsGisLoaded(true);
        };
        document.head.appendChild(script);
      } else {
        setIsGisLoaded(true);
      }
    };

    if (API_KEY && CLIENT_ID) {
      initializeGapi();
      initializeGis();
    }
  }, [API_KEY, CLIENT_ID]);

  // Verificar se o usuário já está autorizado
  useEffect(() => {
    if (isGapiLoaded && window.gapi.client.getToken()) {
      setIsAuthorized(true);
    }
  }, [isGapiLoaded]);

  // Autorizar acesso ao Google Calendar
  const authorize = useCallback(() => {
    if (!tokenClient) {
      setError('Google Identity Services não está carregado');
      return;
    }

    if (!user) {
      setError('Usuário deve estar logado para sincronizar com Google Calendar');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
      setError('Erro ao solicitar autorização: ' + err.message);
      setLoading(false);
    }
  }, [tokenClient, user]);

  // Revogar autorização
  const revoke = useCallback(() => {
    const token = window.gapi.client.getToken();
    if (token) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
      setIsAuthorized(false);
    }
  }, []);

  // Listar eventos do Google Calendar
  const listEvents = useCallback(async (timeMin, timeMax) => {
    if (!isAuthorized) {
      throw new Error('Não autorizado para acessar Google Calendar');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax,
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime',
      });

      setLoading(false);
      return response.result.items || [];
    } catch (err) {
      setError('Erro ao listar eventos: ' + err.message);
      setLoading(false);
      throw err;
    }
  }, [isAuthorized]);

  // Criar evento no Google Calendar
  const createEvent = useCallback(async (eventData) => {
    if (!isAuthorized) {
      throw new Error('Não autorizado para acessar Google Calendar');
    }

    setLoading(true);
    setError(null);

    try {
      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: eventData.start.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: eventData.end.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      };

      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      setLoading(false);
      return response.result;
    } catch (err) {
      setError('Erro ao criar evento: ' + err.message);
      setLoading(false);
      throw err;
    }
  }, [isAuthorized]);

  // Atualizar evento no Google Calendar
  const updateEvent = useCallback(async (eventId, eventData) => {
    if (!isAuthorized) {
      throw new Error('Não autorizado para acessar Google Calendar');
    }

    setLoading(true);
    setError(null);

    try {
      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: eventData.start.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: eventData.end.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      const response = await window.gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event,
      });

      setLoading(false);
      return response.result;
    } catch (err) {
      setError('Erro ao atualizar evento: ' + err.message);
      setLoading(false);
      throw err;
    }
  }, [isAuthorized]);

  // Deletar evento do Google Calendar
  const deleteEvent = useCallback(async (eventId) => {
    if (!isAuthorized) {
      throw new Error('Não autorizado para acessar Google Calendar');
    }

    setLoading(true);
    setError(null);

    try {
      await window.gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });

      setLoading(false);
    } catch (err) {
      setError('Erro ao deletar evento: ' + err.message);
      setLoading(false);
      throw err;
    }
  }, [isAuthorized]);

  // Sincronizar tarefas com Google Calendar
  const syncTasksToCalendar = useCallback(async (tasks) => {
    if (!isAuthorized) {
      throw new Error('Não autorizado para acessar Google Calendar');
    }

    setLoading(true);
    setError(null);

    try {
      const results = [];
      
      for (const task of tasks) {
        // Apenas sincronizar tarefas que têm data de vencimento
        if (!task.dueDate) continue;

        const startDate = new Date(task.dueDate);
        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + 1); // Duração padrão de 1 hora

        const eventData = {
          title: `[Planner] ${task.title}`,
          description: `${task.description}\n\nCategoria: ${task.category}\nPrioridade: ${task.priority}`,
          start: startDate,
          end: endDate,
        };

        try {
          const event = await createEvent(eventData);
          results.push({ task, event, success: true });
        } catch (err) {
          results.push({ task, error: err.message, success: false });
        }
      }

      setLoading(false);
      return results;
    } catch (err) {
      setError('Erro na sincronização: ' + err.message);
      setLoading(false);
      throw err;
    }
  }, [isAuthorized, createEvent]);

  return {
    // Estado
    isGapiLoaded,
    isGisLoaded,
    isAuthorized,
    loading,
    error,
    isReady: isGapiLoaded && isGisLoaded,
    
    // Métodos de autenticação
    authorize,
    revoke,
    
    // Métodos de eventos
    listEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    
    // Sincronização
    syncTasksToCalendar,
    
    // Configuração
    hasCredentials: !!(API_KEY && CLIENT_ID),
  };
};

