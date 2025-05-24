import { useState, useEffect } from "react";
import { Link , useLocation, useNavigate} from "react-router-dom";
import Header from "../../components/common/Header";

import {
  ShoppingCart,
  Eye,
  User,
  Phone,
  MapPin,
  Home,
  CreditCard,
  Package,
  Info,
  Search,
  Plus,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import axios from "axios";
import config from "../../config.json";

const API_URL = config.API_URL;

// Composant OrderForm
const OrderForm = ({
  onSubmit,
  onCancel,
  isEchangePossible,
  setIsEchangePossible,
}) => {
  const [formErrors, setFormErrors] = useState({});

  const validateForm = (formData) => {
    const errors = {};
    const requiredFields = [
      "nomPrioritaire",
      "prenomPrioritaire",
      "telephone1",
      "adresse",
      "gouvernorat",
      "ville",
      "localite",
      "codePostal",
      "designation",
      "prix",
      "nbArticles",
    ];

    requiredFields.forEach((field) => {
      if (!formData.get(field)) {
        errors[field] = "Ce champ est obligatoire";
      }
    });

    if (isEchangePossible) {
      if (!formData.get("codeBarreEchange")) {
        errors.codeBarreEchange = "Code à barre d'échange requis";
      }
      if (!formData.get("nbArticlesEchange")) {
        errors.nbArticlesEchange = "Nombre d'articles d'échange requis";
      }
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const errors = validateForm(formData);

    if (Object.keys(errors).length === 0) {
      onSubmit(e);
    } else {
      setFormErrors(errors);
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(firstErrorField)?.focus();
    }
  };

  return (
    <Card className="p-6 bg-white rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Informations personnelles
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomPrioritaire">Nom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="nomPrioritaire"
                      name="nomPrioritaire"
                      required
                      className={`pl-10 ${
                        formErrors.nomPrioritaire ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenomPrioritaire">Prénom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="prenomPrioritaire"
                      name="prenomPrioritaire"
                      required
                      className={`pl-10 ${
                        formErrors.prenom_prioritaire ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telephone1">Téléphone 1</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="telephone1"
                      name="telephone1"
                      type="tel"
                      required
                      className={`pl-10 ${
                        formErrors.telephone1 ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone2">Téléphone 2 (Optionnel)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="telephone2"
                      name="telephone2"
                      type="tel"
                      className={`pl-10 ${
                        formErrors.telephone2 ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="adresse"
                    name="adresse"
                    required
                    className={`pl-10 ${
                      formErrors.adresse ? "border-red-500" : ""
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gouvernorat">Gouvernorat</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Select name="gouvernorat" required>
                      <SelectTrigger id="gouvernorat" className={`pl-10 ${formErrors.gouvernorat ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Sélectionner un gouvernorat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ariana">Ariana</SelectItem>
                        <SelectItem value="Tunis">Tunis</SelectItem>
                        <SelectItem value="Mannouba">Mannouba</SelectItem>
                        <SelectItem value="Ben Arous">Ben Arous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="ville"
                      name="ville"
                      required
                      className={`pl-10 ${
                        formErrors.ville ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="localite">Localité</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="localite"
                      name="localite"
                      required
                      className={`pl-10 ${
                        formErrors.localite ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codePostal">Code Postal</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="codePostal"
                      name="codePostal"
                      required
                      className={`pl-10 ${
                        formErrors.codePostal ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Détails de la commande */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Détails de la commande
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="designation">Désignation</Label>
                <div className="relative">
                  <Package className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="designation"
                    name="designation"
                    required
                    className={`pl-10 ${
                      formErrors.designation ? "border-red-500" : ""
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prix">Prix</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="prix"
                      name="prix"
                      type="number"
                      step="0.01"
                      required
                      className={`pl-10 ${
                        formErrors.prix ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nbArticles">Nombre d'Articles</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="nbArticles"
                      name="nbArticles"
                      type="number"
                      required
                      className={`pl-10 ${
                        formErrors.nb_article ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="possibleOuvrir" name="possibleOuvrir" />
                  <Label htmlFor="possibleOuvrir">Possible d'Ouvrir</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="possibleEchange"
                    name="possibleEchange"
                    checked={isEchangePossible}
                    onCheckedChange={setIsEchangePossible}
                  />
                  <Label htmlFor="possibleEchange">Possible d'Échange</Label>
                </div>
              </div>

              {isEchangePossible && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="codeBarreEchange">
                      Code à Barre Échange
                    </Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="codeBarreEchange"
                        name="codeBarreEchange"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nbArticlesEchange">
                      Nombre d'Articles Échange
                    </Label>
                    <div className="relative">
                      <Package className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="nbArticlesEchange"
                        name="nbArticlesEchange"
                        type="number"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="remarque">Remarque (Optionnel)</Label>
                <div className="relative">
                  <Info className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Textarea
                    id="remarque"
                    name="remarque"
                    className="pl-10 min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Enregistrer la commande
          </Button>
        </div>
      </form>
    </Card>
  );
};

// Composant OrdersTable
const OrdersTable = ({ commandes, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Commande
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Client
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Ville
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Prix
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              État
            </th>
            <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {commandes.map((commande) => (
            <tr key={commande.code_a_barre} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{commande.code_a_barre}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {commande.nom_prioritaire} {commande.prenom_prioritaire}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {commande.ville}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {commande.prix.toFixed(2)} TND
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  variant={
                    commande.etat === "delivered"
                      ? "default"
                      : commande.etat === "EN_ATTENTE"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {commande.etat}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <Button
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => onViewDetails(commande)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Composant CommandeDetailsModal
const CommandeDetailsModal = ({ commande, onClose }) => {
  if (!commande) return null;

  return (
    <Dialog open={!!commande} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-500" />
            Détails de la commande #{commande.code_a_barre}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">
                  {commande.nom_prioritaire} {commande.prenom_prioritaire}
                </p>
                <p className="text-sm text-gray-600">{commande.telephone1}</p>
                <p className="text-sm text-gray-600">
                  {commande.adresse}, {commande.ville}, {commande.gouvernorat}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Détails de la commande */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">
                  Désignation: {commande.designation}
                </p>
                <p className="text-sm text-gray-600">
                  Prix: {commande.prix.toFixed(2)} TND
                </p>
                <p className="text-sm text-gray-600">
                  Nombre d'articles: {commande.nb_article}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">État:</p>
                  <Badge
                    variant={
                      commande.etat === "delivered"
                        ? "default"
                        : commande.etat === "EN_ATTENTE"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {commande.etat}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Remarque: {commande.remarque || "Aucune remarque"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section échange (si applicable) */}
          {commande.possible_echange && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Échange</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Code à barre d'échange: {commande.code_a_barre_echange}
                  </p>
                  <p className="text-sm text-gray-600">
                    Nombre d'articles d'échange: {commande.nb_article_echange}
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

// Composant MyOrders
const MyOrders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("commandes");
  const [showForm, setShowForm] = useState(false);
  const [isEchangePossible, setIsEchangePossible] = useState(false);
  const [commandes, setCommandes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  
  

  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get("filter") || "all";
    setFilter(filterParam);
  }, [location.search]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    navigate(`/my-orders?filter=${newFilter}`, { replace: true });
  };

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(`${API_URL}/command/clientAllCommands`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCommandes(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur de chargement des commandes");
    }
  };

  const handleAddCommande = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const formData = new FormData(e.target);

    const commandeData = {
      nom_prioritaire: formData.get("nomPrioritaire"),
      prenom_prioritaire: formData.get("prenomPrioritaire"),
      gouvernorat: formData.get("gouvernorat"),
      ville: formData.get("ville"),
      localite: formData.get("localite"),
      codePostal: formData.get("codePostal"),
      adresse: formData.get("adresse"),
      telephone1: formData.get("telephone1"),
      telephone2: formData.get("telephone2") || null,
      designation: formData.get("designation"),
      prix: parseFloat(formData.get("prix")),
      nb_article: parseInt(formData.get("nbArticles")),
      possible_ouvrir: formData.get("possibleOuvrir") === "on",
      possible_echange: formData.get("possibleEchange") === "on",
      remarque: formData.get("remarque") || null,
      code_a_barre_echange: isEchangePossible
        ? formData.get("codeBarreEchange")
        : null,
      nb_article_echange: isEchangePossible
        ? parseInt(formData.get("nbArticlesEchange"))
        : null,
      mode_paiement: "ESPECE",
    };

    try {
      await axios.post(`${API_URL}/command`, commandeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await fetchCommands(); // Rafraîchir la liste des commandes
      setShowForm(false);
      alert("Commande ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la commande:", error);
      alert(
        error.response?.data?.msg || "Erreur lors de l'ajout de la commande"
      );
    }
  };

  const handleViewDetails = (commande) => {
    setSelectedCommande(commande); // Ouvrir le modal avec les détails de la commande
  };

  const filteredCommandes = commandes.filter((commande) => {
    if (!commande) return false;

    const searchMatches =
      searchTerm.toLowerCase().trim() === "" ||
      (commande.nom_prioritaire &&
        commande.nom_prioritaire
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (commande.prenom_prioritaire &&
        commande.prenom_prioritaire
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (commande.ville &&
        commande.ville.toLowerCase().includes(searchTerm.toLowerCase()));

    const filterMatches = filter === "all" || commande.etat === filter;

    return searchMatches && filterMatches;
  });

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {error && (
        <div className="mb-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <Header title="Mes Commandes" />
      <div className="flex justify-between items-center mb-8">
        {!showForm && (
          <div className="mt-8">
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-3"
            >
              <Plus className="h-4 w-4" />
              Nouvelle Commande
            </Button>
          </div>
        )}
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8">
          <button
            onClick={() => {
              setActiveTab("commandes");
              setShowForm(false);
            }}
            className={`pb-4 px-2 -mb-px font-medium text-sm transition-colors duration-200 ${
              activeTab === "commandes"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Commandes en cours
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="space-y-6">
        {showForm ? (
          <OrderForm
            onSubmit={handleAddCommande}
            onCancel={() => setShowForm(false)}
            isEchangePossible={isEchangePossible}
            setIsEchangePossible={setIsEchangePossible}
          />
        ) : (
          <>
            {/* Recherche et filtre */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Rechercher une commande..."
                      className="pl-10 w-full sm:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filtrer par état" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les états</SelectItem>
                      <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                      <SelectItem value="A_ENLEVER">A Enlever</SelectItem>
                      <SelectItem value="AU_DEPOT">Enlevé</SelectItem>
                      <SelectItem value="RETOUR_DEPOT">Retour Depot</SelectItem>
                      <SelectItem value="EN_COURS">En cours</SelectItem>
                      <SelectItem value="A_VERIFIER">A verfier</SelectItem>
                      <SelectItem value="LIVRES">Livrés</SelectItem>
                      <SelectItem value="LIVRES_PAYE">Livrés payés</SelectItem>
                      <SelectItem value="ECHANGE">Echange</SelectItem>
                      <SelectItem value="RETOUR_DEFINITIF">Retour Definitif</SelectItem>
                      <SelectItem value="RETOUR_INTER_AGENCE">Retour Inter-Agence</SelectItem>
                      <SelectItem value="RETOUR_EXPEDITEURS">Retour Expediteurs</SelectItem>
                      <SelectItem value="RETOUR_RECU_PAYE">Retour Recu Payé</SelectItem>
                      <SelectItem value="delivered">Livrées</SelectItem>
                      <SelectItem value="canceled">Annulées</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Tableau des commandes */}
            {activeTab === "commandes" ? (
              filteredCommandes.length > 0 ? (
                <OrdersTable
                  commandes={filteredCommandes}
                  onViewDetails={handleViewDetails}
                />
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Aucune commande 
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Commencez par créer une nouvelle commande.
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-900">
                  Aucune commande abandonnée
                </h3>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal des détails de la commande */}
      <CommandeDetailsModal
        commande={selectedCommande}
        onClose={() => setSelectedCommande(null)}
      />
    </div>
  );
};

export default MyOrders;
