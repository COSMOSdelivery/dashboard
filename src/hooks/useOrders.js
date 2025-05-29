import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import config from '../config.json';

const API_URL = config.API_URL;

const useOrders = (refreshKey) => {
  const [orders, setOrders] = useState([]);
  const [assignedOrderIds, setAssignedOrderIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrdersAndDebriefs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');

      const ordersResponse = await axios.get(`${API_URL}/command/allCommands`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      const debriefsResponse = await axios.get(`${API_URL}/debrief?status=OPEN`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      const assignedIds = debriefsResponse.data.debriefs.flatMap((debrief) =>
        debrief.commandes.map((cmd) => cmd.code_a_barre)
      );
      setAssignedOrderIds(assignedIds);

      const mappedOrders = ordersResponse.data
        .filter((cmd) => ['EN_ATTENTE', 'A_ENLEVER', 'ENLEVE'].includes(cmd.etat))
        .filter((cmd) => !assignedIds.includes(cmd.code_a_barre))
        .map((cmd) => ({
          id: cmd.code_a_barre,
          name: `${cmd.nom_prioritaire} ${cmd.prenom_prioritaire || ''}`.trim(),
          phone: cmd.telephone1,
          status: cmd.etat === 'A_VERIFIER' ? 'À vérifier' : cmd.etat,
          subStatus: cmd.remarque || 'Aucun sous-statut',
          total: parseFloat(cmd.prix) || 0,
          gouvernorat: cmd.gouvernorat,
          note: cmd.remarque || '',
          privateNote: '',
        }));
      setOrders(mappedOrders);
    } catch (err) {
      const errorMessage = err.message || 'Impossible de charger les commandes. Veuillez réessayer.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [refreshKey]);

  useEffect(() => {
    fetchOrdersAndDebriefs();
  }, [fetchOrdersAndDebriefs]);

  return { orders, assignedOrderIds, loading, error, refetch: fetchOrdersAndDebriefs };
};

export default useOrders;