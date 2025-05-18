import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Pré-cache de recursos estáticos
precacheAndRoute(self.__WB_MANIFEST);

// Listener para skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Estratégia para dados em tempo real
const socketFailOver = async (request) => {
  try {
    const response = await fetch(request);
    if (response.ok) return response;
    throw new Error('Network response was not ok');
  } catch (error) {
    const cache = await caches.open('api-cache');
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      const headers = new Headers(cachedResponse.headers);
      headers.append('X-Is-Offline', 'true');
      return new Response(await cachedResponse.blob(), {
        status: 200,
        headers: headers
      });
    }
    throw error;
  }
};

// Registro de rotas específicas
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/bitcoin/price'),
  new NetworkFirst({
    cacheName: 'bitcoin-price-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 minutos
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ],
    networkTimeoutSeconds: 3
  })
);

// Cache para recursos estáticos
registerRoute(
  ({ request }) => request.destination === 'image' ||
                   request.destination === 'style' ||
                   request.destination === 'script' ||
                   request.destination === 'font',
  new CacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
      })
    ]
  })
);