import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Printer, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "../../components/common/Header";

const PaymentsPage = () => {
  // Données statiques pour les paiements
  const payments = [
    {
      id: 1,
      date: "2024-10-01T14:30:00Z",
      amount: 1500.75,
      status: "Payé",
      client: "Client A",
      invoiceNumber: "INV-001",
    },
    {
      id: 2,
      date: "2024-10-02T10:15:00Z",
      amount: 2300.5,
      status: "En attente",
      client: "Client B",
      invoiceNumber: "INV-002",
    },
    {
      id: 3,
      date: "2024-10-03T16:45:00Z",
      amount: 4500.0,
      status: "Annulé",
      client: "Client C",
      invoiceNumber: "INV-003",
    },
  ];

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Fonction pour déterminer la couleur du badge selon l'état
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
              <CardTitle className="text-xl font-medium text-gray-800">Gestion des Paiements</CardTitle>
            </div>
            
          </div>
        </CardHeader>

        <CardContent>
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">Aucun paiement disponible</h3>
              <p className="text-gray-500 mt-2 max-w-md">
                Vous n'avez pas encore enregistré de paiement. Utilisez le bouton "Nouveau Paiement" pour en créer un.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card key={payment.id} className="border rounded-lg overflow-hidden">
                  <CardHeader className="bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          #{payment.invoiceNumber}
                        </Badge>
                        <span className="font-medium">{formatDate(payment.date)}</span>
                        <span className="text-gray-600 ml-3">
                          Client: {payment.client}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-500 text-sm">
                        <span className="font-medium">{payment.amount} TND</span>
                        <Badge 
                          variant="outline" 
                          className={getStatusBadgeColor(payment.status)}
                        >
                          {payment.status}
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
                        onClick={() => window.location.href = `/payments/${payment.id}/print`}
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