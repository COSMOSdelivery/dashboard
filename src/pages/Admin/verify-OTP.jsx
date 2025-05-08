import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { KeyRound, Mail, ArrowRight } from "lucide-react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../config.json";
const API_URL = config.API_URL;

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  
  useEffect(() => {
    if (!email) {
      // Redirect to forgot password page if no email is provided
      navigate("/reset-password", {
        state: { email: email, otp: otp },
      });
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await axios.post(`${API_URL}/users/verify-otp`, { 
        email, 
        otp 
      });
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Code OTP invalide";
      setErrorMessage(errorMsg);
      
      setTimeout(() => setErrorMessage(""), 3000);
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
            <h2 className="mt-6 text-center text-3xl font-extrabold text-black-900">
              Vérification OTP
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Veuillez entrer le code reçu par email
            </p>
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
                <Mail className="absolute left-3 top-3 h-5 w-5 text-black-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-black-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-100"
                  disabled
                />
              </div>

              <div className="relative">
                <label htmlFor="otp" className="sr-only">
                  Code OTP
                </label>
                <KeyRound className="absolute left-3 top-3 h-5 w-5 text-black-400" />
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-black-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Code de vérification"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </motion.div>

            {errorMessage && (
              <motion.p
                className="text-red-500 text-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {errorMessage}
              </motion.p>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Retour
                </button>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#202434] hover:bg-[#181c2c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#15192a] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <KeyRound className="h-5 w-5 text-black-300 group-hover:text-black-200" />
                </span>
                {isLoading ? "Vérification..." : "Vérifier le code"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOtp;