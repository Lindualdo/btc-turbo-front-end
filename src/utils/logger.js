// Utility para logs de diagnóstico que funcionam em produção
const logger = {
  debug: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 DEBUG:', ...args);
    }
  },
  
  info: (...args) => {
    console.log('ℹ️ INFO:', ...args);
  },
  
  warn: (...args) => {
    console.warn('⚠️ WARNING:', ...args);
  },
  
  error: (...args) => {
    console.error('🔴 ERROR:', ...args);
    // Em produção, poderia enviar para um serviço como Sentry
  },
  
  // Função específica para logs de renderização de componentes
  renderLog: (componentName, props) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔄 RENDER: ${componentName}`, props);
    }
  }
};

export default logger;