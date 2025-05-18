import { useConnectionStatus } from '../../hooks/useConnectionStatus';
import { useServiceWorkerContext } from '../../context/ServiceWorkerContext';
import { useState, useEffect } from 'react';

export const ConnectionStatus = () => {
  const { isOnline, lastOnline, reconnectionAttempts, timeSinceLastOnline } = useConnectionStatus();
  const [showNotification, setShowNotification] = useState(false);
  const { registration } = useServiceWorkerContext();

  useEffect(() => {
    // Mostra notificação quando o status muda
    setShowNotification(true);
    
    // Auto-hide para online após 3 segundos
    if (isOnline) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showNotification) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 p-4 rounded-lg shadow-lg transition-all duration-300 transform ${
        showNotification ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      } ${
        isOnline ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'
      }`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {isOnline ? (
            <svg
              className="h-5 w-5 text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <p
            className={`text-sm font-medium ${
              isOnline ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
            }`}
          >
            {isOnline ? 'Connected' : 'You are offline'}
          </p>
          <p
            className={`mt-1 text-sm ${
              isOnline ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
            }`}
          >
            {isOnline
              ? 'Your connection has been restored'
              : reconnectionAttempts > 0
              ? `Attempting to reconnect... (${reconnectionAttempts})`
              : 'Checking connection...'}
          </p>
          {!isOnline && timeSinceLastOnline > 1 && (
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              Last online: {timeSinceLastOnline} minutes ago
            </p>
          )}
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={() => setShowNotification(false)}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isOnline
                  ? 'text-green-500 hover:bg-green-100 dark:hover:bg-green-800 focus:ring-green-600'
                  : 'text-red-500 hover:bg-red-100 dark:hover:bg-red-800 focus:ring-red-600'
              }`}
            >
              <span className="sr-only">Dismiss</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};