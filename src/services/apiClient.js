import axios from 'axios';
import { retry } from '../utils/retry';
import { offlineQueue } from './offlineQueue';

const BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor para requests
apiClient.interceptors.request.use(
  async (config) => {
    // Adiciona timestamp para evitar cache indesejado
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para responses
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se não está online, adiciona à fila offline
    if (!navigator.onLine) {
      await offlineQueue.add(originalRequest);
      throw new Error('Request queued for offline processing');
    }

    // Implementa retry apenas para erros específicos
    if (
      (error.response?.status === 429 || // Rate limit
       error.response?.status === 503 || // Service unavailable
       error.code === 'ECONNABORTED') && // Timeout
      !originalRequest._retry
    ) {
      return retry(async () => {
        originalRequest._retry = true;
        return apiClient(originalRequest);
      }, {
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 5000,
        factor: 2,
      });
    }

    return Promise.reject(error);
  }
);

export { apiClient };