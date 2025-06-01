import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import StatCard from "../../components/common/StatCard";
import OrderDistribution from "../../components/orders/OrderDistribution";

import {
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaUndo,
  FaListAlt,
  FaMoneyBillWave,
  FaUsers,
  FaAward,
  FaChartLine,
} from "react-icons/fa";
import config from "../../config.json";
import Header from "../../components/common/Header";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";

const API_URL = config.API_URL;

const AdminGlobalStatistics = () => {
  const [statistics, setStatistics] = useState({
    global: {
      totalOrders: 0,
      deliveredOrders: 0,
      pendingOrders: 0,
      inProgressOrders: 0,
      delayedOrders: 0,
      returnedOrders: 0,
      ordersToVerify: 0,
      exchangeOrders: 0,
      deliveriesThisWeek: 0,
      totalRevenue: 0,
      totalLivreurRevenue: 0,
      activeLivreurs: 0,
      globalDeliveryRate: 0,
    },
    livreurStats: [],
    topPerformers: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalStatistics = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${API_URL}/stat/admin/global-statistics`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStatistics(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching global statistics:", error);
        setLoading(false);
      }
    };

    fetchGlobalStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Statistiques Globales" />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Chargement des statistiques...</div>
        </div>
      </div>
    );
  }

  // Data for the global bar chart
  const globalBarChartData = [
    { name: "Livrées", value: statistics.global.deliveredOrders },
    { name: "En Cours", value: statistics.global.inProgressOrders },
    { name: "En Attente", value: statistics.global.pendingOrders },
    { name: "Retard", value: statistics.global.delayedOrders },
    { name: "Retournées", value: statistics.global.returnedOrders },
  ];

  // Data for the global pie chart
  const globalPieChartData = [
    { name: "Livrées", value: statistics.global.deliveredOrders },
    { name: "En Cours", value: statistics.global.inProgressOrders },
    { name: "En Attente", value: statistics.global.pendingOrders },
    { name: "Retard", value: statistics.global.delayedOrders },
    { name: "Retournées", value: statistics.global.returnedOrders },
  ];

  // Data for top performers chart
  const topPerformersData = statistics.topPerformers.map(
    (performer, index) => ({
      name: performer.livreurInfo
        ? `${performer.livreurInfo.prenom} ${performer.livreurInfo.nom}`
        : `Livreur ${performer.id_livreur}`,
      livraisons: performer.deliveredOrders,
      taux: parseFloat(performer.deliveryRate.toFixed(1)),
      revenus: parseFloat(performer.livreurRevenue.toFixed(2)),
    })
  );

  // Data for livreur performance comparison
  const livreurComparisonData = statistics.livreurStats
    .sort((a, b) => b.deliveredOrders - a.deliveredOrders)
    .slice(0, 10)
    .map((livreur) => ({
      name: livreur.livreurInfo
        ? `${livreur.livreurInfo.prenom} ${livreur.livreurInfo.nom}`
        : `Livreur ${livreur.id_livreur}`,
      livraisons: livreur.deliveredOrders,
      enCours: livreur.inProgressOrders,
      enRetard: livreur.delayedOrders,
    }));

  // Colors for charts
  const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#DC2626", "#7C3AED"];

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Statistiques Globales - Administration" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* GLOBAL STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total des Commandes"
            icon={FaBox}
            value={statistics.global.totalOrders.toString()}
            color="#4F46E5"
          />
          <StatCard
            name="Commandes Livrées"
            icon={FaCheckCircle}
            value={statistics.global.deliveredOrders.toString()}
            color="#10B981"
          />
          <StatCard
            name="Commandes en Cours"
            icon={FaTruck}
            value={statistics.global.inProgressOrders.toString()}
            color="#F59E0B"
          />
          <StatCard
            name="Commandes en Attente"
            icon={FaClock}
            value={statistics.global.pendingOrders.toString()}
            color="#EF4444"
          />
          <StatCard
            name="Commandes en Retard"
            icon={FaExclamationTriangle}
            value={statistics.global.delayedOrders.toString()}
            color="#DC2626"
          />
          <StatCard
            name="Commandes Retournées"
            icon={FaUndo}
            value={statistics.global.returnedOrders.toString()}
            color="#7C3AED"
          />
          <StatCard
            name="Commandes à Vérifier"
            icon={FaListAlt}
            value={statistics.global.ordersToVerify.toString()}
            color="#2563EB"
          />
          <StatCard
            name="Commandes avec Échange"
            icon={FaExchangeAlt}
            value={statistics.global.exchangeOrders.toString()}
            color="#D97706"
          />
          <StatCard
            name="Livraisons Cette Semaine"
            icon={FaTruck}
            value={statistics.global.deliveriesThisWeek.toString()}
            color="#059669"
          />
          <StatCard
            name="Livreurs Actifs"
            icon={FaUsers}
            value={statistics.global.activeLivreurs.toString()}
            color="#7C2D12"
          />
          <StatCard
            name="Revenus Totaux"
            icon={FaMoneyBillWave}
            value={`${statistics.global.totalRevenue.toFixed(2)} TND`}
            color="#6D28D9"
          />
          <StatCard
            name="Commission Livreurs"
            icon={FaAward}
            value={`${statistics.global.totalLivreurRevenue.toFixed(2)} TND`}
            color="#BE185D"
          />
          <StatCard
            name="Taux de Livraison Global"
            icon={FaChartLine}
            value={`${statistics.global.globalDeliveryRate.toFixed(1)}%`}
            color="#0F766E"
          />
        </motion.div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <OrderDistribution />
        </div>

        {/* TOP PERFORMERS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performers Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Livreurs - Livraisons</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPerformersData}>
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="livraisons" fill="#10B981" name="Livraisons" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Performers Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Livreurs - Revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPerformersData}>
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} TND`, "Revenus"]} />
                  <Legend />
                  <Bar dataKey="revenus" fill="#6D28D9" name="Revenus (TND)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* LIVREUR COMPARISON SECTION */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              Comparaison des Performances - Top 10 Livreurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={livreurComparisonData}>
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="livraisons" fill="#10B981" name="Livrées" />
                <Bar dataKey="enCours" fill="#F59E0B" name="En Cours" />
                <Bar dataKey="enRetard" fill="#DC2626" name="En Retard" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminGlobalStatistics;
