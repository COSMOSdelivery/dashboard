import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config.json";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileText, Printer, Package, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "../../components/common/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const API_URL = config.API_URL;

const normalizeOrderState = (state) => {
  if (!state) return "";
  const lowerState = state.toLowerCase();
  if (lowerState === "en_attente" || lowerState === "en attente") {
    return "En attente";
  } else if (lowerState === "en cours" || lowerState === "en_cours") {
    return "En cours";
  } else {
    return state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();
  }
};

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
  const userRole = JSON.parse(localStorage.getItem("userInfo"))?.role || "GUEST";

  useEffect(() => {
    fetchManifestes();
  }, []);

  const fetchManifestes = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/manifest/getAllManifests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setManifestes(response.data);
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintManifest = async (manifestId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/manifest/${manifestId}/print`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du PDF.");
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
      setError(error.message);
    }
  };

  const handlePrintBordereau = (manifestId) => {
    try {
      const token = localStorage.getItem("authToken");
      const printUrl = `${API_URL}/manifest/${manifestId}/bordereau?token=${encodeURIComponent(token)}`;
      window.open(printUrl, '_blank');
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

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
      <Header title="Gestion des Manifestes" />
      <Card className="shadow-sm border-gray-100">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-xl font-medium text-gray-800">Gestion des Manifestes</CardTitle>
            </div>
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
                Vous n'avez pas encore de manifeste associé à votre compte.
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
                        </div>
                        <div className="flex items-center space-x-3 text-gray-500 text-sm">
                          <span>{manifest.client.nomShop}</span>
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