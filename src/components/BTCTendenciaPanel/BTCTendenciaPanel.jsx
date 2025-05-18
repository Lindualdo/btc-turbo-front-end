import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GaugeChart from '../GaugeChart';
import { logger } from '../../utils/logger';
import './BTCTendenciaPanel.css';

const BTCTendenciaPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeFrames, setSelectedTimeFrames] = useState(['15m', '1h', '4h', '1d', '1w']);

  const fetchData = async () => {
    try {
      logger.info('Iniciando chamada à API de análise técnica de EMAs');
      setLoading(true);
      const response = await axios.get('https://btc-turbo-api-production.up.railway.app/api/v1/analise-tecnica-emas');
      logger.debug('Dados recebidos da API:', response.data);
      setData(response.data);
      setError(null);
    } catch (err) {
      logger.error('Erro ao buscar dados da API:', err);
      setError('Falha ao carregar dados. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    logger.debug('BTCTendenciaPanel montado');
    fetchData();
    
    const interval = setInterval(() => {
      logger.info('Atualizando dados da API (intervalo de 5 minutos)');
      fetchData();
    }, 5 * 60 * 1000);

    return () => {
      logger.debug('BTCTendenciaPanel desmontado, limpando intervalo');
      clearInterval(interval);
    };
  }, []);

  const toggleTimeFrame = (timeFrame) => {
    logger.debug(`Toggle timeframe: ${timeFrame}`);
    setSelectedTimeFrames((prev) =>
      prev.includes(timeFrame)
        ? prev.filter((tf) => tf !== timeFrame)
        : [...prev, timeFrame]
    );
  };

  // Função para renderizar um gauge baseado no timeframe
  const renderGauge = (timeFrame, title) => {
    if (!data || !data.emas || !data.emas[timeFrame]) return null;
    
    const { score, classificacao, observacao } = data.emas[timeFrame].analise;
    logger.debug(`Renderizando gauge para ${timeFrame} com score ${score}`);
    
    return (
      <div className="gauge-container">
        <GaugeChart
          score={score}
          title={title}
          timeframe={timeFrame}
          classificacao={classificacao}
          observacao={observacao}
          size="medium"
        />
      </div>
    );
  };

  return (
    <div className="btc-tendencia-panel">
      <h1>Análise de Tendência de Alta do Bitcoin</h1>
      
      {loading && <div className="loading">Carregando dados...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {/* DEBUG: Exibindo dados brutos recebidos da API */}
      <div className="debug-data" style={{ margin: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px', maxHeight: '200px', overflow: 'auto', whiteSpace: 'pre-wrap', textAlign: 'left', fontSize: '12px', color: 'black' }}>
        <h3>Dados brutos da API (Debug):</h3>
        {data ? JSON.stringify(data, null, 2) : 'Nenhum dado recebido'}
      </div>
      
      {data && (
        <>
          <div className="price-info">
            <div className="current-price">
              <span className="label">Preço Atual:</span>
              <span className="value">${data.preco_atual?.toLocaleString()}</span>
            </div>
            <div className="current-volume">
              <span className="label">Volume:</span>
              <span className="value">{data.volume_atual?.toFixed(2)} BTC</span>
            </div>
          </div>

          <div className="consolidated-gauge">
            <h2>Tendência Geral</h2>
            {data.consolidado && (
              <GaugeChart
                score={data.consolidado.score}
                title="Consolidado"
                timeframe="consolidado"
                classificacao={data.consolidado.classificacao}
                observacao={data.consolidado.racional}
                size="large"
              />
            )}
          </div>

          <div className="timeframe-filters">
            <h3>Filtrar Timeframes:</h3>
            <div className="filter-buttons">
              {['15m', '1h', '4h', '1d', '1w'].map((tf) => (
                <button
                  key={tf}
                  className={`filter-btn ${selectedTimeFrames.includes(tf) ? 'active' : ''}`}
                  onClick={() => toggleTimeFrame(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="timeframe-gauges">
            {selectedTimeFrames.includes('15m') && renderGauge('15m', '15 Minutos')}
            {selectedTimeFrames.includes('1h') && renderGauge('1h', '1 Hora')}
            {selectedTimeFrames.includes('4h') && renderGauge('4h', '4 Horas')}
            {selectedTimeFrames.includes('1d') && renderGauge('1d', '1 Dia')}
            {selectedTimeFrames.includes('1w') && renderGauge('1w', '1 Semana')}
          </div>
        </>
      )}
    </div>
  );
};

export default BTCTendenciaPanel;