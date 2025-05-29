
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  User,
  Phone,
  MapPin,
  Home,
  CreditCard,
  Package,
  Info,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

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
    if (!value && value !== 0) return "Le prix est requis";
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      return "Le prix doit être un nombre positif";
    }
    return null;
  },
  nbArticles: (value) => {
    if (!value && value !== 0) return "Le nombre d'articles est requis";
    const numericValue = parseInt(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      return "Le nombre d'articles doit être un entier positif";
    }
    return null;
  },
  codeBarreEchange: (value, isEchangePossible) => {
    if (isEchangePossible && !value) return "Le code à barre d'échange est requis";
    if (value && String(value).trim().length < 2) return "Le code à barre doit contenir au moins 2 caractères";
    return null;
  },
  nbArticlesEchange: (value, isEchangePossible) => {
    if (isEchangePossible && !value && value !== 0) return "Le nombre d'articles d'échange est requis";
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
            value={formData[name] || ""}
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
            value={formData[name] || ""}
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
  initialData = null,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
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
      modePaiement: "ESPECE",
    }
  );
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [availableCities, setAvailableCities] = useState(
    initialData?.gouvernorat ? GOUVERNORAT_CITIES[initialData.gouvernorat] || [] : []
  );

  useEffect(() => {
    if (initialData?.gouvernorat) {
      setAvailableCities(GOUVERNORAT_CITIES[initialData.gouvernorat] || []);
    }
  }, [initialData]);

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
      case "codeBarreEchange":
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
      } else if (field === "possibleOuvrir" || field === "possibleEchange" || field === "modePaiement") {
        return;
      } else {
        const error = validators[field](formData[field]);
        if (error) {
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
      <CardHeader>
        <CardTitle>{isEditing ? "Modifier la commande" : "Nouvelle commande"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="Ex: 123456"
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
              <InputField
                label="Mode de Paiement"
                name="modePaiement"
                type="select"
                icon={CreditCard}
                placeholder="Sélectionner un mode de paiement"
                formData={formData}
                touched={touched}
                formErrors={formErrors}
                handleInputChange={handleInputChange}
                handleBlur={handleBlur}
                availableCities={[
                  { value: "ESPECE", label: "Espèces" },
                  { value: "CARTE", label: "Carte" },
                  { value: "VIREMENT", label: "Virement" },
                ]}
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
            {isEditing ? "Mettre à jour" : "Enregistrer la commande"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default OrderForm;
