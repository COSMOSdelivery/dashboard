import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, User, MapPin, Package, Calendar, FileText } from "lucide-react";

const statusConfig = {
  OPEN: {
    label: "OPEN",
  },
  CLOSED: {
    label: "CLOSED",
  },
  default: {
    label: "Inconnu",
  },
};

const DebriefDetailsModal = ({ debrief, onClose }) => {
  if (!debrief) return null;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Date invalide";
    }
  };

  return (
    <Dialog open={!!debrief} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-500" />
            Détails du débrief #{debrief.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations du livreur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">
                  {debrief.livreur.utilisateur.prenom} {debrief.livreur.utilisateur.nom}
                </p>
                <p className="text-sm text-gray-600">{debrief.zone}</p>
                <p className="text-sm text-gray-600">
                  Colis: {debrief.ordersDelivered}/{debrief.ordersPlanned} livrés
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails du débrief</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Date: {formatDate(debrief.createdAt)}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">Statut:</p>
                  <Badge
                    variant={
                      debrief.status === "CLOSED"
                        ? "default"
                        : debrief.status === "OPEN"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {statusConfig[debrief.status]?.label || debrief.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Notes: {debrief.notes || "Aucune note"}
                </p>
              </div>
            </CardContent>
          </Card>

          {debrief.commandes && debrief.commandes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Commandes associées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Nombre de commandes: {debrief.commandes.length}
                  </p>
                  <p className="text-sm text-gray-600">
                    Commandes livrées: {debrief.ordersDelivered}
                  </p>
                  <p className="text-sm text-gray-600">
                    Commandes planifiées: {debrief.ordersPlanned}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-end">
          <Button onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DebriefDetailsModal;