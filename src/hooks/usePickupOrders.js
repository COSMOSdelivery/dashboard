import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config.json';

const API_URL = config.API_URL;

const usePickupOrders = (refreshKey) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPickupOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/command/allCommands?statusFilter=EN_ATTENTE`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data || []);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des commandes pour ramassage');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPickupOrders();
  }, [refreshKey]);

  const refetch = () => {
    fetchPickupOrders();
  };

  return { orders, loading, error, refetch };
};

export default usePickupOrders;