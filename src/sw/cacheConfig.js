// Cache configuration settings
export const CACHE_CONFIG = {
  version: 'v1',
  name: 'btc-turbo-cache',
  staticAssets: [
    '/',
    '/index.html',
    '/offline.html',
    '/manifest.json',
    '/favicon.ico',
    '/logo.png',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/icons/apple-touch-icon.png',
    '/icons/maskable-icon.png',
  ],
  dynamicCacheSettings: {
    maxEntries: 50,
    maxAgeSeconds: 24 * 60 * 60, // 24 hours
  },
  // API endpoints to cache
  apiEndpoints: {
    bitcoin: {
      pattern: /\/api\/bitcoin/,
      strategy: 'staleWhileRevalidate',
      cacheDuration: 5 * 60, // 5 minutes
    },
    metrics: {
      pattern: /\/api\/metrics/,
      strategy: 'networkFirst',
      cacheDuration: 15 * 60, // 15 minutes
    },
  },
};