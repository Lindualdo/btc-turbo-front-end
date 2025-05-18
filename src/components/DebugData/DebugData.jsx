import React, { useState } from 'react';

/**
 * Componente de debug para mostrar dados brutos da API
 * Útil para validar se os dados estão chegando corretamente
 */
export const DebugData = ({ title, data }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!data) {
    return (
      <div className="mt-5 p-3 bg-gray-900 rounded-md">
        <h4 className="text-gray-300 font-medium text-sm">{title}</h4>
        <p className="text-gray-400 text-xs mt-1">Nenhum dado recebido</p>
      </div>
    );
  }
  
  return (
    <div className="mt-5 p-3 bg-gray-900 rounded-md">
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
      >
        <h4 className="text-gray-300 font-medium text-sm">{title}</h4>
        <span className="text-blue-400 text-xs">
          {expanded ? 'Ocultar' : 'Mostrar'}
        </span>
      </div>
      
      {expanded && (
        <pre className="mt-2 p-2 bg-black bg-opacity-50 rounded text-green-400 text-xs overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
      
      {!expanded && (
        <p className="text-gray-400 text-xs mt-1">
          Dados recebidos: {Object.keys(data).length} campos
        </p>
      )}
    </div>
  );
};