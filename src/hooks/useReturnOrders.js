import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config.json';

const API_URL = config.API_URL;

const useReturnOrders = (refreshKey) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReturnOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/orders?status=RETOUR_DEFINITIF`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders || []);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des commandes en retour');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReturnOrders();
  }, [refreshKey]);

  const refetch = () => {
    fetchReturnOrders();
  };

  return { orders, loading, error, refetch };
};

export default useReturnOrders;