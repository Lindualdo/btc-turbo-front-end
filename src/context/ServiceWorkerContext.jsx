import { createContext, useContext } from 'react';
import { useServiceWorker } from '../hooks/useServiceWorker';

const ServiceWorkerContext = createContext(null);

export const ServiceWorkerProvider = ({ children }) => {
  const serviceWorkerUtils = useServiceWorker();

  return (
    <ServiceWorkerContext.Provider value={serviceWorkerUtils}>
      {children}
      {serviceWorkerUtils.updateAvailable && <UpdateNotification />}
      {serviceWorkerUtils.error && (
        <ErrorNotification 
          error={serviceWorkerUtils.error}
          onDismiss={() => serviceWorkerUtils.dismissUpdate()} 
        />
      )}
    </ServiceWorkerContext.Provider>
  );
};

// Hook para fácil acesso ao contexto
export const useServiceWorkerContext = () => {
  const context = useContext(ServiceWorkerContext);
  if (!context) {
    throw new Error('useServiceWorkerContext must be used within a ServiceWorkerProvider');
  }
  return context;
};

// Componente de notificação de update
const UpdateNotification = () => {
  const { updateServiceWorker, dismissUpdate } = useServiceWorkerContext();

  return (
    <div className="fixed bottom-4 right-4 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg shadow-lg">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v4a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Update Available
          </p>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
            A new version is available. Update now?
          </p>
        </div>
        <div className="ml-auto pl-3 flex space-x-2">
          <button
            onClick={updateServiceWorker}
            className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update
          </button>
          <button
            onClick={dismissUpdate}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de notificação de erro
const ErrorNotification = ({ error, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-red-50 dark:bg-red-900 p-4 rounded-lg shadow-lg">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Error updating application
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            {error.message}
          </div>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={onDismiss}
            className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};