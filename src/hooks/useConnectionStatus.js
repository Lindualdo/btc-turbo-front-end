import { useState, useEffect, useCallback } from 'react';
import { useServiceWorkerContext } from '../context/ServiceWorkerContext';

export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastOnline, setLastOnline] = useState(Date.now());
  const [reconnectionAttempts, setReconnectionAttempts] = useState(0);
  const { registration } = useServiceWorkerContext();

  const checkConnection = useCallback(async () => {
    try {
      const response = await fetch('/api/health-check', {
        method: 'HEAD',
        cache: 'no-cache',
        timeout: 3000
      });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  const handleOnline = useCallback(async () => {
    const hasConnection = await checkConnection();
    
    if (hasConnection) {
      setIsOnline(true);
      setLastOnline(Date.now());
      setReconnectionAttempts(0);
      
      // Tenta sincronizar dados offline quando volta online
      if (registration?.sync) {
        try {
          await registration.sync.register('syncData');
        } catch (error) {
          console.error('Background sync failed:', error);
        }
      }
    } else {
      handleOffline();
    }
  }, [checkConnection, registration]);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setReconnectionAttempts(prev => prev + 1);
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificação periódica da conexão
    const intervalId = setInterval(async () => {
      const hasConnection = await checkConnection();
      if (hasConnection !== isOnline) {
        hasConnection ? handleOnline() : handleOffline();
      }
    }, 30000); // Verifica a cada 30 segundos

    // Verificação inicial
    handleOnline();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [handleOnline, handleOffline, checkConnection, isOnline]);

  // Retorna o estado e funções utilitárias
  return {
    isOnline,
    lastOnline,
    reconnectionAttempts,
    checkConnection,
    // Tempo desde a última conexão em minutos
    timeSinceLastOnline: Math.floor((Date.now() - lastOnline) / 60000)
  };
};