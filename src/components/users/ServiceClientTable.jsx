import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Edit, 
  Search, 
  Trash2, 
  Eye, 
  User,
  Lock,
  Phone,
  Percent,
  CreditCard,
  Mail
} from "lucide-react";import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import config from "../../config.json";
import axios from "axios";
const API_URL = config.API_URL;
const roleStyle = {
  SERVICECLIENT: {
    background: "bg-blue-500",
    text: "text-black",
  },
};


const ServiceClientTable = ({
  fullWidth = false,
  onAddClick,
  onCancel,
  incrementClientCount,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone1: "",
    telephone2: "",
    cin: "",
    codeTVA: "",
    role: "SERVICECLIENT",
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
    fetchservices();
  }, []);
  const fetchservices = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/users/allServiceClients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching livreurs:", error);
      setError("Failed to load livreurs");
    }
  };
  const handleViewUser = (user) => {
    setSelectedUser(user);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Nombre d'éléments par page
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
const currentItems = filteredUsers.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
  );
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleDeleteservice = async (serviceId) => {
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
          <p>Êtes-vous sûr de vouloir supprimer ce service client ?</p>
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
                  await axios.delete(`${API_URL}/users/deleteUser/${serviceId}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
  
                  // Mise à jour de l'état après suppression
                  setFilteredUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== serviceId)
                  );
                  setUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== serviceId)
                  );
                  notifySuccess("Service client supprimé avec succès!");
                } catch (error) {
                  console.error("Erreur lors de la suppression du service client:", error);
                  const errorMessage =
                    error.response?.data?.msg ||
                    "Une erreur est survenue lors de la suppression du service client";
                  alert(errorMessage);
                } finally {
                  setIsLoading(false);
                  onClose();
                }
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
    const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        `${user.prenom} ${user.nom}`.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset à la première page après une recherche
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    if (newUser.password !== newUser.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    try {
      const userToSubmit = {
        cin: newUser.cin,
        email: newUser.email,
        nom: newUser.nom,
        password: newUser.password,
        prenom: newUser.prenom,
        role: "SERVICECLIENT",
        codeTVA: newUser.codeTVA, // Hardcoded as Service Client since this is the Service Client table
        telephone1: newUser.telephone1, // Make sure this matches the backend field name
        telephone2: newUser.telephone2 || "",
      };
      console.log("Sending data:", userToSubmit);
      const token = localStorage.getItem("authToken");
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
        telephone: "",
        telephone2: "",
        cin: "",
        codeTVA: "", // Hardcoded as Service Client since this is the Service Client table
        role: "SERVICECLIENT",
      });
      if (onCancel) {
        onCancel(); // Cela désactive `fullWidth` et revient à l'affichage des tableaux
      }
      fetchLivreurs();
      setTimeout(() => {
        notifySuccess("Un nouveau livreur est ajouté avec succès!");
      }, 500); 
      if (incrementClientCount) {
        incrementClientCount();
      }
      fetchservices();
    } catch (error) {
      console.error("Erreur lors de l'ajout du service client:", error);

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
    navigate(`/edit-service-client/${user.id}`, { state: { user } });
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
          className="fixed inset-0 bg-white z-50 flex justify-start items-center overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ width: "80vw", height: "110vh" }}
        >
          <motion.div className="w-full max-w-4xl p-8 relative">
            <br></br>
            <h3 className="text-2xl font-semibold text-blue-400 mb-6">
              Ajouter un Service Client
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-black-700 mb-2">Nom</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />{" "}
                      {/* Icône pour le nom */}
                    </div>
                    <input
                      type="text"
                      name="nom"
                      value={newUser.nom}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-black-700 mb-2">Prénom</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />{" "}
                      {/* Icône pour le prénom */}
                    </div>
                    <input
                      type="text"
                      name="prenom"
                      value={newUser.prenom}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-black-700 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />{" "}
                    {/* Icône pour l'email */}
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-black-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />{" "}
                      {/* Icône pour le mot de passe */}
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-black-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />{" "}
                      {/* Icône pour la confirmation du mot de passe */}
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={newUser.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-black-700 mb-2">
                  Téléphone principal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />{" "}
                    {/* Icône pour le téléphone */}
                  </div>
                  <input
                    type="text"
                    name="telephone1"
                    value={newUser.telephone1}
                    onChange={handleInputChange}
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-black-700 mb-2">
                  Téléphone secondaire (optionnel)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />{" "}
                    {/* Icône pour le téléphone */}
                  </div>
                  <input
                    type="text"
                    name="telephone2"
                    value={newUser.telephone2}
                    onChange={handleInputChange}
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black-700 mb-2">Code TVA</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Percent className="h-5 w-5 text-gray-400" />{" "}
                    {/* Icône pour le code TVA */}
                  </div>
                  <input
                    type="text"
                    name="codeTVA"
                    value={newUser.codeTVA}
                    onChange={handleInputChange}
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-black-700 mb-2">CIN</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />{" "}
                  </div>
                  <input
                    type="text"
                    name="cin"
                    value={newUser.cin}
                    onChange={handleInputChange}
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Boutons en bas du formulaire */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button" // Utilisez type="button" pour éviter de soumettre le formulaire
                  onClick={onCancel}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                  onClick={handleSubmit}
                >
                  Ajouter
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-black-700">Service Clients</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Recherche Service Client..."
                  className="bg-gray-200 text-black placeholder-gray-500 rounded-lg pl-10 pr-4 py-2"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-500"
                  size={18}
                />
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={onAddClick}
              >
                Ajouter un Service Client
              </button>
            </div>
          </div>
          <div className="max-h-[700px] w-full overflow-y-auto rounded-lg border border-gray-400">
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
                    <td className="px-6 py-4 text-black-700">
                      {user.telephone1}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          roleStyle[user.role]?.background
                        } ${roleStyle[user.role]?.text}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black-800 flex space-x-3">
                      <button
                        className="text-green-500 hover:text-green-600 flex items-center"
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
                        onClick={() =>handleDeleteservice(user.id)}
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
                Détails de l'Service Clientistrateur
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ServiceClientTable;
