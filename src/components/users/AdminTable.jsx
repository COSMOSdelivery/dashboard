import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Search,
  Trash2,
  Eye,
  User,
  Mail,
  Phone,
  CreditCard,
  Percent,
  Lock,
  AlertCircle,
  CheckCircle
} from "lucide-react";

// Fonctions de validation
const validators = {
  nom: (value) => {
    if (!value.trim()) return "Le nom est requis";
    if (value.trim().length < 2) return "Le nom doit contenir au moins 2 caractères";
    if (!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\s-']+$/.test(value)) {
      return "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes";
    }
    return null;
  },

  prenom: (value) => {
    if (!value.trim()) return "Le prénom est requis";
    if (value.trim().length < 2) return "Le prénom doit contenir au moins 2 caractères";
    if (!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\s-']+$/.test(value)) {
      return "Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes";
    }
    return null;
  },

  email: (value) => {
    if (!value.trim()) return "L'email est requis";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Format d'email invalide";
    if (value.length > 254) return "L'email est trop long";
    return null;
  },

  password: (value) => {
    if (!value) return "Le mot de passe est requis";
    if (value.length < 8) return "Le mot de passe doit contenir au moins 8 caractères";
    if (!/(?=.*[a-z])/.test(value)) return "Le mot de passe doit contenir au moins une minuscule";
    if (!/(?=.*[A-Z])/.test(value)) return "Le mot de passe doit contenir au moins une majuscule";
    if (!/(?=.*\d)/.test(value)) return "Le mot de passe doit contenir au moins un chiffre";
    if (!/(?=.*[@$!%*?&])/.test(value)) return "Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)";
    return null;
  },

  confirmPassword: (value, password) => {
    if (!value) return "La confirmation du mot de passe est requise";
    if (value !== password) return "Les mots de passe ne correspondent pas";
    return null;
  },

  telephone1: (value) => {
    if (!value.trim()) return "Le téléphone principal est requis";
    // Format tunisien : +216 ou 216 ou sans préfixe, 8 chiffres
    const phoneRegex = /^(\+216|216)?[2-9]\d{7}$/;
    const cleanPhone = value.replace(/\s+/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return "Format de téléphone invalide (ex: +216 20123456 ou 20123456)";
    }
    return null;
  },

  telephone2: (value) => {
    if (value && value.trim()) {
      const phoneRegex = /^(\+216|216)?[2-9]\d{7}$/;
      const cleanPhone = value.replace(/\s+/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        return "Format de téléphone invalide (ex: +216 20123456 ou 20123456)";
      }
    }
    return null;
  },

  cin: (value) => {
    if (!value.trim()) return "Le CIN est requis";
    // CIN tunisien : 8 chiffres
    const cinRegex = /^\d{8}$/;
    if (!cinRegex.test(value.replace(/\s+/g, ''))) {
      return "Le CIN doit contenir exactement 8 chiffres";
    }
    return null;
  },

  codeTVA: (value) => {
    if (!value.trim()) return "Le code TVA est requis";
    // Code TVA tunisien : commence par 1 suivi de 6 chiffres
    const tvaRegex = /^1\d{6}$/;
    if (!tvaRegex.test(value.replace(/\s+/g, ''))) {
      return "Le code TVA doit commencer par 1 suivi de 6 chiffres (ex: 1234567)";
    }
    return null;
  }
};

const AdminTable = ({
  fullWidth = false,
  onAddClick,
  onCancel,
  incrementAdminCount,
}) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const itemsPerPage = 5;

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
    role: "ADMIN",
  });

  // Données mockées pour la démonstration
  const mockUsers = [
    {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@example.com",
      telephone1: "20123456",
      telephone2: "25987654",
      cin: "12345678",
      codeTVA: "1234567",
      role: "ADMIN"
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Marie",
      email: "marie.martin@example.com",
      telephone1: "22456789",
      telephone2: "",
      cin: "87654321",
      codeTVA: "1987654",
      role: "ADMIN"
    }
  ];

  useEffect(() => {
    // Simulation de chargement des données
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Validation en temps réel
  const validateField = (name, value) => {
    let error = null;
    
    if (name === 'confirmPassword') {
      error = validators[name](value, newUser.password);
    } else if (validators[name]) {
      error = validators[name](value);
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return error === null;
  };

  // Formatage automatique des champs
  const formatField = (name, value) => {
    switch (name) {
      case 'telephone1':
      case 'telephone2':
        // Formatage du téléphone : ajouter des espaces
        const cleanPhone = value.replace(/\D/g, '');
        if (cleanPhone.length <= 8) {
          return cleanPhone.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3').trim();
        }
        return cleanPhone.substring(0, 8).replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
      
      case 'cin':
        // Formatage CIN : supprimer les caractères non numériques
        return value.replace(/\D/g, '').substring(0, 8);
      
      case 'codeTVA':
        // Formatage code TVA : supprimer les caractères non numériques
        return value.replace(/\D/g, '').substring(0, 7);
      
      case 'nom':
      case 'prenom':
        // Capitaliser la première lettre
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      
      case 'email':
        // Convertir en minuscules
        return value.toLowerCase();
      
      default:
        return value;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatField(name, value);
    
    setNewUser(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Marquer le champ comme touché
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Valider le champ si il a été touché
    if (touched[name] || value) {
      validateField(name, formattedValue);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(newUser).forEach(field => {
      if (field !== 'role' && field !== 'telephone2') { // telephone2 est optionnel
        const error = validateField(field, newUser[field]);
        if (error) {
          isValid = false;
        }
      }
    });

    // Marquer tous les champs comme touchés
    const allTouched = {};
    Object.keys(newUser).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulation d'ajout
      const newAdmin = {
        ...newUser,
        id: Date.now(),
      };
      
      setUsers(prev => [...prev, newAdmin]);
      setFilteredUsers(prev => [...prev, newAdmin]);

      // Réinitialiser le formulaire
      setNewUser({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        confirmPassword: "",
        telephone1: "",
        telephone2: "",
        cin: "",
        codeTVA: "",
        role: "ADMIN",
      });
      setErrors({});
      setTouched({});

      if (onCancel) {
        onCancel();
      }

      alert("Admin ajouté avec succès!");

    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'ajout");
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
    setCurrentPage(1);
    setFilteredUsers(filtered);
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  const roleStyle = {
    ADMIN: {
      background: "bg-red-500",
      text: "text-white",
    },
  };

  // Composant pour les champs de saisie avec validation
  const InputField = ({ label, name, type = "text", required = true, icon: Icon, placeholder }) => {
    const hasError = touched[name] && errors[name];
    const isValid = touched[name] && !errors[name] && newUser[name];

    return (
      <div>
        <label className="block text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className={`h-5 w-5 ${hasError ? 'text-red-400' : isValid ? 'text-green-400' : 'text-gray-400'}`} />
          </div>
          <input
            type={type}
            name={name}
            value={newUser[name]}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`w-full pl-10 pr-10 px-4 py-2 border rounded-lg transition-colors duration-200 ${
              hasError 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : isValid
                ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            } focus:outline-none focus:ring-2`}
            required={required}
          />
          {hasError && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
          )}
          {isValid && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
          )}
        </div>
        {hasError && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className={`bg-white backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200 mb-4 
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
            <br />
            <h3 className="text-2xl font-semibold text-blue-400 mb-6">
              Ajouter un administrateur
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Nom"
                  name="nom"
                  icon={User}
                  placeholder="Ex: Dupont"
                />
                <InputField
                  label="Prénom"
                  name="prenom"
                  icon={User}
                  placeholder="Ex: Jean"
                />
              </div>

              <InputField
                label="Email"
                name="email"
                type="email"
                icon={Mail}
                placeholder="Ex: jean.dupont@example.com"
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Mot de passe"
                  name="password"
                  type="password"
                  icon={Lock}
                  placeholder="Au moins 8 caractères"
                />
                <InputField
                  label="Confirmer le mot de passe"
                  name="confirmPassword"
                  type="password"
                  icon={Lock}
                  placeholder="Répétez le mot de passe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Téléphone principal"
                  name="telephone1"
                  icon={Phone}
                  placeholder="Ex: 20 123 456"
                />
                <InputField
                  label="Téléphone secondaire"
                  name="telephone2"
                  icon={Phone}
                  placeholder="Ex: 25 987 654 (optionnel)"
                  required={false}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="CIN"
                  name="cin"
                  icon={CreditCard}
                  placeholder="Ex: 12345678"
                />
                <InputField
                  label="Code TVA"
                  name="codeTVA"
                  icon={Percent}
                  placeholder="Ex: 1234567"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={onCancel}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || Object.keys(errors).some(key => errors[key])}
                >
                  {isLoading ? "Ajout en cours..." : "Ajouter"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Admins</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Recherche ADMIN..."
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
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={onAddClick}
              >
                Ajouter un admin
              </button>
            </div>
          </div>

          <div className="max-h-[700px] w-full overflow-y-auto rounded-lg border border-gray-400">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-900">{`${user.prenom} ${user.nom}`}</td>
                    <td className="px-6 py-4 text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 text-gray-900">{user.telephone1}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          roleStyle[user.role]?.background
                        } ${roleStyle[user.role]?.text}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 flex space-x-3">
                      <button
                        className="text-green-500 hover:text-green-600 flex items-center transition-colors"
                        disabled={isLoading}
                      >
                        <Edit className="mr-1" size={16} /> Modifier
                      </button>
                      <button
                        className="text-blue-400 hover:text-blue-500 flex items-center transition-colors"
                        onClick={() => handleViewUser(user)}
                        disabled={isLoading}
                      >
                        <Eye className="mr-1" size={16} /> Voir
                      </button>
                      <button
                        className="text-red-400 hover:text-red-500 flex items-center transition-colors"
                        disabled={isLoading}
                      >
                        <Trash2 className="mr-1" size={16} /> Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center items-center mt-6 space-x-4 py-4">
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

      {/* Modal de visualisation */}
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
              <h3 className="text-2xl font-semibold text-gray-800">
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
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium text-gray-800">{`${selectedUser.prenom} ${selectedUser.nom}`}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Mail className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{selectedUser.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Phone className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone principal</p>
                  <p className="font-medium text-gray-800">{selectedUser.telephone1}</p>
                </div>
              </div>

              {selectedUser.telephone2 && (
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone secondaire</p>
                    <p className="font-medium text-gray-800">{selectedUser.telephone2}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <CreditCard className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">CIN</p>
                  <p className="font-medium text-gray-800">{selectedUser.cin}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Percent className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Code TVA</p>
                  <p className="font-medium text-gray-800">{selectedUser.codeTVA}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminTable;
