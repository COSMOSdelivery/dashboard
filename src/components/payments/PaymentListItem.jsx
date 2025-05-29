import { Eye, CreditCard } from 'lucide-react';

const PaymentListItem = ({ debrief, onView, formatDate }) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <CreditCard className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">{formatDate(debrief.date)}</h3>
          <p className="text-sm text-gray-500">Statut Paiement: {debrief.paymentStatus}</p>
          <p className="text-sm text-gray-500">Montant: {debrief.paymentAmount.toFixed(2)} €</p>
          <p className="text-sm text-gray-500">Colis Livrés: {debrief.ordersDelivered}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => onView(debrief.id)} className="p-2 text-gray-500 hover:text-blue-500">
          <Eye className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PaymentListItem;