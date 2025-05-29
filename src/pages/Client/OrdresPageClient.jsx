import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import axios from "axios";
import config from "../../config.json";
import OrderForm from "../../components/orders/OrderForm";
import OrdersTableClient from "../../components/orders/OrdersTableClient";
import CommandeDetailsModal from "../../components/orders/CommandeDetailsModal";
import FilterControls from "../../components/orders/FilterControls";
import NoOrdersMessage from "../../components/orders/NoOrdersMessage";
import TabNavigation from "../../components/orders/TabNavigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_URL = config.API_URL;

const MyOrders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("commandes");
  const [showForm, setShowForm] = useState(false);
  const [isEchangePossible, setIsEchangePossible] = useState(false);
  const [commandes, setCommandes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [editingCommande, setEditingCommande] = useState(null);
  const [filterOptions, setFilterOptions] = useState(["all"]);

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

      // Extract unique etat values for filter options (only for commandes tab)
      const uniqueEtats = [
        "all",
        ...new Set(response.data.map((commande) => commande.etat).filter(Boolean)),
      ];
      setFilterOptions(uniqueEtats);
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur de chargement des commandes");
    }
  };

  const handleAddCommande = async (e, formData) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    const commandeData = {
      nom_prioritaire: formData.nomPrioritaire,
      prenom_prioritaire: formData.prenomPrioritaire,
      gouvernorat: formData.gouvernorat,
      ville: formData.ville,
      localite: formData.localite,
      codePostal: formData.codePostal,
      adresse: formData.adresse,
      telephone1: formData.telephone1.replace(/\s+/g, ""),
      telephone2: formData.telephone2 ? formData.telephone2.replace(/\s+/g, "") : null,
      designation: formData.designation,
      prix: parseFloat(formData.prix),
      nb_article: parseInt(formData.nbArticles),
      possible_ouvrir: formData.possibleOuvrir,
      possible_echange: isEchangePossible,
      remarque: formData.remarque || null,
      code_a_barre_echange: isEchangePossible ? parseInt(formData.codeBarreEchange) : null,
      nb_article_echange: isEchangePossible ? parseInt(formData.nbArticlesEchange) : null,
      mode_paiement: formData.modePaiement || "ESPECE",
    };

    try {
      await axios.post(`${API_URL}/command`, commandeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await fetchCommands();
      setShowForm(false);
      setIsEchangePossible(false);
      alert("Commande ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la commande:", error);
      alert(
        error.response?.data?.msg || "Erreur lors de l'ajout de la commande"
      );
    }
  };

  const handleUpdateCommande = async (e, formData) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    const commandeData = {
      nom_prioritaire: formData.nomPrioritaire,
      prenom_prioritaire: formData.prenomPrioritaire,
      gouvernorat: formData.gouvernorat,
      ville: formData.ville,
      localite: formData.localite,
      codePostal: formData.codePostal,
      adresse: formData.adresse,
      telephone1: formData.telephone1.replace(/\s+/g, ""),
      telephone2: formData.telephone2 ? formData.telephone2.replace(/\s+/g, "") : null,
      designation: formData.designation,
      prix: parseFloat(formData.prix),
      nb_article: parseInt(formData.nbArticles),
      possible_ouvrir: formData.possibleOuvrir,
      possible_echange: isEchangePossible,
      remarque: formData.remarque || null,
      code_a_barre_echange: isEchangePossible ? parseInt(formData.codeBarreEchange) : null,
      nb_article_echange: isEchangePossible ? parseInt(formData.nbArticlesEchange) : null,
      mode_paiement: formData.modePaiement || "ESPECE",
    };

    try {
      await axios.put(`${API_URL}/command/${editingCommande.code_a_barre}`, commandeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await fetchCommands();
      setShowForm(false);
      setEditingCommande(null);
      setIsEchangePossible(false);
      alert("Commande mise à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la commande:", error);
      alert(
        error.response?.data?.msg || "Erreur lors de la mise à jour de la commande"
      );
    }
  };

  const handleDeleteCommande = async (code_a_barre) => {
    if (!window.confirm("Êtes-vous sûr de vouloir abandonner cette commande ?")) return;

    const token = localStorage.getItem("authToken");
    try {
      await axios.put(
        `${API_URL}/command/${code_a_barre}`,
        { etat: "ABANDONNEE" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await fetchCommands();
      alert("Commande déplacée vers les commandes abandonnées avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'abandon de la commande:", error);
      alert(
        error.response?.data?.msg || "Erreur lors de l'abandon de la commande"
      );
    }
  };

  const handleRestoreCommande = async (code_a_barre) => {
    if (!window.confirm("Êtes-vous sûr de vouloir restaurer cette commande ?")) return;

    const token = localStorage.getItem("authToken");
    try {
      await axios.put(
        `${API_URL}/command/${code_a_barre}/restore`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await fetchCommands();
      alert("Commande restaurée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la restauration de la commande :", error);
      alert(
        error.response?.data?.msg || "Erreur lors de la restauration de la commande"
      );
    }
  };

  const handleViewDetails = (commande) => {
    setSelectedCommande(commande);
  };

  const handleEditCommande = (commande) => {
    setEditingCommande(commande);
    setIsEchangePossible(commande.possible_echange);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCommande(null);
    setIsEchangePossible(false);
  };

  const filteredCommandes = commandes.filter((commande) => {
    if (!commande) return false;

    const searchMatches =
      activeTab === "abandonnees" ||
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

    const filterMatches =
      activeTab === "abandonnees" ||
      filter === "all" ||
      (commande.etat &&
        commande.etat.toLowerCase() === filter.toLowerCase());

    const tabMatches =
      activeTab === "commandes"
        ? commande.etat !== "ABANDONNEE"
        : commande.etat === "ABANDONNEE";

    return searchMatches && filterMatches && tabMatches;
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
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showForm={showForm}
        setShowForm={setShowForm}
        setEditingCommande={setEditingCommande}
      />

      <div className="space-y-6">
        {showForm ? (
          <OrderForm
            onSubmit={editingCommande ? handleUpdateCommande : handleAddCommande}
            onCancel={handleCancelForm}
            isEchangePossible={isEchangePossible}
            setIsEchangePossible={setIsEchangePossible}
            initialData={
              editingCommande
                ? {
                    nomPrioritaire: editingCommande.nom_prioritaire,
                    prenomPrioritaire: editingCommande.prenom_prioritaire,
                    telephone1: editingCommande.telephone1,
                    telephone2: editingCommande.telephone2 || "",
                    adresse: editingCommande.adresse,
                    gouvernorat: editingCommande.gouvernorat,
                    ville: editingCommande.ville,
                    localite: editingCommande.localite,
                    codePostal: editingCommande.codePostal,
                    designation: editingCommande.designation,
                    prix: editingCommande.prix.toString(),
                    nbArticles: editingCommande.nb_article.toString(),
                    possibleOuvrir: editingCommande.possible_ouvrir,
                    possibleEchange: editingCommande.possible_echange,
                    codeBarreEchange: editingCommande.code_a_barre_echange?.toString() || "",
                    nbArticlesEchange: editingCommande.nb_article_echange?.toString() || "",
                    remarque: editingCommande.remarque || "",
                    modePaiement: editingCommande.mode_paiement,
                  }
                : null
            }
            isEditing={!!editingCommande}
          />
        ) : (
          <>
            {/* Show FilterControls only for "commandes" tab */}
            {activeTab === "commandes" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <FilterControls
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filter={filter}
                  onFilterChange={handleFilterChange}
                  filterOptions={filterOptions}
                />
              </div>
            )}

            {activeTab === "commandes" ? (
              filteredCommandes.length > 0 ? (
                <OrdersTableClient
                  commandes={filteredCommandes}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDeleteCommande}
                  onEdit={handleEditCommande}
                  onPrint={fetchCommands}
                />
              ) : (
                <NoOrdersMessage message="Commencez par créer une nouvelle commande." />
              )
            ) : (
              filteredCommandes.length > 0 ? (
                <OrdersTableClient
                  commandes={filteredCommandes}
                  onViewDetails={handleViewDetails}
                  onRestore={handleRestoreCommande}
                />
              ) : (
                <NoOrdersMessage message="Aucune commande abandonnée." />
              )
            )}
          </>
        )}
      </div>

      <CommandeDetailsModal
        commande={selectedCommande}
        onClose={() => setSelectedCommande(null)}
      />
    </div>
  );
};

export default MyOrders;