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
  Building,
  MapPin,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import config from "../../config.json";
import axios from "axios";

const API_URL = config.API_URL;

// Liste des gouvernorats
const GOUVERNORATS = [
  { value: "", label: "Sélectionner un gouvernorat" },
  { value: "manouba", label: "Manouba" },
  { value: "ben_arous", label: "Ben Arous" },
  { value: "tunis", label: "Tunis" },
  { value: "ariana", label: "Ariana" },
];

// Mapping des gouvernorats aux villes
const GOUVERNORAT_CITIES = {
  tunis: [
    { value: "bab_el_bhar", label: "Bab El Bhar" },
    { value: "bab_souika", label: "Bab Souika" },
    { value: "carthage", label: "Carthage" },
    { value: "cite_el_khadra", label: "Cité El Khadra" },
    { value: "djebel_jelloud", label: "Djebel Jelloud" },
    { value: "el_kabaria", label: "El Kabaria" },
    { value: "el_menzah", label: "El Menzah" },
    { value: "el_omrane", label: "El Omrane" },
    { value: "el_omrane_superieur", label: "El Omrane Supérieur" },
    { value: "el_ouardia", label: "El Ouardia" },
    { value: "ettahrir", label: "Ettahrir" },
    { value: "ezzouhour", label: "Ezzouhour" },
    { value: "hrairia", label: "Hraïria" },
    { value: "la_goulette", label: "La Goulette" },
    { value: "la_marsa", label: "La Marsa" },
    { value: "le_bardo", label: "Le Bardo" },
    { value: "le_kram", label: "Le Kram" },
    { value: "la_medina", label: "La Médina" },
    { value: "sejoumi", label: "Séjoumi" },
    { value: "sidi_el_bechir", label: "Sidi El Béchir" },
    { value: "sidi_hassine", label: "Sidi Hassine" },
  ],
  ariana: [
    { value: "ariana_ville", label: "Ariana Ville" },
    { value: "ettadhamen", label: "Ettadhamen" },
    { value: "kalaat_el_andalous", label: "Kalâat el-Andalous" },
    { value: "la_soukra", label: "La Soukra" },
    { value: "mnihla", label: "Mnihla" },
    { value: "raoued", label: "Raoued" },
    { value: "sidi_thabet", label: "Sidi Thabet" },
  ],
  ben_arous: [
    { value: "ben_arous", label: "Ben Arous" },
    { value: "bou_mhel_el_bassatine", label: "Bou Mhel el-Bassatine" },
    { value: "el_mourouj", label: "El Mourouj" },
    { value: "ezzahra", label: "Ezzahra" },
    { value: "fouchana", label: "Fouchana" },
    { value: "hammam_chott", label: "Hammam Chott" },
    { value: "hammam_lif", label: "Hammam Lif" },
    { value: "mohamedia", label: "Mohamedia" },
    { value: "medina_jedida", label: "Medina Jedida" },
    { value: "megrine", label: "Mégrine" },
    { value: "mornag", label: "Mornag" },
    { value: "rades", label: "Radès" },
  ],
  manouba: [
    { value: "la_manouba", label: "La Manouba" },
    { value: "den_den", label: "Den Den" },
    { value: "douar_hicher", label: "Douar Hicher" },
    { value: "oued_ellil", label: "Oued Ellil" },
    { value: "mornaguia", label: "Mornaguia" },
    { value: "borj_el_amri", label: "Borj El Amri" },
    { value: "djedeida", label: "Djedeida" },
    { value: "tebourba", label: "Tebourba" },
    { value: "el_batan", label: "El Batan" },
  ],
};

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

  nomShop: (value) => {
    if (!value.trim()) return "Le nom du magasin est requis";
    if (value.trim().length < 2) return "Le nom du magasin doit contenir au moins 2 caractères";
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

  ville: (value, gouvernorat) => {
    if (!value.trim()) return "La ville est requise";
    if (gouvernorat) {
      const validCities = GOUVERNORAT_CITIES[gouvernorat]?.map((city) => city.value) || [];
      if (!validCities.includes(value)) return "Ville invalide pour le gouvernorat sélectionné";
    }
    return null;
  },

  localite: (value) => {
    if (!value.trim()) return "La localité est requise";
    if (value.trim().length < 2) return "La localité doit contenir au moins 2 caractères";
    return null;
  },

  codePostal: (value) => {
    if (!value.trim()) return "Le code postal est requis";
    const codePostalRegex = /^\d{4}$/;
    if (!codePostalRegex.test(value.replace(/\s+/g, ''))) {
      return "Le code postal doit contenir exactement 4 chiffres";
    }
    return null;
  },

  adresse: (value) => {
    if (!value.trim()) return "L'adresse est requise";
    if (value.trim().length < 5) return "L'adresse doit contenir au moins 5 caractères";
    return null;
  },

  fraisLivraison: (value) => {
    if (!value.trim()) return "Les frais de livraison sont requis";
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0) {
      return "Les frais de livraison doivent être un nombre positif";
    }
    return null;
  },

  fraisRetour: (value) => {
    if (!value.trim()) return "Les frais de retour sont requis";
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0) {
      return "Les frais de retour doivent être un nombre positif";
    }
    return null;
  },
};

const ClientTable = ({
  fullWidth = false,
  onAddClick,
  onCancel,
  incrementClientCount,
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
  const [availableCities, setAvailableCities] = useState([]);
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
    cin: "",
    codeTVA: "",
    gouvernorat: "",
    ville: "",
    localite: "",
    codePostal: "",
    adresse: "",
    fraisLivraison: "",
    fraisRetour: "",
    role: "CLIENT",
  });

  // Données mockées pour la démonstration
  const mockUsers = [
    {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
      nomShop: "Magasin Dupont",
      email: "jean.dupont@example.com",
      telephone1: "20 123 456",
      telephone2: "25 987 654",
      cin: "12345678",
      codeTVA: "1234567",
      gouvernorat: "tunis",
      ville: "la_medina",
      localite: "Centre",
      codePostal: "1000",
      adresse: "123 Rue Principale",
      fraisLivraison: "10.00",
      fraisRetour: "5.00",
      role: "CLIENT",
      client: { gouvernorat: "tunis" },
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Marie",
      nomShop: "Boutique Marie",
      email: "marie.martin@example.com",
      telephone1: "22 456 789",
      telephone2: "",
      cin: "87654321",
      codeTVA: "1987654",
      gouvernorat: "ariana",
      ville: "la_soukra",
      localite: "Cité Ennasr",
      codePostal: "2037",
      adresse: "456 Avenue Habib Bourguiba",
      fraisLivraison: "8.00",
      fraisRetour: "4.00",
      role: "CLIENT",
      client: { gouvernorat: "ariana" },
    },
  ];

  useEffect(() => {
    // Charger les données mockées pour la démonstration
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    const uniqueRegions = Array.from(
      new Set(
        mockUsers
          .filter((u) => u.client && u.client.gouvernorat)
          .map((u) => (u.client.gouvernorat || "").trim())
          .filter((g) => g)
      )
    );
    setRegions(uniqueRegions);
    // Commenter fetchClients pour utiliser mock data
    // fetchClients();
  }, []);

  const fetchClients = async () => {
    const token = localStorage.getItem("authToken");
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/users/allClients`, {
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
            .filter((u) => u.client && u.client.gouvernorat)
            .map((u) => (u.client.gouvernorat || "").trim())
            .filter((g) => g)
        )
      );
      setRegions(uniqueRegions);
    } catch (err) {
      alert(err.response?.data?.msg || "Erreur de chargement des clients");
    } finally {
      setIsLoading(false);
    }
  };

  // Validation en temps réel
  const validateField = (name, value) => {
    let error = null;

    if (name === "confirmPassword") {
      error = validators[name](value, newUser.password);
    } else if (name === "ville") {
      error = validators[name](value, newUser.gouvernorat);
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
      case "codePostal":
        return value.replace(/\D/g, "").substring(0, 4);
      case "nom":
      case "prenom":
      case "nomShop":
      case "localite":
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      case "email":
        return value.toLowerCase();
      case "fraisLivraison":
      case "fraisRetour":
        return value.replace(/[^0-9.]/g, "");
      default:
        return value;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatField(name, value);

    setNewUser((prev) => {
      const updatedUser = {
        ...prev,
        [name]: formattedValue,
      };
      // Reset ville when gouvernorat changes
      if (name === "gouvernorat") {
        updatedUser.ville = "";
        setAvailableCities(GOUVERNORAT_CITIES[value] || []);
      }
      return updatedUser;
    });

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
        const error = field === "ville" ? validators[field](newUser[field], newUser.gouvernorat) : validators[field](newUser[field]);
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
        nomShop: newUser.nomShop,
        email: newUser.email,
        nom: newUser.nom,
        password: newUser.password,
        prenom: newUser.prenom,
        codeTVA: newUser.codeTVA,
        telephone1: newUser.telephone1.replace(/\s+/g, ""),
        telephone2: newUser.telephone2 ? newUser.telephone2.replace(/\s+/g, "") : "",
        gouvernorat: newUser.gouvernorat,
        ville: newUser.ville,
        localite: newUser.localite,
        codePostal: newUser.codePostal,
        adresse: newUser.adresse,
        fraisRetour: parseFloat(newUser.fraisRetour),
        fraisLivraison: parseFloat(newUser.fraisLivraison),
        role: "CLIENT",
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
        nomShop: "",
        email: "",
        password: "",
        confirmPassword: "",
        telephone1: "",
        telephone2: "",
        cin: "",
        codeTVA: "",
        gouvernorat: "",
        ville: "",
        localite: "",
        codePostal: "",
        adresse: "",
        fraisRetour: "",
        fraisLivraison: "",
        role: "CLIENT",
      });
      setAvailableCities([]);
      setErrors({});
      setTouched({});
      if (incrementClientCount) {
        incrementClientCount();
      }
      if (onCancel) {
        onCancel();
      }
      alert("Client ajouté avec succès!");
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
      const gouvernorat = (user.client?.gouvernorat || "").toLowerCase().trim();
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
    navigate(`/edit-client/${user.id}`, { state: { user } });
  };

  const handleDeleteClient = (clientId) => {
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
          <p>Êtes-vous sûr de vouloir supprimer ce client ?</p>
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
                  await axios.delete(`${API_URL}/users/deleteUser/${clientId}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  setUsers((prevUsers) => prevUsers.filter((user) => user.id !== clientId));
                  setFilteredUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== clientId)
                  );
                  alert("Client supprimé avec succès!");
                } catch (error) {
                  const errorMessage =
                    error.response?.data?.msg ||
                    "Une erreur est survenue lors de la suppression du client";
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

  const roleStyle = {
    CLIENT: {
      background: "bg-green-500",
      text: "text-white",
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
              disabled={name === "ville" && !newUser.gouvernorat}
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

  // Afficher le label de la ville dans le modal
  const getCityLabel = (gouvernorat, ville) => {
    const cities = GOUVERNORAT_CITIES[gouvernorat] || [];
    const city = cities.find((c) => c.value === ville);
    return city ? city.label : ville || "-";
  };

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
            <h3 className="text-2xl font-semibold text-blue-400 mb-6">Ajouter un client</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Nom du magasin" name="nomShop" icon={Building} placeholder="Ex: Magasin Dupont" />
                <InputField label="Nom" name="nom" icon={User} placeholder="Ex: Dupont" />
                <InputField label="Prénom" name="prenom" icon={User} placeholder="Ex: Jean" />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  icon={Mail}
                  placeholder="Ex: jean.dupont@example.com"
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
                <InputField
                  label="Ville"
                  name="ville"
                  type="select"
                  icon={Home}
                  options={[{ value: "", label: "Sélectionner une ville" }, ...availableCities]}
                  placeholder="Sélectionner une ville"
                />
                <InputField label="Localité" name="localite" icon={Home} placeholder="Ex: Centre" />
                <InputField label="Code Postal" name="codePostal" icon={MapPin} placeholder="Ex: 1000" />
                <InputField label="Adresse" name="adresse" icon={Home} placeholder="Ex: 123 Rue Principale" />
                <InputField
                  label="Frais de Livraison"
                  name="fraisLivraison"
                  icon={Percent}
                  placeholder="Ex: 10.00"
                />
                <InputField label="Frais de Retour" name="fraisRetour" icon={Percent} placeholder="Ex: 5.00" />
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
            <h2 className="text-xl font-semibold text-gray-700">Clients</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Recherche CLIENT..."
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
                Ajouter un client
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
                      Aucun client trouvé
                    </td>
                  </tr>
                ) : (
                  currentItems.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-900">{`${user.prenom} ${user.nom}`}</td>
                      <td className="px-6 py-4 text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 text-gray-900">{user.telephone1}</td>
                      <td className="px-6 py-4 text-gray-900">
                        {user.client?.gouvernorat
                          ? user.client.gouvernorat.charAt(0).toUpperCase() + user.client.gouvernorat.slice(1)
                          : "-"}
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
                          onClick={() => handleDeleteClient(user.id)}
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
              <h3 className="text-2xl font-semibold text-gray-800">Détails du client</h3>
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
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Building className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nom du magasin</p>
                  <p className="font-medium text-gray-800">{selectedUser.nomShop}</p>
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
                    {selectedUser.client?.gouvernorat
                      ? selectedUser.client.gouvernorat.charAt(0).toUpperCase() +
                        selectedUser.client.gouvernorat.slice(1)
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Home className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ville</p>
                  <p className="font-medium text-gray-800">
                    {getCityLabel(selectedUser.client?.gouvernorat, selectedUser.ville)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Home className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Localité</p>
                  <p className="font-medium text-gray-800">{selectedUser.localite}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Code Postal</p>
                  <p className="font-medium text-gray-800">{selectedUser.codePostal}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Home className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium text-gray-800">{selectedUser.adresse}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Percent className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Frais de Livraison</p>
                  <p className="font-medium text-gray-800">{selectedUser.fraisLivraison}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Percent className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Frais de Retour</p>
                  <p className="font-medium text-gray-800">{selectedUser.fraisRetour}</p>
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