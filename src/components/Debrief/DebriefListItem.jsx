import PropTypes from 'prop-types';
import { User, MapPin, Package, Calendar, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';

const statusConfig = {
  OPEN: {
    bg: 'bg-gradient-to-r from-orange-50 to-orange-100',
    text: 'text-green-700',
    label: 'OPEN',
    dot: 'bg-green-500',
    icon: CheckCircle,
  },
  CLOSED: {
    bg: 'bg-gradient-to-r from-green-50 to-green-100',
    text: 'text-red-700',
    label: 'CLOSED',
    dot: 'bg-red-500',
    icon: CheckCircle,
  },
  default: {
    bg: 'bg-gradient-to-r from-gray-50 to-gray-100',
    text: 'text-gray-700',
    label: 'Inconnu',
    dot: 'bg-gray-500',
    icon: CheckCircle,
  },
};

const DebriefListItem = ({ debrief, onView, onEdit, onDelete, onValidate, formatDate }) => {
  const StatusIcon = statusConfig[debrief.status]?.icon || statusConfig.default.icon;

  return (
    <div
      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 border-l-gray-300"
      onClick={() => onView(debrief.id)}
      role="button"
      tabIndex={0}
      aria-label={`Voir débrief ${debrief.id}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {debrief.id}
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${statusConfig[debrief.status]?.bg || statusConfig.default.bg} ${statusConfig[debrief.status]?.text || statusConfig.default.text}`}
            >
              <div className={`w-2 h-2 rounded-full ${statusConfig[debrief.status]?.dot || statusConfig.default.dot}`}></div>
              {statusConfig[debrief.status]?.label || debrief.status}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-900">{debrief.deliveryAgent}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-500" />
                Zone: {debrief.zone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="h-4 w-4 text-gray-500" />
                {debrief.ordersDelivered}/{debrief.ordersPlanned} colis livrés
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-gray-500" />
                {formatDate(debrief.date)} à {debrief.createdAt}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {debrief.status === 'OPEN' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onValidate(debrief.id);
              }}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              aria-label={`Valider débrief ${debrief.id}`}
            >
              <StatusIcon size={18} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(debrief.id);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label={`Voir détails du débrief ${debrief.id}`}
          >
            <Eye size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(debrief.id);
            }}
            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            aria-label={`Modifier débrief ${debrief.id}`}
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(debrief.id);
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label={`Supprimer débrief ${debrief.id}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

DebriefListItem.propTypes = {
  debrief: PropTypes.shape({
    id: PropTypes.string.isRequired,
    deliveryAgent: PropTypes.string.isRequired,
    zone: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    ordersDelivered: PropTypes.number.isRequired,
    ordersPlanned: PropTypes.number.isRequired,
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
};

export default DebriefListItem;