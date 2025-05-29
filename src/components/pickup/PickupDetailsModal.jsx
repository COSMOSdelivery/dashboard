import { X } from 'lucide-react';
import { formatDate } from 'date-fns';

const PickupDetailsModal = ({ pickup, onClose }) => {
  if (!pickup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Détails du Pickup</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <p><strong>Date:</strong> {formatDate(pickup.date)}</p>
          <p><strong>Statut:</strong> {pickup.status}</p>
          <p><strong>Articles Ramassés:</strong> {pickup.itemsPickedUp}</p>
          {/* Ajoutez d'autres détails ici si nécessaire, par exemple : */}
          {/* <p><strong>Conducteur:</strong> {pickup.driver}</p> */}
          {/* <p><strong>Remarques:</strong> {pickup.notes}</p> */}
        </div>
      </div>
    </div>
  );
};

export default PickupDetailsModal;