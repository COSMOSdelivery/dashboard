import React, { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import axios from "axios";
import config from "../../config.json";
const API_URL = config.API_URL;
const Searchcolis = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEchangePossible, setIsEchangePossible] = useState(false);
  const handleEchangeChange = (e) => {
    setIsEchangePossible(e.target.checked); // Met à jour l'état en fonction de la case à cocher
  };
  const [commandes, setCommandes] = useState([]); // Start with an empty array

  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchCommands = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(`${API_URL}/command/clientAllCommands`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCommandes(response.data); // Dynamically set the fetched commandes
      } catch (err) {
        setError(err.response?.data?.msg || "Erreur de chargement des commandes");
      }
    };

    fetchCommands();
  }, []);
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Recherche effectuée :", searchTerm);
  };

  const handleAddCommande = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
  
    // Collect form data
    const formData = {
      nom_prioritaire: e.target.elements.nomPrioritaire.value,
      prenom_prioritaire: e.target.elements.prenomPrioritaire.value,
      gouvernorat: e.target.elements.gouvernorat.value,
      ville: e.target.elements.ville.value,
      localite: e.target.elements.localite.value,
      codePostal: e.target.elements.codePostal.value,
      adresse: e.target.elements.adresse.value,
      telephone1: e.target.elements.telephone1.value,
      telephone2: e.target.elements.telephone2.value || null,
      designation: e.target.elements.designation.value,
      prix: parseFloat(e.target.elements.prix.value),
      nb_article: parseInt(e.target.elements.nbArticles.value),
      mode_paiement: e.target.elements.modePaiement.value,
      possible_ouvrir: e.target.elements.possibleOuvrir.checked,
      possible_echange: e.target.elements.possibleEchange.checked,
      remarque: e.target.elements.remarque.value || null,
      code_a_barre_echange: isEchangePossible ? e.target.elements.codeBarreEchange?.value : null,
      nb_article_echange: isEchangePossible ? parseInt(e.target.elements.nbArticlesEchange?.value) : null
    };
  
    try {
      const response = await axios.post(`${API_URL}/command`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setShowForm(false);
      
      // Optionally, refresh the commands list
      const updatedResponse = await axios.get(`${API_URL}/command/clientAllCommands`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCommandes(updatedResponse.data);
  
      // Show success message (you might want to use a toast or alert component)
      alert('Commande ajoutée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la commande:', error.response?.data);
      alert(error.response?.data?.msg || 'Erreur lors de l\'ajout de la commande');
    }
  };

  const filteredCommandes = commandes.filter((commande) => {
    const search = searchTerm.toLowerCase();
    return (
      commande.nom_prioritaire.toLowerCase().includes(search) ||
      commande.prenom_prioritaire.toLowerCase().includes(search) ||
      commande.ville.toLowerCase().includes(search)
    );
  });

  return (
<div className="flex flex-col w-full min-h-screen">
<Header title="Gestion des colis" />
      <br />

      <div className="flex items-center border-b">
        <button
          onClick={() => {
            setActiveTab("commandes");
            setShowForm(false);
          }}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "commandes"
              ? "border-b-2 border-blue-400 text-blue-400"
              : "text-gray-500"
          }`}
        >
          Commandes
        </button>
        <button
          onClick={() => {
            setActiveTab("abandonnee");
            setShowForm(false);
          }}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "abandonnee"
              ? "border-b-2 border-blue-400 text-blue-400"
              : "text-gray-500"
          }`}
        >
          Abandonnée (0)
        </button>
      </div>

      {!showForm && activeTab === "commandes" && (
        <div className="p-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-400 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-500 shadow-md"
          >
            + Ajouter une commande
          </button>
        </div>
      )}

<main className="flex-1 p-6 overflow-auto">
        {!showForm && (
          <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg mb-4">
            <div className="flex items-center space-x-4">
              <select className="px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-400">
                <option>Produit 📦</option>
              </select>
              <select className="px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-400">
                <option>Livraison 🚚</option>
              </select>
              <select className="px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-400">
                <option>Statut</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Rechercher..."
                className="rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black border border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500"
              >
                Rechercher
              </button>
            </div>
          </div>
        )}

        {showForm ? (
          <form onSubmit={handleAddCommande} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="nomPrioritaire"
              placeholder="Nom Prioritaire"
              required
              className="border p-2 rounded-md w-full"
            />
            <input
              type="text"
              name="prenomPrioritaire"
              placeholder="Prénom Prioritaire"
              required
              className="border p-2 rounded-md w-full"
            />
            <input
              type="text"
              name="gouvernorat"
              placeholder="Gouvernorat"
              required
              className="border p-2 rounded-md w-full"
            />
            <input
              type="text"
              name="ville"
              placeholder="Ville"
              required
              className="border p-2 rounded-md w-full"
            />
            <input
              type="text"
              name="localite"
              placeholder="Localité"
              required
              className="border p-2 rounded-md w-full"
            />
            <input
              type="text"
              name="codePostal"
              placeholder="Code Postal"
              required
              className="border p-2 rounded-md w-full"
            />
            <input
              type="text"
              name="adresse"
              placeholder="Adresse"
              required
              className="border p-2 rounded-md w-full"
            />
            <input
              type="tel"
              name="telephone1"
              placeholder="Téléphone 1"
              required
              className="border p-2 rounded-md w-full"
            />
            <input
              type="tel"
              name="telephone2"
              placeholder="Téléphone 2 (Optionnel)"
              className="border p-2 rounded-md w-full"
            />
            <input
              type="text"
              name="designation"
              placeholder="Désignation"
              required
              className="border p-2 rounded-md w-full"
            />
            <input
              type="number"
              name="prix"
              placeholder="Prix"
              required
              className="border p-2 rounded-md w-full"
            />
            <input
              type="number"
              name="nbArticles"
              placeholder="Nombre d'Articles"
              required
              className="border p-2 rounded-md w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="etatCommande"
              required
              className="border p-2 rounded-md w-full text-gray-500"
            >
              <option value="">État de la Commande</option>
              <option value="EN_COURS">En Cours</option>
              <option value="LIVREE">Livrée</option>
            </select>
            <select
              name="modePaiement"
              required
              className="border p-2 rounded-md w-full text-gray-500"
            >
              <option value="">Mode de Paiement</option>
              <option value="ESPECE">Espèces</option>
              <option value="CHEQUE">Cheque</option>
            </select>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="possibleOuvrir"
                name="possibleOuvrir"
                className="h-4 w-4"
              />
              <label htmlFor="possibleOuvrir" className="ml-2">
                Possible d'Ouvrir
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="possibleEchange"
                name="possibleEchange"
                className="h-4 w-4"
                onChange={handleEchangeChange}
              />
              <label htmlFor="possibleEchange" className="ml-2">
                Possible d'Échange
              </label>
            </div>
        
            {isEchangePossible && (
              <>
                <input
                  type="text"
                  name="codeBarreEchange"
                  placeholder="Code à Barre Échange (Optionnel)"
                  className="border p-2 rounded-md w-full"
                />
                <input
                  type="number"
                  name="nbArticlesEchange"
                  placeholder="Nombre d'Articles Échange (Optionnel)"
                  className="border p-2 rounded-md w-full"
                />
              </>
            )}
          </div>
          <textarea
            name="remarque"
            placeholder="Remarque (Optionnel)"
            className="border p-2 rounded-md w-full"
            rows="4"
          />
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Annuler
            </button>
          </div>
        </form>
        ) : activeTab === "commandes" ? (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2">Nom</th>
                <th className="border border-gray-200 px-4 py-2">Prénom</th>
                <th className="border border-gray-200 px-4 py-2">Ville</th>
                <th className="border border-gray-200 px-4 py-2">Prix</th>
                <th className="border border-gray-200 px-4 py-2">État</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommandes.map((commande) => (
                <tr key={commande.code_a_barre} className="text-center">
                  <td className="border border-gray-200 px-4 py-2">
                    {commande.nom_prioritaire}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {commande.prenom_prioritaire}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {commande.ville}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {commande.prix.toFixed(2)} TND
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {commande.etat}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Aucun colis trouvé
          </div>
        )}
      </main>
    </div>
  );
};

export default Searchcolis;
