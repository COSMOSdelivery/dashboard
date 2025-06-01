import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Save, Package, Truck, Phone, MapPin, Euro, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import Header from '../../components/common/Header';
import ActionButton from '../../components/common/ActionButton';
import config from '../../config.json';

const API_URL = config.API_URL;

const ValidateDebriefPage = () => {
  const { debriefId } = useParams();
  const navigate = useNavigate();
  const [debrief, setDebrief] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ count: 0, total: 0 });
  const [userRole, setUserRole] = useState(null);

  // Fetch user role and debrief details
  useEffect(() => {
    const fetchUserAndDebrief = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('Token d\'authentification manquant');
        }

        // Fetch user rol
        // Pour les admins et service client, récupérer directement le débrief
        // Le débrief contient déjà l'information du livreur via deliveryAgentId
        const response = await axios.get(`${API_URL}/debrief/${debriefId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const debriefData = response.data.debrief;
        
        if (!debriefData) {
          throw new Error('Débrief non trouvé');
        }

        console.log('Débrief récupéré:', debriefData);
        console.log('Livreur ID du débrief:', debriefData.deliveryAgentId);

        setDebrief(debriefData);
        
        // Initialize orders with proper status mapping
        const initialOrders = debriefData.commandes.map((order) => ({
          ...order,
          status: order.etat === 'LIVRES' 
            ? 'RECEIVED' 
            : order.etat === 'RETOUR_DEFINITIF' 
            ? 'NOT_RECEIVED' 
            : 'PENDING',
        }));
        
        setOrders(initialOrders);
        
      } catch (err) {
        console.error('Erreur lors de la récupération du débrief:', err);
        setError(err.response?.data?.msg || err.message || 'Erreur lors du chargement du débrief');
      } finally {
        setLoading(false);
      }
    };

    if (debriefId) {
      fetchUserAndDebrief();
    } else {
      setError('ID de débrief manquant');
      setLoading(false);
    }
  }, [debriefId]);

  // Calculate stats for orders
  useEffect(() => {
    setStats({
      count: orders.length,
      total: orders.reduce((sum, order) => sum + (order.prix || 0), 0),
    });
  }, [orders]);

  // Handle status change for an order
  const handleStatusChange = (code_a_barre, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.code_a_barre === code_a_barre ? { ...order, status: newStatus } : order
      )
    );
    toast.success(`Commande ${code_a_barre} marquée comme ${newStatus === 'RECEIVED' ? 'Reçue' : 'Non reçue'}`);
  };

  // Handle saving the validations
  const handleSave = async () => {
    if (orders.some((order) => order.status === 'PENDING')) {
      toast.error('Veuillez valider toutes les commandes avant de sauvegarder');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const payload = {
        orders: orders.map((order) => ({
          code_a_barre: order.code_a_barre,
          etat: order.status === 'RECEIVED' ? 'LIVRES' : 'RETOUR_DEFINITIF',
        })),
      };

      console.log('Payload pour validation:', payload);
      console.log('ID du livreur pour historique:', debrief.deliveryAgentId);

      await axios.post(`${API_URL}/debrief/${debriefId}/validate-orders`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success('Validations enregistrées avec succès. Débrief fermé.');
      navigate('/debrief');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      toast.error(`Échec de la sauvegarde: ${err.response?.data?.msg || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => navigate('/debrief');

  // Define status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'RECEIVED':
        return 'bg-green-100 text-green-700';
      case 'NOT_RECEIVED':
        return 'bg-red-100 text-red-700';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
        <Header title={`Validation Débrief #${debriefId}`} />
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-4">Chargement du débrief...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
        <Header title={`Validation Débrief #${debriefId}`} />
        <div className="bg-red-100 text-red-700 p-4 rounded-lg m-6">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      <div className="bg-white shadow-sm border-b border-gray-200 p-6">
        <Header title={`Validation Débrief #${debriefId}`} />
        <div className="mt-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-600" />
              Livreur: {debrief?.livreur?.utilisateur?.nom} {debrief?.livreur?.utilisateur?.prenom}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              ID Livreur: <span className="font-medium">{debrief?.deliveryAgentId}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">Zone: {debrief?.zone}</p>
            <p className="text-sm text-gray-500 mt-1">Note: {debrief?.notes || 'Aucune note'}</p>
            <p className="text-sm text-gray-500 mt-1">
              Statut: <span className={debrief?.status === 'CLOSED' ? 'text-green-600' : 'text-yellow-600'}>{debrief?.status}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Validé par: {userRole} (ID: {debrief?.createdBy?.id})
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Commandes à valider
              </h2>
              <div className="text-sm text-gray-600">
                Nombre: <span className="font-semibold">{stats.count}</span> | Total:{' '}
                <span className="font-semibold">{stats.total.toFixed(2)} TND</span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {orders.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucune commande à valider</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order.code_a_barre} className="p-4 hover:bg-gray-50 group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">{order.code_a_barre}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {order.status === 'RECEIVED'
                              ? 'Reçu'
                              : order.status === 'NOT_RECEIVED'
                              ? 'Non reçu'
                              : 'En attente'}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{order.nom_prioritaire} {order.prenom_prioritaire}</span>
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
                            <Euro className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold text-green-600">{order.prix?.toFixed(2) || '0.00'} TND</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(order.code_a_barre, 'RECEIVED')}
                          className={`p-2 rounded-lg transition-colors ${
                            order.status === 'RECEIVED'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                          }`}
                          aria-label={`Marquer la commande ${order.code_a_barre} comme reçue`}
                          disabled={debrief?.status === 'CLOSED'}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.code_a_barre, 'NOT_RECEIVED')}
                          className={`p-2 rounded-lg transition-colors ${
                            order.status === 'NOT_RECEIVED'
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                          }`}
                          aria-label={`Marquer la commande ${order.code_a_barre} comme non reçue`}
                          disabled={debrief?.status === 'CLOSED'}
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
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
          onClick={handleBack}
          icon={ArrowLeft}
          label="Retour"
          color="bg-gray-600"
          ariaLabel="Retourner aux débriefs"
        />
        <ActionButton
          onClick={handleSave}
          icon={Save}
          label={loading ? 'Sauvegarde...' : 'Sauvegarder'}
          disabled={loading || orders.some((order) => order.status === 'PENDING') || debrief?.status === 'CLOSED'}
          ariaLabel="Sauvegarder les validations"
        />
      </div>
    </div>
  );
};

export default ValidateDebriefPage;