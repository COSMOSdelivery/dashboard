import { Eye, Edit, Trash2, CheckCircle, Package } from 'lucide-react';

const PickupListItem = ({ pickup, onView, onEdit, onDelete, onValidate, formatDate }) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Package className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">{formatDate(pickup.date)}</h3>
          <p className="text-sm text-gray-500">Statut: {pickup.status}</p>
          <p className="text-sm text-gray-500">Articles: {pickup.itemsPickedUp}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => onView(pickup.id)} className="p-2 text-gray-500 hover:text-blue-500">
          <Eye className="h-5 w-5" />
        </button>
        <button onClick={() => onEdit(pickup.id)} className="p-2 text-gray-500 hover:text-yellow-500">
          <Edit className="h-5 w-5" />
        </button>
        <button onClick={() => onValidate(pickup.id)} className="p-2 text-gray-500 hover:text-green-500">
          <CheckCircle className="h-5 w-5" />
        </button>
        <button onClick={() => onDelete(pickup.id)} className="p-2 text-gray-500 hover:text-red-500">
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PickupListItem;