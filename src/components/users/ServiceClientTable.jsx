import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import config from "../../config.json";
import axios from "axios";
const API_URL = config.API_URL;
const userData = [
  {
    nom: "بن سعيد",
    prenom: "خالد",
    email: "khaled@example.com",
    gouvernorat: "تونس",
    ville: "المنار",
    localité: "حي النصر",
    codePostal: "1073",
    adresse: "30 شارع الرياض",
    telephone: "91234567",
    cin: "CIN001",
    role: "Service_Client",
    dateInscription: "2023-09-10",
    derniereMiseAJour: "2023-09-11",
  },
  {
    nom: "الطاهر",
    prenom: "سامي",
    email: "sami@example.com",
    gouvernorat: "المنستير",
    ville: "المنستير",
    localité: "المدينة الجديدة",
    codePostal: "5000",
    adresse: "15 شارع النخيل",
    telephone: "92345678",
    cin: "CIN002",
    role: "Service_Client",
    dateInscription: "2023-09-15",
    derniereMiseAJour: "2023-09-16",
  },
  {
    nom: "الشابي",
    prenom: "فاطمة",
    email: "fatma@example.com",
    gouvernorat: "صفاقس",
    ville: "صفاقس",
    localité: "حي النصر",
    codePostal: "3001",
    adresse: "25 شارع تونس",
    telephone: "93456789",
    cin: "CIN003",
    role: "Service_Client",
    dateInscription: "2023-09-20",
    derniereMiseAJour: "2023-09-21",
  },
];

// Styles de rôle
const roleStyles = {
  Service_Client: {
    background: "bg-blue-500",
    text: "text-black",
  },
};

const ServiceClientTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(userData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = userData.filter(
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
      const response = await axios.post(
        `${API_URL}/users/creatAccount`,
        userToSubmit,
        {
          headers: {
            "Content-Type": "application/json",
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

      alert("SERVICE client ajouté avec succès!");
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
        <h2 className="text-xl font-semibold text-black-700">Service Client</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          Ajouter Service Client
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Recherche..."
            className="bg-gray-200 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search
            className="absolute left-3 top-2.5 text-black-700"
            size={18}
          />
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
                <td className="px-6 py-4 text-black-700">{user.telephone}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      roleStyles[user.role]?.background
                    } ${roleStyles[user.role]?.text}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black-800">
                  <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                    Edit
                  </button>
                  <button className="text-red-400 hover:text-red-300">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
