import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useBtcData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/bitcoin/metrics`);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      // Try to get cached data if available
      const cachedData = localStorage.getItem('btc-metrics');
      if (cachedData) {
        setData(JSON.parse(cachedData));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up polling interval
    const interval = setInterval(fetchData, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Cache successful responses
  useEffect(() => {
    if (data) {
      localStorage.setItem('btc-metrics', JSON.stringify(data));
    }
  }, [data]);

  const refresh = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refresh
  };
};

export default useBtcData;