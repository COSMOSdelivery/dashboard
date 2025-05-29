import { Package } from "lucide-react";

const NoOrdersMessage = ({ message }) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
      <Package className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default NoOrdersMessage;