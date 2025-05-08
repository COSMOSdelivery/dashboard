import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Check, Edit, Truck, X, Filter } from "lucide-react";
import axios from "axios";
import config from "../../config.json";
import StatusDialog from "./StatusDialog";
import CarDialog from "./CarDialog";
import { toast } from "sonner";
const API_URL = config.API_URL;

const statusConfig = {
  EN_ATTENTE: { bg: "bg-yellow-100", text: "text-yellow-800" },
  A_ENLEVER: { bg: "bg-blue-100", text: "text-blue-800" },
  ENLEVE: { bg: "bg-green-100", text: "text-green-800" },
  AU_DEPOT: { bg: "bg-purple-100", text: "text-purple-800" },
  RETOUR_DEPOT: { bg: "bg-indigo-100", text: "text-indigo-800" },
  EN_COURS: { bg: "bg-pink-100", text: "text-pink-800" },
  A_VERIFIER: { bg: "bg-orange-100", text: "text-orange-800" },
  LIVRES: { bg: "bg-teal-100", text: "text-teal-800" },
  LIVRES_PAYE: { bg: "bg-emerald-100", text: "text-emerald-800" },
  ECHANGE: { bg: "bg-amber-100", text: "text-amber-800" },
  RETOUR_DEFINITIF: { bg: "bg-rose-100", text: "text-rose-800" },
  RETOUR_INTER_AGENCE: { bg: "bg-cyan-100", text: "text-cyan-800" },
  RETOUR_EXPEDITEURS: { bg: "bg-violet-100", text: "text-violet-800" },
  RETOUR_RECU_PAYE: { bg: "bg-lime-100", text: "text-lime-800" },
  default: { bg: "bg-gray-100", text: "text-gray-800" },
};

const OrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedOrderIdForStatus, setSelectedOrderIdForStatus] = useState(null);
  
  // États pour la sélection multiple
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  
  // Nouveaux états pour le filtrage par livreur
  const [couriers, setCouriers] = useState([]);
  const [selectedCourierId, setSelectedCourierId] = useState("");
  const [loadingCouriers, setLoadingCouriers] = useState(false);
  const [ordersWithDetails, setOrdersWithDetails] = useState([]);
  const [assigningOrders, setAssigningOrders] = useState(false);

  const handleEditClick = (orderId) => {
    console.log(orderId);
    setSelectedOrderIdForStatus(orderId);
    setIsStatusDialogOpen(true);
  };

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
  };

  // Gestionnaire pour assigner un livreur à une commande individuelle
  const handleCourierClick = (orderId) => {
    console.log(orderId);
    setSelectedOrderId(orderId);
    setIsDialogOpen(true);
  };

  // Gestionnaire pour l'assignation multiple
  const handleMultipleCourierClick = () => {
    if (selectedOrders.length > 0) {
      setIsDialogOpen(true);
    } else {
      toast.error("Veuillez sélectionner au moins une commande");
    }
  };

  // Fonction pour affecter directement les commandes filtrées au livreur sélectionné
  const handleDirectAssignToCourier = async () => {
    if (filteredOrders.length === 0 || !selectedCourierId) {
      toast.error("Aucune commande à affecter ou aucun livreur sélectionné");
      return;
    }

    const orderIds = filteredOrders.map(order => order.commandId);    setAssigningOrders(true);
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(
        `${API_URL}/command/assignLivreurToMultipleCommands`,
        {
          commandeIds: orderIds,
          livreurId: selectedCourierId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Calculer les résultats
        const success = response.data.filter(result => result.status === "success").length;
        const failed = response.data.filter(result => result.status === "error").length;

        if (failed > 0) {
          toast(`${success} commande(s) assignée(s) avec succès, ${failed} échec(s)`, {
            description: "Assignation terminée avec des erreurs",
            icon: "⚠️"
          });
        } else {
          toast.success(`${success} commande(s) assignée(s) avec succès`, {
            description: "Assignation terminée"
          });
        }

        // Rafraîchir les données
        fetchOrders();
      } else {
        toast.error("Une erreur est survenue lors de l'assignation des commandes");
      }
    } catch (error) {
      console.error("Erreur lors de l'assignation des commandes:", error);
      toast.error("Erreur lors de l'assignation des commandes");
    } finally {
      setAssigningOrders(false);
    }
  };

  // Gestionnaire pour basculer la sélection d'une commande
  const handleOrderSelection = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  // Fonction pour sélectionner/désélectionner toutes les commandes
  const handleSelectAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };
  
  // Fonction pour récupérer les livreurs
  const fetchCouriers = async () => {
    const token = localStorage.getItem("authToken");
    setLoadingCouriers(true);
    
    try {
      const response = await axios.get(`${API_URL}/users/allLivreurs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 200) {
        setCouriers(response.data);
      } else {
        toast.error("Impossible de récupérer la liste des livreurs");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des livreurs:", error);
      toast.error("Erreur lors de la récupération des livreurs");
    } finally {
      setLoadingCouriers(false);
    }
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(`${API_URL}/command/clientAllCommands`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        // Garder la réponse complète pour avoir accès aux détails comme gouvernorat
        setOrdersWithDetails(response.data);
        
        const transformedData = response.data.map((order) => ({
          id: order.code_a_barre,
          commandId: order.id, // Stockez l'ID réel de la commande
          // autres propriétés...          customer: `${order.nom_prioritaire} ${order.prenom_prioritaire}`,
          total: order.prix * order.nb_article,
          status: order.etat,
          date: new Date(order.dateAjout).toISOString().split("T")[0],
          livreur: order.livreur?.utilisateur
            ? `${order.livreur.utilisateur.nom} ${order.livreur.utilisateur.prenom}`
            : "Non affecté",
          gouvernorat: order.gouvernorat,
          livreurId: order.livreur?.id || null
        }));
  
        console.log("Fetched orders:", transformedData);
        setOrders(transformedData);
        setFilteredOrders(transformedData);
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
    fetchCouriers();
  }, []);
  
  // Gestionnaire pour les résultats de l'assignation en masse
  const handleBulkAssignmentResults = (results) => {
    if (results.success > 0) {
      if (results.failed > 0) {
        toast(`${results.success} commande(s) assignée(s) avec succès, ${results.failed} échec(s)`, {
          description: "Assignation terminée avec des erreurs",
          icon: "⚠️"
        });
      } else {
        toast.success(`${results.success} commande(s) assignée(s) avec succès`, {
          description: "Assignation terminée"
        });
      }
      
      // Rafraîchir les commandes après assignation
      fetchOrders();
      
      // Réinitialiser la sélection si tout s'est bien passé
      if (results.failed === 0) {
        setSelectedOrders([]);
        setMultiSelectMode(false);
      }
    }
  };
  
  // Fonction pour gérer le changement de livreur sélectionné
  const handleCourierChange = (e) => {
    const courierId = e.target.value;
    setSelectedCourierId(courierId);
    
    if (!courierId) {
      // Si aucun livreur n'est sélectionné, afficher toutes les commandes
      setFilteredOrders(orders);
      return;
    }
    
    // Trouver le livreur sélectionné et son gouvernorat
    const selectedCourier = couriers.find(courier => courier.id.toString() === courierId);
    
    if (selectedCourier && selectedCourier.gouvernorat) {
      // Filtrer les commandes par gouvernorat du livreur
      const filtered = orders.filter(order => 
        order.gouvernorat && order.gouvernorat.toLowerCase() === selectedCourier.gouvernorat.toLowerCase()
      );
      
      setFilteredOrders(filtered);
    } else {
      // Si le livreur n'a pas de gouvernorat, afficher un message
      setFilteredOrders([]);
      toast.info("Ce livreur n'a pas de gouvernorat assigné");
    }
  };
  
  // Effet pour appliquer le filtre de recherche
  useEffect(() => {
    let filtered = orders;
    
    // Appliquer le filtre par texte (recherche)
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Appliquer le filtre par livreur si un livreur est sélectionné
    if (selectedCourierId) {
      const selectedCourier = couriers.find(courier => courier.id.toString() === selectedCourierId);
      
      if (selectedCourier && selectedCourier.gouvernorat) {
        filtered = filtered.filter(order => 
          order.gouvernorat && order.gouvernorat.toLowerCase() === selectedCourier.gouvernorat.toLowerCase()
        );
      }
    }
    
    setFilteredOrders(filtered);
  }, [searchTerm, orders, selectedCourierId, couriers]);

  return (
    <motion.div
      className="bg-white backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black-700">
          Liste des Commandes
        </h2>
        <div className="flex items-center gap-2">
          {/* Sélecteur de livreur */}
          <div className="relative">
            <select
              className="bg-gray-200 text-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCourierId}
              onChange={handleCourierChange}
              disabled={loadingCouriers}
            >
              <option value="">Tous les livreurs</option>
              {couriers.map(courier => (
                <option key={courier.id} value={courier.id}>
                  {`${courier.nom} ${courier.prenom}`}
                </option>
              ))}
            </select>
            <Filter 
              className="absolute left-3 top-2.5 text-gray-700" 
              size={18} 
            />
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Recherche Comm..."
              className="bg-gray-200 text-gray-700 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Rechercher une commande"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-700"
              size={18}
            />
          </div>
          
          {/* Bouton contextuel: "Affecter au livreur" ou "Sélection multiple" */}
          {selectedCourierId ? (
            <button
              onClick={handleDirectAssignToCourier}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              disabled={filteredOrders.length === 0 || assigningOrders}
            >
              {assigningOrders ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                  Affectation...
                </>
              ) : (
                <>
                  <Truck size={18} />
                  Affecter au livreur ({filteredOrders.length})
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                setMultiSelectMode(!multiSelectMode);
                if (!multiSelectMode) {
                  setSelectedOrders([]);
                }
              }}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                multiSelectMode ? "bg-red-500 hover:bg-red-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {multiSelectMode ? (
                <>
                  <X size={18} />
                  Annuler
                </>
              ) : (
                <>
                  <Check size={18} />
                  Sélection multiple
                </>
              )}
            </button>
          )}
          
          {/* Bouton pour assigner un livreur aux commandes sélectionnées */}
          {multiSelectMode && selectedOrders.length > 0 && !selectedCourierId && (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
              onClick={handleMultipleCourierClick}
            >
              <Truck size={18} />
              Assigner livreur ({selectedOrders.length})
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {/* Colonne de sélection en mode multi-sélection */}
                {multiSelectMode && !selectedCourierId && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAllOrders}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
                  ID Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
                  Gouvernorat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
                  Livreur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={
                      selectedOrders.includes(order.id) ? "bg-blue-50" : ""
                    }
                  >
                    {/* Case à cocher pour la sélection en mode multi-sélection */}
                    {multiSelectMode && !selectedCourierId && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleOrderSelection(order.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black-700">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black-700">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black-700">
                      {order.total.toFixed(2)} TND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-800">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusConfig[order.status]?.bg || statusConfig.default.bg
                        } ${statusConfig[order.status]?.text || statusConfig.default.text}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-800">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-800">
                      {order.gouvernorat || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-800">
                      {order.livreur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-800">
                      <button
                        className="text-indigo-400 hover:text-indigo-300 mr-2"
                        onClick={() => handleEditClick(order.id)}
                        aria-label="Modifier la commande"
                      >
                        <Edit size={18} />
                      </button>
                      {!multiSelectMode && !selectedCourierId && (
                        <button
                          className="text-green-400 hover:text-green-300"
                          onClick={() => handleCourierClick(order.id)}
                          aria-label="Affecter un livreur"
                        >
                          <Truck size={18} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={multiSelectMode && !selectedCourierId ? 9 : 8} className="px-6 py-4 text-center text-sm text-gray-500">
                    {selectedCourierId 
                      ? "Aucune commande correspondant aux gouvernorats de ce livreur" 
                      : "Aucune commande trouvée"}
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
      
      {/* CarDialog pour les sélections individuelles ou multiples sans livreur présélectionné */}
      <CarDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedOrderId(null);
        }}
        orderId={selectedOrderId}
        isMultipleSelection={multiSelectMode && selectedOrders.length > 0}
        selectedOrders={selectedOrders}
        onBulkAssign={handleBulkAssignmentResults}
      />
    </motion.div>
  );
};

export default OrdersTable;