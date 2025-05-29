import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, AlertCircle } from 'lucide-react';
import Header from '../../components/common/Header';
import StatCard from '../../components/common/StatCard';
import ReturnControls from '../../components/Returns/ReturnControls';
import ReturnListItem from '../../components/Returns/ReturnListItem';
import ReturnDetailsModal from '../../components/Returns/ReturnDetailsModal';
import useReturns from '../../hooks/useReturns';

const ReturnsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [selectedReturn, setSelectedReturn] = useState(null);
  const navigate = useNavigate();
  const { returns, loading, error } = useReturns(searchTerm, statusFilter, sortBy);

  const handleAddReturn = () => navigate('/assign-return');
  const handleViewReturn = (returnId) => {
    const returnItem = returns.find((r) => r.id === returnId);
    setSelectedReturn(returnItem);
  };
  const handleCloseModal = () => setSelectedReturn(null);

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
      total: returns.length,
      pending: returns.filter((r) => r.status === 'PENDING').length,
      completed: returns.filter((r) => r.status === 'COMPLETED').length,
      totalItems: returns.reduce((acc, r) => acc + r.itemsReturned, 0),
    }),
    [returns]
  );

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header title="Retours des Commandes" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Retours" value={stats.total} icon={Package} color="bg-blue-100" />
          <StatCard title="En attente" value={stats.pending} icon={AlertCircle} color="bg-orange-100" />
          <StatCard title="Articles Retournés" value={stats.totalItems} icon={Package} color="bg-blue-100" />
        </div>

        <ReturnControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onAdd={handleAddReturn}
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-4">Chargement des retours...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <AlertCircle className="h-12 w-12 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : returns.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {returns.map((returnItem, index) => (
                <ReturnListItem
                  key={returnItem.id}
                  returnItem={returnItem}
                  onView={handleViewReturn}
                  formatDate={formatDate}
                  style={{ animationDelay: `${index * 0.1}s`, animation: 'fadeInUp 0.5s ease-out forwards' }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun retour trouvé</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par assigner un retour'}
              </p>
            </div>
          )}
        </div>
        <ReturnDetailsModal returnItem={selectedReturn} onClose={handleCloseModal} />
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

export default ReturnsPage;