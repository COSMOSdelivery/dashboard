import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter, User, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";
import PropTypes from "prop-types";

// Status options (aligned with statusConfig from OrdersTable)
const statusOptions = [
  { value: "", label: "Tous les statuts" },
  { value: "EN_ATTENTE", label: "En Attente" },
  { value: "A_ENLEVER", label: "À Enlever" },
  { value: "ENLEVE", label: "Enlevé" },
  { value: "AU_DEPOT", label: "Au Dépôt" },
  { value: "RETOUR_DEPOT", label: "Retour Dépôt" },
  { value: "EN_COURS", label: "En Cours" },
  { value: "A_VERIFIER", label: "À Vérifier" },
  { value: "LIVRES", label: "Livré" },
  { value: "LIVRES_PAYE", label: "Livré Payé" },
  { value: "ECHANGE", label: "Échange" },
  { value: "RETOUR_DEFINITIF", label: "Retour Définitif" },
  { value: "RETOUR_INTER_AGENCE", label: "Retour Inter-Agence" },
  { value: "RETOUR_EXPEDITEURS", label: "Retour Expéditeurs" },
  { value: "RETOUR_RECU_PAYE", label: "Retour Reçu Payé" },
];

// Tunisian governorates
const governorateOptions = [
  { value: "", label: "Toutes les villes" },
  { value: "Ariana", label: "Ariana" },
  { value: "Beja", label: "Béja" },
  { value: "Ben Arous", label: "Ben Arous" },
  { value: "Bizerte", label: "Bizerte" },
  { value: "Gabes", label: "Gabès" },
  { value: "Gafsa", label: "Gafsa" },
  { value: "Jendouba", label: "Jendouba" },
  { value: "Kairouan", label: "Kairouan" },
  { value: "Kasserine", label: "Kasserine" },
  { value: "Kebili", label: "Kébili" },
  { value: "Kef", label: "Le Kef" },
  { value: "Mahdia", label: "Mahdia" },
  { value: "Manouba", label: "Manouba" },
  { value: "Medenine", label: "Médenine" },
  { value: "Monastir", label: "Monastir" },
  { value: "Nabeul", label: "Nabeul" },
  { value: "Sfax", label: "Sfax" },
  { value: "Sidi Bouzid", label: "Sidi Bouzid" },
  { value: "Siliana", label: "Siliana" },
  { value: "Sousse", label: "Sousse" },
  { value: "Tataouine", label: "Tataouine" },
  { value: "Tozeur", label: "Tozeur" },
  { value: "Tunis", label: "Tunis" },
  { value: "Zaghouan", label: "Zaghouan" },
];

const FilterModal = ({ isOpen, onClose, onApply, currentFilters }) => {
  const [filters, setFilters] = useState({
    status: currentFilters?.status || "",
    startDate: currentFilters?.startDate || "",
    endDate: currentFilters?.endDate || "",
    customerName: currentFilters?.customerName || "",
    governorate: currentFilters?.governorate || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    // Validate date range
    if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
      toast.error("La date de début ne peut pas être postérieure à la date de fin.");
      return;
    }

    console.log("Applying filters:", filters);
    onApply(filters);
    toast.success("Filtres appliqués avec succès !");
    console.log("Closing modal (apply)");
    onClose();
  };

  const handleClear = () => {
    const resetFilters = {
      status: "",
      startDate: "",
      endDate: "",
      customerName: "",
      governorate: "",
    };
    setFilters(resetFilters);
    console.log("Resetting filters:", resetFilters);
    onApply(resetFilters);
    toast.success("Filtres réinitialisés !");
    console.log("Closing modal (clear)");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Filter className="w-6 h-6 text-white" />
                <h3 className="text-lg font-semibold text-white">Filtrer les Commandes</h3>
              </div>
              <button
                onClick={() => {
                  console.log("Closing modal (X button)");
                  onClose();
                }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                title="Fermer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  Statut de la Commande
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Plage de Dates
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Nom du Client
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={filters.customerName}
                  onChange={handleChange}
                  placeholder="Entrez le nom du client"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label htmlFor="governorate" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Gouvernorat
                </label>
                <select
                  id="governorate"
                  name="governorate"
                  value={filters.governorate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  {governorateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Réinitialiser
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Appliquer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

FilterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  currentFilters: PropTypes.shape({
    status: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    customerName: PropTypes.string,
    governorate: PropTypes.string,
  }),
};

export default FilterModal;