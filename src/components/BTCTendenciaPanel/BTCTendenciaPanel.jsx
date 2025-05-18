import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GaugeChart from '../GaugeChart/GaugeChart';
import logger from '../../utils/logger';
import { DebugData } from '../DebugData/DebugData';

const BTCTendenciaPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'https://btc-turbo-api-production.up.railway.app/api/v1/analise-tecnica-emas';

  // Função mock para testes quando a API não estiver disponível
  const getMockData = () => {
    return {
      "date": "2023-05-10",
      "price": 27500,
      "ema9": 27200,
      "ema21": 27000,
      "ema55": 26800,
      "ema200": 26000,
      "tendencia_curto_prazo": 85,
      "tendencia_medio_prazo": 75,
      "tendencia_longo_prazo": 60
    };
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Configuração avançada do Axios
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
      
      const response = await axios.get(API_URL, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.status === 200 && response.data) {
        logger.debug('Dados recebidos da API:', response.data);
        setData(response.data);
      } else {
        throw new Error(`Resposta inválida. Status: ${response.status}`);
      }
    } catch (err) {
      logger.error('Erro ao buscar dados da API:', err);
      
      if (err.name === 'AbortError') {
        setError('Timeout ao acessar a API. Por favor, tente novamente mais tarde.');
      } else if (err.response) {
        // Erro de resposta da API (4xx, 5xx)
        setError(`Erro ${err.response.status}: ${err.response.statusText}`);
      } else if (err.request) {
        // Requisição feita mas sem resposta
        setError('Servidor não respondeu. Verificando dados alternativos...');
        
        // Usar dados mockados como fallback
        setData(getMockData());
        logger.info('Usando dados mockados como fallback');
      } else {
        // Erro na configuração da requisição
        setError(`Erro ao configurar requisição: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Atualizar a cada 5 minutos
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Verificar disponibilidade do CORS fazendo uma requisição OPTIONS
  useEffect(() => {
    const checkCORS = async () => {
      try {
        await axios({
          method: 'OPTIONS',
          url: API_URL,
          timeout: 5000
        });
        logger.info('CORS está configurado corretamente');
      } catch (err) {
        logger.warn('Possível problema de CORS detectado:', err.message);
      }
    };
    
    checkCORS();
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md h-full">
      <h2 className="text-xl font-bold text-white mb-4">Tendência BTC</h2>
      
      {loading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-800 bg-opacity-30 border border-red-500 text-red-200 p-3 rounded-md mb-4">
          <p className="font-medium">{error}</p>
        </div>
      )}
      
      {data && !loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <h3 className="text-center text-gray-300 mb-2">Curto Prazo</h3>
            <GaugeChart 
              value={data.tendencia_curto_prazo} 
              title="Curto Prazo"
            />
          </div>
          <div>
            <h3 className="text-center text-gray-300 mb-2">Médio Prazo</h3>
            <GaugeChart 
              value={data.tendencia_medio_prazo} 
              title="Médio Prazo"
            />
          </div>
          <div>
            <h3 className="text-center text-gray-300 mb-2">Longo Prazo</h3>
            <GaugeChart 
              value={data.tendencia_longo_prazo} 
              title="Longo Prazo"
            />
          </div>
        </div>
      )}
      
      {/* Seção de debug para verificar se os dados estão chegando */}
      <DebugData
        title="Dados brutos da API (Debug):"
        data={data}
      />
    </div>
  );
};

export default BTCTendenciaPanel;