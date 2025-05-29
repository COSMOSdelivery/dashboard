import { useState, useEffect } from 'react';

// Simuler une API pour récupérer les débriefs clos (à remplacer par un appel réel)
const fetchClosedDebriefs = async () => {
  // Exemple de données simulées
  return [
    { id: 1, date: '2025-05-28', status: 'CLOSED', ordersDelivered: 20, paymentAmount: 150.50, paymentStatus: 'PENDING' },
    { id: 2, date: '2025-05-27', status: 'CLOSED', ordersDelivered: 15, paymentAmount: 100.00, paymentStatus: 'PAID' },
    { id: 3, date: '2025-05-26', status: 'CLOSED', ordersDelivered: 18, paymentAmount: 120.75, paymentStatus: 'PENDING' },
  ];
};

const useClosedDebriefs = (searchTerm, statusFilter, sortBy) => {
  const [debriefs, setDebriefs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadClosedDebriefs = async () => {
      setLoading(true);
      try {
        const data = await fetchClosedDebriefs();

        // Filtrer les débriefs (seulement CLOSED, mais avec filtrage supplémentaire par paymentStatus)
        let filteredDebriefs = data.filter((debrief) => debrief.status === 'CLOSED');
        if (searchTerm) {
          filteredDebriefs = filteredDebriefs.filter((debrief) =>
            debrief.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
            debrief.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        if (statusFilter !== 'ALL') {
          filteredDebriefs = filteredDebriefs.filter((debrief) => debrief.paymentStatus === statusFilter);
        }

        // Trier les débriefs
        filteredDebriefs.sort((a, b) => {
          if (sortBy === 'date') {
            return new Date(b.date) - new Date(a.date); // Tri descendant par date
          } else if (sortBy === 'paymentAmount') {
            return b.paymentAmount - a.paymentAmount; // Tri descendant par montant
          }
          return 0;
        });

        setDebriefs(filteredDebriefs);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des débriefs clos');
        setDebriefs([]);
      } finally {
        setLoading(false);
      }
    };

    loadClosedDebriefs();
  }, [searchTerm, statusFilter, sortBy]);

  return { debriefs, loading, error };
};

export default useClosedDebriefs;