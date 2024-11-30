import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const userData = [
  {
    nom: "العدوي",
    prenom: "محمد",
    email: "mohamed@example.com",
    gouvernerat: "تونس",
    ville: "المنار",
    localité: "الحي الجامعي",
    codePostal: "1002",
    adresse: "789 شارع النخيل",
    telephone: "91234567",
    cin: "CIN101",
    role: "Livreur",
    dateInscription: "2023-05-20",
    derniereMiseAJour: "2023-05-21"
  },
  {
    nom: "السباعي",
    prenom: "عادل",
    email: "adel@example.com",
    gouvernerat: "القصرين",
    ville: "فريانة",
    localité: "الطريق الرئيسية",
    codePostal: "2120",
    adresse: "102 شارع الفجر",
    telephone: "92765432",
    cin: "CIN202",
    role: "Livreur",
    dateInscription: "2023-06-10",
    derniereMiseAJour: "2023-06-11"
  },
  {
    nom: "الجلاصي",
    prenom: "سليم",
    email: "selim@example.com",
    gouvernerat: "سوسة",
    ville: "القصبة",
    localité: "منطقة صناعية",
    codePostal: "4000",
    adresse: "555 شارع البحر",
    telephone: "95647382",
    cin: "CIN303",
    role: "Livreur",
    dateInscription: "2023-07-05",
    derniereMiseAJour: "2023-07-06"
  },
  {
    nom: "الهاشمي",
    prenom: "رشيد",
    email: "rachid@example.com",
    gouvernerat: "قابس",
    ville: "قابس المدينة",
    localité: "المنطقة الصناعية",
    codePostal: "6000",
    adresse: "234 شارع النصر",
    telephone: "93487521",
    cin: "CIN404",
    role: "Livreur",
    dateInscription: "2023-08-15",
    derniereMiseAJour: "2023-08-16"
  }
  
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
  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    nomShop: "",
    email: "",
    gouvernerat: "",
    ville: "",
    localité: "",
    codePostal: "",
    adresse: "",
    telephone: "",
    codeTVA: "",
    cin: "",
    role: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilteredUsers((prevUsers) => [...prevUsers, newUser]);
    setNewUser({
      nom: "",
      prenom: "",
      nomShop: "",
      email: "",
      gouvernerat: "",
      ville: "",
      localité: "",
      codePostal: "",
      adresse: "",
      telephone: "",
      codeTVA: "",
      cin: "",
      role: "",
    });
    setIsModalOpen(false);
  };

  return (
    <motion.div
  className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-4"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Livreurs</h2>
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
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="max-h-[350px] w-[97vh] overflow-y-auto rounded-lg border border-gray-600">
  <table className="min-w-full divide-y divide-gray-700">
    <thead>
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
          Nom Complet
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
          Email
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
          Téléphone
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
          Rôle
        </th>
      </tr>
    </thead>
    <tbody>
      {filteredUsers.map((user, index) => (
        <tr key={index} className="hover:bg-gray-700">
          <td className="px-6 py-4 text-gray-200">{`${user.prenom} ${user.nom}`}</td>
          <td className="px-6 py-4 text-gray-200">{user.email}</td>
          <td className="px-6 py-4 text-gray-200">{user.telephone}</td>
          <td className="px-6 py-4">
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleStyles[user.role]?.background} ${roleStyles[user.role]?.text}`}
            >
              {user.role}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
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
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="bg-white rounded-lg p-6 shadow-lg min-w-[90vh] h-[400px] overflow-auto           ">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ajouter un Livreur</h3>
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
                <label className="block text-gray-700">Nom de Shop</label>
                <input
                  type="text"
                  name="nomShop"
                  value={newUser.nomShop}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                  <label className="block text-gray-700">Gouvernerat</label>
                  <input
                    type="text"
                    name="gouvernerat"
                    value={newUser.gouvernerat}
                    onChange={handleInputChange}
                    className="mt-1 text-black block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Ville</label>
                  <input
                    type="text"
                    name="ville"
                    value={newUser.ville}
                    onChange={handleInputChange}
                    className="mt-1 text-black block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700">Localité</label>
                <input
                  type="text"
                  name="localité"
                  value={newUser.localité}
                  onChange={handleInputChange}
                  className="mt-1 text-black block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Code Postal</label>
                  <input
                    type="text"
                    name="codePostal"
                    value={newUser.codePostal}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Adresse</label>
                  <input
                    type="text"
                    name="adresse"
                    value={newUser.adresse}
                    onChange={handleInputChange}
                    className="mt-1 text-black block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Téléphone</label>
                  <input
                    type="text"
                    name="telephone"
                    value={newUser.telephone}
                    onChange={handleInputChange}
                    className="mt-1 block text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Code TVA</label>
                  <input
                    type="text"
                    name="codeTVA"
                    value={newUser.codeTVA}
                    onChange={handleInputChange}
                    className="mt-1 block text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700">CIN</label>
                <input
                  type="text"
                  name="cin"
                  value={newUser.cin}
                  onChange={handleInputChange}
                  className="mt-1 block text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700">Rôle</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="mt-1 text-black block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un rôle</option>
                  <option value="Admin">Admin</option>
                  <option value="Livreur">Livreur</option>
                  <option value="Client">Client</option>
                </select>
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

export default Livreur;

