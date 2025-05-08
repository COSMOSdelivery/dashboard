import { useState, useEffect, useRef } from "react";
import { User, X, Upload, Check, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SettingSection from "./SettingSection";
import config from "../../config.json";

const API_URL = config.API_URL;

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "Ferjani Moemen",
    email: "moemen.ferjeni@example.com",
    imageUrl: "/placeholder-profile.jpg",
  });

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleViewImage = () => {
    setImageModalOpen(true);
    setMenuOpen(false);
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(`${API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token.trim()}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          const imageUrl = data.profile.imageUrl?.startsWith("uploads/")
            ? `${API_URL.replace(/\/api\/v1$/, "")}/${data.profile.imageUrl}`
            : data.profile.imageUrl || profile.imageUrl;

          setProfile({
            name: `${data.profile.nom} ${data.profile.prenom}`,
            email: data.profile.email,
            imageUrl,
          });
        }
      } catch (error) {
        toast.error(error.message);
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

    if (file.size > MAX_FILE_SIZE) {
      toast.error("La taille du fichier ne doit pas dépasser 5MB");
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Seules les images JPG, PNG et GIF sont autorisées");
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    const uploadPromise = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found");

        const formData = new FormData();
        formData.append("image", selectedImage);

        const response = await fetch(`${API_URL}/users/upload-profile-image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const baseUrl = API_URL.replace(/\/api\/v1$/, "");
        const imageUrl = `${baseUrl}/uploads/${data.imageUrl.split("/").pop()}`;

        setProfile(prev => ({ ...prev, imageUrl }));
        setSelectedImage(null);
        setPreview(null);
        setMenuOpen(false);
        resolve("Photo de profil mise à jour avec succès!");
      } catch (error) {
        console.error("Image upload error:", error);
        reject(error.message);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(
      uploadPromise,
      {
        loading: 'Mise à jour de la photo...',
        success: (message) => message,
        error: (error) => `Erreur: ${error}`
      }
    );
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
    setMenuOpen(false);
  };

  const handleRemoveImage = () => {
    const removePromise = new Promise((resolve) => {
      setProfile(prev => ({
        ...prev,
        imageUrl: "/placeholder-profile.jpg"
      }));
      setMenuOpen(false);
      resolve();
    });

    toast.promise(
      removePromise,
      {
        loading: 'Suppression de la photo...',
        success: 'Photo de profil supprimée',
        error: 'Erreur lors de la suppression'
      }
    );
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    const changePasswordPromise = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(`${API_URL}/users/changePassword`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setPasswordModalOpen(false);
          resolve("Mot de passe mis à jour avec succès!");
        }
      } catch (error) {
        console.error("Password change error:", error);
        reject(error.message);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(
      changePasswordPromise,
      {
        loading: 'Mise à jour du mot de passe...',
        success: (message) => message,
        error: (error) => `Erreur: ${error}`
      }
    );
  };

  return (
    <SettingSection icon={User} title="Profile">
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <button 
                onClick={toggleMenu}
                className="relative focus:outline-none"
                aria-label="Toggle profile image menu"
              >
                <img
                  src={preview || profile.imageUrl}
                  alt={`${profile.name}'s profile`}
                  className="rounded-full w-24 h-24 object-cover ring-2 ring-offset-2 ring-gray-100 transition-all duration-200 group-hover:ring-blue-500"
                  onError={(e) => {
                    e.target.src = "/placeholder-profile.jpg";
                  }}
                />
                <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
                onChange={handleImageChange}
                id="fileInput"
              />
              <label htmlFor="fileInput" className="sr-only">Upload profile image</label>

              {menuOpen && (
                <div
                  ref={menuRef}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden w-48 z-50"
                >
                  <ul className="divide-y divide-gray-100">
                    <li
                      onClick={handleViewImage}
                      className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                    >
                      <span className="flex-1">Voir Image</span>
                    </li>
                    <li
                      onClick={handleFileSelect}
                      className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                    >
                      <span className="flex-1">Changer Image</span>
                    </li>
                    <li
                      onClick={handleRemoveImage}
                      className="px-4 py-3 text-sm text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2"
                    >
                      <span className="flex-1">Supprimer Image</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="text-center sm:text-left">
              <h3 className="text-xl font-semibold text-gray-900">
                {profile.name}
              </h3>
              <p className="text-gray-500">{profile.email}</p>
            </div>
          </div>

          {preview && (
            <div className="relative bg-gray-50 rounded-xl p-6 border border-gray-200">
              <button
                onClick={() => {
                  setPreview(null);
                  setSelectedImage(null);
                }}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Close preview"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-lg w-32 h-32 object-cover shadow-lg"
                  />
                  <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
                    <div className="bg-green-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-900">Prêt à télécharger</h4>
                  <p className="text-xs text-gray-500 mt-1">Aperçu de votre nouvelle photo de profil</p>
                </div>

                <button
                  onClick={handleImageUpload}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 
                           disabled:bg-blue-400 text-white font-medium rounded-lg
                           shadow-sm transition duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Téléchargement...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Télécharger la photo</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Mot de passe</h3>
              <button
                onClick={() => setPasswordModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition duration-200 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Changer le mot de passe</span>
              </button>
            </div>
          </div>

          <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Photo de profil</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-center p-6">
                <img
                  src={profile.imageUrl}
                  alt={`${profile.name}'s profile`}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = "/placeholder-profile.jpg";
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Changer le mot de passe</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Ancien mot de passe</label>
                  <input
                    type="password"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-700 
                           disabled:bg-blue-400 text-white font-medium rounded-lg
                           shadow-sm transition duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Changement en cours...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Changer le mot de passe</span>
                    </>
                  )}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </SettingSection>
  );
};

export default Profile;