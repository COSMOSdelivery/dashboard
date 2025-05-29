import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config.json';

const API_URL = config.API_URL;

const useClients = (refreshKey) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/users//allClients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(response.data.clients || []);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des clients');
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [refreshKey]);

  const refetch = () => {
    fetchClients();
  };

  return { clients, loading, error, refetch };
};

export default useClients;