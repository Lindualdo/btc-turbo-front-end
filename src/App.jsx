import { useEffect } from 'react'
import './styles/App.css'

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
    <div className="min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-center py-8">
        BTC Turbo Dashboard
      </h1>
      {/* Components will be added here */}
    </div>
  )
}

export default App