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