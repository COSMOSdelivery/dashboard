import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, Eye } from "lucide-react";

import config from "../../config.json";
import axios from "axios";
const API_URL = config.API_URL;

const roleStyles = {
  SERVICECLIENT: {
    background: "bg-blue-500",
    text: "text-black",
  },
};

const ServiceClientTable = (incrementServiceCount) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
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
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce client ?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("authToken");
    setIsLoading(true);

    try {
      await axios.delete(`${API_URL}/users/deleteUser/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted client from the state
      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== serviceId)
      );
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== serviceId));
      alert("Client supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression du service client:", error);

      const errorMessage =
        error.response?.data?.msg ||
        "Une erreur est survenue lors de la suppression du service client";

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
        codeTVA: newUser.codeTVA, // Hardcoded as ADMIN since this is the admin table
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
      setIsModalOpen(false);
      setNewUser({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        confirmPassword: "",
        telephone: "",
        telephone2: "",
        cin: "",
        codeTVA: "", // Hardcoded as ADMIN since this is the admin table
        role: "SERVICECLIENT",
      });
      if (incrementClientCount) {
        incrementClientCount();
      }
      alert("SERVICE client ajouté avec succès!");
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
  return (
    <motion.div
      className="bg-white backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
  <h2 className="text-xl font-semibold text-black-700">Services Client</h2>
  <div className="flex items-center space-x-4">
    <div className="relative">
      <input
        type="text"
        placeholder="Recherche..."
        className="bg-gray-200 text-black placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Search
        className="absolute left-3 top-2.5 text-black-700"
        size={18}
      />
    </div>
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      onClick={() => setIsModalOpen(true)}
    >
      Ajouter un Service Client
    </button>
  </div>
</div>

      {/* Tableau */}
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
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
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
                  <button className="text-green-500 hover:text-green-600 flex items-center">
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
                    onClick={() => handleDeleteservice(user.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-white flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="bg-white rounded-lg p-6 shadow-lg w-full h-full overflow-auto">
            <h3 className="text-2xl font-semibold text-black-800 mb-4">
              Ajouter un Service Client
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
                    Confirmer le mot de passe
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

              <div>
                <label className="block text-black-700">
                  Téléphone principal
                </label>
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
                  Téléphone secondaire (optionnel)
                </label>
                <input
                  type="text"
                  name="telephone2"
                  value={newUser.telephone2}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-black-700">code tva</label>
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

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ServiceClientTable;
