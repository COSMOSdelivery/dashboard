import { useState, useEffect } from 'react';

// Simuler une API (à remplacer par vos appels réels à l'API)
const fetchPickups = async (searchTerm, statusFilter, sortBy) => {
  try {
    const response = await fetch(
      `/command/allCommands?searchTerm=${encodeURIComponent(searchTerm || '')}&statusFilter=${statusFilter || 'ALL'}&sortBy=${sortBy || 'date'}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Adjust based on your auth method
        },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch pickups');
    const data = await response.json();
    return data.map(pickup => ({
      id: pickup.code_a_barre,
      date: pickup.dateAjout, // Adjust if using a different date field
      status: pickup.etat === 'EN_ATTENTE' || pickup.etat === 'A_ENLEVER' ? 'OPEN' : 'CLOSED', // Map etat to OPEN/CLOSED
      itemsPickedUp: pickup.nb_article,
    }));
  } catch (error) {
    throw new Error('Erreur lors du chargement des pickups');
  }
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

  return { pickups, loading, error, deletePickup };
};

export default usePickups;