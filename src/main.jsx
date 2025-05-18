import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import logger from './utils/logger'

// Importando ApexCharts globalmente para garantir que ele esteja disponível
import ApexCharts from 'apexcharts';

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

// Verificando se ApexCharts foi carregado corretamente
logger.info('ApexCharts disponível:', typeof ApexCharts !== 'undefined');

// Configuração global para ApexCharts
window.Apex = {
  chart: {
    foreColor: '#ccc',
    toolbar: {
      show: false
    },
    fontFamily: 'Inter, "Segoe UI", Roboto, sans-serif',
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      dynamicAnimation: {
        enabled: true
      }
    }
  },
  stroke: {
    width: 3,
    curve: 'smooth',
  },
  dataLabels: {
    enabled: false
  },
  tooltip: {
    theme: 'dark',
    style: {
      fontSize: '14px'
    }
  },
  grid: {
    borderColor: "#222",
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  markers: {
    size: 5,
    strokeWidth: 0,
    hover: {
      size: 7
    }
  }
};

// Verifica se a biblioteca ReactApexChart está disponível
try {
  const ReactApexChart = require('react-apexcharts');
  logger.info('ReactApexChart importado com sucesso:', typeof ReactApexChart !== 'undefined');
} catch (error) {
  logger.error('Erro ao importar ReactApexChart:', error.message);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)