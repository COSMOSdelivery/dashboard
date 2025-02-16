import Header from "../../components/common/Header";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import config from "../../config.json";
import { ClipLoader } from "react-spinners";
import { User, Mail, Phone, CreditCard, Percent } from "lucide-react";

const API_URL = config.API_URL;

const EditAdminPage = () => {
  const { state } = useLocation(); // Get user data passed from previous page
  const navigate = useNavigate();
  const [initialUser,] = useState(state?.user || {
    nom: "",
    prenom: "",
    email: "",
    telephone1: "",
    telephone2: "",
    cin: "",
    codeTVA: "",

  });
  const [user, setUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation des champs
  const validateForm = () => {
    const newErrors = {};
    
    // Validation du nom
    if (!user.nom) newErrors.nom = "Le nom est requis.";
  
    // Validation du prénom
    if (!user.prenom) newErrors.prenom = "Le prénom est requis.";
  
    // Validation de l'email
    if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Veuillez entrer une adresse email valide.";
    }
  
    // Validation du téléphone principal (exactement 8 chiffres)
    if (!user.telephone1 || !/^\d{8}$/.test(user.telephone1)) {
      newErrors.telephone1 = "Le téléphone principal doit contenir 8 chiffres.";
    }
  
    // Validation du téléphone secondaire (exactement 8 chiffres, si rempli)
    if (user.telephone2 && !/^\d{8}$/.test(user.telephone2)) {
      newErrors.telephone2 = "Le téléphone secondaire doit contenir 8 chiffres.";
    }
  
    // Validation du CIN (exactement 8 chiffres)
    if (!user.cin || !/^\d{8}$/.test(user.cin)) {
      newErrors.cin = "Le CIN doit contenir 8 chiffres.";
    }
  
    // Validation du code TVA
    if (!user.codeTVA) newErrors.codeTVA = "Le code TVA est requis.";
  
    // Mettre à jour les erreurs
    setErrors(newErrors);
  
    // Retourner true si aucune erreur n'est trouvée
    return Object.keys(newErrors).length === 0;
  };
  const notifySuccess = (message) => {
    toast.success(message, {
      icon: "✅", // Icône personnalisée
      style: {
        background: "rgb(255, 255, 255)", // Couleur de fond similaire à l'image
        color: "#2E7D32", // Texte vert
        fontWeight: "normal", // Police régulière
        borderRadius: "8px", // Coins arrondis
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)", // Ombre légère
        padding: "10px 20px", // Espacement intérieur
      },
      duration: 4000, // Durée d'affichage de la notification
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Vérifier si les données ont changé
    const hasChanged = Object.keys(user).some((key) => user[key] !== initialUser[key]);
  
    if (!hasChanged) {
     
      navigate("/users");
      setTimeout(() => {
        toast.error("Aucune modification n'a été effectuée.");
      }, 500); // Délai de 500 ms pour s'assurer que le formulaire est fermé
      return;
    }
  
    if (!validateForm()) return;
  
    setIsLoading(true);
    setErrors({});
  
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(`${API_URL}/users/updateUser/${user.id}`, user, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        setTimeout(() => {
          notifySuccess("L'admin est modifié avec success !");
        }, 500); // Délai de 500 ms pour s'assurer que le formulaire est fermé
          navigate("/users", { state: { updatedUser: response.data } });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erreur lors de la mise à jour de l'administrateur";
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 p-6 bg-gray-100">
      <Header title="Modifier l'administrateur" />

      {errors.submit && <p className="text-red-500 mb-4 text-center">{errors.submit}</p>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Nom"
            name="nom"
            value={user.nom}
            onChange={handleInputChange}
            error={errors.nom}
            icon={<User className="h-5 w-5" />} // Icône à l'intérieur du champ
            required
          />
          <FormField
            label="Prénom"
            name="prenom"
            value={user.prenom}
            onChange={handleInputChange}
            error={errors.prenom}
            icon={<User className="h-5 w-5" />} // Icône à l'intérieur du champ
            required
          />
        </div>

        <FormField
          label="Email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleInputChange}
          error={errors.email}
          icon={<Mail className="h-5 w-5" />} // Icône à l'intérieur du champ
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Téléphone principal"
            name="telephone1"
            value={user.telephone1}
            onChange={handleInputChange}
            error={errors.telephone1}
            icon={<Phone className="h-5 w-5" />} // Icône à l'intérieur du champ
            required
          />
          <FormField
            label="Téléphone secondaire (optionnel)"
            name="telephone2"
            value={user.telephone2 || ""}
            onChange={handleInputChange}
            error={errors.telephone2}
            icon={<Phone className="h-5 w-5" />} // Icône à l'intérieur du champ
          />
        </div>

        <FormField
          label="CIN"
          name="cin"
          value={user.cin}
          onChange={handleInputChange}
          error={errors.cin}
          icon={<CreditCard className="h-5 w-5" />} // Icône à l'intérieur du champ
          required
        />

        <FormField
          label="Code TVA"
          name="codeTVA"
          value={user.codeTVA}
          onChange={handleInputChange}
          error={errors.codeTVA}
          icon={<Percent className="h-5 w-5" />} // Icône à l'intérieur du champ
          required
        />

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <ClipLoader size={20} color="#ffffff" /> : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Composant réutilisable pour les champs de formulaire avec icône
const FormField = ({ label, name, type = "text", value, onChange, error, icon, required }) => (
  <div className="flex flex-col space-y-2">
    <label className="block text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {icon} {/* Icône à l'intérieur du champ */}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 px-4 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
        required={required}
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    <Toaster
        position="top-right"
        containerStyle={{
          position: "fixed",
          top: "1rem", // Ajustez la distance par rapport au haut de l'écran
          right: "1rem", // Ajustez la distance par rapport au côté droit de l'écran
        }}
    />
  </div>
);

export default EditAdminPage;