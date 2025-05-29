import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import config from '../config.json';

const API_URL = config.API_URL;

const useDeliveryAgents = (refreshKey, retryCount, maxRetries = 3) => {
  const [deliveryAgents, setDeliveryAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeliveryAgents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found. Please log in again.');

      const livreursResponse = await axios.get(`${API_URL}/users/allLivreurs`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      const openDebriefsResponse = await axios.get(`${API_URL}/debrief/open-delivery-agents`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      const agentIdsWithOpenDebriefs = new Set(openDebriefsResponse.data.agentIds);
      const mappedAgents = livreursResponse.data
        .filter((livreur) => !agentIdsWithOpenDebriefs.has(livreur.idLivreur))
        .map((livreur) => ({
          id: livreur.idLivreur,
          name: `${livreur.prenom} ${livreur.nom}`,
          gouvernorat: livreur.gouvernorat,
        }));

      setDeliveryAgents(mappedAgents);
      if (mappedAgents.length === 0) {
        setError('Aucun livreur disponible pour créer un débrief. Tous les livreurs ont des débriefs ouverts.');
        toast.warning('Aucun livreur disponible sans débrief ouvert');
      }
    } catch (err) {
      const errorMessage = err.message || 'Impossible de charger les livreurs. Veuillez réessayer.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchDeliveryAgents();
  }, [fetchDeliveryAgents, refreshKey]);

  return { deliveryAgents, loading, error, refetch: fetchDeliveryAgents };
};

export default useDeliveryAgents;