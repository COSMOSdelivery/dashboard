import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, CreditCard } from "lucide-react";
import axios from "axios";
import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import OrdersTable from "../../components/orders/OrdersTable";
import config from "../../config.json";
import { toast } from "sonner";
import PropTypes from "prop-types";

const API_URL = config.API_URL || "http://localhost:3000/api";

const AbandonedOrdersPage = () => {
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Utilisateur non authentifié");
        }
        const response = await axios.get(`${API_URL}/stat/client/command`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const { results } = response.data;
          if (!results || !results.ABANDONNEE) {
            console.warn("API response missing expected data:", response.data);
            setOrderStats({
              totalOrders: 0,
              pendingOrders: 0,
              completedOrders: 0,
              totalRevenue: 0,
            });
          } else {
            setOrderStats({
              totalOrders: results.ABANDONNEE.count || 0,
              pendingOrders: 0,
              completedOrders: 0,
              totalRevenue: results.ABANDONNEE.totalPrix || 0,
            });
          }
        } else {
          throw new Error("Erreur lors de la récupération des données");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.response?.data?.message || error.message || "Une erreur s'est produite");
        toast.error(`Erreur: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title="Commandes Abandonnées" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <StatCard
                name="Total des Commandes Abandonnées"
                icon={ShoppingBag}
                value={orderStats.totalOrders.toString()}
                color="#6366F1"
              />
              <StatCard
                name="Revenu Total Abandonné"
                icon={CreditCard}
                value={`${orderStats.totalRevenue.toFixed(2)} TND`}
                color="#10B981"
              />
            </motion.div>
            <OrdersTable
              filters={{ status: "ABANDONNEE" }}
              selectedOrders={selectedOrders}
              setSelectedOrders={setSelectedOrders}
              statusMode="only-abandoned"
            />
          </>
        )}
      </main>
    </div>
  );
};

AbandonedOrdersPage.propTypes = {
  // No props for this page component, but added for consistency
};

export default AbandonedOrdersPage;