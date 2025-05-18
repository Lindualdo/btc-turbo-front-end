import { useEffect, useState } from 'react'
import './styles/App.css'
import BTCTendenciaPanel from './components/BTCTendenciaPanel/BTCTendenciaPanel'
import logger from './utils/logger'

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    logger.info('App montado - inicializando dashboard...');
    
    // Monitor de status online/offline
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        logger.info('Conexão de internet restaurada');
        setLastUpdated(new Date());
      } else {
        logger.warn('Conexão de internet perdida');
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            logger.info('SW registrado com sucesso:', registration)
          })
          .catch(registrationError => {
            logger.error('SW falha no registro:', registrationError)
          })
      })
    }

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      logger.info('App desmontado');
    };
  }, []);

  // Atualizar o horário de atualização a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      if (navigator.onLine) {
        setLastUpdated(new Date());
      }
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="container mx-auto mb-6">
        <h1 className="text-3xl font-bold text-center py-6 text-btc-orange">
          BTC Turbo Dashboard
        </h1>
        <p className="text-center text-gray-400 max-w-2xl mx-auto">
          Análise avançada de indicadores técnicos para Bitcoin em múltiplos timeframes
        </p>

        {/* Status bar */}
        <div className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
          <div className="status-indicator"></div>
          <span>{isOnline ? 'Online' : 'Offline'}</span>
          {isOnline && (
            <span className="last-updated">
              Última atualização: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </header>
      
      <main className="container mx-auto">
        <BTCTendenciaPanel />
        {/* Outros painéis serão adicionados aqui */}
      </main>

      <footer className="container mx-auto mt-12 mb-4 text-center text-gray-500 text-sm">
        <div className="border-t border-gray-800 pt-4">
          <p>© 2025 BTC Turbo - Painel de Tendência Bitcoin</p>
          <div className="app-version">v0.1.0</div>
        </div>
      </footer>
    </div>
  )
}

export default App