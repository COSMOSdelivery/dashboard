import { FileText, Printer, Edit, Trash2, Filter } from "lucide-react";
import { motion } from "framer-motion";

const OrderActions = ({
  onExport,
  onPrint,
  onEdit,
  onDelete,
  onFilter,
  selectedOrders = [],
  disabled = false,
}) => {
  return (
    <motion.div
      className="flex items-center gap-3 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={onExport}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
          disabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
        }`}
        title="Exporter les commandes"
      >
        <FileText className="w-4 h-4" />
        Exporter
      </button>

      <button
        onClick={onPrint}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
          disabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-green-100 text-green-700 hover:bg-green-200"
        }`}
        title="Imprimer les commandes"
      >
        <Printer className="w-4 h-4" />
        Imprimer
      </button>

      <button
        onClick={onEdit}
        disabled={selectedOrders.length === 0 || disabled}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
          selectedOrders.length === 0 || disabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
        }`}
        title="Modifier les commandes sélectionnées"
      >
        <Edit className="w-4 h-4" />
        Modifier
      </button>

      <button
        onClick={onDelete}
        disabled={selectedOrders.length === 0 || disabled}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
          selectedOrders.length === 0 || disabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-red-100 text-red-700 hover:bg-red-200"
        }`}
        title="Supprimer les commandes sélectionnées"
      >
        <Trash2 className="w-4 h-4" />
        Supprimer
      </button>

      <button
        onClick={onFilter}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors duration-200"
        title="Filtrer les commandes"
      >
        <Filter className="w-4 h-4" />
        Filtrer
      </button>
    </motion.div>
  );
};

export default OrderActions;