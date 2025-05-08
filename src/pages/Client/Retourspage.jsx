import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Eye,
  Package,
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

import axios from "axios";
import config from "../../config.json";
import Header from "../../components/common/Header";

const API_URL = config.API_URL;

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
                <Badge variant="destructive">Retours</Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <Button
                  variant="ghost"
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
      <DialogContent className="sm:max-w-2xl">
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
              <CardTitle className="text-lg">Informations client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">
                  {commande.nom_prioritaire} {commande.prenom_prioritaire}
                </p>
                <p className="text-sm text-gray-600">{commande.telephone1}</p>
                <p className="text-sm text-gray-600">
                  {commande.adresse}, {commande.ville}, {commande.gouvernorat}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Détails de la commande */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">Désignation: {commande.designation}</p>
                <p className="text-sm text-gray-600">
                  Prix: {commande.prix.toFixed(2)} TND
                </p>
                <p className="text-sm text-gray-600">
                  Nombre d'articles: {commande.nb_article}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">État:</p>
                  <Badge variant="destructive">Retours</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Remarque: {commande.remarque || "Aucune remarque"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-end">
          <Button onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Composant Retours
const Retours = () => {
  const [commandes, setCommandes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCommande, setSelectedCommande] = useState(null);

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(`${API_URL}/command/clientAllCommands`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Filtrer les commandes en état "retours"
      const commandesRetours = response.data.filter(
        (commande) => commande.etat === "retours"
      );
      setCommandes(commandesRetours);
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur de chargement des commandes");
    }
  };

  const handleViewDetails = (commande) => {
    setSelectedCommande(commande); // Ouvrir le modal avec les détails de la commande
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {error && (
        <div className="mb-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
                <Header title="Mes Retours" />


      {/* Tableau des commandes */}
      {commandes.length > 0 ? (
        <OrdersTable
          commandes={commandes}
          onViewDetails={handleViewDetails}
        />
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande en retours</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucune commande n'est actuellement en état de retour.
          </p>
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