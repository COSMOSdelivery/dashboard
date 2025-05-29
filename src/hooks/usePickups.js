import { useState, useEffect } from 'react';

// Simuler une API (à remplacer par vos appels réels à l'API)
const fetchPickups = async () => {
  // Exemple de données simulées (remplacez par une requête API réelle, ex. : fetch('/api/pickups'))
  return [
    { id: 1, date: '2025-05-28', status: 'OPEN', itemsPickedUp: 10 },
    { id: 2, date: '2025-05-27', status: 'CLOSED', itemsPickedUp: 15 },
    { id: 3, date: '2025-05-26', status: 'OPEN', itemsPickedUp: 8 },
  ];
};

const validatePickupAPI = async (id) => {
  // Simuler la validation d'un pickup (remplacez par une requête API réelle, ex. : PATCH /api/pickups/:id)
  return true;
};

const deletePickupAPI = async (id) => {
  // Simuler la suppression d'un pickup (remplacez par une requête API réelle, ex. : DELETE /api/pickups/:id)
  return true;
};

const usePickups = (searchTerm, statusFilter, sortBy) => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les pickups avec filtrage et tri
  useEffect(() => {
    const loadPickups = async () => {
      setLoading(true);
      try {
        const data = await fetchPickups();
        
        // Filtrer les pickups
        let filteredPickups = data;
        if (searchTerm) {
          filteredPickups = filteredPickups.filter((pickup) =>
            pickup.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pickup.status.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        if (statusFilter !== 'ALL') {
          filteredPickups = filteredPickups.filter((pickup) => pickup.status === statusFilter);
        }

        // Trier les pickups
        filteredPickups.sort((a, b) => {
          if (sortBy === 'date') {
            return new Date(b.date) - new Date(a.date); // Tri descendant par date
          } else if (sortBy === 'status') {
            return a.status.localeCompare(b.status); // Tri alphabétique par statut
          }
          return 0;
        });

        setPickups(filteredPickups);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des pickups');
        setPickups([]);
      } finally {
        setLoading(false);
      }
    };

    loadPickups();
  }, [searchTerm, statusFilter, sortBy]);

  // Valider un pickup
  const validatePickup = async (id) => {
    try {
      const success = await validatePickupAPI(id);
      if (success) {
        setPickups((prevPickups) =>
          prevPickups.map((pickup) =>
            pickup.id === id ? { ...pickup, status: 'CLOSED' } : pickup
          )
        );
        return true;
      }
      return false;
    } catch (err) {
      setError('Erreur lors de la validation du pickup');
      return false;
    }
  };

  // Supprimer un pickup
  const deletePickup = async (id) => {
    try {
      const success = await deletePickupAPI(id);
      if (success) {
        setPickups((prevPickups) => prevPickups.filter((pickup) => pickup.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError('Erreur lors de la suppression du pickup');
      return false;
    }
  };

  return { pickups, loading, error, validatePickup, deletePickup };
};

export default usePickups;