import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import './GaugeChart.css';
import logger from '../../utils/logger';

const GaugeChart = ({ 
  score, 
  title, 
  classification, 
  observacao,
  timeframe,
  size = 'medium'  // 'small', 'medium', 'large'
}) => {
  // Determine as classes CSS com base no parâmetro size
  const containerClass = `gauge-container gauge-${size}`;
  const titleClass = `gauge-title gauge-title-${size}`;
  
  // Log quando o componente recebe novas props
  logger.debug('GaugeChart renderizado:', { score, title, timeframe, size });
  
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
          return `Score: ${score}/10 - ${classification}`;
        }
      }
    }
  };

  // Converte o score para valor percentual (0-10 para 0-100)
  const series = [score * 10];

  return (
    <div className={containerClass}>
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
      {classification && (
        <div className="gauge-classification">
          <span style={{ color: getColor(score) }}>{classification}</span>
        </div>
      )}
      {observacao && <div className="gauge-observacao">{observacao}</div>}
    </div>
  );
};

export default GaugeChart;