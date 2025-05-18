import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BTCTendenciaPanel.css';
import GaugeChart from '../GaugeChart';
import logger from '../../utils/logger';

// Constantes para os timeframes
const TIMEFRAMES = {
  '15m': '15 minutos',
  '1h': '1 hora',
  '4h': '4 horas',
  '1d': '1 dia',
  '1w': '1 semana'
};

const BTCTendenciaPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframes, setSelectedTimeframes] = useState(
    Object.keys(TIMEFRAMES).reduce((acc, tf) => ({ ...acc, [tf]: true }), {})
  );

  // Função para buscar dados da API
  const fetchData = async () => {
    setLoading(true);
    try {
      logger.info('Buscando dados de análise técnica...');
      const response = await axios.get('https://btc-turbo-api-production.up.railway.app/api/v1/analise-tecnica-emas');
      logger.debug('Dados recebidos:', response.data);
      setData(response.data);
      setError(null);
    } catch (err) {
      logger.error('Erro ao buscar dados de tendência:', err);
      setError('Falha ao carregar dados de tendência. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Efeito para buscar dados ao carregar o componente
  useEffect(() => {
    fetchData();

    // Atualizar dados a cada 5 minutos
    const interval = setInterval(fetchData, 300000);
    
    return () => clearInterval(interval);
  }, []);

  // Alternar seleção de timeframe
  const toggleTimeframe = (timeframe) => {
    setSelectedTimeframes(prev => ({
      ...prev,
      [timeframe]: !prev[timeframe]
    }));
  };

  // Renderizar painel de carregamento
  if (loading && !data) {
    return (
      <div className="btc-tendencia-panel loading">
        <div className="loading-spinner"></div>
        <p>Carregando análise de tendência...</p>
      </div>
    );
  }

  // Renderizar painel de erro
  if (error) {
    return (
      <div className="btc-tendencia-panel error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button onClick={fetchData} className="retry-button">
          Tentar novamente
        </button>
      </div>
    );
  }

  logger.renderLog('BTCTendenciaPanel', { 
    timeframes: Object.keys(selectedTimeframes).filter(k => selectedTimeframes[k]),
    hasData: !!data 
  });

  // Renderizar painel principal com os dados
  return (
    <div className="btc-tendencia-panel">
      <div className="panel-header">
        <div className="panel-title">
          <h2>Análise de Tendência BTC</h2>
          <p className="price-info">
            <span className="price-label">Preço Atual:</span>
            <span className="price-value">${data?.preco_atual.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}</span>
            <span className="volume-label">Volume 24h:</span>
            <span className="volume-value">{data?.volume_atual.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })} BTC</span>
          </p>
        </div>
        <div className="panel-actions">
          <button onClick={fetchData} className="refresh-button" title="Atualizar dados">
            <span className="refresh-icon">↻</span>
          </button>
        </div>
      </div>

      {/* Filtro de timeframes */}
      <div className="timeframe-filters">
        {Object.entries(TIMEFRAMES).map(([key, label]) => (
          <button
            key={key}
            className={`timeframe-filter ${selectedTimeframes[key] ? 'active' : ''}`}
            onClick={() => toggleTimeframe(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Gráfico consolidado principal */}
      <div className="consolidated-gauge">
        <GaugeChart
          score={data?.consolidado.score || 0}
          title="Tendência Bitcoin Consolidada"
          classification={data?.consolidado.classificacao || ""}
          observacao={data?.consolidado.racional || ""}
          size="large"
        />
      </div>

      {/* Gráficos por timeframe */}
      <div className="timeframe-gauges">
        {Object.keys(TIMEFRAMES)
          .filter(timeframe => selectedTimeframes[timeframe])
          .map(timeframe => (
            data?.emas[timeframe] && (
              <GaugeChart
                key={timeframe}
                score={data.emas[timeframe].analise.score || 0}
                title={`Score de Tendência`}
                timeframe={TIMEFRAMES[timeframe]}
                classification={data.emas[timeframe].analise.classificacao || ""}
                observacao={data.emas[timeframe].analise.observacao || ""}
                size="medium"
              />
            )
          ))
        }
      </div>

      {/* Rodapé com informações adicionais */}
      <div className="panel-footer">
        <div className="data-timestamp">
          Última atualização: {new Date().toLocaleString()}
        </div>
        <div className="data-hint">
          * O score é calculado com base no alinhamento das EMAs e posição do preço
        </div>
      </div>
    </div>
  );
};

export default BTCTendenciaPanel;