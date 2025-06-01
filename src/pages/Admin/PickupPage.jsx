import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, AlertCircle } from 'lucide-react';
import Header from '../../components/common/Header';
import StatCard from '../../components/common/StatCard';
import PickupControls from '../../components/Pickup/PickupControls';
import PickupListItem from '../../components/Pickup/PickupListItem';
import PickupDetailsModal from '../../components/Pickup/PickupDetailsModal';
import usePickups from '../../hooks/usePickups';

const PickupPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [selectedPickup, setSelectedPickup] = useState(null);
  const navigate = useNavigate();
  const { pickups, loading, error, deletePickup } = usePickups(searchTerm, statusFilter, sortBy);

  const handleAddPickup = () => navigate('/assign-pickup');
  const handleViewPickup = (pickupId) => {
    const pickup = pickups.find((p) => p.id === pickupId);
    setSelectedPickup(pickup);
  };
  const handleCloseModal = () => setSelectedPickup(null);
  const handleEditPickup = (pickupId) => navigate(`/pickup/edit/${pickupId}`);
  const handleDeletePickup = async (id) => {
    if (await deletePickup(id)) navigate('/assign-pickup', { state: { pickupDeleted: true } });
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error('Invalid date');
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Date invalide';
    }
  };

  const stats = useMemo(
    () => ({
      total: pickups.length,
      pending: pickups.filter((p) => p.status === 'OPEN').length,
      totalItems: pickups.reduce((acc, p) => acc + p.itemsPickedUp, 0),
    }),
    [pickups]
  );

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header title="Pickups" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Pickups" value={stats.total} icon={Package} color="bg-blue-100" />
          <StatCard title="OPEN" value={stats.pending} icon={AlertCircle} color="bg-orange-100" />
          <StatCard title="Articles Ramassés" value={stats.totalItems} icon={Package} color="bg-blue-100" />
        </div>

        <PickupControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onAdd={handleAddPickup}
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-4">Chargement des pickups...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <AlertCircle className="h-12 w-12 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : pickups.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {pickups.map((pickup, index) => (
                <PickupListItem
                  key={pickup.id}
                  pickup={pickup}
                  onView={handleViewPickup}
                  onEdit={handleEditPickup}
                  onDelete={handleDeletePickup}
                  formatDate={formatDate}
                  style={{ animationDelay: `${index * 0.1}s`, animation: 'fadeInUp 0.5s ease-out forwards' }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun pickup trouvé</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par créer le premier pickup'}
              </p>
            </div>
          )}
        </div>
        <PickupDetailsModal pickup={selectedPickup} onClose={handleCloseModal} />
      </main>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PickupPage;