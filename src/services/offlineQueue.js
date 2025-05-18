import { openDB } from 'idb';

class OfflineQueue {
  constructor() {
    this.dbPromise = this.initDB();
    this.isProcessing = false;
  }

  async initDB() {
    return openDB('offlineQueueDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('requests')) {
          db.createObjectStore('requests', { 
            keyPath: 'id',
            autoIncrement: true 
          });
        }
      },
    });
  }

  async add(request) {
    const db = await this.dbPromise;
    const serializedRequest = {
      url: request.url,
      method: request.method,
      data: request.data,
      headers: request.headers,
      timestamp: Date.now(),
    };

    await db.add('requests', serializedRequest);
    this.notifyQueueUpdate();
  }

  async process() {
    if (this.isProcessing || !navigator.onLine) return;

    this.isProcessing = true;
    const db = await this.dbPromise;
    
    try {
      const requests = await db.getAll('requests');
      
      for (const request of requests) {
        try {
          // Importa o cliente API dinamicamente para evitar referência circular
          const { apiClient } = await import('./apiClient');
          
          await apiClient({
            url: request.url,
            method: request.method,
            data: request.data,
            headers: request.headers,
          });
          
          // Remove request processada com sucesso
          await db.delete('requests', request.id);
        } catch (error) {
          console.error('Failed to process queued request:', error);
          
          // Se o erro não for de rede, remove da fila para evitar loop infinito
          if (!error.isAxiosError || !error.code === 'ECONNABORTED') {
            await db.delete('requests', request.id);
          }
        }
      }
    } finally {
      this.isProcessing = false;
      this.notifyQueueUpdate();
    }
  }

  async getQueueSize() {
    const db = await this.dbPromise;
    return await db.count('requests');
  }

  async getQueuedRequests() {
    const db = await this.dbPromise;
    return await db.getAll('requests');
  }

  async clearQueue() {
    const db = await this.dbPromise;
    await db.clear('requests');
    this.notifyQueueUpdate();
  }

  notifyQueueUpdate() {
    window.dispatchEvent(new CustomEvent('offlineQueueUpdate'));
  }
}

export const offlineQueue = new OfflineQueue();

// Processa a fila quando voltar online
window.addEventListener('online', () => {
  offlineQueue.process();
});