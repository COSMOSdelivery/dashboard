import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import config from '../../config.json';
import axios from 'axios';
const API_URL = config.API_URL;
const roleStyles = {
  Client: {
    background: "bg-green-500",
    text: "text-white",
  },
};
const ClientTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
const [filteredUsers, setFilteredUsers] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");
const [users, setUsers] = useState([])
// Add this new state
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
  fraisRetour: null,
  fraisLivraison: null,
  role: "CLIENT",
});
  useEffect(() => {
    const fetchAdmins = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get(`${config.API_URL}/users/allClients`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || "Erreur de chargement des clients");
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, []);
  const [loading, setLoading] = useState(false);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const token = localStorage.getItem('authToken');

    // Validation des champs obligatoires
    if (!newUser.nom || !newUser.prenom || !newUser.email || !newUser.password) {
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
        nomShop:newUser.nomShop,
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
        fraisRetour:parseFloat(newUser.fraisRetour),
        fraisLivraison:parseFloat(newUser.fraisLivraison),
        role: "CLIENT",
      };
      console.log('Sending data:', userToSubmit);
      const response = await axios.post(`${API_URL}/users/creatAccount`, userToSubmit, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setFilteredUsers(prev => [...prev, response.data]);
      setIsModalOpen(false);
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
        fraisRetour: null,
        fraisLivraison: null,
        role: "CLIENT",
      });
      alert('client ajouté avec succès!');
    }catch (error) {
      console.error("Full error response:", error.response);
      console.error("Error details:", JSON.stringify(error.response?.data, null, 2));
    
      if (error.response) {
        // Log specific error messages from the backend
        const errorMessage = error.response.data.message || 
                             error.response.data.msg || 
                             'Une erreur est survenue lors de la création du compte';
        setError(errorMessage);
        alert(errorMessage);
      } else if (error.request) {
        setError("Erreur de connexion au serveur");
      } else {
        setError("Une erreur inattendue s'est produite");
      }
    } finally {
      setIsLoading(false);
    }
  };

  
    

  const handleEdit = (user) => {
    // Ouvrir le formulaire avec les informations du client pour modification
    setNewUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (email) => {
    // Supprimer l'utilisateur en filtrant par son email
    setFilteredUsers(filteredUsers.filter(user => user.email !== email));
  };

  return (
    <motion.div
      className="bg-white backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Clients</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          Ajouter un Client
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Recherche..."
            className="bg-gray-200 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-700" size={18} />
        </div>
      </div>
      {/* Tableau */}
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
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Action
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
        className="fixed inset-0 bg-white flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="bg-white rounded-lg p-6 shadow-lg w-full h-full overflow-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Ajouter un Service Client
          </h3>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="nomShop" className="block text-sm font-medium text-gray-700">Nom du magasin</label>
              <input
                id="nomShop"
                type="text"
                name="nomShop"
                value={newUser.nomShop}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                id="nom"
                type="text"
                name="nom"
                value={newUser.nom}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                id="prenom"
                type="text"
                name="prenom"
                value={newUser.prenom}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                id="password"
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={newUser.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="telephone1" className="block text-sm font-medium text-gray-700">Téléphone 1</label>
              <input
                id="telephone1"
                type="text"
                name="telephone1"
                value={newUser.telephone1}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="telephone2" className="block text-sm font-medium text-gray-700">Téléphone 2</label>
              <input
                id="telephone2"
                type="text"
                name="telephone2"
                value={newUser.telephone2}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="codeTVA" className="block text-sm font-medium text-gray-700">Code TVA</label>
              <input
                id="codeTVA"
                type="text"
                name="codeTVA"
                value={newUser.codeTVA}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="cin" className="block text-sm font-medium text-gray-700">CIN</label>
              <input
                id="cin"
                type="text"
                name="cin"
                value={newUser.cin}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="gouvernorat" className="block text-sm font-medium text-gray-700">Gouvernorat</label>
              <input
                id="gouvernorat"
                type="text"
                name="gouvernorat"
                value={newUser.gouvernorat}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ville" className="block text-sm font-medium text-gray-700">Ville</label>
              <input
                id="ville"
                type="text"
                name="ville"
                value={newUser.ville}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="localite" className="block text-sm font-medium text-gray-700">Localité</label>
              <input
                id="localite"
                type="text"
                name="localite"
                value={newUser.localite}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="codePostal" className="block text-sm font-medium text-gray-700">Code Postal</label>
              <input
                id="codePostal"
                type="text"
                name="codePostal"
                value={newUser.codePostal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                id="adresse"
                type="text"
                name="adresse"
                value={newUser.adresse}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Frais Livraison</label>
                  <input
                    type="text"
                    name="fraisLivraison"
                    value={newUser.fraisLivraison}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Frais Retour</label>
                  <input
                    type="text"
                    name="fraisRetour"
                    value={newUser.fraisRetour}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
<br/>
            <div className="flex justify-end space-x-2">
            <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                {loading ? "Ajout en cours..." : "Ajouter"}
              </button>
            </div>
            </form>
            
            </motion.div>
            </motion.div>
        
      )}
      
      </motion.div>
  );
}

export default ClientTable;
