import { useState, useEffect } from 'react';
import { offlineQueue } from '../services/offlineQueue';

export const useOfflineRequests = () => {
  const [queueSize, setQueueSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const updateQueueSize = async () => {
      const size = await offlineQueue.getQueueSize();
      setQueueSize(size);
    };

    const handleQueueUpdate = () => {
      updateQueueSize();
      setIsProcessing(offlineQueue.isProcessing);
    };

    window.addEventListener('offlineQueueUpdate', handleQueueUpdate);
    updateQueueSize();

    return () => {
      window.removeEventListener('offlineQueueUpdate', handleQueueUpdate);
    };
  }, []);

  const processQueue = () => {
    offlineQueue.process();
  };

  return {
    queueSize,
    isProcessing,
    processQueue,
  };
};