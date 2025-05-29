import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, ChevronDown, ChevronUp, Eye, User, MapPin, Calendar, FileText, History, Phone, CreditCard, Hash, Edit3, CheckCircle2, Clock, AlertCircle, Copy, Package, X } from "lucide-react";
import axios from "axios";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import config from "../../config.json";
import StatusDialog from "./StatusDialog";
import { toast } from "sonner";
import OrderDetailsDialog from "./OrderDetailsDialog";

const API_URL = config.API_URL || "http://localhost:3000/api";

const statusConfig = {
  EN_ATTENTE: { bg: "bg-yellow-100", text: "text-yellow-800", label: "En Attente" },
  A_ENLEVER: { bg: "bg-blue-100", text: "text-blue-800", label: "À Enlever" },
  ENLEVE: { bg: "bg-green-100", text: "text-green-800", label: "Enlevé" },
  AU_DEPOT: { bg: "bg-purple-100", text: "text-purple-800", label: "Au Dépôt" },
  RETOUR_DEPOT: { bg: "bg-indigo-100", text: "text-indigo-800", label: "Retour Dépôt" },
  EN_COURS: { bg: "bg-pink-100", text: "text-pink-800", label: "En Cours" },
  A_VERIFIER: { bg: "bg-orange-100", text: "text-orange-800", label: "À Vérifier" },
  LIVRES: { bg: "bg-teal-100", text: "text-teal-800", label: "Livré" },
  LIVRES_PAYE: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Livré Payé" },
  ECHANGE: { bg: "bg-amber-100", text: "text-amber-800", label: "Échange" },
  RETOUR_DEFINITIF: { bg: "bg-rose-100", text: "text-rose-800", label: "Retour Définitif" },
  RETOUR_INTER_AGENCE: { bg: "bg-cyan-100", text: "text-cyan-800", label: "Retour Inter-Agence" },
  RETOUR_EXPEDITEURS: { bg: "bg-violet-100", text: "text-violet-800", label: "Retour Expéditeurs" },
  RETOUR_RECU_PAYE: { bg: "bg-lime-100", text: "text-lime-800", label: "Retour Reçu Payé" },
  ABANDONNEE: { bg: "bg-gray-100", text: "text-gray-800", label: "Abandonnée" },
  default: { bg: "bg-gray-100", text: "text-gray-800", label: "Inconnu" },
};

const OrdersTable = ({ filters, selectedOrders, setSelectedOrders, statusMode = "all" }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedOrderIdForStatus, setSelectedOrderIdForStatus] = useState(null);
  const [ordersWithDetails, setOrdersWithDetails] = useState([]);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  const debugOrderStructure = () => {
    if (process.env.NODE_ENV === "development" && ordersWithDetails.length > 0) {
      console.log("=== DEBUG ORDERS ===");
      console.log("Premier ordre dans ordersWithDetails:", ordersWithDetails[0]);
      console.log("Premier ordre transformé:", orders[0]);
      console.log("===================");
    }
  };

  const handleEditClick = (e, orderId) => {
    e.stopPropagation();
    setSelectedOrderIdForStatus(orderId);
    setIsStatusDialogOpen(true);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
    setOrdersWithDetails((prev) =>
      prev.map((order) => (order.code_a_barre === orderId ? { ...order, etat: newStatus } : order))
    );
    toast.success(`Statut de la commande ${orderId} mis à jour !`);
  };

  const handleOrderSelection = (e, orderId) => {
    e.stopPropagation();
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length && orders.length > 0) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order.id));
    }
  };

  const applyFilters = (data) => {
    let filteredData = [...data];

    // Apply statusMode filter
    if (statusMode === "exclude-abandoned") {
      filteredData = filteredData.filter((order) => order.etat.toUpperCase() !== "ABANDONNEE");
    } else if (statusMode === "only-abandoned") {
      filteredData = filteredData.filter((order) => order.etat.toUpperCase() === "ABANDONNEE");
    }

    // Apply additional status filter from filters prop
    if (filters.status) {
      filteredData = filteredData.filter((order) => order.etat.toUpperCase() === filters.status.toUpperCase());
    }

    // Date range filter
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      filteredData = filteredData.filter((order) => new Date(order.dateAjout) >= start);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      filteredData = filteredData.filter((order) => new Date(order.dateAjout) <= end);
    }

    // Customer name filter
    if (filters.customerName) {
      const search = filters.customerName.toLowerCase().trim();
      filteredData = filteredData.filter((order) =>
        `${order.nom_prioritaire} ${order.prenom_prioritaire || ''}`.toLowerCase().includes(search)
      );
    }

    // Governorate filter
    if (filters.governorate) {
      filteredData = filteredData.filter((order) => order.gouvernorat === filters.governorate);
    }

    return filteredData;
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Utilisateur non authentifié");
      }
      const response = await axios.get(`${API_URL}/command/allCommands?_t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setOrdersWithDetails(response.data);
        const transformedData = applyFilters(response.data).map((order) => {
          const prix = Number(order.prix);
          const total = isNaN(prix) || prix < 0 ? 0 : prix;
          return {
            id: order.code_a_barre,
            customer: `${order.nom_prioritaire} ${order.prenom_prioritaire || ''}`.trim(),
            total,
            status: order.etat,
            date: new Date(order.dateAjout).toLocaleDateString("fr-FR"),
            gouvernorat: order.gouvernorat,
          };
        });
        setOrders(transformedData);
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (e) {
      setError(e.message);
      toast.error(`Erreur lors de la récupération des commandes: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchOrders = debounce(fetchOrders, 500);

  const fetchOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Utilisateur non authentifié");
      }
      const response = await axios.get(`${API_URL}/commandHistory/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { code_a_barre: orderId },
      });
      if (response.status === 200) {
        setSelectedOrderDetails(response.data.command);
        setOrderHistory(response.data.history);
        setIsOrderDetailsOpen(true);
      } else {
        throw new Error("Impossible de récupérer les détails de la commande");
      }
    } catch (error) {
      toast.error(`Erreur: ${error.response?.data?.msg || error.message}`);
    }
  };

  const handleRowClick = (orderId) => {
    fetchOrderDetails(orderId);
  };

  const handleCloseOrderDetails = () => {
    setIsOrderDetailsOpen(false);
    setSelectedOrderDetails(null);
    setOrderHistory([]);
  };

  useEffect(() => {
    debouncedFetchOrders();
    return () => debouncedFetchOrders.cancel();
  }, [filters, statusMode]);

  useEffect(() => {
    debugOrderStructure();
  }, [ordersWithDetails]);

  return (
    <>
      {isOrderDetailsOpen ? (
        <OrderDetailsDialog
          open={isOrderDetailsOpen}
          onClose={handleCloseOrderDetails}
          order={selectedOrderDetails}
          history={orderHistory}
        />
      ) : (
        <motion.div
          className="bg-white backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: "0.4" }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-black-800">
              Liste des commandes
            </h2>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === orders.length && orders.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      ID Commande
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Ville
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: "0.3", delay: index * 0.05 }}
                        className={`cursor-pointer hover:bg-gray-100 transition-colors ${selectedOrders.includes(order.id) ? "bg-blue-50" : ""}`}
                        onClick={() => handleRowClick(order.id)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={(e) => handleOrderSelection(e, order.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">{order.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">
                          {isNaN(order.total) ? "Invalide" : `${order.total.toFixed(2)} TND`}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[order.status]?.bg || statusConfig.default.bg} ${statusConfig[order.status]?.text || statusConfig.default.text}`}
                          >
                            {statusConfig[order.status]?.label || order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{order.date}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{order.gouvernorat || "-"}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <button
                            className="text-blue-500 hover:text-blue-600 mr-3"
                            onClick={(e) => handleEditClick(e, order.id)}
                            aria-label={`Modifier la commande ${order.id}`}
                          >
                            <Edit size={20} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-4 text-center text-sm text-gray-500"
                      >
                        Aucune commande disponible
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <StatusDialog
            open={isStatusDialogOpen}
            onClose={() => setIsStatusDialogOpen(false)}
            orderId={selectedOrderIdForStatus}
            onStatusChange={handleStatusChange}
          />
        </motion.div>
      )}
    </>
  );
};

OrdersTable.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    customerName: PropTypes.string,
    governorate: PropTypes.string,
  }),
  selectedOrders: PropTypes.arrayOf(PropTypes.string),
  setSelectedOrders: PropTypes.func.isRequired,
  statusMode: PropTypes.oneOf(["all", "exclude-abandoned", "only-abandoned"]),
};

OrdersTable.defaultProps = {
  filters: {},
  selectedOrders: [],
  statusMode: "all",
};

export default OrdersTable;