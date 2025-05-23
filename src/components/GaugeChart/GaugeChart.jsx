import React, { useEffect, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';
import './GaugeChart.css';
import logger from '../../utils/logger';

const GaugeChart = ({ 
  score = 5, // Default valor  
  title = 'Score', 
  classificacao,
  observacao,
  timeframe,
  size = 'medium'  // 'small', 'medium', 'large'
}) => {
  // Referência para o container do gráfico para debugging
  const chartRef = useRef(null);

  // Determine as classes CSS com base no parâmetro size
  const containerClass = `gauge-container gauge-${size}`;
  const titleClass = `gauge-title gauge-title-${size}`;
  
  // Log quando o componente é renderizado
  useEffect(() => {
    logger.debug('GaugeChart renderizado com props:', { 
      score, title, timeframe, size,
      chartType: 'radialBar',
      apexChartsLoaded: typeof ReactApexChart !== 'undefined',
      chartRefExists: chartRef.current !== null,
      apexGlobalObject: typeof window.ApexCharts !== 'undefined'
    });

    // Verificar se a biblioteca está disponível
    if (typeof ReactApexChart === 'undefined') {
      logger.error('ReactApexChart não está disponível');
    }

    // Verificar se o objeto global ApexCharts está disponível
    if (typeof window.ApexCharts === 'undefined') {
      logger.error('Objeto global ApexCharts não está disponível');
    }

    // Verificar se o score está no formato correto
    if (typeof score !== 'number') {
      logger.warn(`Score inválido (${score}). Usando valor padrão 5.`);
    }

    // Registrar informação de montagem do componente
    return () => {
      logger.debug('GaugeChart desmontado:', { title, timeframe });
    };
  }, [score, title, timeframe, size]);
  
  // Define as cores com base no score
  const getColor = (score) => {
    if (score >= 7) return '#22c55e'; // Verde para tendência de alta forte
    if (score >= 5) return '#84cc16'; // Verde claro para tendência de alta moderada
    if (score >= 3) return '#f59e0b'; // Amarelo para neutro/indefinido
    if (score >= 1) return '#f97316'; // Laranja para tendência de baixa moderada
    return '#ef4444';             // Vermelho para tendência de baixa forte
  };

  // Configura as opções do gráfico
  const options = {
    chart: {
      type: 'radialBar',
      offsetY: 0,
      sparkline: {
        enabled: true
      },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        track: {
          background: '#333',
          strokeWidth: '97%',
          margin: 5,
          dropShadow: {
            enabled: false,
          }
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            offsetY: -2,
            fontSize: size === 'small' ? '16px' : size === 'medium' ? '20px' : '24px',
            color: getColor(score),
            fontWeight: 'bold',
            formatter: function (val) {
              return score.toString();
            }
          }
        },
        hollow: {
          size: '60%',
        },
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        colorStops: [
          {
            offset: 0,
            color: getColor(score),
            opacity: 1
          },
          {
            offset: 100,
            color: getColor(score),
            opacity: 0.8
          }
        ]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Score'],
    tooltip: {
      enabled: true,
      y: {
        formatter: function(value) {
          return `Score: ${score}/10 ${classificacao ? `- ${classificacao}` : ''}`;
        }
      }
    }
  };

  // Converte o score para valor percentual (0-10 para 0-100)
  const series = [score * 10];

  // Log para debug com o valor da série e opções
  logger.debug('GaugeChart config:', { series, color: getColor(score), options });

  // Se o chart não puder ser renderizado, mostrar uma versão simplificada como fallback
  const renderFallbackChart = () => {
    return (
      <div className="fallback-chart">
        <div className="fallback-score" style={{ color: getColor(score) }}>
          {score.toFixed(1)}
        </div>
        <div className="fallback-title">{title}</div>
        {classificacao && <div className="fallback-classificacao">{classificacao}</div>}
      </div>
    );
  };

  // Fallback para evitar erros em caso de problemas com a biblioteca
  if (typeof ReactApexChart === 'undefined' || typeof window.ApexCharts === 'undefined') {
    return (
      <div className={containerClass} ref={chartRef}>
        <div className={titleClass}>
          {timeframe && <span className="timeframe-badge">{timeframe}</span>}
          {title && <h3>{title}</h3>}
        </div>
        <div className="chart-wrapper error-state">
          <div className="chart-error">
            {renderFallbackChart()}
            <p className="error-message">Erro ao carregar o gráfico</p>
          </div>
        </div>
      </div>
    );
  }

  // Adicionar um elemento simples para debugging se estiver em dev
  const debugElement = process.env.NODE_ENV !== 'production' ? (
    <div className="debug-info">
      Chart: {typeof ReactApexChart} | Score: {score} | Color: {getColor(score)}
    </div>
  ) : null;

  try {
    return (
      <div className={containerClass} ref={chartRef}>
        <div className={titleClass}>
          {timeframe && <span className="timeframe-badge">{timeframe}</span>}
          {title && <h3>{title}</h3>}
        </div>
        <div className="chart-wrapper">
          <ReactApexChart 
            options={options} 
            series={series} 
            type="radialBar" 
            height={size === 'small' ? 180 : size === 'medium' ? 240 : 300}
          />
        </div>
        {classificacao && (
          <div className="gauge-classificacao">
            <span style={{ color: getColor(score) }}>{classificacao}</span>
          </div>
        )}
        {observacao && <div className="gauge-observacao">{observacao}</div>}
        {debugElement}
      </div>
    );
  } catch (error) {
    logger.error('Erro ao renderizar o GaugeChart:', error);
    return renderFallbackChart();
  }
};

export default GaugeChart;