import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import logger from './utils/logger'

// Garantir que a biblioteca ApexCharts esteja disponível globalmente
try {
  // Importando ApexCharts globalmente para garantir que ele esteja disponível
  import('apexcharts').then((ApexCharts) => {
    window.ApexCharts = ApexCharts.default || ApexCharts;
    logger.info('ApexCharts carregado dinamicamente com sucesso:', typeof window.ApexCharts);
    
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
  }).catch(error => {
    logger.error('Falha ao carregar ApexCharts dinamicamente:', error);
  });
} catch (error) {
  logger.error('Erro ao importar ApexCharts:', error.message);
}

// Importando React-ApexCharts explicitamente para garantir que esteja disponível
try {
  import('react-apexcharts').then((ReactApexChartModule) => {
    window.ReactApexChart = ReactApexChartModule.default || ReactApexChartModule;
    logger.info('ReactApexChart carregado com sucesso:', typeof window.ReactApexChart);
  }).catch(error => {
    logger.error('Falha ao carregar ReactApexChart:', error);
  });
} catch (error) {
  logger.error('Erro ao importar ReactApexChart:', error.message);
}

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)