import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GaugeChart from '../GaugeChart/GaugeChart';
import logger from '../../utils/logger';
import './BTCTendenciaPanel.css';

// Dados mockados para teste
const MOCK_DATA = {
  "1d": {
    "ema9_x_ema21": {
      "resultado": "BULL",
      "score": 75
    },
    "price_x_ema9": {
      "resultado": "BULL",
      "score": 85
    },
    "price_x_ema21": {
      "resultado": "BULL",
      "score": 80
    },
    "tendencia_global": {
      "resultado": "BULL",
      "score": 80
    }
  },
  "4h": {
    "ema9_x_ema21": {
      "resultado": "BULL",
      "score": 65
    },
    "price_x_ema9": {
      "resultado": "BULL",
      "score": 70
    },
    "price_x_ema21": {
      "resultado": "BULL",
      "score": 75
    },
    "tendencia_global": {
      "resultado": "BULL",
      "score": 70
    }
  },
  "1h": {
    "ema9_x_ema21": {
      "resultado": "BEAR",
      "score": 40
    },
    "price_x_ema9": {
      "resultado": "BEAR",
      "score": 35
    },
    "price_x_ema21": {
      "resultado": "BEAR",
      "score": 30
    },
    "tendencia_global": {
      "resultado": "BEAR",
      "score": 35
    }
  },
  "15m": {
    "ema9_x_ema21": {
      "resultado": "NEUTRO",
      "score": 50
    },
    "price_x_ema9": {
      "resultado": "NEUTRO",
      "score": 45
    },
    "price_x_ema21": {
      "resultado": "NEUTRO",
      "score": 55
    },
    "tendencia_global": {
      "resultado": "NEUTRO",
      "score": 50
    }
  }
};

const BTCTendenciaPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [useMockData, setUseMockData] = useState(true); // Use mock data flag

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (useMockData) {
        logger.info('Usando dados mockados para teste');
        setData(MOCK_DATA);
      } else {
        logger.info('Buscando dados da API...');
        const response = await axios.get('https://btc-turbo-api-production.up.railway.app/api/v1/analise-tecnica-emas');
        logger.debug('Dados recebidos da API:', response.data);
        setData(response.data);
      }
    } catch (err) {
      logger.error('Erro ao buscar dados:', err);
      setError('Falha ao carregar dados. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  const handleTimeframeChange = (timeframe) => {
    logger.debug(`Mudando timeframe para: ${timeframe}`);
    setSelectedTimeframe(timeframe);
  };

  const toggleDataSource = () => {
    setUseMockData(!useMockData);
    fetchData();
  };

  return (
    <div className="btc-tendencia-panel">
      <div className="panel-header">
        <h2>Análise de Tendência BTC</h2>
        <div className="timeframe-selector">
          <button
            className={selectedTimeframe === '15m' ? 'active' : ''}
            onClick={() => handleTimeframeChange('15m')}
          >
            15m
          </button>
          <button
            className={selectedTimeframe === '1h' ? 'active' : ''}
            onClick={() => handleTimeframeChange('1h')}
          >
            1h
          </button>
          <button
            className={selectedTimeframe === '4h' ? 'active' : ''}
            onClick={() => handleTimeframeChange('4h')}
          >
            4h
          </button>
          <button
            className={selectedTimeframe === '1d' ? 'active' : ''}
            onClick={() => handleTimeframeChange('1d')}
          >
            1d
          </button>
        </div>
      </div>

      <div className="debug-panel">
        <h3>Usando: {useMockData ? 'Dados Mockados' : 'Dados da API'}</h3>
        <button onClick={toggleDataSource}>
          Alternar fonte de dados
        </button>
      </div>

      {loading ? (
        <div className="loading">Carregando dados...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : data ? (
        <div className="gauge-container">
          <GaugeChart
            title="EMA9 x EMA21"
            score={data[selectedTimeframe]?.ema9_x_ema21?.score || 0}
            timeframe={selectedTimeframe}
          />
          <GaugeChart
            title="Preço x EMA9"
            score={data[selectedTimeframe]?.price_x_ema9?.score || 0}
            timeframe={selectedTimeframe}
          />
          <GaugeChart
            title="Preço x EMA21"
            score={data[selectedTimeframe]?.price_x_ema21?.score || 0}
            timeframe={selectedTimeframe}
          />
          <GaugeChart
            title="Tendência Global"
            score={data[selectedTimeframe]?.tendencia_global?.score || 0}
            timeframe={selectedTimeframe}
          />
        </div>
      ) : (
        <div className="error">Nenhum dado disponível</div>
      )}

      <div className="debug-section">
        <h4>Dados brutos da API (Debug):</h4>
        {data ? (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <p>Nenhum dado recebido</p>
        )}
      </div>
    </div>
  );
};

export default BTCTendenciaPanel;