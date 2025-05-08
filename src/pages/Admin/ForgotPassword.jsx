import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import config from "../../config.json";

const API_URL = config.API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

      try {
          const response = await axios.post(`${API_URL}/users/forgot-password`, { email });
          setMessage(response.data.message);
        
          // Only navigate if success is true
          if (response.data.success) {
              setTimeout(() => {
                  navigate("/verify-otp", { state: { email } });
              }, 2000);
          }
      } catch (error) {
            setError(error.response?.data?.message || "Erreur lors de l'envoi du code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex-1 overflow-auto relative z-10 bg-cover bg-center min-h-screen"
      style={{
        backgroundImage: "url('/login.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="min-h-screen flex items-center justify-end py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-sm w-full space-y-8 bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ maxWidth: "450px" }}
        >
          <div className="flex flex-col items-center">
            <img src="/logo.jpg" alt="Logo" className="w-44 h-auto" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Réinitialisation du mot de passe
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <motion.div
              className="rounded-md shadow-sm space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  Adresse email
                </label>
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#202434] hover:bg-[#181c2c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#15192a] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Envoi en cours..." : "Envoyer"}
              </button>
            </motion.div>
          </form>

          {message && <p className="text-green-600 text-center mt-4">{message}</p>}
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;

