import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus, ArrowLeft, RefreshCw, Search, Package, Truck } from 'lucide-react';
import axios from 'axios';
import Header from '../../components/common/Header';
import ActionButton from '../../components/common/ActionButton';
import AgentSelector from '../../components/CreateDebrief/AgentSelector';
import OrderList from '../../components/CreateDebrief/OrderList';
import useDeliveryAgents from '../../hooks/useDeliveryAgents';
import useOrders from '../../hooks/useOrders';
import config from '../../config.json';

const API_URL = config.API_URL;

const CreateDebriefPage = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [briefingNote, setBriefingNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingDebrief, setLoadingDebrief] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const { deliveryAgents, loading: loadingAgents, error: agentError, refetch: refetchAgents } = useDeliveryAgents(refreshKey, retryCount);
  const { orders, loading: loadingOrders, error: orderError, refetch: refetchOrders } = useOrders(refreshKey);

  // Handle debrief deletion signal
  useMemo(() => {
    if (location.state?.debriefDeleted) {
      setRefreshKey((prev) => prev + 1);
      toast.success('Débrief supprimé, commandes libérées pour réassignation');
    }
  }, [location.state]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'À vérifier': return 'bg-yellow-100 text-yellow-700';
      case 'EN_COURS': return 'bg-blue-100 text-blue-700';
      case 'LIVRES': return 'bg-green-100 text-green-700';
      case 'LIVRES_PAYE': return 'bg-green-200 text-green-800';
      case 'RETOUR_DEFINITIF': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFilteredOrders = useCallback(() => {
    if (!selectedAgent) return orders;
    return orders.filter(
      (order) =>
        order.gouvernorat.trim().toLowerCase() === selectedAgent.gouvernorat.trim().toLowerCase() &&
        !selectedOrders.find((selected) => selected.id === order.id)
    );
  }, [selectedAgent, selectedOrders, orders]);

  const filteredOrders = useMemo(
    () =>
      getFilteredOrders().filter(
        (order) =>
          order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.phone.includes(searchTerm)
      ),
    [getFilteredOrders, searchTerm]
  );

  const availableStats = useMemo(
    () => ({
      count: filteredOrders.length,
      total: filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0),
    }),
    [filteredOrders]
  );

  const selectedStats = useMemo(
    () => ({
      count: selectedOrders.length,
      total: selectedOrders.reduce((sum, order) => sum + (order.total || 0), 0),
    }),
    [selectedOrders]
  );

  const handleSelectOrder = (order) => {
    setSelectedOrders([...selectedOrders, order]);
    setOrders(orders.filter((o) => o.id !== order.id));
    toast.success(`Commande ${order.id} ajoutée au débrief`);
  };

  const handleRemoveOrder = (orderId) => {
    const removedOrder = selectedOrders.find((order) => order.id === orderId);
    if (removedOrder) {
      setSelectedOrders(selectedOrders.filter((order) => order.id !== orderId));
      setOrders([...orders, removedOrder]);
      toast.success(`Commande ${orderId} retirée du débrief`);
    }
  };

  const handleOpenDebrief = async () => {
    if (!selectedAgent || selectedOrders.length === 0) {
      toast.error('Veuillez sélectionner un livreur et au moins une commande');
      return;
    }
    setLoadingDebrief(true);
    try {
      const token = localStorage.getItem('authToken');
      const payload = {
        deliveryAgentId: selectedAgent.id,
        zone: selectedAgent.gouvernorat,
        commandeIds: selectedOrders.map((order) => order.id),
        notes: briefingNote || 'Nouveau débrief créé depuis la préparation',
      };
      const response = await axios.post(`${API_URL}/debrief`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Débrief ${response.data.debrief.id} créé avec succès pour ${selectedAgent.name}`);
      navigate('/debrief');
    } catch (err) {
      toast.error(`Échec de la création du débrief: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoadingDebrief(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="w-full flex flex-col h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      <div className="bg-white shadow-sm border-b border-gray-200 p-6">
        <Header title="Préparation de Livraison" />
        {(agentError || orderError) && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 flex items-center justify-between">
            <span>{agentError || orderError}</span>
            {retryCount < 3 && (
              <ActionButton
                onClick={handleRetry}
                icon={RefreshCw}
                label="Réessayer"
                color="bg-red-200"
                ariaLabel="Réessayer le chargement des données"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Note de briefing</label>
            <input
              type="text"
              value={briefingNote}
              onChange={(e) => setBriefingNote(e.target.value)}
              placeholder="Instructions particulières..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Saisir une note de briefing"
            />
          </div>
        </div>
      </div>
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        <OrderList
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
                <Truck className="h-5 w-5 text-green-600" />
                Commandes Sélectionnées
                {selectedAgent && (
                  <span className="text-sm text-gray-500">pour {selectedAgent.name}</span>
                )}
              </h2>
              <div className="text-sm text-gray-600">
                Nombre: <span className="font-semibold">{selectedStats.count}</span> | Total:{' '}
                <span className="font-semibold">{selectedStats.total.toFixed(2)} TND</span>
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
                  <div key={order.id} className="p-4 hover:bg-red-50 group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">{order.id}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{order.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{order.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{order.gouvernorat}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Euro className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold text-green-600">{order.total.toFixed(2)} TND</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveOrder(order.id)}
                        className="text-gray-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-all"
                        aria-label={`Supprimer la commande ${order.id} de la sélection`}
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
          onClick={() => navigate('/debrief')}
          icon={ArrowLeft}
          label="Retour"
          color="bg-gray-600"
          ariaLabel="Retourner aux débriefs"
        />
        <ActionButton
          onClick={handleOpenDebrief}
          icon={Plus}
          label={loadingDebrief ? 'Création...' : 'Créer le Débrief'}
          disabled={loadingDebrief || !selectedAgent || selectedOrders.length === 0}
          ariaLabel="Créer un nouveau débrief"
        />
      </div>
    </div>
  );
};

export default CreateDebriefPage;