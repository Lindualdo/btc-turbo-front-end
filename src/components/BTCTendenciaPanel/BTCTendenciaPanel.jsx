import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import GaugeChart from '../GaugeChart/GaugeChart';
import logger from '../../utils/logger';
import './BTCTendenciaPanel.css';

// Dados mockados para teste
const MOCK_DATA = {
  "1d": {
    "ema9_x_ema21": {
      "resultado": "BULL",
      "score": 7.5
    },
    "price_x_ema9": {
      "resultado": "BULL",
      "score": 8.5
    },
    "price_x_ema21": {
      "resultado": "BULL",
      "score": 8.0
    },
    "tendencia_global": {
      "resultado": "BULL",
      "score": 8.0
    }
  },
  "4h": {
    "ema9_x_ema21": {
      "resultado": "BULL",
      "score": 6.5
    },
    "price_x_ema9": {
      "resultado": "BULL",
      "score": 7.0
    },
    "price_x_ema21": {
      "resultado": "BULL",
      "score": 7.5
    },
    "tendencia_global": {
      "resultado": "BULL",
      "score": 7.0
    }
  },
  "1h": {
    "ema9_x_ema21": {
      "resultado": "BEAR",
      "score": 4.0
    },
    "price_x_ema9": {
      "resultado": "BEAR",
      "score": 3.5
    },
    "price_x_ema21": {
      "resultado": "BEAR",
      "score": 3.0
    },
    "tendencia_global": {
      "resultado": "BEAR",
      "score": 3.5
    }
  },
  "15m": {
    "ema9_x_ema21": {
      "resultado": "NEUTRO",
      "score": 5.0
    },
    "price_x_ema9": {
      "resultado": "NEUTRO",
      "score": 4.5
    },
    "price_x_ema21": {
      "resultado": "NEUTRO",
      "score": 5.5
    },
    "tendencia_global": {
      "resultado": "NEUTRO",
      "score": 5.0
    }
  }
};

const BTCTendenciaPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [useMockData, setUseMockData] = useState(true); // Use mock data flag
  const apiCallCountRef = useRef(0);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (useMockData) {
        logger.info('Usando dados mockados para teste');
        setData(MOCK_DATA);
      } else {
        apiCallCountRef.current += 1;
        logger.info(`Buscando dados da API... (chamada #${apiCallCountRef.current})`);
        
        const response = await axios.get('https://btc-turbo-api-production.up.railway.app/api/v1/analise-tecnica-emas', {
          timeout: 10000 // 10 segundos timeout
        });
        
        logger.debug('Dados recebidos da API:', response.data);
        
        // Verificar se os dados têm a estrutura esperada
        if (!response.data || typeof response.data !== 'object') {
          throw new Error('Formato de dados inválido recebido da API');
        }
        
        setData(response.data);
      }
    } catch (err) {
      logger.error('Erro ao buscar dados:', err);
      setError(`Falha ao carregar dados: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // atualiza a cada minuto
    return () => clearInterval(interval);
  }, [useMockData]); // Re-fetch quando a fonte de dados mudar

  const handleTimeframeChange = (timeframe) => {
    logger.debug(`Mudando timeframe para: ${timeframe}`);
    setSelectedTimeframe(timeframe);
  };

  const toggleDataSource = () => {
    setUseMockData(!useMockData);
  };

  // Função para gerar classificação com base no score
  const getClassificacao = (score) => {
    if (score >= 7.5) return 'MUITO BULLISH';
    if (score >= 6.0) return 'BULLISH';
    if (score >= 5.0) return 'LEVEMENTE BULLISH';
    if (score > 4.0) return 'NEUTRO';
    if (score >= 3.0) return 'LEVEMENTE BEARISH';
    if (score >= 1.5) return 'BEARISH';
    return 'MUITO BEARISH';
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
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchData} className="retry-button">Tentar novamente</button>
        </div>
      ) : data ? (
        <div className="gauge-container-grid">
          {selectedTimeframe && data[selectedTimeframe] ? (
            <>
              {data[selectedTimeframe].ema9_x_ema21 && (
                <GaugeChart
                  title="EMA9 x EMA21"
                  score={data[selectedTimeframe].ema9_x_ema21.score}
                  classificacao={getClassificacao(data[selectedTimeframe].ema9_x_ema21.score)}
                  timeframe={selectedTimeframe}
                />
              )}
              
              {data[selectedTimeframe].price_x_ema9 && (
                <GaugeChart
                  title="Preço x EMA9"
                  score={data[selectedTimeframe].price_x_ema9.score}
                  classificacao={getClassificacao(data[selectedTimeframe].price_x_ema9.score)}
                  timeframe={selectedTimeframe}
                />
              )}
              
              {data[selectedTimeframe].price_x_ema21 && (
                <GaugeChart
                  title="Preço x EMA21"
                  score={data[selectedTimeframe].price_x_ema21.score}
                  classificacao={getClassificacao(data[selectedTimeframe].price_x_ema21.score)}
                  timeframe={selectedTimeframe}
                />
              )}
              
              {data[selectedTimeframe].tendencia_global && (
                <GaugeChart
                  title="Tendência Global"
                  score={data[selectedTimeframe].tendencia_global.score}
                  classificacao={getClassificacao(data[selectedTimeframe].tendencia_global.score)}
                  timeframe={selectedTimeframe}
                />
              )}
            </>
          ) : (
            <div className="error">
              Timeframe selecionado não disponível nos dados: {selectedTimeframe}
            </div>
          )}
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