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
  CheckCircle,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";
import config from "../../config.json";

const API_URL = config.API_URL;

// Liste des gouvernorats
const GOUVERNORATS = [
  { value: "", label: "Sélectionner un gouvernorat" },
  { value: "ariana", label: "Ariana" },
  { value: "tunis", label: "Tunis" },
  { value: "manouba", label: "Manouba" },
  { value: "ben_arous", label: "Ben Arous" },
];

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
    const cinRegex = /^\d{8}$/;
    if (!cinRegex.test(value.replace(/\s+/g, ''))) {
      return "Le CIN doit contenir exactement 8 chiffres";
    }
    return null;
  },

  codeTVA: (value) => {
    if (!value.trim()) return "Le code TVA est requis";
    const tvaRegex = /^1\d{6}$/;
    if (!tvaRegex.test(value.replace(/\s+/g, ''))) {
      return "Le code TVA doit commencer par 1 suivi de 6 chiffres (ex: 1234567)";
    }
    return null;
  },

  gouvernorat: (value) => {
    if (!value) return "Le gouvernorat est requis";
    return null;
  },

  adresse: (value) => {
    if (!value.trim()) return "L'adresse est requise";
    if (value.trim().length < 5) return "L'adresse doit contenir au moins 5 caractères";
    return null;
  },
};

const LivreurTable = ({
  fullWidth = false,
  onAddClick,
  onCancel,
  incrementLivreurCount,
}) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [regions, setRegions] = useState([]);
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
    gouvernorat: "",
    adresse: "",
    role: "LIVREUR",
  });

  // Données mockées pour la démonstration
  const mockUsers = [
    {
      id: 1,
      nom: "Ben Ali",
      prenom: "Ahmed",
      email: "ahmed.benali@example.com",
      telephone1: "20 123 456",
      telephone2: "25 987 654",
      cin: "12345678",
      codeTVA: "1234567",
      gouvernorat: "tunis",
      adresse: "123 Avenue de la Liberté",
      role: "LIVREUR",
    },
    {
      id: 2,
      nom: "Trabelsi",
      prenom: "Fatma",
      email: "fatma.trabelsi@example.com",
      telephone1: "22 456 789",
      telephone2: "",
      cin: "87654321",
      codeTVA: "1987654",
      gouvernorat: "ariana",
      adresse: "456 Rue de l'Indépendance",
      role: "LIVREUR",
    },
  ];

  useEffect(() => {
    fetchLivreurs();
  }, []);

  const fetchLivreurs = async () => {
    const token = localStorage.getItem("authToken");
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/users/allLivreurs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data || [];
      setUsers(data);
      setFilteredUsers(data);
      const uniqueRegions = Array.from(
        new Set(
          data
            .filter((u) => u.livreur && u.livreur.gouvernorat)
            .map((u) => (u.livreur.gouvernorat || "").trim())
            .filter((g) => g)
        )
      );
      setRegions(uniqueRegions);
    } catch (err) {
      alert(err.response?.data?.msg || "Erreur de chargement des livreurs");
    } finally {
      setIsLoading(false);
    }
  };

  // Validation en temps réel
  const validateField = (name, value) => {
    let error = null;

    if (name === "confirmPassword") {
      error = validators[name](value, newUser.password);
    } else if (validators[name]) {
      error = validators[name](value);
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === null;
  };

  // Formatage automatique des champs
  const formatField = (name, value) => {
    switch (name) {
      case "telephone1":
      case "telephone2":
        const cleanPhone = value.replace(/\D/g, "");
        if (cleanPhone.length <= 8) {
          return cleanPhone.replace(/(\d{2})(\d{3})(\d{3})/, "$1 $2 $3").trim();
        }
        return cleanPhone.substring(0, 8).replace(/(\d{2})(\d{3})(\d{3})/, "$1 $2 $3");
      case "cin":
        return value.replace(/\D/g, "").substring(0, 8);
      case "codeTVA":
        return value.replace(/\D/g, "").substring(0, 7);
      case "nom":
      case "prenom":
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      case "email":
        return value.toLowerCase();
      default:
        return value;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatField(name, value);

    setNewUser((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    if (touched[name] || value) {
      validateField(name, formattedValue);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, value);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(newUser).forEach((field) => {
      if (field !== "role" && field !== "telephone2") {
        const error = validateField(field, newUser[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    const allTouched = {};
    Object.keys(newUser).forEach((field) => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setIsLoading(true);

    const token = localStorage.getItem("authToken");

    try {
      const userToSubmit = {
        cin: newUser.cin,
        email: newUser.email,
        nom: newUser.nom,
        password: newUser.password,
        prenom: newUser.prenom,
        codeTVA: newUser.codeTVA,
        telephone1: newUser.telephone1.replace(/\s+/g, ""),
        telephone2: newUser.telephone2 ? newUser.telephone2.replace(/\s+/g, "") : "",
        gouvernorat: newUser.gouvernorat,
        adresse: newUser.adresse,
        role: "LIVREUR",
      };
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
      setUsers((prev) => [...prev, response.data]);
      setFilteredUsers((prev) => [...prev, response.data]);
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
        gouvernorat: "",
        adresse: "",
        role: "LIVREUR",
      });
      setErrors({});
      setTouched({});
      if (incrementLivreurCount) {
        incrementLivreurCount();
      }
      if (onCancel) {
        onCancel();
      }
      alert("Livreur ajouté avec succès!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        "Une erreur est survenue lors de la création du compte";
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
    setCurrentPage(1);
    setFilteredUsers(filtered);
  };

  const handleFilterRegion = (e) => {
    const region = e.target.value;
    setFilterRegion(region);
    const filtered = users.filter((user) => {
      const gouvernorat = (user.livreur?.gouvernorat || "").toLowerCase().trim();
      return !region || gouvernorat === region.toLowerCase().trim();
    });
    setCurrentPage(1);
    setFilteredUsers(filtered);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  const handleEditInitiate = (user) => {
    navigate(`/edit-livreur/${user.id}`, { state: { user } });
  };

  const handleDeleteLivreur = (livreurId) => {
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
          <p>Êtes-vous sûr de vouloir supprimer ce livreur ?</p>
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
                  await axios.delete(`${API_URL}/users/deleteUser/${livreurId}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  setUsers((prevUsers) => prevUsers.filter((user) => user.id !== livreurId));
                  setFilteredUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== livreurId)
                  );
                  alert("Livreur supprimé avec succès!");
                } catch (error) {
                  const errorMessage =
                    error.response?.data?.msg ||
                    "Une erreur est survenue lors de la suppression du livreur";
                  alert(errorMessage);
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

  const roleStyles = {
    LIVREUR: {
      background: "bg-yellow-500",
      text: "text-black",
    },
  };

  // Composant pour les champs de saisie avec validation
  const InputField = ({ label, name, type = "text", required = true, icon: Icon, placeholder, options }) => {
    const hasError = touched[name] && errors[name];
    const isValid = touched[name] && !errors[name] && newUser[name];

    return (
      <div>
        <label className="block text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {type === "select" ? (
            <select
              name={name}
              value={newUser[name]}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full pl-10 pr-10 px-4 py-2 border rounded-lg transition-colors duration-200 ${
                hasError
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : isValid
                  ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              } focus:outline-none focus:ring-2`}
              required={required}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              value={newUser[name]}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              className={`w-full pl-10 pr-10 px-4 py-2 border rounded-lg transition-colors duration-200 ${
                hasError
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : isValid
                  ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              } focus:outline-none focus:ring-2`}
              required={required}
            />
          )}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon
              className={`h-5 w-5 ${hasError ? "text-red-400" : isValid ? "text-green-400" : "text-gray-400"}`}
            />
          </div>
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

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div
      className={`bg-white backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200 mb-4 ${
        fullWidth ? "w-full h-full" : ""
      }`}
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
            <h3 className="text-2xl font-semibold text-blue-400 mb-6">Ajouter un livreur</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Nom" name="nom" icon={User} placeholder="Ex: Ben Ali" />
                <InputField label="Prénom" name="prenom" icon={User} placeholder="Ex: Ahmed" />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  icon={Mail}
                  placeholder="Ex: ahmed.benali@example.com"
                />
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
                <InputField label="CIN" name="cin" icon={CreditCard} placeholder="Ex: 12345678" />
                <InputField label="Code TVA" name="codeTVA" icon={Percent} placeholder="Ex: 1234567" />
                <InputField
                  label="Gouvernorat"
                  name="gouvernorat"
                  type="select"
                  icon={MapPin}
                  options={GOUVERNORATS}
                />
                <InputField label="Adresse" name="adresse" icon={MapPin} placeholder="Ex: 123 Avenue de la Liberté" />
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
                  disabled={isLoading || Object.keys(errors).some((key) => errors[key])}
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
            <h2 className="text-xl font-semibold text-gray-700">Livreurs</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Recherche LIVREUR..."
                  className="bg-gray-200 text-black placeholder-gray-500 rounded-lg pl-10 pr-4 py-2"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
              </div>
              <div className="relative">
                <select
                  value={filterRegion}
                  onChange={handleFilterRegion}
                  className="bg-gray-200 text-black placeholder-gray-500 rounded-lg pl-10 pr-4 py-2"
                >
                  <option value="">Tous les gouvernorats</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region.charAt(0).toUpperCase() + region.slice(1)}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute left-3 top-2.5 text-gray-500" size={18} />
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={onAddClick}
              >
                Ajouter un livreur
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
                    Gouvernorat
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
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Chargement...
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Aucun livreur trouvé
                    </td>
                  </tr>
                ) : (
                  currentItems.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-900">{`${user.prenom} ${user.nom}`}</td>
                      <td className="px-6 py-4 text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 text-gray-900">{user.telephone1}</td>
                      <td className="px-6 py-4 text-gray-900">
                        {user.livreur?.gouvernorat
                          ? user.livreur.gouvernorat.charAt(0).toUpperCase() + user.livreur.gouvernorat.slice(1)
                          : "-"}
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
                          className="text-green-500 hover:text-green-600 flex items-center transition-colors"
                          onClick={() => handleEditInitiate(user)}
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
                          onClick={() => handleDeleteLivreur(user.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="mr-1" size={16} /> Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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
              <h3 className="text-2xl font-semibold text-gray-800">Détails du livreur</h3>
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
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gouvernorat</p>
                  <p className="font-medium text-gray-800">
                    {selectedUser.livreur?.gouvernorat
                      ? selectedUser.livreur.gouvernorat.charAt(0).toUpperCase() +
                        selectedUser.livreur.gouvernorat.slice(1)
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium text-gray-800">{selectedUser.adresse}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LivreurTable;