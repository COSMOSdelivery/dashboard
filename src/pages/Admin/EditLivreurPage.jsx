import Header from "../../components/common/Header";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import config from "../../config.json";
import { ClipLoader } from "react-spinners";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Percent,
  MapPin,
} from "lucide-react";

const API_URL = config.API_URL;

const EditLivreurPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [initialUser] = useState(
    state?.user || {
        nom: "",
        prenom: "",
        email: "",
        telephone1: "",
        telephone2: "",
        codeTVA: "",
        cin: "",
        gouvernorat: "",
    }
  );

  const [user, setUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!user.nom) newErrors.nom = "Le nom est requis.";
    if (!user.prenom) newErrors.prenom = "Le prénom est requis.";
    if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Veuillez entrer une adresse email valide.";
    }
    if (!user.telephone1 || !/^\d{8}$/.test(user.telephone1)) {
      newErrors.telephone1 = "Le téléphone principal doit contenir 8 chiffres.";
    }
    if (user.telephone2 && !/^\d{8}$/.test(user.telephone2)) {
      newErrors.telephone2 =
        "Le téléphone secondaire doit contenir 8 chiffres.";
    }
    if (!user.cin || !/^\d{8}$/.test(user.cin)) {
      newErrors.cin = "Le CIN doit contenir 8 chiffres.";
    }
    if (!user.gouvernorat) newErrors.gouvernorat = "Le gouvernorat est requis.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const notifySuccess = (message) => {
    toast.success(message, {
      icon: "✅",
      style: {
        background: "rgb(255, 255, 255)",
        color: "#2E7D32",
        fontWeight: "normal",
        borderRadius: "8px",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
        padding: "10px 20px",
      },
      duration: 4000,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasChanged = Object.keys(user).some(
      (key) => user[key] !== initialUser[key]
    );

    if (!hasChanged) {
      navigate("/users");
      setTimeout(() => {
        toast.error("Aucune modification n'a été effectuée.");
      }, 500);
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `${API_URL}/users/updateUser/${user.id}`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setTimeout(() => {
          notifySuccess("Le livreur est modifié avec succès !");
        }, 500);
        navigate("/users", { state: { updatedUser: response.data } });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Erreur lors de la mise à jour du livreur";
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
        <Header title="Modifier le client" />
  
        {errors.submit && (
          <p className="text-red-500 mb-4 text-center">{errors.submit}</p>
        )}
  
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-black-700">Nom</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="nom"
                  value={user.nom}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full pl-10 px-4 py-2 border ${
                    errors.nom ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
              {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
            </div>
            <div>
              <label className="block text-black-700">Prénom</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="prenom"
                  value={user.prenom}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full pl-10 px-4 py-2 border ${
                    errors.prenom ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
              {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
            </div>
          </div>
  
          <div>
            <label className="block text-black-700">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full pl-10 px-4 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
  
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-black-700">Téléphone principal</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="telephone1"
                  value={user.telephone1}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full pl-10 px-4 py-2 border ${
                    errors.telephone1 ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
              {errors.telephone1 && <p className="text-red-500 text-sm mt-1">{errors.telephone1}</p>}
            </div>
            <div>
              <label className="block text-black-700">Téléphone secondaire (optionnel)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="telephone2"
                  value={user.telephone2 || ""}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full pl-10 px-4 py-2 border ${
                    errors.telephone2 ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              {errors.telephone2 && <p className="text-red-500 text-sm mt-1">{errors.telephone2}</p>}
            </div>
          </div>
  
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-black-700">Code TVA</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Percent className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="codeTVA"
                  value={user.codeTVA}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full pl-10 px-4 py-2 border ${
                    errors.codeTVA ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
              {errors.codeTVA && <p className="text-red-500 text-sm mt-1">{errors.codeTVA}</p>}
            </div>
            <div>
              <label className="block text-black-700">CIN</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="cin"
                  value={user.cin}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full pl-10 px-4 py-2 border ${
                    errors.cin ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
              {errors.cin && <p className="text-red-500 text-sm mt-1">{errors.cin}</p>}
            </div>
          </div>
  
          <div>
            <label className="block text-black-700">Gouvernorat</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="gouvernorat"
                value={user.gouvernorat}
                onChange={handleInputChange}
                className={`mt-1 block w-full pl-10 px-4 py-2 border ${
                  errors.gouvernorat ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              >
                <option value="" disabled>Sélectionner un gouvernorat</option>
                <option value="Ariana">Ariana</option>
                <option value="Tunis">Tunis</option>
                <option value="Mannouba">Mannouba</option>
                <option value="Ben Arous">Ben Arous</option>
              </select>
            </div>
            {errors.gouvernorat && <p className="text-red-500 text-sm mt-1">{errors.gouvernorat}</p>}
          </div>
  
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? <ClipLoader size={20} color="#ffffff" /> : "Enregistrer"}
            </button>
          </div>
        </form>
        <Toaster
          position="top-right"
          containerStyle={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
          }}
        />
      </div>
    );
  };
  
  export default EditLivreurPage;