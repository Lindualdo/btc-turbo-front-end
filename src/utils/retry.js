/**
 * Utility para retry de operações com backoff exponencial
 * @param {Function} fn - Função a ser executada
 * @param {Object} options - Opções de configuração
 * @param {number} options.retries - Número máximo de tentativas
 * @param {number} options.minTimeout - Tempo mínimo entre tentativas (ms)
 * @param {number} options.maxTimeout - Tempo máximo entre tentativas (ms)
 * @param {number} options.factor - Fator multiplicador para backoff exponencial
 */
export const retry = async (fn, options = {}) => {
  const {
    retries = 3,
    minTimeout = 1000,
    maxTimeout = 5000,
    factor = 2,
  } = options;

  let attempts = 0;

  const execute = async () => {
    try {
      return await fn();
    } catch (error) {
      attempts++;

      if (attempts >= retries) {
        throw error;
      }

      // Calcula delay exponencial com jitter
      const timeout = Math.min(
        maxTimeout,
        minTimeout * Math.pow(factor, attempts) * (1 + Math.random() * 0.1)
      );

      await new Promise(resolve => setTimeout(resolve, timeout));

      return execute();
    }
  };

  return execute();
};

/**
 * Helper para criar uma promise que rejeita após um timeout
 * @param {number} ms - Timeout em milissegundos
 */
export const createTimeout = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });
};

/**
 * Executa uma operação com timeout
 * @param {Promise} promise - Promise a ser executada
 * @param {number} ms - Timeout em milissegundos
 */
export const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    createTimeout(ms)
  ]);
};