import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, AlertCircle } from 'lucide-react';
import Header from '../../components/common/Header';
import StatCard from '../../components/common/StatCard';
import PaymentControls from '../../components/Payments/PaymentControls';
import PaymentListItem from '../../components/Payments/PaymentListItem';
import PaymentDetailsModal from '../../components/Payments/PaymentDetailsModal';
import useClosedDebriefs from '../../hooks/useClosedDebriefs';

const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // Pour filtrer par statut de paiement (PENDING, PAID)
  const [sortBy, setSortBy] = useState('date');
  const [selectedDebrief, setSelectedDebrief] = useState(null);
  const navigate = useNavigate();
  const { debriefs, loading, error } = useClosedDebriefs(searchTerm, statusFilter, sortBy);

  const handleViewDebrief = (debriefId) => {
    const debrief = debriefs.find((d) => d.id === debriefId);
    setSelectedDebrief(debrief);
  };
  const handleCloseModal = () => setSelectedDebrief(null);

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
      pendingPayments: debriefs.filter((d) => d.paymentStatus === 'PENDING').length,
      totalAmount: debriefs.reduce((acc, d) => acc + (d.paymentAmount || 0), 0),
    }),
    [debriefs]
  );

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header title="Paiements des Débriefs Clos" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Débriefs Clos" value={stats.total} icon={CreditCard} color="bg-blue-100" />
          <StatCard title="Paiements en attente" value={stats.pendingPayments} icon={AlertCircle} color="bg-orange-100" />
          <StatCard title="Montant Total" value={`${stats.totalAmount.toFixed(2)} €`} icon={CreditCard} color="bg-blue-100" />
        </div>

        <PaymentControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-4">Chargement des débriefs clos...</p>
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
                <PaymentListItem
                  key={debrief.id}
                  debrief={debrief}
                  onView={handleViewDebrief}
                  formatDate={formatDate}
                  style={{ animationDelay: `${index * 0.1}s`, animation: 'fadeInUp 0.5s ease-out forwards' }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun débrief clos trouvé</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Aucun débrief clos disponible pour les paiements'}
              </p>
            </div>
          )}
        </div>
        <PaymentDetailsModal debrief={selectedDebrief} onClose={handleCloseModal} />
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

export default PaymentsPage;