import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, AlertCircle } from 'lucide-react';
import Header from '../../components/common/Header';
import StatCard from '../../components/common/StatCard';
import DebriefControls from '../../components/Debrief/DebriefControls';
import DebriefListItem from '../../components/Debrief/DebriefListItem';
import DebriefDetailsModal from '../../components/Debrief/DebriefDetailsModal';
import useDebriefs from '../../hooks/useDebriefs';

const DebriefPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [selectedDebrief, setSelectedDebrief] = useState(null);
  const navigate = useNavigate();
  const { debriefs, loading, error, validateDebrief, deleteDebrief } = useDebriefs(searchTerm, statusFilter, sortBy);

  const handleAddDebrief = () => navigate('/preparation-livraisons');
  const handleViewDebrief = (debriefId) => {
    const debrief = debriefs.find((d) => d.id === debriefId);
    setSelectedDebrief(debrief);
  };
  const handleCloseModal = () => setSelectedDebrief(null);
  const handleEditDebrief = (debriefId) => navigate(`/debrief/edit/${debriefId}`);
  const handleDeleteDebrief = async (id) => {
    if (await deleteDebrief(id)) navigate('/preparation-livraisons', { state: { debriefDeleted: true } });
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
      total: debriefs.length,
      pending: debriefs.filter((d) => d.status === 'OPEN').length,
      validated: debriefs.filter((d) => d.status === 'CLOSED').length,
      totalOrders: debriefs.reduce((acc, d) => acc + d.ordersDelivered, 0),
    }),
    [debriefs]
  );

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header title="Débriefs Livraisons" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Débriefs" value={stats.total} icon={Truck} color="bg-blue-100" />
          <StatCard title="OPEN" value={stats.pending} icon={AlertCircle} color="bg-orange-100" />
          <StatCard title="Colis Livrés" value={stats.totalOrders} icon={Truck} color="bg-blue-100" />
        </div>

        <DebriefControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onAdd={handleAddDebrief}
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-4">Chargement des débriefs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <AlertCircle className="h-12 w-12 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : debriefs.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {debriefs.map((debrief, index) => (
                <DebriefListItem
                  key={debrief.id}
                  debrief={debrief}
                  onView={handleViewDebrief}
                  onEdit={handleEditDebrief}
                  onDelete={handleDeleteDebrief}
                  onValidate={validateDebrief}
                  formatDate={formatDate}
                  style={{ animationDelay: `${index * 0.1}s`, animation: 'fadeInUp 0.5s ease-out forwards' }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun débrief trouvé</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par créer le premier débrief de livraison'}
              </p>
            </div>
          )}
        </div>
        <DebriefDetailsModal debrief={selectedDebrief} onClose={handleCloseModal} />
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

export default DebriefPage;