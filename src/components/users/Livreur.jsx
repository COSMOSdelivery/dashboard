import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios";
import config from "../../config.json";
const API_URL = config.API_URL;

const userData = [
  {
    nom: "العدوي",
    prenom: "محمد",
    email: "mohamed@example.com",
    gouvernorat: "تونس",
    ville: "المنار",
    localité: "الحي الجامعي",
    codePostal: "1002",
    adresse: "789 شارع النخيل",
    telephone: "91234567",
    cin: "CIN101",
    role: "Livreur",
    dateInscription: "2023-05-20",
    derniereMiseAJour: "2023-05-21",
  },
  {
    nom: "السباعي",
    prenom: "عادل",
    email: "adel@example.com",
    gouvernorat: "القصرين",
    ville: "فريانة",
    localité: "الطريق الرئيسية",
    codePostal: "2120",
    adresse: "102 شارع الفجر",
    telephone: "92765432",
    cin: "CIN202",
    role: "Livreur",
    dateInscription: "2023-06-10",
    derniereMiseAJour: "2023-06-11",
  },
  {
    nom: "الجلاصي",
    prenom: "سليم",
    email: "selim@example.com",
    gouvernorat: "سوسة",
    ville: "القصبة",
    localité: "منطقة صناعية",
    codePostal: "4000",
    adresse: "555 شارع البحر",
    telephone: "95647382",
    cin: "CIN303",
    role: "Livreur",
    dateInscription: "2023-07-05",
    derniereMiseAJour: "2023-07-06",
  },
  {
    nom: "الهاشمي",
    prenom: "رشيد",
    email: "rachid@example.com",
    gouvernorat: "قابس",
    ville: "قابس المدينة",
    localité: "المنطقة الصناعية",
    codePostal: "6000",
    adresse: "234 شارع النصر",
    telephone: "93487521",
    cin: "CIN404",
    role: "Livreur",
    dateInscription: "2023-08-15",
    derniereMiseAJour: "2023-08-16",
  },
];

const roleStyles = {
  Admin: {
    background: "bg-red-500",
    text: "text-white",
  },
  Livreur: {
    background: "bg-yellow-500",
    text: "text-black",
  },
  Client: {
    background: "bg-green-500",
    text: "text-white",
  },
};

const Livreur = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(userData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
  const [loading, setLoading] = useState(false);
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
    setIsLoading(true);
    setError("");
    const token = localStorage.getItem('authToken');
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
            'Authorization': `Bearer ${token}`
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
        telephone1: "",
        telephone2: "",
        codeTVA: "",
        cin: "",
        gouvernorat: "",
        role: "LIVREUR",
      });
      alert("livreur ajouté avec succès!");
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

  return (
    <motion.div
      className="bg-white   backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Livreurs</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          Ajouter Livreur
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Recherche Livreur..."
            className="bg-gray-200 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-700" size={18} />
        </div>
      </div>

      <div className="max-h-[350px] w-full overflow-y-auto rounded-lg border border-gray-400">
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
                Rôle
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index} className="hover:bg-gray-200">
                <td className="px-6 py-4 text-gray-700">{`${user.prenom} ${user.nom}`}</td>
                <td className="px-6 py-4 text-gray-700">{user.email}</td>
                <td className="px-6 py-4 text-gray-700">{user.telephone}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      roleStyles[user.role]?.background
                    } ${roleStyles[user.role]?.text}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
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

      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-white   flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="bg-white rounded-lg p-6 shadow-lg w-full h-full overflow-auto">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Ajouter un Livreur
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Nom</label>
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
                  <label className="block text-gray-700">Prénom</label>
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
                <label className="block text-gray-700">Email</label>
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
                  <label className="block text-gray-700">Mot de passe</label>
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
                  <label className="block text-gray-700">
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
                  <label className="block text-gray-700">Téléphone 1</label>
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
                  <label className="block text-gray-700">
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
                  <label className="block text-gray-700">Code TVA</label>
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
                  <label className="block text-gray-700">CIN</label>
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
                <label className="block text-gray-700">Gouvernorat</label>
                <input
                  type="text"
                  name="gouvernorat"
                  value={newUser.gouvernorat}
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
                  Enregistrer
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Livreur;
