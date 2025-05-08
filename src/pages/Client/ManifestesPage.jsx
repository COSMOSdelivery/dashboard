import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config.json";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileText, Printer, Trash2, Package, AlertCircle, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "../../components/common/Header";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const API_URL = config.API_URL;

// Fonction utilitaire pour normaliser l'état des commandes
const normalizeOrderState = (state) => {
  if (!state) return "";
  
  // Convertir en minuscules pour la comparaison
  const lowerState = state.toLowerCase();
  
  // Mapping des états possibles
  if (lowerState === "en_attente" || lowerState === "en attente") {
    return "En attente";
  } else if (lowerState === "en cours" || lowerState === "en_cours") {
    return "En cours";
  } else {
    // Première lettre en majuscule pour les autres états
    return state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();
  }
};

// Fonction pour déterminer la couleur du badge selon l'état
const getStateBadgeColor = (state) => {
  const normalizedState = normalizeOrderState(state).toLowerCase();
  
  if (normalizedState === "en attente") {
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  } else if (normalizedState === "en cours") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  } else if (normalizedState === "livré" || normalizedState === "terminé") {
    return "bg-green-50 text-green-700 border-green-200";
  } else {
    return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const ManifestesPage = () => {
  const [manifestes, setManifestes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedManifest, setSelectedManifest] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const userRole = JSON.parse(localStorage.getItem("userInfo"))?.role || "GUEST";


  // Fetch manifestes
  useEffect(() => {
    fetchManifestes();
  }, []);

  const fetchManifestes = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/manifest/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Réponse de l'API:", response.data); // Log pour déboguer
        setManifestes(response.data);
    } catch (error) {
        console.error("Erreur lors de la récupération des manifestes:", error.response?.data || error.message);
        setError(error.response?.data?.error || error.message);
    } finally {
        setLoading(false);
    }
};

  // Delete a manifest
  const handleDeleteManifest = async (manifestId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette page");
      }

      const response = await axios.delete(`${API_URL}/manifest/${manifestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setSuccessMessage("Manifeste supprimé avec succès");
        // Refresh the manifestes list
        fetchManifestes();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error("Échec de la suppression du manifeste");
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message);
      setTimeout(() => setError(null), 3000);
    }
    setDeleteDialogOpen(false);
  };

  // Remove order from manifest
  const handleRemoveOrder = async (manifestId, orderId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette page");
      }
      const response = await fetch(`${API_URL}/manifest/${manifestId}/print`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

      if (response.status === 200) {
        setSuccessMessage("Commande retirée du manifeste avec succès");
        // Refresh the manifestes list
        fetchManifestes();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error("Échec du retrait de la commande");
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message);
      setTimeout(() => setError(null), 3000);
    }
    setSelectedOrder(null);
  };
  const handlePrintManifest = async (manifestId) => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error("Vous devez être connecté pour accéder à cette page");
        }

        const response = await fetch(`${API_URL}/manifest/${manifestId}/print`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || "Erreur lors de la génération du PDF.");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `manifest_${manifestId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        setError(error.message);
    }
};
  // Print bordereau
  const handlePrintBordereau = (manifestId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette page");
      }
      
      // Construire l'URL avec token pour éviter les problèmes d'authentification
      const printUrl = `${API_URL}/manifest/${manifestId}/bordereau?token=${encodeURIComponent(token)}`;
      window.open(printUrl, '_blank');
    } catch (error) {
      setError(error.message);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Calcul du total d'un manifeste
  const calculateManifestTotal = (commandes) => {
    return commandes.reduce((total, cmd) => total + cmd.prix, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="text-sm text-gray-500">Chargement des manifestes...</p>
        </div>
      </div>
    );
  }

  if (error && !successMessage) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Alert variant="destructive" className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
                <Header title="Mes Manifestes" />
          
      <Card className="shadow-sm border-gray-100">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-xl font-medium text-gray-800">Gestion des Manifestes</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/create-manifest'}
              className="text-sm"
            >
              Nouveau Manifeste
            </Button>
          </div>
          
          {successMessage && (
            <Alert className="mt-4 bg-green-50 border-green-100">
              <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
            </Alert>
          )}
        </CardHeader>

        <CardContent>
          {manifestes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Package className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">Aucun manifeste disponible</h3>
              <p className="text-gray-500 mt-2 max-w-md">
                Vous n'avez pas encore créé de manifeste. Utilisez le bouton "Nouveau Manifeste" pour en créer un.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {manifestes.map((manifest) => (
                  <AccordionItem key={manifest.id} value={`manifest-${manifest.id}`} className="border rounded-lg mb-4 overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            #{manifest.id}
                          </Badge>
                          <span className="font-medium">{formatDate(manifest.dateCreation)}</span>
                          
                          {/* Afficher le client si admin */}
                          {userRole === 'admin' && manifest.client && (
                            <span className="text-gray-600 ml-3">
                              Client: {manifest.client.nom} {manifest.client.prenom}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 text-gray-500 text-sm">
                          <span>{manifest.commandes.length} commandes</span>
                          <span className="font-medium">{calculateManifestTotal(manifest.commandes)} TND</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0">
                      <div className="p-4 bg-gray-50">
                        <div className="flex flex-wrap gap-3 mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                            onClick={() => handlePrintManifest(manifest.id)}
                          >
                            <Printer className="h-4 w-4 mr-2" />
                            Imprimer Manifeste
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                            onClick={() => handlePrintBordereau(manifest.id)}
                          >
                            <Printer className="h-4 w-4 mr-2" />
                            Imprimer Bordereau
                          </Button>
                          <Dialog open={deleteDialogOpen && selectedManifest === manifest.id} onOpenChange={(open) => {
                            setDeleteDialogOpen(open);
                            if (!open) setSelectedManifest(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white text-red-600 border-red-100 hover:bg-red-50"
                                onClick={() => setSelectedManifest(manifest.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer Manifeste
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Confirmer la suppression</DialogTitle>
                                <DialogDescription>
                                  Cette action supprimera le manifeste #{manifest.id} et remettra toutes ses commandes en état "en attente".
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="flex space-x-2 justify-end pt-4">
                                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                  Annuler
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleDeleteManifest(manifest.id)}
                                >
                                  Supprimer
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-100">
                          <div className="p-3 border-b border-gray-100 bg-gray-50 text-sm text-gray-500 font-medium">
                            Commandes dans ce manifeste
                          </div>
                          <ScrollArea className="h-64">
                            <div className="divide-y divide-gray-100">
                              {manifest.commandes.map((order) => (
                                <div key={order.code_a_barre} className="p-3 hover:bg-gray-50">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium text-gray-800">#{order.code_a_barre}</span>
                                        <Badge 
                                          variant="outline" 
                                          className={getStateBadgeColor(order.etat)}
                                        >
                                          {normalizeOrderState(order.etat)}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">{order.designation}</p>
                                      <p className="text-sm font-medium text-gray-700 mt-1">{order.prix} TND</p>
                                    </div>
                                    <Dialog open={selectedOrder === order.code_a_barre} onOpenChange={(open) => {
                                      if (!open) setSelectedOrder(null);
                                    }}>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-gray-500 hover:text-red-600"
                                          onClick={() => setSelectedOrder(order.code_a_barre)}
                                        >
                                          <Edit className="h-4 w-4" />
                                          <span className="sr-only">Retirer la commande</span>
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                          <DialogTitle>Retirer la commande</DialogTitle>
                                          <DialogDescription>
                                            Cette action retirera la commande #{order.code_a_barre} du manifeste et la remettra en état "en attente".
                                          </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="flex space-x-2 justify-end pt-4">
                                          <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                                            Annuler
                                          </Button>
                                          <Button 
                                            variant="destructive" 
                                            onClick={() => handleRemoveOrder(manifest.id, order.code_a_barre)}
                                          >
                                            Retirer
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManifestesPage;