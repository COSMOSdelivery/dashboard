import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Printer, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "../../components/common/Header";
import config from "../../config.json"; // Assurez-vous que le chemin est correct
const API_URL = config.API_URL; // Définissez l'URL de l'API

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupération de l'ID client depuis le localStorage
  const clientId = JSON.parse(localStorage.getItem("userInfo"))?.id;

  useEffect(() => {
    if (!clientId) {
      setError("Client non connecté.");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/paiements/client/${clientId}`)
      .then((res) => {
        if (!res.ok)
          throw new Error("Erreur lors du chargement des paiements.");
        return res.json();
      })
      .then((data) => {
        setPayments(data);
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
      case "payé":
        return "bg-green-50 text-green-700 border-green-200";
      case "en attente":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "annulé":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
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
                Gestion des Paiements
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500">Chargement...</p>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">
                Aucun paiement disponible
              </h3>
              <p className="text-gray-500 mt-2 max-w-md">
                Vous n'avez pas encore enregistré de paiement.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card
                  key={payment.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <CardHeader className="bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          #{payment.invoiceNumber || `Paiement-${payment.id}`}
                        </Badge>
                        <span className="font-medium">
                          {formatDate(payment.date)}
                        </span>
                        <span className="text-gray-600 ml-3">
                          Client: {payment.client || `#${payment.id_client}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-500 text-sm">
                        <span className="font-medium">
                          {formatMontant(payment.montant)}
                        </span>
                        <Badge
                          variant="outline"
                          className={getStatusBadgeColor(payment.statut)}
                        >
                          {payment.statut}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                        onClick={() =>
                          (window.location.href = `/payments/${payment.id}/print`)
                        }
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
    </div>
  );
};

export default PaymentsPage;
