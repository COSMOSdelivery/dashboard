import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Edit, Search, Trash2, Eye , User, Mail, Phone, CreditCard, Percent, Building, MapPin, Home } from "lucide-react";


import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import config from "../../config.json";
import axios from "axios";

const API_URL = config.API_URL;
const roleStyles = {
  CLIENT: {
    background: "bg-green-500",
    text: "text-white",
  },
};
const ClientTable = ({
  fullWidth = false,
  onAddClick,
  onCancel,
  incrementClientCount,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [Error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    nomShop: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone1: "",
    telephone2: "",
    codeTVA: "",
    cin: "",
    gouvernorat: "",
    ville: "",
    localite: "",
    codePostal: "",
    adresse: "",
    fraisRetour: "",
    fraisLivraison: "",
    role: "CLIENT",
  });
  const notifySuccess = (message) => {
    toast.success(message, {
      icon: "✅",
      style: {
        background: "rgb(255, 255, 255)",
        color: "#2E7D32",
        fontWeight: "normal",
        borderRadius: "8px",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
        padding: "10px 20px",
      },
      duration: 4000,
    });
  };
  const notifyError = (message) => {
    toast.error(message, {
      duration: 4000,
      position: "top-right",
      style: {
        background: "rgb(255, 255, 255)",
        color: "#D32F2F",
        fontWeight: "normal",
        borderRadius: "8px",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
        padding: "10px 20px",
      },
    });
  };
  useEffect(() => {
    fetchClients();
  }, []);
  const fetchClients = async () => {
    const token = localStorage.getItem("authToken");
    console.log("Token: " + token);
    try {
      const response = await axios.get(`${config.API_URL}/users/allClients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur de chargement des clients");
      setIsLoading(false);
    }
  };
  const [loading] = useState(false);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        `${user.prenom} ${user.nom}`.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  const handleEditInitiate = (user) => {
    navigate(`/edit-client/${user.id}`, { state: { user } });
  };
  const handleViewUser = (user) => {
    setSelectedUser(user);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const token = localStorage.getItem("authToken");

    if (newUser.password !== newUser.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    try {
      const userToSubmit = {
        cin: newUser.cin,
        nomShop: newUser.nomShop,
        email: newUser.email,
        nom: newUser.nom,
        password: newUser.password,
        prenom: newUser.prenom,
        codeTVA: newUser.codeTVA,
        telephone1: newUser.telephone1,
        telephone2: newUser.telephone2 || "",
        gouvernorat: newUser.gouvernorat,
        ville: newUser.ville,
        localite: newUser.localite,
        codePostal: newUser.codePostal,
        adresse: newUser.adresse,
        fraisRetour: parseFloat(newUser.fraisRetour),
        fraisLivraison: parseFloat(newUser.fraisLivraison),
        role: "CLIENT",
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
        nomShop: "",
        email: "",
        password: "",
        confirmPassword: "",
        telephone1: "",
        telephone2: "",
        codeTVA: "",
        cin: "",
        gouvernorat: "",
        ville: "",
        localite: "",
        codePostal: "",
        adresse: "",
        fraisRetour: "",
        fraisLivraison: "",
        role: "CLIENT",
      });
      fetchClients();
      if (incrementClientCount) {
        incrementClientCount();
      }
      notifySuccess("Client ajouté avec succès!");
    } catch (error) {
      console.log("Error object:", error);

      // Log detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);

        const errorMessage =
          error.response.data?.message ||
          error.response.data?.msg ||
          "Une erreur est survenue lors de la création du compte";
        notifyError(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        console.log("Error request:", error.request);
        notifyError("Erreur de connexion au serveur");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error message:", error.message);
        notifyError("Une erreur inattendue s'est produite");
      }

      setError(error.message || "Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteClient = async (clientId) => {
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
          <p>Êtes-vous sûr de vouloir supprimer cet administrateur ?</p>
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
                try {
                  await axios.delete(
                    `${API_URL}/users/deleteUser/${clientId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  // Remove the deleted client from the state
                  setFilteredUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== clientId)
                  );
                  setUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== clientId)
                  );

                  notifySuccess("Administrateur supprimé avec succès!");
                } catch (error) {
                  console.error(
                    "Erreur lors de la suppression du client:",
                    error
                  );

                  const errorMessage =
                    error.response?.data?.msg ||
                    "Une erreur est survenue lors de la suppression du client";

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

  return (
    <motion.div
      className={`bg-white backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200 mb-4 
        ${fullWidth ? "w-full h-full" : ""}`} // Ajoutez w-full et h-full pour occuper tout l'espace
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Toaster
        position="top-right"
        containerStyle={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
        }}
      />
      {fullWidth ? (
        <motion.div
          className="fixed inset-0 bg-white z-50 flex justify-start items-center overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ width: "80vw", height: "150vh" }}
        >
          <motion.div className="bg-white rounded-lg p-6 shadow-lg w-full h-full overflow-auto">
          <br></br>
            <h3 className="text-2xl font-semibold text-blue-400 mb-4">
              Ajouter un Client
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {[
      { label: "Nom du magasin", name: "nomShop", icon: <Building className="h-5 w-5 text-gray-400" /> },
      { label: "Nom", name: "nom", icon: <User className="h-5 w-5 text-gray-400" /> },
      { label: "Prénom", name: "prenom", icon: <User className="h-5 w-5 text-gray-400" /> },
      { label: "Email", name: "email", type: "email", icon: <Mail className="h-5 w-5 text-gray-400" /> },
      { label: "Téléphone 1", name: "telephone1", icon: <Phone className="h-5 w-5 text-gray-400" /> },
      { label: "Téléphone 2", name: "telephone2", icon: <Phone className="h-5 w-5 text-gray-400" /> },
      { label: "Code TVA", name: "codeTVA", icon: <Percent className="h-5 w-5 text-gray-400" /> },
      { label: "CIN", name: "cin", icon: <CreditCard className="h-5 w-5 text-gray-400" /> },
      { label: "Gouvernorat", name: "gouvernorat", icon: <MapPin className="h-5 w-5 text-gray-400" /> },
      { label: "Ville", name: "ville", icon: <MapPin className="h-5 w-5 text-gray-400" /> },
      { label: "Localité", name: "localite", icon: <MapPin className="h-5 w-5 text-gray-400" /> },
      { label: "Code Postal", name: "codePostal", icon: <MapPin className="h-5 w-5 text-gray-400" /> },
      { label: "Adresse", name: "adresse", icon: <Home className="h-5 w-5 text-gray-400" /> },
    ].map((field, index) => (
      <div key={index} className="mb-4">
        <label
          htmlFor={field.name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {field.label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {field.icon}
          </div>
          <input
            id={field.name}
            type={field.type || "text"}
            name={field.name}
            value={newUser[field.name]}
            onChange={handleInputChange}
            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>
      </div>
    ))}
  </div>

  {/* Password Section */}
  <div className="mb-4">
    <label
      htmlFor="password"
      className="block text-sm font-medium text-gray-700"
    >
      Mot de passe
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <CreditCard className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id="password"
        type="password"
        name="password"
        value={newUser.password}
        onChange={handleInputChange}
        className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
        required
      />
    </div>
  </div>

  <div className="mb-4">
    <label
      htmlFor="confirmPassword"
      className="block text-sm font-medium text-gray-700"
    >
      Confirmer le mot de passe
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <CreditCard className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id="confirmPassword"
        type="password"
        name="confirmPassword"
        value={newUser.confirmPassword}
        onChange={handleInputChange}
        className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
        required
      />
    </div>
  </div>

  {/* Frais Section */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Frais Livraison
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <CreditCard className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          name="fraisLivraison"
          value={newUser.fraisLivraison}
          onChange={handleInputChange}
          className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
          required
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Frais Retour
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <CreditCard className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          name="fraisRetour"
          value={newUser.fraisRetour}
          onChange={handleInputChange}
          className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
          required
        />
      </div>
    </div>
  </div>

  {/* Buttons Section */}
  <div className="flex justify-center space-x-4 mt-6">
    <button
      type="button"
      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
      onClick={onCancel}
    >
      Annuler
    </button>
    <button
      type="submit"
      disabled={loading}
      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
    >
      {loading ? "Ajout en cours..." : "Ajouter"}
    </button>
  </div>
</form>
          </motion.div>
        </motion.div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Clients</h2>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Recherche..."
                    className="bg-gray-200 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <Search
                    className="absolute left-3 top-2.5 text-gray-700"
                    size={18}
                  />
                </div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  onClick={onAddClick}
                >
                  Ajouter un Client
                </button>
              </div>
            </div>
          </div>
          {/* Tableau */}
          <div className="max-h-[700px] w-full overflow-y-auto rounded-lg border border-gray-400">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Nom Complet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-200">
                    <td className="px-6 py-4 text-gray-700">{`${user.prenom} ${user.nom}`}</td>
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {user.telephone1}
                    </td>
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
                      <button
                        className="text-green-500 hover:text-green-600 flex items-center"
                        onClick={() => handleEditInitiate(user)}
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
                        onClick={() => handleDeleteClient(user.id)}
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
                Détails de l'administrateur
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
              <div className="flex items-center space-x-8">

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
                      d="M4 5a2 2 0 012-2 3 3 0 016 0 2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2 10h8V5H6v10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Code TVA</p>
                  <p className="font-medium text-gray-800">
                    {selectedUser.codeTva}
                  </p>
                </div>
                </div>
                </div>

              {/* Nom du shop */}
              <div className="flex items-center space-x-4">
                <div className="bg-teal-100 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-teal-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 7a2 2 0 012-2h10a2 2 0 012 2v6H3V7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nom du Shop</p>
                  <p className="font-medium text-gray-800">
                    {selectedUser.nomShop}
                  </p>
                </div>
              </div>

              {/* Type */}
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-orange-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 2a1 1 0 100 2h2a1 1 0 100-2h-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium text-gray-800">
                    {selectedUser.type}
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

export default ClientTable;
