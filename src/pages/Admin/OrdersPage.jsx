import { useState, useEffect } from "react";
import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import DailyOrders from "../../components/orders/DailyOrders";
import OrderDistribution from "../../components/orders/OrderDistribution";
import OrdersTable from "../../components/orders/OrdersTable";
import config from "../../config.json";

const API_URL = config.API_URL;

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [resultsByEtat, setResultsByEtat] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get(`${API_URL}/stat/client/command`);
  
        if (response.status === 200) {
          const { results, totalOrders, totalRevenue } = response.data;
  
          // Update resultsByEtat
          setResultsByEtat(results || {});
  
          // Update orderStats
          setOrderStats({
            totalOrders: totalOrders || 0,
            pendingOrders: results?.EN_ATTENTE?.count || 0,
            completedOrders: results?.LIVRES_PAYE?.count || 0,
            totalRevenue: totalRevenue || 0,
          });
        } else {
          throw new Error("Erreur lors de la récupération des données");
        }
      } catch (error) {
        setError(error.response?.data?.message || error.message || "Une erreur s'est produite");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCount();
  }, []);
  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title="Commandes" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total des Commandes"
            icon={ShoppingBag}
            value={orderStats.totalOrders.toString()}
            color="#6366F1"
          />
          <StatCard
            name="Commandes en attente"
            icon={Clock}
            value={`${resultsByEtat.EN_ATTENTE?.count || 0}`} // Fixed syntax
            color="#F59E0B"
          />
          <StatCard
            name="Commandes terminées"
            icon={CheckCircle}
            value={`${resultsByEtat.LIVRES_PAYE?.count || 0}`}
            color="#10B981"
          />

        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DailyOrders />
          <OrderDistribution />
        </div>

        <OrdersTable />
      </main>
    </div>
  );
};

export default OrdersPage;