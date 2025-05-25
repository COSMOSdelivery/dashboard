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
  const [filteredLivreurs, setFilteredLivreurs] = useState([]);
  const [selectedLivreur, setSelectedLivreur] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [commandRegions, setCommandRegions] = useState([]);

  // Fonction pour récupérer les informations d'une commande
  const fetchCommandInfo = async (commandId) => {
    try {
      const codeBarreInt = parseInt(commandId);
      if (isNaN(codeBarreInt)) {
        throw new Error("ID de commande invalide");
      }

      const response = await fetch(`${API_URL}/command/getCommandById/${codeBarreInt}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des informations de la commande");
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération de la commande:", error);
      return null;
    }
  };

  // Fonction pour récupérer les régions des commandes sélectionnées
  const fetchCommandsRegions = async () => {
    setIsLoadingData(true);
    const regions = new Set();
    
    try {
      if (isMultipleSelection && selectedOrders.length > 0) {
        // Pour plusieurs commandes, récupérer la région de chaque commande
        for (const commandId of selectedOrders) {
          const commandInfo = await fetchCommandInfo(commandId);
          if (commandInfo && commandInfo.gouvernorat) {
            regions.add(commandInfo.gouvernorat);
          }
        }
      } else if (orderId) {
        // Pour une seule commande
        const commandInfo = await fetchCommandInfo(orderId);
        if (commandInfo && commandInfo.gouvernorat) {
          regions.add(commandInfo.gouvernorat);
        }
      }
      
      setCommandRegions(Array.from(regions));
    } catch (error) {
      console.error("Erreur lors de la récupération des régions:", error);
      setError("Erreur lors de la récupération des informations des commandes");
    } finally {
      setIsLoadingData(false);
    }
  };

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
      fetchCommandsRegions();
      setSelectedLivreur(""); // Réinitialiser la sélection
      setError(null);
      setProgress({ current: 0, total: 0 });
    }
  }, [open, orderId, selectedOrders, isMultipleSelection]);

  // Filtrer les livreurs selon les régions des commandes
  useEffect(() => {
    if (livreurs.length > 0 && commandRegions.length > 0) {
      const filtered = livreurs.filter(livreur => 
        commandRegions.includes(livreur.gouvernorat)
      );
      setFilteredLivreurs(filtered);
      
      // Si aucun livreur ne correspond, afficher un message d'erreur
      if (filtered.length === 0) {
        setError(`Aucun livreur disponible pour la région: ${commandRegions.join(', ')}`);
      }
    } else {
      setFilteredLivreurs([]);
    }
  }, [livreurs, commandRegions]);

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
          {commandRegions.length > 0 && (
            <DialogDescription>
              Région(s) des commandes: {commandRegions.join(', ')}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          {isLoadingData ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Chargement des informations...</p>
            </div>
          ) : (
            <Select 
              onValueChange={setSelectedLivreur} 
              value={selectedLivreur}
              disabled={filteredLivreurs.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  filteredLivreurs.length === 0 
                    ? "Aucun livreur disponible pour cette région"
                    : "Sélectionnez un livreur"
                } />
              </SelectTrigger>
              <SelectContent>
                {filteredLivreurs.map((livreur) => (
                  <SelectItem key={livreur.id} value={livreur.id.toString()}>
                    {livreur.nom} {livreur.prenom} - {livreur.gouvernorat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {filteredLivreurs.length > 0 && (
            <p className="text-xs text-gray-600">
              {filteredLivreurs.length} livreur{filteredLivreurs.length > 1 ? 's' : ''} disponible{filteredLivreurs.length > 1 ? 's' : ''} pour cette région
            </p>
          )}
          
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
            disabled={isLoading || !selectedLivreur || filteredLivreurs.length === 0 || isLoadingData}
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

export default CarDialog