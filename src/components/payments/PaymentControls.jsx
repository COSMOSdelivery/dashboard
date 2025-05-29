import { Search } from 'lucide-react';

const PaymentControls = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, sortBy, setSortBy }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
      <div className="relative w-full md:w-1/3">
        <input
          type="text"
          placeholder="Rechercher un débrief clos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      <div className="flex space-x-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">Tous les statuts de paiement</option>
          <option value="PENDING">Paiement en attente</option>
          <option value="PAID">Paiement effectué</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        >
          <option value="date">Trier par date</option>
          <option value="paymentAmount">Trier par montant</option>
        </select>
      </div>
    </div>
  );
};

export default PaymentControls;