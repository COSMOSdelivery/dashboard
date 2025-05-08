import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Clock, Truck, CheckCircle, Home, Repeat, RefreshCw, Package, CreditCard, RefreshCcw, XCircle, ArrowLeftCircle, ArrowRightCircle, Archive } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import config from "../../config.json";

const API_URL = config.API_URL;
const statusConfig = {
  EN_ATTENTE: { label: "En attente", color: "bg-yellow-100 text-yellow-700", icon: <Clock className="h-5 w-5" /> },
  A_ENLEVER: { label: "À enlever", color: "bg-blue-100 text-blue-700", icon: <Truck className="h-5 w-5" /> },
  ENLEVE: { label: "Enlevé", color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-5 w-5" /> },
  AU_DEPOT: { label: "Au dépôt", color: "bg-purple-100 text-purple-700", icon: <Home className="h-5 w-5" /> },
  RETOUR_DEPOT: { label: "Retour dépôt", color: "bg-indigo-100 text-indigo-700", icon: <Repeat className="h-5 w-5" /> },
  EN_COURS: { label: "En cours", color: "bg-pink-100 text-pink-700", icon: <RefreshCw className="h-5 w-5" /> },
  A_VERIFIER: { label: "À vérifier", color: "bg-orange-100 text-orange-700", icon: <AlertCircle className="h-5 w-5" /> },
  LIVRES: { label: "Livrés", color: "bg-teal-100 text-teal-700", icon: <Package className="h-5 w-5" /> },
  LIVRES_PAYE: { label: "Livrés et payés", color: "bg-emerald-100 text-emerald-700", icon: <CreditCard className="h-5 w-5" /> },
  ECHANGE: { label: "Échange", color: "bg-amber-100 text-amber-700", icon: <RefreshCcw className="h-5 w-5" /> },
  RETOUR_DEFINITIF: { label: "Retour définitif", color: "bg-rose-100 text-rose-700", icon: <XCircle className="h-5 w-5" /> },
  RETOUR_INTER_AGENCE: { label: "Retour inter-agence", color: "bg-cyan-100 text-cyan-700", icon: <ArrowLeftCircle className="h-5 w-5" /> },
  RETOUR_EXPEDITEURS: { label: "Retour expéditeurs", color: "bg-violet-100 text-violet-700", icon: <ArrowRightCircle className="h-5 w-5" /> },
  RETOUR_RECU_PAYE: { label: "Retour reçu et payé", color: "bg-lime-100 text-lime-700", icon: <Archive className="h-5 w-5" /> },
};

const StatusDialog = ({ open, onClose, orderId, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelectedStatus('');
      setError('');
    }
  }, [open]);

  const handleStatusChange = async () => {
    if (!selectedStatus) {
      setError('Veuillez sélectionner un statut');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call the /modifyStatus API
      const response = await fetch(`${API_URL}/command/modifyStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          code_a_barre: orderId, // Pass the order ID
          state: selectedStatus, // Pass the selected status
          commentaire: `Statut modifié en ${statusConfig[selectedStatus].label}`, // Optional comment
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();

      // Notify the parent component of the status change
      onStatusChange(orderId, selectedStatus);

      // Close the dialog
      onClose();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la mise à jour du statut');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Modifier le statut de la commande
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-2">
            {Object.entries(statusConfig).map(([value, { label, color }]) => (
              <Button
                key={value}
                variant={selectedStatus === value ? 'default' : 'outline'}
                className={`${color} ${
                  selectedStatus === value ? 'font-bold' : ''
                }`}
                onClick={() => setSelectedStatus(value)}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button
              onClick={handleStatusChange}
              disabled={!selectedStatus || isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                'Confirmer'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusDialog;