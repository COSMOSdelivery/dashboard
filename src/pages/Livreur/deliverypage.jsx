import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Truck, CheckCircle, Clock, AlertCircle, Package, Home, RefreshCw, Loader, ArrowRight, ChevronDown } from "lucide-react";
import axios from "axios";
import config from "../../config.json";
const API_URL = config.API_URL;
import Header from "../../components/common/Header";

const statusConfig = {
  EN_ATTENTE: { bg: "bg-yellow-50", text: "text-yellow-600", icon: Clock },
  A_ENLEVER: { bg: "bg-blue-50", text: "text-blue-600", icon: Package },
  ENLEVE: { bg: "bg-green-50", text: "text-green-600", icon: CheckCircle },
  AU_DEPOT: { bg: "bg-purple-50", text: "text-purple-600", icon: Home },
  RETOUR_DEPOT: { bg: "bg-indigo-50", text: "text-indigo-600", icon: RefreshCw },
  EN_COURS: { bg: "bg-pink-50", text: "text-pink-600", icon: Truck },
  A_VERIFIER: { bg: "bg-orange-50", text: "text-orange-600", icon: AlertCircle },
  LIVRES: { bg: "bg-teal-50", text: "text-teal-600", icon: CheckCircle },
  default: { bg: "bg-gray-50", text: "text-gray-600", icon: Loader },
};
const OrdersGridForCourier = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [regionFilter, setRegionFilter] = useState("");
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [regions, setRegions] = useState([]);
    const [editStatus, setEditStatus] = useState(""); // État pour le statut sélectionné dans le dialogue/ État pour stocker les régions uniques
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setEditStatus(order.status); // Initialiser le statut dans le dialogue avec le statut actuel de la commande
      };
    useEffect(() => {
      const fetchOrders = async () => {
        const token = localStorage.getItem("authToken");
        const id_livreur = JSON.parse(localStorage.getItem("userInfo"))?.id || "1";
  
        try {
          const response = await axios.get(
            `${API_URL}/command/livreurAllCommands/${id_livreur}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            const transformedData = response.data.map((order) => ({
              id: order.code_a_barre,
              customer: `${order.nom_prioritaire} ${order.prenom_prioritaire}`,
              total: order.prix * order.nb_article,
              status: order.etat,
              date: new Date(order.dateAjout).toISOString().split("T")[0],
              region: order.gouvernorat, // Ajouter la région à l'objet order
            }));
  
            setOrders(transformedData);
            setFilteredOrders(transformedData);
  
            // Extraire les régions uniques des commandes
            const uniqueRegions = [...new Set(transformedData.map((order) => order.region))];
            setRegions(uniqueRegions); // Mettre à jour l'état des régions
          } else {
            throw new Error("Failed to fetch orders");
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrders();
    }, []);
  
    useEffect(() => {
      let filtered = orders;
  
      // Appliquer le filtre de recherche
      if (searchTerm) {
        filtered = filtered.filter(
          (order) =>
            order.id.toString().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
  
      // Appliquer le filtre de région
      if (regionFilter) {
        filtered = filtered.filter((order) => order.region === regionFilter);
      }
  
      setFilteredOrders(filtered);
    }, [searchTerm, regionFilter, orders]);
  

    const handleSaveStatus = async () => {
        if (!selectedOrder) return;
    
        const token = localStorage.getItem("authToken");
    
        try {
          const response = await axios.put(
            `${API_URL}/command/updateStatus/${selectedOrder.id}`,
            { status: editStatus },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          if (response.status === 200) {
            // Mettre à jour l'état local des commandes
            const updatedOrders = orders.map((order) =>
              order.id === selectedOrder.id ? { ...order, status: editStatus } : order
            );
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);
    
            // Fermer le dialogue
            setSelectedOrder(null);
          } else {
            throw new Error("Failed to update order status");
          }
        } catch (error) {
          setError(error.message);
        }
      };
  return (
    <motion.div
      className="flex-1 overflow-auto relative z-10 bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex-1 overflow-auto relative z-10 bg-white">
        <Header title={"Mes Commandes"} />

        <div className="flex items-center gap-2 p-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Recherche Comm..."
              className="w-full bg-gray-50 text-gray-700 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Rechercher une commande"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <div className="relative">
            <select
              className="bg-gray-50 text-gray-700 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all duration-300"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <option value="">Toutes les régions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {/* Grille moderne */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {filteredOrders.map((order, index) => {
          const StatusIcon = statusConfig[order.status]?.icon || statusConfig.default.icon;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Commande #{order.id}
                </h3>
                <button 
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={() => handleViewDetails(order)}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Client :</span> {order.customer}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total :</span> {order.total.toFixed(2)} TND
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date :</span> {order.date}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Région :</span> {order.region}
                </p>
                <div className="flex items-center">
                  <StatusIcon className="mr-2" size={14} />
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      statusConfig[order.status]?.bg || statusConfig.default.bg
                    } ${
                      statusConfig[order.status]?.text || statusConfig.default.text
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal pour afficher les détails de la commande */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Détails de la commande #{selectedOrder.id}</h2>
            <div className="space-y-4">
              <p><span className="font-medium">Client :</span> {selectedOrder.customer}</p>
              <p><span className="font-medium">Total :</span> {selectedOrder.total.toFixed(2)} TND</p>
              <p><span className="font-medium">Date :</span> {selectedOrder.date}</p>
              <p><span className="font-medium">Région :</span> {selectedOrder.region}</p>
              <div className="flex items-center">
                <span className="font-medium">Statut :</span>
                <select
                  className="ml-2 bg-gray-50 text-gray-700 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all duration-300"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  {Object.keys(statusConfig).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                onClick={() => setSelectedOrder(null)}
              >
                Annuler
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                onClick={handleSaveStatus}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default OrdersGridForCourier;