import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import config from "../../config.json";

const API_URL = config.API_URL;

const CarDialog = ({ open, onClose, orderId, isMultipleSelection = false, selectedOrders = [], onBulkAssign }) => {
  const [livreurs, setLivreurs] = useState([]);
  const [selectedLivreur, setSelectedLivreur] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    const fetchLivreurs = async () => {
      try {
        const response = await fetch(`${API_URL}/users/allLivreurs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setLivreurs(data);
        } else {
          console.error("Format de données inattendu:", data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des livreurs:", error);
        setError("Erreur lors de la récupération des livreurs");
      }
    };

    if (open) {
      fetchLivreurs();
      setSelectedLivreur(""); // Réinitialiser la sélection
      setError(null);
      setProgress({ current: 0, total: 0 });
    }
  }, [open]);

  const handleAssignLivreur = async () => {
    if (!selectedLivreur) {
      setError("Veuillez sélectionner un livreur.");
      return;
    }
    setError(null);
    setIsLoading(true);

    if (isMultipleSelection && selectedOrders.length > 0) {
      await handleBulkAssignment();
    } else {
      await handleSingleAssignment();
    }
  };

  const handleSingleAssignment = async () => {
    try {
      // Convertir orderId en nombre et s'assurer qu'il n'est pas NaN
      const codeBarreInt = parseInt(orderId);
      if (isNaN(codeBarreInt)) {
        throw new Error("ID de commande invalide");
      }

      const response = await fetch(`${API_URL}/command/setaDeleveryPerson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          code_a_barre: codeBarreInt,
          id_livreur: parseInt(selectedLivreur)
        })
      });

      const data = await response.json();

      if (response.ok) {
        onClose();
        // Vous pouvez ajouter ici un message de succès si nécessaire
      } else {
        throw new Error(data.msg || "Erreur lors de l'affectation du livreur");
      }
    } catch (error) {
      console.error('Erreur lors de l\'affectation du livreur:', error);
      setError(error.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAssignment = async () => {
    const totalOrders = selectedOrders.length;
    setProgress({ current: 0, total: totalOrders });
    
    const results = { success: 0, failed: 0, errors: [] };
    
    for (let i = 0; i < totalOrders; i++) {
      try {
        const codeBarreInt = parseInt(selectedOrders[i]);
        if (isNaN(codeBarreInt)) {
          results.failed++;
          results.errors.push(`ID de commande invalide: ${selectedOrders[i]}`);
          continue;
        }

        const response = await fetch(`${API_URL}/command/setaDeleveryPerson`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            code_a_barre: codeBarreInt,
            id_livreur: parseInt(selectedLivreur)
          })
        });

        if (response.ok) {
          results.success++;
        } else {
          const data = await response.json();
          results.failed++;
          results.errors.push(`Erreur pour commande ${selectedOrders[i]}: ${data.msg || "Erreur inconnue"}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Erreur pour commande ${selectedOrders[i]}: ${error.message || "Erreur inconnue"}`);
      }
      
      // Mettre à jour la progression
      setProgress({ current: i + 1, total: totalOrders });
    }

    if (results.failed > 0) {
      setError(`${results.success} commande(s) assignée(s) avec succès, ${results.failed} échec(s).`);
    }
    
    if (typeof onBulkAssign === 'function') {
      onBulkAssign(results);
    }
    
    // Remettre isLoading à false après un court délai pour que l'utilisateur puisse voir le message final
    setTimeout(() => {
      setIsLoading(false);
      if (results.failed === 0) {
        onClose();
      }
    }, 1500);
  };

  const selectedOrdersCount = isMultipleSelection ? selectedOrders.length : 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedLivreur(""); // Réinitialiser la sélection
          setError(null);
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isMultipleSelection 
              ? `Affecter un livreur à ${selectedOrdersCount} commande${selectedOrdersCount > 1 ? 's' : ''}` 
              : "Affecter un livreur"}
          </DialogTitle>
          {isMultipleSelection && (
            <DialogDescription>
              Les commandes sélectionnées seront toutes assignées au même livreur
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <Select 
            onValueChange={setSelectedLivreur} 
            value={selectedLivreur}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un livreur" />
            </SelectTrigger>
            <SelectContent>
              {livreurs.map((livreur) => (
                <SelectItem key={livreur.id} value={livreur.id.toString()}>
                  {livreur.nom} {livreur.prenom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {isLoading && isMultipleSelection && progress.total > 0 && (
            <div className="w-full">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-center mt-1">
                {progress.current} sur {progress.total} commandes traitées
              </p>
            </div>
          )}
          
          <Button 
            onClick={handleAssignLivreur} 
            disabled={isLoading || !selectedLivreur}
            className="w-full"
          >
            {isLoading 
              ? isMultipleSelection 
                ? `Affectation en cours...` 
                : "Chargement..." 
              : "Affecter"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarDialog;