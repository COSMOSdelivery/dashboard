import { useState, useEffect } from "react";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config.json";


import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import SalesOverviewChart from "../../components/overview/SalesOverviewChart";
import OrderDistribution from "../../components/orders/OrderDistribution";

const API_URL = config.API_URL;

const OverviewPage = () => {
  const navigate = useNavigate();
  const [orderStats, setOrderStats] = useState({
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
    });
  const [resultsByEtat, setResultsByEtat] = useState({});


  useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    throw new Error("Vous devez être connecté.");
                }

                // Fetch command stats
                const commandResponse = await axios.get(`${API_URL}/stat/client/command`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (commandResponse.status !== 200) {
                    throw new Error("Erreur lors de la récupération des commandes.");
                }

                const { results, totalOrders, totalRevenue } = commandResponse.data;

                // Fetch user stats
                const userResponse = await axios.get(`${API_URL}/stat/usersNumbers`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (userResponse.status !== 200) {
                    throw new Error("Erreur lors de la récupération des utilisateurs.");
                }

                const { totalUsers } = userResponse.data;

                // Update states
                setResultsByEtat(results || {});
                setOrderStats({
                    totalOrders: totalOrders || 0,
                    totalUsers: totalUsers || 0,
                    totalRevenue: totalRevenue || 0,
                });
                setError(null);
            } catch (error) {
                console.error("Error fetching stats:", error);
                setError(error.response?.data?.msg || error.message || "Une erreur s'est produite");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Aperçu" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Ventes totales"
            icon={Zap}
            value={`${orderStats.totalRevenue.toFixed(2)} TND`}
            color="#6366F1"
          />
          <StatCard
            name="Nouveaux utilisateurs"
            icon={Users}
            value={orderStats.totalUsers.toString()}
            color="#8B5CF6"
          />
          <StatCard
            name="Produits totaux"
            icon={ShoppingBag}
            value={orderStats.totalOrders.toString()}
            color="#EC4899"
          />
          <StatCard
            name="Taux de conversion"
            icon={BarChart2}
            value="12.5%"
            color="#10B981"
          />
        </motion.div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart />
          <OrderDistribution />
        </div>
      </main>
    </div>
  );
};
export default OverviewPage;
