import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import {
  ShoppingCart,
  Eye,
  User,
  Phone,
  MapPin,
  Home,
  CreditCard,
  Package,
  Info,
  Search,
  Plus,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Printer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import config from "../../config.json";

const API_URL = config.API_URL;

// Liste des gouvernorats
const GOUVERNORATS = [
  { value: "ariana", label: "Ariana" },
  { value: "tunis", label: "Tunis" },
  { value: "manouba", label: "Manouba" },
  { value: "ben_arous", label: "Ben Arous" },
];

// Mapping des gouvernorats aux villes
const GOUVERNORAT_CITIES = {
  ariana: [
    { value: "ariana", label: "Ariana" },
    { value: "raoued", label: "Raoued" },
    { value: "sidi_thabet", label: "Sidi Thabet" },
    { value: "kalâat_l_andalous", label: "Kalâat l’Andalous" },
    { value: "la_soukra", label: "La Soukra" },
    { value: "borj_louzir", label: "Borj Louzir" },
    { value: "mnihla", label: "Mnihla" },
  ],
  tunis: [
    { value: "tunis", label: "Tunis" },
    { value: "la_marsa", label: "La Marsa" },
    { value: "carthage", label: "Carthage" },
    { value: "le_bardo", label: "Le Bardo" },
    { value: "sidi_bou_said", label: "Sidi Bou Saïd" },
    { value: "le_kram", label: "Le Kram" },
    { value: "la_goulette", label: "La Goulette" },
    { value: "sidi_hassine", label: "Sidi Hassine" },
    { value: "el_ouardia", label: "El Ouardia" },
    { value: "ezzouhour", label: "Ezzouhour" },
    { value: "bab_bhar", label: "Bab Bhar" },
    { value: "bab_souika", label: "Bab Souika" },
    { value: "cite_el_khadra", label: "Cité El Khadra" },
    { value: "jebel_jelloud", label: "Jebel Jelloud" },
    { value: "kabaria", label: "Kabaria" },
    { value: "medina", label: "Médina" },
  ],
  manouba: [
    { value: "manouba", label: "Manouba" },
    { value: "den_den", label: "Den Den" },
    { value: "douar_hicher", label: "Douar Hicher" },
    { value: "tebourba", label: "Tebourba" },
    { value: "bousalem", label: "Bousalem" },
    { value: "el_battan", label: "El Battan" },
    { value: "jedaida", label: "Jedaida" },
    { value: "mornag", label: "Mornag" },
    { value: "oued_ellil", label: "Oued Ellil" },
  ],
  ben_arous: [
    { value: "ben_arous", label: "Ben Arous" },
    { value: "hammam_lif", label: "Hammam Lif" },
    { value: "hammam_chott", label: "Hammam Chott" },
    { value: "ezzahra", label: "Ezzahra" },
    { value: "rades", label: "Radès" },
    { value: "megrine", label: "Mégrine" },
    { value: "bou_mhel_el_bassatine", label: "Bou Mhel El Bassatine" },
    { value: "fouchana", label: "Fouchana" },
    { value: "mohammedia", label: "Mohammedia" },
    { value: "el_mourouj", label: "El Mourouj" },
    { value: "khalidia", label: "Khalidia" },
  ],
};

// Fonctions de validation
const validators = {
  nomPrioritaire: (value) => {
    if (!value.trim()) return "Le nom est requis";
    if (value.trim().length < 2) return "Le nom doit contenir au moins 2 caractères";
    if (!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\s-']+$/.test(value)) {
      return "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes";
    }
    return null;
  },
  prenomPrioritaire: (value) => {
    if (!value.trim()) return "Le prénom est requis";
    if (value.trim().length < 2) return "Le prénom doit contenir au moins 2 caractères";
    if (!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\s-']+$/.test(value)) {
      return "Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes";
    }
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
  adresse: (value) => {
    if (!value.trim()) return "L'adresse est requise";
    if (value.trim().length < 5) return "L'adresse doit contenir au moins 5 caractères";
    return null;
  },
  gouvernorat: (value) => {
    if (!value) return "Le gouvernorat est requis";
    if (!GOUVERNORATS.some(g => g.value === value)) return "Gouvernorat invalide";
    return null;
  },
  ville: (value, gouvernorat) => {
    if (!value) return "La ville est requise";
    if (gouvernorat && !GOUVERNORAT_CITIES[gouvernorat]?.some(c => c.value === value)) {
      return "Ville invalide pour le gouvernorat sélectionné";
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
  designation: (value) => {
    if (!value.trim()) return "La désignation est requise";
    if (value.trim().length < 2) return "La désignation doit contenir au moins 2 caractères";
    return null;
  },
  prix: (value) => {
    if (!value.trim()) return "Le prix est requis";
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      return "Le prix doit être un nombre positif";
    }
    return null;
  },
  nbArticles: (value) => {
    if (!value.trim()) return "Le nombre d'articles est requis";
    const numericValue = parseInt(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      return "Le nombre d'articles doit être un entier positif";
    }
    return null;
  },
  codeBarreEchange: (value, isEchangePossible) => {
    if (isEchangePossible && !value.trim()) return "Le code à barre d'échange est requis";
    if (value && value.trim().length < 2) return "Le code à barre doit contenir au moins 2 caractères";
    return null;
  },
  nbArticlesEchange: (value, isEchangePossible) => {
    if (isEchangePossible && !value.trim()) return "Le nombre d'articles d'échange est requis";
    if (value) {
      const numericValue = parseInt(value);
      if (isNaN(numericValue) || numericValue <= 0) {
        return "Le nombre d'articles d'échange doit être un entier positif";
      }
    }
    return null;
  },
};

// Composant InputField
const InputField = ({
  label,
  name,
  type = "text",
  required = true,
  icon: Icon,
  placeholder,
  formData,
  touched,
  formErrors,
  handleInputChange,
  handleBlur,
  availableCities = [],
  disabled = false,
}) => {
  const hasError = touched[name] && formErrors[name];
  const isValid = touched[name] && !formErrors[name] && formData[name];

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        {type === "select" ? (
          <Select
            name={name}
            value={formData[name]}
            onValueChange={(value) =>
              handleInputChange({ target: { name, value } })
            }
            required={required}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              className={`pl-10 ${hasError ? "border-red-500" : isValid ? "border-green-500" : ""}`}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {(name === "gouvernorat" ? GOUVERNORATS : availableCities).map(
                (option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        ) : type === "textarea" ? (
          <Textarea
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`pl-10 min-h-[100px] ${hasError ? "border-red-500" : isValid ? "border-green-500" : ""}`}
            required={required}
          />
        ) : (
          <Input
            id={name}
            name={name}
            type={type}
            value={formData[name]}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`pl-10 ${hasError ? "border-red-500" : isValid ? "border-green-500" : ""}`}
            required={required}
          />
        )}
        {Icon && (
          <Icon
            className={`absolute left-3 top-3 h-5 w-5 ${hasError ? "text-red-400" : isValid ? "text-green-400" : "text-gray-400"}`}
          />
        )}
        {hasError && (
          <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-400" />
        )}
        {isValid && (
          <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-400" />
        )}
      </div>
      {hasError && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {formErrors[name]}
        </p>
      )}
    </div>
  );
};

// Composant OrderForm
const OrderForm = ({
  onSubmit,
  onCancel,
  isEchangePossible,
  setIsEchangePossible,
}) => {
  const [formData, setFormData] = useState({
    nomPrioritaire: "",
    prenomPrioritaire: "",
    telephone1: "",
    telephone2: "",
    adresse: "",
    gouvernorat: "",
    ville: "",
    localite: "",
    codePostal: "",
    designation: "",
    prix: "",
    nbArticles: "",
    possibleOuvrir: false,
    possibleEchange: isEchangePossible,
    codeBarreEchange: "",
    nbArticlesEchange: "",
    remarque: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [availableCities, setAvailableCities] = useState([]);

  const formatField = (name, value) => {
    switch (name) {
      case "telephone1":
      case "telephone2":
        const cleanPhone = value.replace(/\D/g, "");
        if (cleanPhone.length <= 8) {
          return cleanPhone.replace(/(\d{2})(\d{3})(\d{3})/, "$1 $2 $3").trim();
        }
        return cleanPhone
          .substring(0, 8)
          .replace(/(\d{2})(\d{3})(\d{3})/, "$1 $2 $3");
      case "codePostal":
        return value.replace(/\D/g, "").substring(0, 4);
      case "nomPrioritaire":
      case "prenomPrioritaire":
      case "localite":
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      case "prix":
        return value.replace(/[^0-9.]/g, "");
      case "nbArticles":
      case "nbArticlesEchange":
        return value.replace(/[^0-9]/g, "");
      default:
        return value;
    }
  };

  const validateField = (name, value) => {
    let error = null;
    if (name === "ville") {
      error = validators[name](value, formData.gouvernorat);
    } else if (name === "codeBarreEchange" || name === "nbArticlesEchange") {
      error = validators[name](value, isEchangePossible);
    } else if (validators[name]) {
      error = validators[name](value);
    }
    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
    return error === null;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const formattedValue = type === "checkbox" ? checked : formatField(name, value);

    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: formattedValue,
      };
      if (name === "gouvernorat") {
        updatedData.ville = "";
        setAvailableCities(GOUVERNORAT_CITIES[value] || []);
      }
      return updatedData;
    });

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    if (touched[name] || value || type === "checkbox") {
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

    Object.keys(formData).forEach((field) => {
      if (field === "telephone2" || field === "remarque") return;
      if (field === "codeBarreEchange" || field === "nbArticlesEchange") {
        const error = validators[field](formData[field], isEchangePossible);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      } else if (field === "possibleOuvrir" || field === "possibleEchange") {
        return;
      } else {
        const error = validateField(field, formData[field]);
        if (!error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    setFormErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstErrorField = Object.keys(formErrors).find(
        (key) => formErrors[key]
      );
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    await onSubmit(e, formData);
  };

  return (
    <Card className="p-6 bg-white rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Informations personnelles
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Nom"
                  name="nomPrioritaire"
                  icon={User}
                  placeholder="Ex: Dupont"
                  formData={formData}
                  touched={touched}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                />
                <InputField
                  label="Prénom"
                  name="prenomPrioritaire"
                  icon={User}
                  placeholder="Ex: Jean"
                  formData={formData}
                  touched={touched}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Téléphone 1"
                  name="telephone1"
                  type="tel"
                  icon={Phone}
                  placeholder="Ex: 20 123 456"
                  formData={formData}
                  touched={touched}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                />
                <InputField
                  label="Téléphone 2 (Optionnel)"
                  name="telephone2"
                  type="tel"
                  icon={Phone}
                  placeholder="Ex: 25 987 654"
                  required={false}
                  formData={formData}
                  touched={touched}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                />
              </div>
              <InputField
                label="Adresse"
                name="adresse"
                icon={Home}
                placeholder="Ex: 123 Rue Principale"
                formData={formData}
                touched={touched}
                formErrors={formErrors}
                handleInputChange={handleInputChange}
                handleBlur={handleBlur}
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Gouvernorat"
                  name="gouvernorat"
                  type="select"
                  icon={MapPin}
                  placeholder="Sélectionner un gouvernorat"
                  formData={formData}
                  touched={touched}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                />
                <InputField
                  label="Ville"
                  name="ville"
                  type="select"
                  icon={MapPin}
                  placeholder="Sélectionner une ville"
                  formData={formData}
                  touched={touched}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                  availableCities={availableCities}
                  disabled={!formData.gouvernorat}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Localité"
                  name="localite"
                  icon={MapPin}
                  placeholder="Ex: Centre"
                  formData={formData}
                  touched={touched}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                />
                <InputField
                  label="Code Postal"
                  name="codePostal"
                  icon={CreditCard}
                  placeholder="Ex: 1000"
                  formData={formData}
                  touched={touched}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                />
              </div>
            </div>
          </div>

          {/* Détails de la commande */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Détails de la commande
            </h2>
            <div className="space-y-4">
              <InputField
                label="Désignation"
                name="designation"
                icon={Package}
                placeholder="Ex: Produit XYZ"
                formData={formData}
                touched={touched}
                formErrors={formErrors}
                handleInputChange={handleInputChange}
                handleBlur={handleBlur}
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Prix"
                  name="prix"
                  type="number"
                  icon={CreditCard}
                  placeholder="Ex: 10.00"
                  step="0.01"
                  formData={formData}
                  touched={touched}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                />
                <InputField
                  label="Nombre d'Articles"
                  name="nbArticles"
                  type="number"
                  icon={Package}
                  placeholder="Ex: 1"
                  formData={formData}
                  touched={touched}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  handleBlur={handleBlur}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="possibleOuvrir"
                    name="possibleOuvrir"
                    checked={formData.possibleOuvrir}
                    onCheckedChange={(checked) =>
                      handleInputChange({
                        target: { name: "possibleOuvrir", type: "checkbox", checked },
                      })
                    }
                  />
                  <Label htmlFor="possibleOuvrir">Possible d'Ouvrir</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="possibleEchange"
                    name="possibleEchange"
                    checked={isEchangePossible}
                    onCheckedChange={(checked) => {
                      setIsEchangePossible(checked);
                      handleInputChange({
                        target: { name: "possibleEchange", type: "checkbox", checked },
                      });
                    }}
                  />
                  <Label htmlFor="possibleEchange">Possible d'Échange</Label>
                </div>
              </div>
              {isEchangePossible && (
                <div className="space-y-4">
                  <InputField
                    label="Code à Barre Échange"
                    name="codeBarreEchange"
                    icon={CreditCard}
                    placeholder="Ex: ABC123"
                    formData={formData}
                    touched={touched}
                    formErrors={formErrors}
                    handleInputChange={handleInputChange}
                    handleBlur={handleBlur}
                  />
                  <InputField
                    label="Nombre d'Articles Échange"
                    name="nbArticlesEchange"
                    type="number"
                    icon={Package}
                    placeholder="Ex: 1"
                    formData={formData}
                    touched={touched}
                    formErrors={formErrors}
                    handleInputChange={handleInputChange}
                    handleBlur={handleBlur}
                  />
                </div>
              )}
              <InputField
                label="Remarque (Optionnel)"
                name="remarque"
                type="textarea"
                icon={Info}
                placeholder="Ex: Instructions spécifiques"
                required={false}
                formData={formData}
                touched={touched}
                formErrors={formErrors}
                handleInputChange={handleInputChange}
                handleBlur={handleBlur}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={Object.values(formErrors).some((error) => error)}
          >
            Enregistrer la commande
          </Button>
        </div>
      </form>
    </Card>
  );
};

// Composant OrdersTable
const OrdersTable = ({ commandes, onViewDetails }) => {
  const getCityLabel = (gouvernorat, ville) => {
    const cities = GOUVERNORAT_CITIES[gouvernorat?.toLowerCase()] || [];
    const city = cities.find((c) => c.value === ville);
    return city ? city.label : ville || "-";
  };

  const handlePrint = async (commande) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/command/${commande.code_a_barre}/print`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Important for handling binary data (PDF)
      });

      // Create a blob URL for the PDF
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      // Open the PDF in a new window
      const printWindow = window.open(fileURL);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      } else {
        // Fallback: trigger download if pop-up is blocked
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = `commande_${commande.code_a_barre}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Clean up the blob URL
      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error('Erreur lors de l\'impression de la commande:', error);
      alert(error.response?.data?.error || "Erreur lors de l'impression de la commande");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Commande
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Client
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Ville
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Prix
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              État
            </th>
            <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {commandes.map((commande) => (
            <tr key={commande.code_a_barre} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{commande.code_a_barre}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {commande.nom_prioritaire} {commande.prenom_prioritaire}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getCityLabel(commande.gouvernorat, commande.ville)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {commande.prix.toFixed(2)} TND
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  variant={
                    commande.etat === "delivered"
                      ? "default"
                      : commande.etat === "EN_ATTENTE"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {commande.etat}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <Button
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-800 mr-2"
                  onClick={() => onViewDetails(commande)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => handlePrint(commande)}
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Composant CommandeDetailsModal
const CommandeDetailsModal = ({ commande, onClose }) => {
  const getCityLabel = (gouvernorat, ville) => {
    const cities = GOUVERNORAT_CITIES[gouvernorat?.toLowerCase()] || [];
    const city = cities.find((c) => c.value === ville);
    return city ? city.label : ville || "-";
  };

  if (!commande) return null;

  return (
    <Dialog open={!!commande} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-500" />
            Détails de la commande #{commande.code_a_barre}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">
                  {commande.nom_prioritaire} {commande.prenom_prioritaire}
                </p>
                <p className="text-sm text-gray-600">{commande.telephone1}</p>
                <p className="text-sm text-gray-600">
                  {commande.adresse}, {getCityLabel(commande.gouvernorat, commande.ville)},{" "}
                  {commande.gouvernorat}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Détails de la commande */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">Désignation: {commande.designation}</p>
                <p className="text-sm text-gray-600">
                  Prix: {commande.prix.toFixed(2)} TND
                </p>
                <p className="text-sm text-gray-600">
                  Nombre d'articles: {commande.nb_article}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">État:</p>
                  <Badge
                    variant={
                      commande.etat === "delivered"
                        ? "default"
                        : commande.etat === "EN_ATTENTE"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {commande.etat}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Remarque: {commande.remarque || "Aucune remarque"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section échange (si applicable) */}
          {commande.possible_echange && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Échange</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Code à barre d'échange: {commande.code_a_barre_echange || "-"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Nombre d'articles d'échange: {commande.nb_article_echange || "-"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-end">
          <Button onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Composant MyOrders
const MyOrders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("commandes");
  const [showForm, setShowForm] = useState(false);
  const [isEchangePossible, setIsEchangePossible] = useState(false);
  const [commandes, setCommandes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCommande, setSelectedCommande] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get("filter") || "all";
    setFilter(filterParam);
  }, [location.search]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    navigate(`/my-orders?filter=${newFilter}`, { replace: true });
  };

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(`${API_URL}/command/clientAllCommands`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCommandes(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur de chargement des commandes");
    }
  };

  const handleAddCommande = async (e, formData) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    const commandeData = {
      nom_prioritaire: formData.nomPrioritaire,
      prenom_prioritaire: formData.prenomPrioritaire,
      gouvernorat: formData.gouvernorat,
      ville: formData.ville,
      localite: formData.localite,
      codePostal: formData.codePostal,
      adresse: formData.adresse,
      telephone1: formData.telephone1.replace(/\s+/g, ""),
      telephone2: formData.telephone2 ? formData.telephone2.replace(/\s+/g, "") : null,
      designation: formData.designation,
      prix: parseFloat(formData.prix),
      nb_article: parseInt(formData.nbArticles),
      possible_ouvrir: formData.possibleOuvrir,
      possible_echange: isEchangePossible,
      remarque: formData.remarque || null,
      code_a_barre_echange: isEchangePossible ? formData.codeBarreEchange : null,
      nb_article_echange: isEchangePossible
        ? parseInt(formData.nbArticlesEchange)
        : null,
      mode_paiement: "ESPECE",
    };

    try {
      await axios.post(`${API_URL}/command`, commandeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await fetchCommands();
      setShowForm(false);
      alert("Commande ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la commande:", error);
      alert(
        error.response?.data?.msg || "Erreur lors de l'ajout de la commande"
      );
    }
  };

  const handleViewDetails = (commande) => {
    setSelectedCommande(commande);
  };

  const filteredCommandes = commandes.filter((commande) => {
    if (!commande) return false;

    const searchMatches =
      searchTerm.toLowerCase().trim() === "" ||
      (commande.nom_prioritaire &&
        commande.nom_prioritaire
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (commande.prenom_prioritaire &&
        commande.prenom_prioritaire
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (commande.ville &&
        commande.ville.toLowerCase().includes(searchTerm.toLowerCase()));

    const filterMatches = filter === "all" || commande.etat === filter;

    return searchMatches && filterMatches;
  });

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {error && (
        <div className="mb-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <Header title="Mes Commandes" />
      <div className="flex justify-between items-center mb-8">
        {!showForm && (
          <div className="mt-8">
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-3"
            >
              <Plus className="h-4 w-4" />
              Nouvelle Commande
            </Button>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8">
          <button
            onClick={() => {
              setActiveTab("commandes");
              setShowForm(false);
            }}
            className={`pb-4 px-2 -mb-px font-medium text-sm transition-colors duration-200 ${
              activeTab === "commandes"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Commandes en cours
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {showForm ? (
          <OrderForm
            onSubmit={handleAddCommande}
            onCancel={() => setShowForm(false)}
            isEchangePossible={isEchangePossible}
            setIsEchangePossible={setIsEchangePossible}
          />
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Rechercher une commande..."
                      className="pl-10 w-full sm:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filtrer par état" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les états</SelectItem>
                      <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                      <SelectItem value="A_ENLEVER">À Enlever</SelectItem>
                      <SelectItem value="AU_DEPOT">Enlevé</SelectItem>
                      <SelectItem value="RETOUR_DEPOT">Retour Dépôt</SelectItem>
                      <SelectItem value="EN_COURS">En cours</SelectItem>
                      <SelectItem value="A_VERIFIER">À vérifier</SelectItem>
                      <SelectItem value="LIVRES">Livrées</SelectItem>
                      <SelectItem value="LIVRES_PAYE">Livrées payées</SelectItem>
                      <SelectItem value="ECHANGE">Échange</SelectItem>
                      <SelectItem value="RETOUR_DEFINITIF">
                        Retour Définitif
                      </SelectItem>
                      <SelectItem value="RETOUR_INTER_AGENCE">
                        Retour Inter-Agence
                      </SelectItem>
                      <SelectItem value="RETOUR_EXPEDITEURS">
                        Retour Expéditeurs
                      </SelectItem>
                      <SelectItem value="RETOUR_RECU_PAYE">
                        Retour Reçu Payé
                      </SelectItem>
                      <SelectItem value="delivered">Livrées</SelectItem>
                      <SelectItem value="canceled">Annulées</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {activeTab === "commandes" ? (
              filteredCommandes.length > 0 ? (
                <OrdersTable
                  commandes={filteredCommandes}
                  onViewDetails={handleViewDetails}
                />
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Aucune commande
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Commencez par créer une nouvelle commande.
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-900">
                  Aucune commande abandonnée
                </h3>
              </div>
            )}
          </>
        )}
      </div>

      <CommandeDetailsModal
        commande={selectedCommande}
        onClose={() => setSelectedCommande(null)}
      />
    </div>
  );
};

export default MyOrders;