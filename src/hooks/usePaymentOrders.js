import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config.json';

const API_URL = config.API_URL;

const usePaymentOrders = (refreshKey) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/command?status=LIVRES,LIVRES_PAYE`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data || []);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des commandes pour paiement');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentOrders();
  }, [refreshKey]);

  const refetch = () => {
    fetchPaymentOrders();
  };

  return { orders, loading, error, refetch };
};

export default usePaymentOrders;