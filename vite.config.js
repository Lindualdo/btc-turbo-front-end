import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@utils': resolve(__dirname, './src/utils'),
      '@styles': resolve(__dirname, './src/styles')
    }
  },
  
  build: {
    // Configurações de otimização de build
    sourcemap: process.env.NODE_ENV !== 'production',
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa bibliotecas grandes em chunks separados
          'vendor': ['react', 'react-dom'],
          'charts': ['apexcharts', 'react-apexcharts'],
          'utils': ['axios']
        }
      }
    },
    // Relatório de tamanho do bundle
    reportCompressedSize: true
  },
  
  plugins: [
    react({
      // Inclui logs de renderização em desenvolvimento
      include: "**/*.jsx",
      babel: {
        plugins: [
          process.env.NODE_ENV !== 'production' && [
            'babel-plugin-transform-react-remove-prop-types', 
            { removeImport: true }
          ]
        ].filter(Boolean)
      }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'BTC Turbo Dashboard',
        short_name: 'BTC Turbo',
        description: 'Bitcoin Analytics Dashboard',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/maskable-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\..*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
              }
            }
          }
        ]
      },
      devOptions: {
        // Ativa PWA em desenvolvimento
        enabled: true,
        // Mostra as opções de registro durante desenvolvimento
        type: 'module'
      }
    })
  ],
  
  server: {
    // Configuração do servidor de desenvolvimento
    port: 3000,
    strictPort: true,
    host: true,
    cors: true,
    hmr: {
      // Hot Module Replacement
      overlay: true
    }
  }
})