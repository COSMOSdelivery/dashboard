import PropTypes from 'prop-types';
import { User, Phone, MapPin, Euro, FileText, ArrowRight } from 'lucide-react';

const OrderListItem = ({ order, onSelect, getStatusColor }) => (
  <div
    onClick={() => onSelect(order)}
    className="p-4 hover:bg-blue-50 cursor-pointer transition-colors group"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onSelect(order)}
    aria-label={`Sélectionner la commande ${order.id}`}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-semibold text-gray-900">{order.id}</span>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {order.subStatus}
          </span>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{order.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{order.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{order.gouvernorat}</span>
          </div>
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-green-600">{order.total.toFixed(2)} TND</span>
          </div>
          {order.note && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
              <span className="text-gray-600">{order.note}</span>
            </div>
          )}
        </div>
      </div>
      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
    </div>
  </div>
);

OrderListItem.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    subStatus: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    gouvernorat: PropTypes.string.isRequired,
    note: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  getStatusColor: PropTypes.func.isRequired,
};

export default OrderListItem;