import { useState, useEffect } from "react";
import {
  Eye,
  Package,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// États de retour selon votre enum Prisma
const ETATS_RETOUR = [
  "RETOUR_DEPOT",
  "RETOUR_DEFINITIF", 
  "RETOUR_INTER_AGENCE",
  "RETOUR_EXPEDITEURS",
  "RETOUR_RECU_PAYE"
];

// Fonction pour obtenir le libellé français de l'état
const getEtatLabel = (etat) => {
  const labels = {
    "RETOUR_DEPOT": "Retour dépôt",
    "RETOUR_DEFINITIF": "Retour définitif",
    "RETOUR_INTER_AGENCE": "Retour inter-agence",
    "RETOUR_EXPEDITEURS": "Retour expéditeurs",
    "RETOUR_RECU_PAYE": "Retour reçu payé"
  };
  return labels[etat] || etat;
};

// Fonction pour obtenir la variante du badge selon l'état
const getBadgeVariant = (etat) => {
  switch(etat) {
    case "RETOUR_DEFINITIF":
      return "destructive";
    case "RETOUR_RECU_PAYE":
      return "default";
    case "RETOUR_DEPOT":
      return "secondary";
    case "RETOUR_INTER_AGENCE":
      return "outline";
    case "RETOUR_EXPEDITEURS":
      return "secondary";
    default:
      return "secondary";
  }
};

// Fonction pour obtenir le mode de paiement en français
const getModePaiementLabel = (mode) => {
  const labels = {
    "ESPECE": "Espèces",
    "CHEQUE": "Chèque",
    "ESPECE_ou_CHEQUE": "Espèces ou Chèque"
  };
  return labels[mode] || mode;
};

// Composant OrdersTable
const OrdersTable = ({ commandes, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Commande</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Client</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Ville</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Prix</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">État</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
            <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {commandes.map((commande) => (
            <tr key={commande.code_a_barre} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{commande.code_a_barre}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {commande.nom_prioritaire} {commande.prenom_prioritaire}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {commande.ville}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {commande.prix.toFixed(2)} TND
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getBadgeVariant(commande.etat)}>
                  {getEtatLabel(commande.etat)}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(commande.dateAjout).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => onViewDetails(commande)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Composant CommandeDetailsModal
const CommandeDetailsModal = ({ commande, onClose }) => {
  if (!commande) return null;

  return (
    <Dialog open={!!commande} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-500" />
            Détails de la commande #{commande.code_a_barre}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>👤</span>
                Informations client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {commande.nom_prioritaire} {commande.prenom_prioritaire}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    📞 {commande.telephone1}
                  </p>
                  {commande.telephone2 && (
                    <p className="text-sm text-gray-600">
                      📞 {commande.telephone2}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    📍 {commande.adresse}
                  </p>
                  <p className="text-sm text-gray-600">
                    🏙️ {commande.ville}, {commande.gouvernorat}
                  </p>
                  <p className="text-sm text-gray-600">
                    📮 {commande.codePostal}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails de la commande */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>📦</span>
                Détails de la commande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Désignation</p>
                    <p className="text-sm text-gray-900">{commande.designation}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Prix</p>
                    <p className="text-lg font-bold text-green-600">
                      {commande.prix.toFixed(2)} TND
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Nombre d'articles</p>
                    <p className="text-sm text-gray-900">{commande.nb_article}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">État</p>
                    <Badge variant={getBadgeVariant(commande.etat)} className="mt-1">
                      {getEtatLabel(commande.etat)}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Mode de paiement</p>
                    <p className="text-sm text-gray-900">
                      {getModePaiementLabel(commande.mode_paiement)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date d'ajout</p>
                    <p className="text-sm text-gray-900">
                      {new Date(commande.dateAjout).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  
                  {commande.derniereMiseAJour && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Dernière mise à jour</p>
                      <p className="text-sm text-gray-900">
                        {new Date(commande.derniereMiseAJour).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {commande.remarque && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">Remarque</p>
                  <p className="text-sm text-yellow-700 mt-1">{commande.remarque}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations livreur si disponible */}
          {commande.livreur && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>🚚</span>
                  Informations livreur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">
                    {commande.livreur.utilisateur.nom} {commande.livreur.utilisateur.prenom}
                  </p>
                  <p className="text-sm text-gray-600">
                    📞 {commande.livreur.utilisateur.telephone1}
                  </p>
                  <p className="text-sm text-gray-600">
                    📧 {commande.livreur.utilisateur.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    🏛️ Gouvernorat: {commande.livreur.gouvernorat}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informations d'échange si applicable */}
          {(commande.code_a_barre_echange || commande.nb_article_echange) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>🔄</span>
                  Informations d'échange
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {commande.code_a_barre_echange && (
                  <p className="text-sm text-gray-600">
                    Code à barre échange: <span className="font-medium">{commande.code_a_barre_echange}</span>
                  </p>
                )}
                {commande.nb_article_echange && (
                  <p className="text-sm text-gray-600">
                    Nombre d'articles échange: <span className="font-medium">{commande.nb_article_echange}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Composant Header
const Header = ({ title }) => (
  <div className="mb-6">
    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
      <Package className="h-8 w-8 text-blue-500" />
      {title}
    </h1>
    <p className="text-gray-600 mt-2">Gérez vos commandes en état de retour</p>
  </div>
);

// Composant Alert
const Alert = ({ variant, children }) => (
  <div className={`p-4 rounded-lg border ${
    variant === 'destructive' 
      ? 'bg-red-50 border-red-200 text-red-800' 
      : 'bg-blue-50 border-blue-200 text-blue-800'
  }`}>
    <div className="flex items-center gap-2">
      <AlertCircle className="h-4 w-4" />
      {children}
    </div>
  </div>
);

const AlertDescription = ({ children }) => (
  <span>{children}</span>
);

// Composant Stats
const StatsCards = ({ commandes }) => {
  const stats = ETATS_RETOUR.reduce((acc, etat) => {
    acc[etat] = commandes.filter(cmd => cmd.etat === etat).length;
    return acc;
  }, {});

  const totalRetours = commandes.length;
  const totalMontant = commandes.reduce((sum, cmd) => sum + cmd.prix, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Retours</p>
              <p className="text-2xl font-bold text-gray-900">{totalRetours}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Montant Total</p>
              <p className="text-2xl font-bold text-green-600">{totalMontant.toFixed(2)} TND</p>
            </div>
            <span className="text-2xl">💰</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Retours Définitifs</p>
              <p className="text-2xl font-bold text-red-600">{stats.RETOUR_DEFINITIF || 0}</p>
            </div>
            <span className="text-2xl">❌</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Retours Payés</p>
              <p className="text-2xl font-bold text-green-600">{stats.RETOUR_RECU_PAYE || 0}</p>
            </div>
            <span className="text-2xl">✅</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant Retours principal
const Retours = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCommande, setSelectedCommande] = useState(null);

  // Simulation de l'appel API - Remplacez par votre vraie logique
  const fetchCommands = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // REMPLACEZ cette partie par votre vrai appel API :
      /*
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/command/clientAllCommands`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Filtrer les commandes en état de retour selon l'enum Prisma
      const commandesRetours = response.data.filter(
        (commande) => ETATS_RETOUR.includes(commande.etat)
      );
      
      setCommandes(commandesRetours);
      */
      
      // Simulation pour la démonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCommandes([]); // Aucune commande pour la demo
      
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur de chargement des commandes");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommands();
  }, []);

  const handleViewDetails = (commande) => {
    setSelectedCommande(commande);
  };

  const handleRefresh = () => {
    fetchCommands();
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto relative z-10 p-6">
        <Header title="Mes Retours" />
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-900">Chargement des commandes...</p>
          <p className="text-sm text-gray-500">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto relative z-10 p-6 bg-gray-50 min-h-screen">
      {error && (
        <div className="mb-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      
      <Header title="Mes Retours" />

      {/* Statistiques */}
      {commandes.length > 0 && <StatsCards commandes={commandes} />}

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        
        {commandes.length > 0 && (
          <div className="text-sm text-gray-600">
            {commandes.length} commande{commandes.length > 1 ? 's' : ''} en retour
          </div>
        )}
      </div>

      {/* Tableau des commandes */}
      {commandes.length > 0 ? (
        <OrdersTable
          commandes={commandes}
          onViewDetails={handleViewDetails}
        />
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <Package className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-xl font-medium text-gray-900">Aucune commande en retours</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Aucune commande n'est actuellement en état de retour. 
            Toutes vos commandes sont soit en cours de traitement, soit livrées avec succès.
          </p>
          <Button onClick={handleRefresh} variant="outline" className="mt-4">
            🔄 Vérifier à nouveau
          </Button>
        </div>
      )}

      {/* Modal des détails de la commande */}
      <CommandeDetailsModal
        commande={selectedCommande}
        onClose={() => setSelectedCommande(null)}
      />
    </div>
  );
};

export default Retours;