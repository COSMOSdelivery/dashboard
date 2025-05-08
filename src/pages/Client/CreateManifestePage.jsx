import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config.json";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "../../components/common/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Package, Check, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const API_URL = config.API_URL;

const ManifestGenerator = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Vous devez être connecté pour accéder à cette page");
        }

        const response = await axios.get(`${API_URL}/command/clientAllCommands`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setOrders(response.data);
        } else {
          throw new Error("Échec de la récupération des commandes");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle order selection
  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  // Create manifest
  const handleCreateManifest = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette page");
      }

      const response = await axios.post(
        `${API_URL}/manifest/`,
        {
          commandes: selectedOrders,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Manifeste créé avec succès !");
        setSelectedOrders([]);
      } else {
        throw new Error("Échec de la création du manifeste");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "livré":
        return "bg-green-100 text-green-800";
      case "en cours":
        return "bg-blue-100 text-blue-800";
      case "en attente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="text-sm text-gray-500">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
                <Header title="Créer une manifeste" />
          
      <Card className="shadow-sm border-gray-100">
        <CardHeader className="pb-4">
          {successMessage && (
            <Alert className="mt-4 bg-green-50 border-green-100">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
              </div>
            </Alert>
          )}
        </CardHeader>

        <CardContent className="px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Available Orders Section */}
            <div>
              <h2 className="text-sm uppercase tracking-wide text-gray-500 font-medium mb-3">
                Commandes Disponibles ({orders.length})
              </h2>
              <ScrollArea className="h-96 rounded-md">
                <div className="space-y-2 pr-3">
                  {orders.map((order) => (
                    <div
                      key={order.code_a_barre}
                      className={`p-3 rounded-lg border transition-all hover:bg-gray-50 ${
                        selectedOrders.includes(order.code_a_barre) 
                        ? "border-blue-200 bg-blue-50" 
                        : "border-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-800">#{order.code_a_barre}</span>
                            <Badge className={getStatusColor(order.etat)}>{order.etat}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{order.designation}</p>
                          <p className="text-sm font-medium text-gray-700 mt-2">{order.prix} TND</p>
                        </div>
                        <Checkbox
                          checked={selectedOrders.includes(order.code_a_barre)}
                          onCheckedChange={() => handleSelectOrder(order.code_a_barre)}
                          className="h-5 w-5 rounded-md data-[state=checked]:bg-blue-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Selected Orders Section */}
            <div>
              <h2 className="text-sm uppercase tracking-wide text-gray-500 font-medium mb-3">
                Commandes Sélectionnées ({selectedOrders.length})
              </h2>
              <div className="border rounded-lg h-96 overflow-hidden">
                {selectedOrders.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    <p>Aucune commande sélectionnée</p>
                  </div>
                ) : (
                  <ScrollArea className="h-full">
                    <div className="p-3 space-y-1">
                      {selectedOrders.map((orderId, index) => {
                        const order = orders.find((o) => o.code_a_barre === orderId);
                        return (
                          <React.Fragment key={orderId}>
                            <div className="py-2">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium text-gray-800">#{orderId}</span>
                                  <p className="text-sm text-gray-600">{order?.designation}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSelectOrder(orderId)}
                                  className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-600"
                                >
                                  <span className="sr-only">Supprimer</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-4 h-4"
                                  >
                                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                            {index < selectedOrders.length - 1 && <Separator />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </div>
              
              <div className="mt-6">
                <Button
                  onClick={handleCreateManifest}
                  disabled={selectedOrders.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {selectedOrders.length > 0 ? (
                    <>Créer Manifeste ({selectedOrders.length})</>
                  ) : (
                    "Créer Manifeste"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManifestGenerator;