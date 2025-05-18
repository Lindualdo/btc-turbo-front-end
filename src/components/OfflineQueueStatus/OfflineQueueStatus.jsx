import { useOfflineRequests } from '../../hooks/useOfflineRequests';

export const OfflineQueueStatus = () => {
  const { queueSize, isProcessing, processQueue } = useOfflineRequests();

  if (queueSize === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg shadow-lg">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {isProcessing ? (
            <svg className="animate-spin h-5 w-5 text-yellow-500" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg 
              className="h-5 w-5 text-yellow-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            {queueSize} pending {queueSize === 1 ? 'request' : 'requests'}
          </p>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            {isProcessing ? 'Processing...' : 'Waiting to sync'}
          </p>
        </div>
        {!isProcessing && navigator.onLine && (
          <button
            onClick={processQueue}
            className="ml-4 px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 
                     dark:bg-yellow-800 dark:text-yellow-100 rounded-md 
                     hover:bg-yellow-200 dark:hover:bg-yellow-700 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Sync Now
          </button>
        )}
      </div>
    </div>
  );
};