import { useState, useEffect } from 'react';

// Simuler une API pour récupérer les retours (à remplacer par un appel réel)
const fetchReturns = async () => {
  // Exemple de données simulées
  return [
    {
      id: 1,
      clientName: 'Jean Dupont',
      driverName: 'Marie Lefèvre',
      returnDate: '2025-05-28',
      status: 'PENDING',
      itemsReturned: 5,
    },
    {
      id: 2,
      clientName: 'Sophie Martin',
      driverName: 'Pierre Dubois',
      returnDate: '2025-05-27',
      status: 'COMPLETED',
      itemsReturned: 3,
    },
    {
      id: 3,
      clientName: 'Lucas Durand',
      driverName: 'Marie Lefèvre',
      returnDate: '2025-05-26',
      status: 'PENDING',
      itemsReturned: 7,
    },
  ];
};

const useReturns = (searchTerm, statusFilter, sortBy) => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReturns = async () => {
      setLoading(true);
      try {
        const data = await fetchReturns();

        // Filtrer les retours
        let filteredReturns = data;
        if (searchTerm) {
          filteredReturns = filteredReturns.filter((returnItem) =>
            returnItem.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            returnItem.driverName.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        if (statusFilter !== 'ALL') {
          filteredReturns = filteredReturns.filter((returnItem) => returnItem.status === statusFilter);
        }

        // Trier les retours
        filteredReturns.sort((a, b) => {
          if (sortBy === 'date') {
            return new Date(b.returnDate) - new Date(a.returnDate); // Tri descendant par date
          } else if (sortBy === 'clientName') {
            return a.clientName.localeCompare(b.clientName); // Tri alphabétique par nom du client
          }
          return 0;
        });

        setReturns(filteredReturns);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des retours');
        setReturns([]);
      } finally {
        setLoading(false);
      }
    };

    loadReturns();
  }, [searchTerm, statusFilter, sortBy]);

  return { returns, loading, error };
};

export default useReturns;