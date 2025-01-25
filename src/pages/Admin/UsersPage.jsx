import { useState, useEffect } from "react";
import { UsersIcon, User, Truck, Headset } from "lucide-react"; // Icônes adaptées
import { motion } from "framer-motion";
import axios from "axios";
import config from "../../config.json";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import ClientTable from "../../components/users/ClientTable";
import AdminTable from "../../components/users/AdminTable";
import Livreur from "../../components/users/Livreur";
import ServiceClientTable from "../../components/users/ServiceClientTable";

const API_URL = config.API_URL;

const UsersPage = () => {
  const [countsByRole, setCountsByRole] = useState({
    CLIENT: 0,
    ADMIN: 0,
    LIVREUR: 0,
    SERVICECLIENT: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Récupérer les données depuis l'API
  const fetchUserStats = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/stat/usersNumbers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Mettre à jour les données par rôle
      setCountsByRole(response.data.countsByRole);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      setError("Erreur lors de la récupération des données.");
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchUserStats();
  }, []);

  // Afficher un message de chargement
  if (isLoading) {
    return <div>Chargement en cours...</div>;
  }

  // Afficher un message d'erreur
  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Utilisateurs" />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {/* STATS */}
          <motion.div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
          >
            <StatCard
                name="Clients"
                icon={UsersIcon} // Icône pour les clients
                value={countsByRole.CLIENT || 0}
                color="#6366F1" // Couleur pour les clients
            />
            <StatCard
                name="Admins"
                icon={User} // Icône pour les admins
                value={countsByRole.ADMIN || 0}
                color="#10B981" // Couleur pour les admins
            />
            <StatCard
                name="Livreurs"
                icon={Truck} // Icône pour les livreurs
                value={countsByRole.LIVREUR || 0}
                color="#F59E0B" // Couleur pour les livreurs
            />
            <StatCard
                name="Service Client"
                icon={Headset} // Icône pour le service client
                value={countsByRole.SERVICECLIENT || 0}
                color="#EF4444" // Couleur pour le service client
            />
          </motion.div>

          {/* Tables */}
          <div className="flex flex-col space-y-6 w-full">
            <AdminTable />
            <ServiceClientTable />
            <Livreur />
            <ClientTable />
          </div>
        </main>
      </div>
  );
};

export default UsersPage;