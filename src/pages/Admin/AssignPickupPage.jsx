import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus, ArrowLeft, RefreshCw, Package, Phone, MapPin } from 'lucide-react';
import axios from 'axios';
import Header from '../../components/common/Header';
import ActionButton from '../../components/common/ActionButton';
import AgentSelector from '../../components/CreateDebrief/AgentSelector';
import PickupOrderList from '../../components/AssignPickup/PickupOrderList';
import useDeliveryAgents from '../../hooks/useDeliveryAgents';
import usePickupOrders from '../../hooks/usePickupOrders';
import config from '../../config.json';

const API_URL = config.API_URL;

const AssignPickupPage = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [briefingNote, setBriefingNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingPickup, setLoadingPickup] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const { deliveryAgents, loading: loadingAgents, error: agentError, refetch: refetchAgents } = useDeliveryAgents(refreshKey, retryCount);
  const { orders, loading: loadingOrders, error: orderError, refetch: refetchOrders } = usePickupOrders(refreshKey);

  // Handle pickup deletion signal
  useMemo(() => {
    if (location.state?.pickupDeleted) {
      setRefreshKey((prev) => prev + 1);
      toast.success('Pickup supprimé, commandes libérées pour réassignation');
    }
  }, [location.state]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-700';
      case 'A_ENLEVER': return 'bg-blue-100 text-blue-700';
      case 'ENLEVE': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFilteredOrders = useCallback(() => {
    if (!selectedAgent) return orders;
    return orders.filter(
      (order) =>
        order.gouvernorat.trim().toLowerCase() === selectedAgent.gouvernorat.trim().toLowerCase() &&
        !selectedOrders.find((selected) => selected.code_a_barre === order.code_a_barre)
    );
  }, [selectedAgent, selectedOrders, orders]);

  const filteredOrders = useMemo(
    () =>
      getFilteredOrders().filter(
        (order) =>
          order.nom_prioritaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.code_a_barre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.telephone1.includes(searchTerm)
      ),
    [getFilteredOrders, searchTerm]
  );

  const availableStats = useMemo(
    () => ({
      count: filteredOrders.length,
      totalItems: filteredOrders.reduce((sum, order) => sum + (order.nb_article || 0), 0),
    }),
    [filteredOrders]
  );

  const selectedStats = useMemo(
    () => ({
      count: selectedOrders.length,
      totalItems: selectedOrders.reduce((sum, order) => sum + (order.nb_article || 0), 0),
    }),
    [selectedOrders]
  );

  const handleSelectOrder = (order) => {
    setSelectedOrders([...selectedOrders, order]);
    toast.success(`Commande ${order.code_a_barre} ajoutée au pickup`);
  };

  const handleRemoveOrder = (code_a_barre) => {
    const removedOrder = selectedOrders.find((order) => order.code_a_barre === code_a_barre);
    if (removedOrder) {
      setSelectedOrders(selectedOrders.filter((order) => order.code_a_barre !== code_a_barre));
      toast.success(`Commande ${code_a_barre} retirée du pickup`);
    }
  };

  const handleAssignPickup = async () => {
    if (!selectedAgent || selectedOrders.length === 0) {
      toast.error('Veuillez sélectionner un livreur et au moins une commande');
      return;
    }
    setLoadingPickup(true);
    try {
      const token = localStorage.getItem('authToken');
      const payload = {
        deliveryAgentId: selectedAgent.idLivreur,
        zone: selectedAgent.gouvernorat,
        commandeIds: selectedOrders.map((order) => order.code_a_barre),
        notes: briefingNote || 'Nouveau pickup assigné',
      };
      const response = await axios.post(`${API_URL}/command/setaDeleveryPerson`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Pickup ${response.data.pickup.id} créé avec succès pour ${selectedAgent.name}`);
      navigate('/pickups', { state: { pickupAssigned: true } });
    } catch (err) {
      toast.error(`Échec de la création du pickup: ${err.response?.data?.msg || err.message}`);
    } finally {
      setLoadingPickup(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="w-full flex flex-col h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      <div className="bg-white shadow-sm border-b border-gray-200 p-6">
        <Header title="Assignation de Pickup" />
        {(agentError || orderError) && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 flex items-center justify-between">
            <span>{agentError || orderError}</span>
            {retryCount < 3 && (
              <ActionButton
                onClick={handleRetry}
                icon={<RefreshCw />}
                label="Réessayer"
                color="bg-red-200"
                aria-label="Réessayer le chargement des données"
              />
            )}
          </div>
        )}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AgentSelector
            agents={deliveryAgents}
            selectedAgent={selectedAgent}
            setSelectedAgent={setSelectedAgent}
            loading={loadingAgents}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note de pickup</label>
            <input
              type="text"
              value={briefingNote}
              onChange={(e) => setBriefingNote(e.target.value)}
              placeholder="Instructions particulières..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Saisir une note de pickup"
            />
          </div>
        </div>
      </div>
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        <PickupOrderList
          orders={filteredOrders}
          onSelect={handleSelectOrder}
          selectedAgent={selectedAgent}
          getStatusColor={getStatusColor}
          stats={availableStats}
          loading={loadingOrders}
        />
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Commandes Sélectionnées
                {selectedAgent && (
                  <span className="text-sm text-gray-500">pour {selectedAgent.name}</span>
                )}
              </h2>
              <div className="text-sm text-gray-600">
                Nombre: <span className="font-semibold">{selectedStats.count}</span> | Articles:{' '}
                <span className="font-semibold">{selectedStats.totalItems}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {selectedOrders.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucune commande sélectionnée</p>
                  <p className="text-sm mt-1">Cliquez sur une commande à gauche pour l'ajouter</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {selectedOrders.map((order) => (
                  <div key={order.code_a_barre} className="p-4 hover:bg-red-50 group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">{order.code_a_barre}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.etat)}`}>
                            {order.etat}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{order.nom_prioritaire}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{order.telephone1}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{order.gouvernorat}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold">{order.nb_article} articles</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveOrder(order.code_a_barre)}
                        className="text-gray-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-all"
                        aria-label={`Supprimer la commande ${order.code_a_barre} de la sélection`}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white border-t border-gray-200 p-6 flex justify-between">
  <ActionButton
    onClick={() => navigate('/pickups')}
    icon={ArrowLeft} // Changed from <ArrowLeft /> to ArrowLeft
    label="Retour"
    color="bg-gray-600"
    aria-label="Retourner aux pickups"
  />
  <ActionButton
    onClick={handleAssignPickup}
    icon={Plus} // Changed from <Plus /> to Plus
    label={loadingPickup ? 'Assignation...' : 'Assigner le Pickup'}
    disabled={loadingPickup || !selectedAgent || selectedOrders.length === 0}
    aria-label="Assigner un nouveau pickup"
  />
</div>
    </div>
  );
};

export default AssignPickupPage;