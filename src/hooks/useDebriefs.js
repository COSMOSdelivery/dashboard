import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import config from '../config.json';

const API_URL = config.API_URL;

const useDebriefs = (searchTerm, statusFilter, sortBy) => {
  const [debriefs, setDebriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDebriefs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/debrief`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: 1,
          limit: 50,
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          search: searchTerm || undefined,
          sortBy,
        },
      });
      const mappedDebriefs = response.data.debriefs.map((debrief) => ({
        id: debrief.id.toString(),
        deliveryAgent: `${debrief.livreur.utilisateur.prenom} ${debrief.livreur.utilisateur.nom}`,
        zone: debrief.zone,
        status: debrief.status,
        date: debrief.createdAt.split('T')[0],
        createdAt: new Date(debrief.createdAt).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        ordersDelivered: debrief.ordersDelivered,
        ordersPlanned: debrief.ordersPlanned,
        notes: debrief.notes || '',
        livreur: debrief.livreur,
        commandes: debrief.commandes,
      }));
      setDebriefs(mappedDebriefs);
    } catch (err) {
      console.error('Erreur lors de la récupération des débriefs:', err);
      setError('Impossible de charger les débriefs. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, sortBy]);

  useEffect(() => {
    fetchDebriefs();
  }, [fetchDebriefs]);

  const validateDebrief = async (debriefId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_URL}/debrief/${debriefId}/validate`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDebriefs(debriefs.map((d) => (d.id === debriefId ? { ...d, status: 'CLOSED' } : d)));
      toast.success('Débrief validé avec succès');
    } catch (err) {
      console.error('Erreur lors de la validation du débrief:', err);
      toast.error(`Échec de la validation du débrief: ${err.response?.data?.msg || err.message}`);
    }
  };

  const deleteDebrief = async (id) => {
    try {
      await axios.delete(`${API_URL}/debrief/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      toast.success('Débrief supprimé avec succès');
      return true;
    } catch (err) {
      toast.error(`Erreur lors de la suppression: ${err.response?.data?.msg || err.message}`);
      return false;
    }
  };

  return { debriefs, loading, error, validateDebrief, deleteDebrief, refetch: fetchDebriefs };
};

export default useDebriefs;