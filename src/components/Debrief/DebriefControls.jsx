import PropTypes from 'prop-types';
import { Search, Plus } from 'lucide-react';
import ActionButton from '../common/ActionButton';

const DebriefControls = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, sortBy, setSortBy, onAdd }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Rechercher par livreur, zone ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Rechercher débriefs par livreur, zone ou ID"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filtrer par statut"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="OPEN">En attente</option>
            <option value="CLOSED">Validés</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Trier débriefs"
          >
            <option value="date">Trier par date</option>
            <option value="agent">Trier par livreur</option>
          </select>
        </div>
      </div>
      <ActionButton
        onClick={onAdd}
        icon={Plus}
        label="Nouveau Débrief"
        ariaLabel="Créer un nouveau débrief"
      />
    </div>
  </div>
);

DebriefControls.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  setStatusFilter: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default DebriefControls;