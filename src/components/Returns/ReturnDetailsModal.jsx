import { X } from 'lucide-react';

const ReturnDetailsModal = ({ returnItem, onClose }) => {
  if (!returnItem) return null;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Détails du Retour</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <p><strong>Client:</strong> {returnItem.clientName}</p>
          <p><strong>Livreur:</strong> {returnItem.driverName}</p>
          <p><strong>Date de retour:</strong> {formatDate(returnItem.returnDate)}</p>
          <p><strong>Statut:</strong> {returnItem.status}</p>
          <p><strong>Articles Retournés:</strong> {returnItem.itemsReturned}</p>
          {/* Ajoutez d'autres détails si nécessaire, ex. : <p><strong>Raison:</strong> {returnItem.reason}</p> */}
        </div>
      </div>
    </div>
  );
};

export default ReturnDetailsModal;