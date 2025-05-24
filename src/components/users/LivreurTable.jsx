import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, Eye } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import config from "../../config.json";
const API_URL = config.API_URL;
const roleStyles = {
  LIVREUR: {
    background: "bg-yellow-500",
    text: "text-black",
  },
};

const Livreur = ({
  fullWidth = false,
  onAddClick,
  onCancel,
  incrementLivreurCount,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilteredUsers, setSearchFilteredUsers] = useState([]);
  const [regionFilteredUsers, setRegionFilteredUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterRegion, setFilterRegion] = useState(""); 
  const [regions, setRegions] = useState([]);
  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    gouvernorat: "",
    confirmPassword: "",
    password: "",
    adresse: "",
    telephone1: "",
    telephone2: "",
    codeTVA: "",
    cin: "",
  });
  const notifySuccess = (message) => {
    toast.success(message, {
      icon: "✅", // Icône personnalisée
      style: {
        background: "rgb(255, 255, 255)", // Couleur de fond similaire à l'image
        color: "#2E7D32", // Texte vert
        fontWeight: "normal", // Police régulière
        borderRadius: "8px", // Coins arrondis
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)", // Ombre légère
        padding: "10px 20px", // Espacement intérieur
      },
      duration: 4000, // Durée d'affichage de la notification
    });
  };

  useEffect(() => {
    fetchLivreurs();
  }, []);

  useEffect(() => {
    let result = users;

    // Apply search filter if active
    if (searchTerm) {
      result = result.filter((user) =>
        searchFilteredUsers.some((u) => u.id === user.id)
      );
    }

    // Apply region filter if active
    if (filterRegion) {
      result = result.filter((user) =>
        regionFilteredUsers.some((u) => u.id === user.id)
      );
    }
    setFilteredUsers([...result]); // Force new array
    setCurrentPage(1);
  }, [users, searchFilteredUsers, regionFilteredUsers, searchTerm, filterRegion]);


  const fetchLivreurs = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/users/allLivreurs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data || [];
      setFilteredUsers(response.data);
      setUsers(data);
      setSearchFilteredUsers(data);
      setRegionFilteredUsers(data);
      setFilteredUsers(data);
      const uniqueRegions = Array.from(
        new Set(
          data
          .filter((u) => u.livreur && u.livreur.gouvernorat)
          .map((u) => (u.livreur.gouvernorat || '').trim())
          .filter((g) => g)
        )
      );
      setRegions(uniqueRegions);
    } catch (error) {
      console.error("Error fetching livreurs:", error);
      setError("Failed to load livreurs");
    }
  };
  const handleViewUser = (user) => {
    setSelectedUser(user);
  };
  const handleDeletelivreur = async (livreurId) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            borderRadius: "8px",
            background: "#fff",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1 style={{ fontWeight: "bold", marginBottom: "20px" }}>
            Confirmer la suppression
          </h1>
          <p>Êtes-vous sûr de vouloir supprimer ce Livreur?</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button
              onClick={async () => {
                const token = localStorage.getItem("authToken");
                setIsLoading(true);

                try {
                  await axios.delete(
                    `${API_URL}/users/deleteUser/${livreurId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  setFilteredUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== livreurId)
                  );
                  setUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== livreurId)
                  );
                } catch (error) {
                  console.error(
                    "Erreur lors de la suppression du livreur:",
                    error
                  );

                  const errorMessage =
                    error.response?.data?.msg ||
                    "Une erreur est survenue lors de la suppression du livreur";

                  alert(errorMessage);
                } finally {
                  setIsLoading(false);
                }
                onClose();
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ff4d4f",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {" "}
              Oui
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ccc",
                color: "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Non
            </button>
          </div>
        </div>
      ),
    });
  };
  
  // Handle search input (restored original logic)
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    console.log('Search term:', term);
    const filtered = users.filter((user) => {
      const prenom = (user.prenom || '').toLowerCase().trim();
      const nom = (user.nom || '').toLowerCase().trim();
      const email = (user.email || '').toLowerCase().trim();
      const matches = `${prenom} ${nom}`.includes(term) || email.includes(term) || term === '';
      console.log('User:', user, 'Matches search:', matches);
      return matches;
    });
    console.log('Search filtered users:', filtered);
    setSearchFilteredUsers([...filtered]);
  };

  // Handle region filter
  const handleFilterRegion = (e) => {
    const region = e.target.value;
    setFilterRegion(region);
    console.log('Selected region:', region);
    const filtered = users.filter((user) => {
      const gouvernorat = (user.livreur?.gouvernorat || '').toLowerCase().trim();
      const matchesRegion = !region || gouvernorat === region.toLowerCase().trim();
      console.log('User:', user, 'Matches region:', matchesRegion);
      return matchesRegion;
    });
    console.log('Region filtered users:', filtered);
    setRegionFilteredUsers([...filtered]);
  };
  



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Nombre d'éléments par page
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const token = localStorage.getItem("authToken");
    // Validation des champs obligatoires
    if (
      !newUser.nom ||
      !newUser.prenom ||
      !newUser.email ||
      !newUser.password
    ) {
      alert("Tous les champs sont obligatoires !");
      setIsLoading(false);
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    try {
      const userToSubmit = {
        cin: newUser.cin,
        email: newUser.email,
        nom: newUser.nom,
        password: newUser.password,
        prenom: newUser.prenom,
        codeTVA: newUser.codeTVA, // Hardcoded as ADMIN since this is the admin table
        telephone1: newUser.telephone1, // Make sure this matches the backend field name
        telephone2: newUser.telephone2 || "",
        gouvernorat: newUser.gouvernorat,
        role: "LIVREUR",
      };
      console.log("Sending data:", userToSubmit);
      const response = await axios.post(
        `${API_URL}/users/creatAccount`,
        userToSubmit,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFilteredUsers((prev) => [...prev, response.data]);
      setNewUser({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        confirmPassword: "",
        telephone1: "",
        telephone2: "",
        codeTVA: "",
        cin: "",
        gouvernorat: "",
        role: "LIVREUR",
      });
      if (onCancel) {
        onCancel(); // Cela désactive `fullWidth` et revient à l'affichage des tableaux
      }
      fetchLivreurs();
      setTimeout(() => {
        notifySuccess("Un nouveau livreur est ajouté avec succès!");
      }, 500); // Délai de 500 ms pour s'assurer que le formulaire est fermé
      if (incrementLivreurCount) {
        incrementLivreurCount();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de livreur:", error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Une erreur est survenue lors de la création du compte"
        );
      } else if (error.request) {
        setError(
          "Erreur de connexion au serveur. Veuillez vérifier votre connexion internet."
        );
      } else {
        setError("Une erreur inattendue s'est produite.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleEditInitiate = (user) => {
    navigate(`/edit-livreur/${user.id}`, { state: { user } });
  };
  return (
    <motion.div
      className={`bg-white   backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200 mb-4
      ${fullWidth ? "w-full h-full" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {fullWidth ? (
      <motion.div
          className="fixed inset-0 bg-white   flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ width: "80vw", height: "110vh" }}
        >
          <motion.div className="bg-white rounded-lg p-6 shadow-lg w-full h-full overflow-auto">
            <h3 className="text-2xl font-semibold text-black-800 mb-4">
              Ajouter un Livreur
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-black-700">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={newUser.nom}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-black-700">Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    value={newUser.prenom}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-black-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-black-700">Mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-black-700">
                    Confirmez le mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={newUser.confirmPassword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-black-700">Téléphone 1</label>
                  <input
                    type="text"
                    name="telephone1"
                    value={newUser.telephone1}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-black-700">
                    Téléphone 2 (optionnel)
                  </label>
                  <input
                    type="text"
                    name="telephone2"
                    value={newUser.telephone2}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-black-700">Code TVA</label>
                  <input
                    type="text"
                    name="codeTVA"
                    value={newUser.codeTVA}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-black-700">CIN</label>
                  <input
                    type="text"
                    name="cin"
                    value={newUser.cin}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-black-700">Gouvernorat</label>
                <select
                  name="gouvernorat"
                  value={newUser.gouvernorat}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Sélectionner un gouvernorat</option>
                  <option value="Ariana">Ariana</option>
                  <option value="Tunis">Tunis</option>
                  <option value="Mannouba">Mannouba</option>
                  <option value="Ben Arous">Ben Arous</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  onClick={onCancel}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ): (
        <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black-700">Livreurs</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Recherche Livreur..."
              className="bg-gray-200 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 text-black-700" size={18} />
            </div>
          <select
            value={filterRegion}
            onChange={handleFilterRegion}
            className="bg-gray-200 text-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={onAddClick}
            >
            Ajouter un Livreur
          </button>
        </div>
      </div>

      <div className="max-h-[350px] w-full overflow-y-auto rounded-lg border border-gray-400">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
                Nom Complet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user, index) => (
              <tr key={index} className="hover:bg-gray-200">
                <td className="px-6 py-4 text-black-700">{`${user.prenom} ${user.nom}`}</td>
                <td className="px-6 py-4 text-black-700">{user.email}</td>
                <td className="px-6 py-4 text-black-700">{user.telephone1}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      roleStyles[user.role]?.background
                    } ${roleStyles[user.role]?.text}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 flex space-x-3">
                  <button className="text-green-500 hover:text-green-600 flex items-center"
                                          onClick={() => handleEditInitiate(user)} // Rediriger vers la page de modification
                                          disabled={isLoading}
                  >
                    
                    <Edit className="mr-1" size={16} /> Modifier
                  </button>
                  <button
                    className="text-blue-400 hover:text-blue-500 flex items-center"
                    onClick={() => handleViewUser(user)}
                    disabled={isLoading}
                  >
                    <Eye className="mr-1" size={16} /> Voir
                  </button>
                  <button
                    className="text-red-400 hover:text-red-500 flex items-center"
                    onClick={() => handleDeletelivreur(user.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="mr-1" size={16} /> Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
            </div>
            </>
      )}
      <Toaster
        position="top-right"
        containerStyle={{
          position: "fixed",
          top: "1rem", // Ajustez la distance par rapport au haut de l'écran
          right: "1rem", // Ajustez la distance par rapport au côté droit de l'écran
        }}
      />
{selectedUser && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedUser(null)}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="justify-center text-2xl font-semibold text-gray-800">
                Détails du Livreur
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700 transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Nom */}
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium text-gray-800">{`${selectedUser.prenom} ${selectedUser.nom}`}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-8">
  {/* Téléphone principal */}
  <div className="flex items-center space-x-4">
    <div className="bg-green-100 p-3 rounded-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-green-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    </div>
    <div>
      <p className="text-sm text-gray-500">Téléphone principal</p>
      <p className="font-medium text-gray-800">
        {selectedUser.telephone1}
      </p>
    </div>
  </div>

  {/* Téléphone secondaire */}
  <div className="flex items-center space-x-4">
    <div className="bg-yellow-100 p-3 rounded-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-yellow-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    </div>
    <div>
      <p className="text-sm text-gray-500">Téléphone secondaire</p>
      <p className="font-medium text-gray-800">
        {selectedUser.telephone2 || "N/A"}
      </p>
    </div>
  </div>
</div>


              {/* CIN */}
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CIN</p>
                  <p className="font-medium text-gray-800">
                    {selectedUser.cin}
                  </p>
                </div>
              </div>

              {/* Code TVA */}
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Code TVA</p>
                  <p className="font-medium text-gray-800">
                    {selectedUser.codeTVA}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gouvernorat</p>
                  <p className="font-medium text-gray-800">
                    {selectedUser.gouvernorat}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Livreur;
