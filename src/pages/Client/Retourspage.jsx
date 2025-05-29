import { useState, useEffect } from "react";
import {
  Eye,
  Package,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { debounce } from "lodash";
import config from "../../config.json";
import StatCard from "../../components/common/StatCard";
import { FaBox, FaMoneyBillWave, FaUndo, FaCheckCircle } from "react-icons/fa";

const API_URL = config.API_URL || "http://localhost:3000"; // Fallback if config.json is missing
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ETATS_RETOUR = [
  "RETOUR_DEPOT",
  "RETOUR_DEFINITIF",
  "RETOUR_INTER_AGENCE",
  "RETOUR_EXPEDITEURS",
  "RETOUR_RECU_PAYE",
];

// Fonction pour obtenir le libellé français de l'état
const getEtatLabel = (etat) => {
  const labels = {
    RETOUR_DEPOT: "Retour dépôt",
    RETOUR_DEFINITIF: "Retour définitif",
    RETOUR_INTER_AGENCE: "Retour inter-agence",
    RETOUR_EXPEDITEURS: "Retour expéditeurs",
    RETOUR_RECU_PAYE: "Retour reçu payé",
  };
  return labels[etat] || etat;
};

// Fonction pour obtenir la variante du badge selon l'état
const getBadgeVariant = (etat) => {
  switch (etat) {
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
    ESPECE: "Espèces",
    CHEQUE: "Chèque",
    ESPECE_ou_CHEQUE: "Espèces ou Chèque",
  };
  return labels[mode] || mode;
};

// Validation simple des données de commande
const validateCommande = (cmd) => {
  const requiredFields = ["code_a_barre", "nom_prioritaire", "prenom_prioritaire", "ville", "prix", "etat", "dateAjout"];
  return requiredFields.every((field) => cmd[field] !== undefined && cmd[field] !== null);
};

// Composant OrdersTable
const OrdersTable = ({ commandes, onViewDetails, onSort, sortBy, sortOrder }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full min-w-[640px]" role="grid" aria-label="Tableau des commandes en retour">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              <button
                onClick={() => onSort("code_a_barre")}
                className="flex items-center gap-1"
                aria-sort={sortBy === "code_a_barre" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Commande
                {sortBy === "code_a_barre" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Client</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Ville</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              <button
                onClick={() => onSort("prix")}
                className="flex items-center gap-1"
                aria-sort={sortBy === "prix" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Prix
                {sortBy === "prix" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">État</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              <button
                onClick={() => onSort("dateAjout")}
                className="flex items-center gap-1"
                aria-sort={sortBy === "dateAjout" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Date
                {sortBy === "dateAjout" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
            </th>
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{commande.ville}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {commande.prix.toFixed(2)} TND
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getBadgeVariant(commande.etat)}>{getEtatLabel(commande.etat)}</Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(commande.dateAjout), "dd/MM/yyyy", { locale: fr })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => onViewDetails(commande)}
                  aria-label={`Voir les détails de la commande ${commande.code_a_barre}`}
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby="modal-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-500" />
            Détails de la commande #{commande.code_a_barre}
          </DialogTitle>
        </DialogHeader>
        <div id="modal-description" className="sr-only">
          Détails de la commande, incluant les informations du client, de la commande, du livreur et des échanges.
        </div>

        <div className="space-y-6">
          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {commande.nom_prioritaire} {commande.prenom_prioritaire}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Téléphone: {commande.telephone1}</p>
                  {commande.telephone2 && (
                    <p className="text-sm text-gray-600">Téléphone 2: {commande.telephone2}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Adresse: {commande.adresse}</p>
                  <p className="text-sm text-gray-600">
                    Ville: {commande.ville}, {commande.gouvernorat}
                  </p>
                  <p className="text-sm text-gray-600">Code postal: {commande.codePostal}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails de la commande */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails de la commande</CardTitle>
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
                    <p className="text-lg font-bold text-green-600">{commande.prix.toFixed(2)} TND</p>
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
                    <p className="text-sm text-gray-900">{getModePaiementLabel(commande.mode_paiement)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date d'ajout</p>
                    <p className="text-sm text-gray-900">
                      {format(new Date(commande.dateAjout), "dd/MM/yyyy HH:mm", { locale: fr })}
                    </p>
                  </div>
                  {commande.derniereMiseAJour && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Dernière mise à jour</p>
                      <p className="text-sm text-gray-900">
                        {format(new Date(commande.derniereMiseAJour), "dd/MM/yyyy HH:mm", { locale: fr })}
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
                <CardTitle className="text-lg">Informations livreur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">
                    {commande.livreur.utilisateur.nom} {commande.livreur.utilisateur.prenom}
                  </p>
                  <p className="text-sm text-gray-600">Téléphone: {commande.livreur.utilisateur.telephone1}</p>
                  <p className="text-sm text-gray-600">Email: {commande.livreur.utilisateur.email}</p>
                  <p className="text-sm text-gray-600">Gouvernorat: {commande.livreur.gouvernorat}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informations d'échange si applicable */}
          {(commande.code_a_barre_echange || commande.nb_article_echange) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations d'échange</CardTitle>
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
  <div
    className={`p-4 rounded-lg border ${
      variant === "destructive"
        ? "bg-red-50 border-red-200 text-red-800"
        : "bg-blue-50 border-blue-200 text-blue-800"
    }`}
    role="alert"
  >
    <div className="flex items-center gap-2">
      <AlertCircle className="h-4 w-4" />
      {children}
    </div>
  </div>
);

const AlertDescription = ({ children }) => <span>{children}</span>;

// Composant StatsCards using StatCard
const StatsCards = ({ commandes }) => {
  const stats = ETATS_RETOUR.reduce((acc, etat) => {
    acc[etat] = commandes.filter((cmd) => cmd.etat === etat).length;
    return acc;
  }, {});

  const totalRetours = commandes.length;
  const totalMontant = commandes.reduce((sum, cmd) => sum + cmd.prix, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        name="Total Retours"
        icon={FaBox}
        value={totalRetours.toString()}
        color="#4F46E5"
      />
      <StatCard
        name="Montant Total"
        icon={FaMoneyBillWave}
        value={`${totalMontant.toFixed(2)} TND`}
        color="#10B981"
      />
      <StatCard
        name="Retours Définitifs"
        icon={FaUndo}
        value={stats.RETOUR_DEFINITIF?.toString() || "0"}
        color="#EF4444"
      />
      <StatCard
        name="Retours Payés"
        icon={FaCheckCircle}
        value={stats.RETOUR_RECU_PAYE?.toString() || "0"}
        color="#059669"
      />
    </div>
  );
};

// Composant Retours principal
const Retours = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [sortBy, setSortBy] = useState("dateAjout");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchCommands = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const userInfo = localStorage.getItem("userInfo");

      // Log token and userInfo for debugging
      console.log("Token stored in localStorage:", token);
      console.log("userInfo stored in localStorage:", userInfo);

      if (!token) {
        throw new Error("Veuillez vous reconnecter (token manquant)");
      }

      if (!userInfo) {
        throw new Error("Informations utilisateur manquantes. Veuillez vous reconnecter.");
      }

      let id_client;
      try {
        const parsed = JSON.parse(userInfo);
        id_client = parsed.id;
      } catch (parseErr) {
        throw new Error("Données utilisateur invalides. Veuillez vous reconnecter.");
      }

      if (!id_client) {
        throw new Error("Identifiant client manquant dans les informations utilisateur");
      }

      // Use query parameter instead of body for GET request
      const response = await axios.get(`${API_URL}/command/clientAllCommands`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { id_client }, // Send id_client as query parameter
      });

      // Valider et filtrer les commandes
      const commandesRetours = response.data
        .filter((cmd) => ETATS_RETOUR.includes(cmd.etat) && validateCommande(cmd))
        .sort((a, b) => {
          const aValue = a[sortBy];
          const bValue = b[sortBy];
          if (sortBy === "dateAjout") {
            return sortOrder === "asc"
              ? new Date(aValue) - new Date(bValue)
              : new Date(bValue) - new Date(aValue);
          }
          if (sortBy === "prix") {
            return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
          }
          return sortOrder === "asc"
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
        });

      setCommandes(commandesRetours);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (err.response?.status === 500) {
        setError(err.response?.data?.msg || "Erreur du serveur. Veuillez réessayer plus tard.");
      } else {
        setError(err.message || "Erreur de connexion au serveur. Vérifiez votre réseau.");
      }
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommands();
  }, [sortBy, sortOrder]);

  const handleViewDetails = (commande) => {
    setSelectedCommande(commande);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleRefresh = debounce(() => {
    fetchCommands();
  }, 300);

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

      {commandes.length > 0 && <StatsCards commandes={commandes} />}

      <div className="flex justify-between items-center mb-6">
        {commandes.length > 0 && (
          <div className="text-sm text-gray-600">
            {commandes.length} commande{commandes.length > 1 ? "s" : ""} en retour
          </div>
        )}
        <Button onClick={handleRefresh} variant="outline">
          🔄 Actualiser
        </Button>
      </div>

      {commandes.length > 0 ? (
        <OrdersTable
          commandes={commandes}
          onViewDetails={handleViewDetails}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <Package className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-xl font-medium text-gray-900">Aucune commande en retours</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Aucune commande n'est actuellement en état de retour. Vérifiez à nouveau ou contactez le support.
          </p>
          <Button onClick={handleRefresh} variant="outline" className="mt-4">
            🔄 Vérifier à nouveau
          </Button>
        </div>
      )}

      <CommandeDetailsModal commande={selectedCommande} onClose={() => setSelectedCommande(null)} />
    </div>
  );
};

export default Retours;