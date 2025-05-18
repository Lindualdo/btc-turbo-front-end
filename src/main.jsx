import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import logger from './utils/logger'

// Adicionando configuração para exibir logs completos em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  logger.info('Ambiente de desenvolvimento detectado')
  console.log = (function(originalLog) {
    return function(...args) {
      originalLog.apply(console, args)
    }
  })(console.log)
}

// Log para verificar o carregamento da aplicação
logger.info('Iniciando BTC Turbo Dashboard...')

// Configuração global para ApexCharts
window.Apex = {
  chart: {
    foreColor: '#ccc',
    toolbar: {
      show: false
    },
  },
  stroke: {
    width: 3
  },
  dataLabels: {
    enabled: false
  },
  tooltip: {
    theme: 'dark'
  },
  grid: {
    borderColor: "#222",
    xaxis: {
      lines: {
        show: false
      }
    }
  }
};

// Verifica se a biblioteca ReactApexChart está disponível
logger.debug('ReactApexChart disponível:', typeof window.ApexCharts !== 'undefined');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)