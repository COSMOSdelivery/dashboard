import { X } from "lucide-react";

const PaymentDetailsModal = ({ debrief, onClose }) => {
  if (!debrief) return null;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Date invalide";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Détails du Paiement</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <p>
            <strong>Date:</strong> {formatDate(debrief.date)}
          </p>
          <p>
            <strong>Statut:</strong> {debrief.status}
          </p>
          <p>
            <strong>Statut Paiement:</strong> {debrief.paymentStatus}
          </p>
          <p>
            <strong>Montant:</strong> {debrief.paymentAmount.toFixed(2)} TND
          </p>
          <p>
            <strong>Colis Livrés:</strong> {debrief.ordersDelivered}
          </p>
          {/* Ajoutez d'autres détails si nécessaire, ex. : <p><strong>Conducteur:</strong> {debrief.driver}</p> */}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
