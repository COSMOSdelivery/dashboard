import React, { useState, useEffect } from "react";
import OrderForm from "../../components/orders/OrderForm";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Header from "../../components/common/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import config from "@/config";

const API_URL = config.API_URL;

const AdminCreateOrder = () => {
  const { toast } = useToast();
  const [isEchangePossible, setIsEchangePossible] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create axios instance with default headers
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  // Fetch clients from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axiosInstance.get("/users/allClients");
        // Filter out null values and ensure we have valid client data
        const validClients = response.data.filter(client => client && client.id);
        setClients(validClients);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des clients");
        setLoading(false);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des clients.",
          variant: "destructive",
        });
      }
    };

    fetchClients();
  }, [toast]);

  // Initial data based on selected client
  const initialData = selectedClient
    ? {
        nomPrioritaire: selectedClient.nom || "",
        prenomPrioritaire: selectedClient.prenom || "",
        telephone1: selectedClient.telephone || "",
        telephone2: selectedClient.telephone2 || "",
        adresse: selectedClient.adresse || "",
        gouvernorat: selectedClient.gouvernorat || "",
        ville: selectedClient.ville || "",
        localite: selectedClient.localite || "",
        codePostal: selectedClient.codePostal || "",
        designation: "",
        prix: "",
        nbArticles: "",
        possibleOuvrir: false,
        possibleEchange: isEchangePossible,
        codeBarreEchange: "",
        nbArticlesEchange: "",
        remarque: "",
        modePaiement: "ESPECE",
      }
    : null;

  // Handle client selection
  const handleClientChange = (clientId) => {
    const client = clients.find((c) => c.id === clientId) || null;
    setSelectedClient(client);
  };

  // Transform frontend field names to backend field names
  const transformFormDataToBackend = (formData) => {
    return {
      nom_prioritaire: formData.nomPrioritaire,
      prenom_prioritaire: formData.prenomPrioritaire,
      telephone1: formData.telephone1,
      telephone2: formData.telephone2,
      adresse: formData.adresse,
      gouvernorat: formData.gouvernorat,
      ville: formData.ville,
      localite: formData.localite,
      codePostal: formData.codePostal,
      designation: formData.designation,
      prix: parseFloat(formData.prix),
      nb_article: parseInt(formData.nbArticles),
      mode_paiement: formData.modePaiement,
      possible_ouvrir: formData.possibleOuvrir,
      possible_echange: formData.possibleEchange,
      remarque: formData.remarque || "",
      code_a_barre_echange: formData.possibleEchange ? formData.codeBarreEchange : null,
      nb_article_echange: formData.possibleEchange ? parseInt(formData.nbArticlesEchange) : null,
      id_client: parseInt(selectedClient.id), // Match your backend's expected field name
    };
  };

  // Handle form submission
  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    if (!selectedClient) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un client avant de créer une commande.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Transform the form data to match backend expectations
      const backendData = transformFormDataToBackend(formData);

      console.log("Sending data to backend:", backendData); // Debug log

      const response = await axiosInstance.post("/orders", backendData);

      toast({
        title: "Commande créée",
        description: `La commande a été enregistrée avec succès. Code: ${response.data.code_a_barre}`,
        variant: "success",
      });

      // Reset form
      setSelectedClient(null);
    } catch (error) {
      console.error("Erreur lors de la création de la commande :", error);
      
      // More specific error handling
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.msg || 
                          "Une erreur s'est produite lors de la création de la commande.";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedClient(null);
    console.log("Commande annulée");
  };

return (
  <div className="container mx-auto flex flex-col min-h-screen">
    <Header title="Créer une commande" />
    <div className="flex-1 overflow-y-auto p-4">
      {/* Client selection dropdown */}
      <div className="mb-6">
        <Label htmlFor="client-select">Sélectionner un client</Label>
        <Select
          onValueChange={handleClientChange}
          value={selectedClient?.id || ""}
          disabled={loading}
        >
          <SelectTrigger id="client-select" className="w-full max-w-md">
            <SelectValue placeholder="Choisir un client" />
          </SelectTrigger>
          <SelectContent>
            {loading && <SelectItem value="loading" disabled>Chargement...</SelectItem>}
            {!loading && clients.length === 0 && (
              <SelectItem value="no-clients" disabled>
                Aucun client disponible
              </SelectItem>
            )}
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.nom} {client.prenom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      {selectedClient && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Commande pour {selectedClient.nom} {selectedClient.prenom}
          </h2>
          <OrderForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEchangePossible={isEchangePossible}
            setIsEchangePossible={setIsEchangePossible}
            initialData={initialData}
            isEditing={false}
          />
        </>
      )}
    </div>
  </div>
);
};

export default AdminCreateOrder;