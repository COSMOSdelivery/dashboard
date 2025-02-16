import { useState, useEffect } from "react";
import { UsersIcon, User, Truck, Headset } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_URL } from "../../config";
import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import ClientTable from "../../components/users/ClientTable";
import AdminTable from "../../components/users/AdminTable";
import Livreur from "../../components/users/Livreur";
import ServiceClientTable from "../../components/users/ServiceClientTable";

const INITIAL_COUNTS = {
  CLIENT: 0,
  ADMIN: 0,
  LIVREUR: 0,
  SERVICECLIENT: 0,
};

// Define which roles can see which tables
const ROLE_PERMISSIONS = {
  ADMIN: ["ADMIN", "SERVICECLIENT", "LIVREUR", "CLIENT"],
  SERVICECLIENT: ["CLIENT", "LIVREUR"]
};

const UsersPage = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [countsByRole, setCountsByRole] = useState(INITIAL_COUNTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const userRole = JSON.parse(localStorage.getItem("userInfo"))?.role;

  const incrementRoleCount = (role) => {
    setCountsByRole(prev => ({
      ...prev,
      [role]: prev[role] + 1,
    }));
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/stat/usersNumbers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCountsByRole(response.data.countsByRole);
    } catch (err) {
      setError("Erreur lors de la récupération des données.");
      console.error("Error fetching user statistics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  // Check if the current user can view a specific role's table
  const canViewRole = (roleToView) => {
    return ROLE_PERMISSIONS[userRole]?.includes(roleToView);
  };

  const statsCards = [
    {
      name: "Clients",
      icon: UsersIcon,
      value: countsByRole.CLIENT,
      color: "#6366F1",
      role: "CLIENT",
    },
    {
      name: "Admins",
      icon: User,
      value: countsByRole.ADMIN,
      color: "#10B981",
      role: "ADMIN",
    },
    {
      name: "Livreurs",
      icon: Truck,
      value: countsByRole.LIVREUR,
      color: "#F59E0B",
      role: "LIVREUR",
    },
    {
      name: "Service Client",
      icon: Headset,
      value: countsByRole.SERVICECLIENT,
      color: "#EF4444",
      role: "SERVICECLIENT",
    },
  ];

  if (isLoading) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Utilisateurs" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {statsCards
            .filter(card => canViewRole(card.role))
            .map(({ name, icon: Icon, value, color }) => (
              <StatCard
                key={name}
                name={name}
                icon={Icon}
                value={value || 0}
                color={color}
              />
            ))}
        </motion.div>

        <div className="flex flex-col space-y-6 w-full">
          {activeForm ? (
            <div className="w-full">
              {activeForm === "ADMIN" && canViewRole("ADMIN") && (
                <AdminTable
                  fullWidth
                  onCancel={() => setActiveForm(null)}
                  incrementAdminCount={() => incrementRoleCount("ADMIN")}
                />
              )}
              {activeForm === "SERVICECLIENT" && canViewRole("SERVICECLIENT") && (
                <ServiceClientTable
                  fullWidth
                  onCancel={() => setActiveForm(null)}
                  incrementRoleCount={() => incrementRoleCount("SERVICECLIENT")}
                />
              )}
              {activeForm === "LIVREUR" && canViewRole("LIVREUR") && (
                <Livreur
                  fullWidth
                  onCancel={() => setActiveForm(null)}
                  incrementRoleCount={() => incrementRoleCount("LIVREUR")}
                />
              )}
              {activeForm === "CLIENT" && canViewRole("CLIENT") && (
                <ClientTable
                  fullWidth
                  onCancel={() => setActiveForm(null)}
                  incrementRoleCount={() => incrementRoleCount("CLIENT")}
                />
              )}
            </div>
          ) : (
            <>
              {canViewRole("ADMIN") && (
                <AdminTable
                  onAddClick={() => setActiveForm("ADMIN")}
                  incrementAdminCount={() => incrementRoleCount("ADMIN")}
                />
              )}
              {canViewRole("SERVICECLIENT") && (
                <ServiceClientTable
                  onAddClick={() => setActiveForm("SERVICECLIENT")}
                  incrementRoleCount={() => incrementRoleCount("SERVICECLIENT")}
                />
              )}
              {canViewRole("LIVREUR") && (
                <Livreur
                  onAddClick={() => setActiveForm("LIVREUR")}
                  incrementRoleCount={() => incrementRoleCount("LIVREUR")}
                />
              )}
              {canViewRole("CLIENT") && (
                <ClientTable
                  onAddClick={() => setActiveForm("CLIENT")}
                  incrementRoleCount={() => incrementRoleCount("CLIENT")}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default UsersPage;