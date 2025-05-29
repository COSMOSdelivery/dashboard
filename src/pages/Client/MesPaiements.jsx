import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Printer, AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast,ToastContainer } from "react-toastify";
import Header from "../../components/common/Header";
import config from "../../config.json";

const API_URL = config.API_URL;

const PaymentsPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const clientId = JSON.parse(localStorage.getItem("userInfo"))?.id;

  useEffect(() => {
    if (!clientId) {
      setError("Client non connecté.");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/paiements/client/${clientId}/orders`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des commandes.");
        return res.json();
      })
      .then((response) => {
        setOrders(response.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [clientId]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const formatMontant = (val) =>
    new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(val);

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "paye":
        return "bg-green-50 text-green-700 border-green-200";
      case "en_attente":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "non_paye":
        return "bg-red-50 text-red-700 border-red-200";
      case "refuse":
        return "bg-red-600 text-white border-red-700";
      case "livres_paye":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleConfirmPayment = async (paymentId) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/paiements/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_paiement: paymentId }),
      });

      if (!res.ok) throw new Error("Erreur lors de la confirmation du paiement.");
      const response = await res.json();
      toast.success(response.message);

      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          paiements: order.paiements.map((p) =>
            p.id === paymentId ? { ...p, statut: "PAYE" } : p
          ),
          etat: order.paiements.some((p) => p.id === paymentId)
            ? "LIVRES_PAYE"
            : order.etat,
          statutPaiement: order.paiements.some((p) => p.id === paymentId)
            ? "PAYE"
            : order.statutPaiement,
        }))
      );
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Mes Paiements" />

      <Card className="shadow-sm border-gray-100">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-xl font-medium text-gray-800">
                Gestion des Commandes Payées
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500">Chargement...</p>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">
                Aucune commande payée disponible
              </h3>
              <p className="text-gray-500 mt-2 max-w-md">
                Vous n'avez pas de commandes en attente de confirmation.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card
                  key={order.code_a_barre}
                  className="border rounded-lg overflow-hidden"
                >
                  <CardHeader className="bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          Commande #{order.code_a_barre}
                        </Badge>
                        <span className="font-medium">
                          {formatDate(order.dateAjout)}
                        </span>
                        <span className="text-gray-600 ml-3">
                          Client: {order.client?.nomShop || `#${order.id_client}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">
                          {formatMontant(order.prix)}
                        </span>
                        <Badge
                          variant="outline"
                          className={getStatusBadgeColor(order.etat)}
                        >
                          {order.etat}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {order.paiements.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <span className="font-medium">
                              Paiement: {formatMontant(payment.montant)}
                            </span>
                            <Badge
                              variant="outline"
                              className={getStatusBadgeColor(payment.statut)}
                            >
                              {payment.statut}
                            </Badge>
                          </div>
                          {payment.statut === "EN_ATTENTE" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                              onClick={() => handleConfirmPayment(payment.id)}
                              disabled={loading}
                            >
                              {loading ? (
                                <span className="animate-spin h-4 w-4 mr-2">⏳</span>
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              Confirmer Paiement
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                        onClick={() =>
                          (window.location.href = `/payments/${order.paiements[0]?.id}/print`)
                        }
                        disabled={!order.paiements[0]}
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimer Facture
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default PaymentsPage;