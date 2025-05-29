import PropTypes from 'prop-types';
import { Package } from 'lucide-react';
import OrderListItem from './OrderListItem';

const OrderList = ({ orders, onSelect, selectedAgent, getStatusColor, stats, loading }) => (
  <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-600" />
          Commandes en Attente
          {selectedAgent && (
            <span className="text-sm text-gray-500">({selectedAgent.gouvernorat})</span>
          )}
        </h2>
        <div className="text-sm text-gray-600">
          Nombre: <span className="font-semibold">{stats.count}</span> | Total:{' '}
          <span className="font-semibold">{stats.total.toFixed(2)} TND</span>
        </div>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !selectedAgent ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Sélectionnez un livreur pour voir les commandes disponibles</p>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Aucune commande disponible pour cette zone</p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
            <OrderListItem key={order.id} order={order} onSelect={onSelect} getStatusColor={getStatusColor} />
          ))}
        </div>
      )}
    </div>
  </div>
);

OrderList.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      subStatus: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
      gouvernorat: PropTypes.string.isRequired,
      note: PropTypes.string,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedAgent: PropTypes.object,
  getStatusColor: PropTypes.func.isRequired,
  stats: PropTypes.shape({
    count: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default OrderList;