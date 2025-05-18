import { useEffect } from 'react'
import './styles/App.css'
import BTCTendenciaPanel from './components/BTCTendenciaPanel'

function App() {
  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('SW registered: ', registration)
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError)
          })
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="container mx-auto mb-6">
        <h1 className="text-3xl font-bold text-center py-6 text-btc-orange">
          BTC Turbo Dashboard
        </h1>
        <p className="text-center text-gray-400 max-w-2xl mx-auto">
          Análise avançada de indicadores técnicos para Bitcoin em múltiplos timeframes
        </p>
      </header>
      
      <main className="container mx-auto">
        <BTCTendenciaPanel />
        {/* Outros painéis serão adicionados aqui */}
      </main>

      <footer className="container mx-auto mt-12 mb-4 text-center text-gray-500 text-sm">
        <div className="border-t border-gray-800 pt-4">
          <p>© 2025 BTC Turbo - Painel de Tendência Bitcoin</p>
        </div>
      </footer>
    </div>
  )
}

export default App