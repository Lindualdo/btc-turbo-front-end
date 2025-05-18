import { useState, useEffect } from 'react';
import { registerServiceWorker, checkForUpdates, forcePageReload } from '../utils/pwaUtils';

const useServiceWorker = () => {
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('idle'); // 'idle' | 'checking' | 'available' | 'updating'

  useEffect(() => {
    const onServiceWorkerUpdate = (registration) => {
      setWaitingWorker(registration.waiting);
      setNewVersionAvailable(true);
      setUpdateStatus('available');
    };

    const registerSW = async () => {
      try {
        const registration = await registerServiceWorker();
        
        // Verifica se já existe uma versão esperando para ser ativada
        if (registration?.waiting) {
          setWaitingWorker(registration.waiting);
          setNewVersionAvailable(true);
          setUpdateStatus('available');
        }

        // Listener para mudanças no controller (quando uma nova versão é ativada)
        registration?.addEventListener('controllerchange', () => {
          setUpdateStatus('updating');
          window.location.reload();
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
        setRegistrationError(error.message);
      }
    };

    registerSW();

    // Verifica atualizações periodicamente
    const updateCheckInterval = setInterval(() => {
      setUpdateStatus('checking');
      checkForUpdates()
        .then(() => setUpdateStatus('idle'))
        .catch((error) => {
          console.error('Update check failed:', error);
          setUpdateStatus('idle');
        });
    }, 60 * 60 * 1000); // Verifica a cada hora

    return () => {
      clearInterval(updateCheckInterval);
    };
  }, []);

  const updateServiceWorker = () => {
    if (!waitingWorker) return;

    try {
      setUpdateStatus('updating');
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setNewVersionAvailable(false);
      forcePageReload();
    } catch (error) {
      console.error('Failed to update service worker:', error);
      setUpdateStatus('available');
    }
  };

  return {
    newVersionAvailable,
    updateServiceWorker,
    registrationError,
    updateStatus,
    isUpdating: updateStatus === 'updating',
    isChecking: updateStatus === 'checking'
  };
};

export default useServiceWorker;