import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import StatCard from '../../components/common/StatCard';
import {
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaUndo,
  FaListAlt,
  FaMoneyBillWave, // Nouvelle icône pour les revenus
} from 'react-icons/fa';
import config from '../../config.json';
import Header from '../../components/common/Header';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

const API_URL = config.API_URL;

const StatisticsDashboard = () => {
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    delayedOrders: 0,
    returnedOrders: 0,
    ordersToVerify: 0,
    exchangeOrders: 0,
    deliveriesThisWeek: 0,
    livreurRevenue: 0, // Ajouter les revenus du livreur
  });

  useEffect(() => {
    // Fetch statistics from the backend
    const fetchStatistics = async () => {
      try {
        const id_livreur = JSON.parse(localStorage.getItem('userInfo'))?.id || '1';
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/stat/statistics/${id_livreur}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  // Data for the bar chart
  const barChartData = [
    { name: 'Livrées', value: statistics.deliveredOrders },
    { name: 'En Cours', value: statistics.inProgressOrders },
    { name: 'En Attente', value: statistics.pendingOrders },
    { name: 'Retard', value: statistics.delayedOrders },
    { name: 'Retournées', value: statistics.returnedOrders },
  ];

  // Data for the pie chart
  const pieChartData = [
    { name: 'Livrées', value: statistics.deliveredOrders },
    { name: 'En Cours', value: statistics.inProgressOrders },
    { name: 'En Attente', value: statistics.pendingOrders },
    { name: 'Retard', value: statistics.delayedOrders },
    { name: 'Retournées', value: statistics.returnedOrders },
  ];

  // Colors for the pie chart
  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#DC2626', '#7C3AED'];

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
            name="Total des Commandes"
            icon={FaBox}
            value={statistics.totalOrders.toString()}
            color="#4F46E5"
          />
          <StatCard
            name="Commandes Livrées"
            icon={FaCheckCircle}
            value={statistics.deliveredOrders.toString()}
            color="#10B981"
          />
          <StatCard
            name="Commandes en Cours"
            icon={FaTruck}
            value={statistics.inProgressOrders.toString()}
            color="#F59E0B"
          />
          <StatCard
            name="Commandes en Attente"
            icon={FaClock}
            value={statistics.pendingOrders.toString()}
            color="#EF4444"
          />
          <StatCard
            name="Commandes en Retard"
            icon={FaExclamationTriangle}
            value={statistics.delayedOrders.toString()}
            color="#DC2626"
          />
          <StatCard
            name="Commandes Retournées"
            icon={FaUndo}
            value={statistics.returnedOrders.toString()}
            color="#7C3AED"
          />
          <StatCard
            name="Commandes à Vérifier"
            icon={FaListAlt}
            value={statistics.ordersToVerify.toString()}
            color="#2563EB"
          />
          <StatCard
            name="Commandes avec Échange"
            icon={FaExchangeAlt}
            value={statistics.exchangeOrders.toString()}
            color="#D97706"
          />
          <StatCard
            name="Livraisons Cette Semaine"
            icon={FaTruck}
            value={statistics.deliveriesThisWeek.toString()}
            color="#059669"
          />
          {/* Nouvelle carte pour les revenus du livreur */}
          <StatCard
            name="Mes revenus"
            icon={FaMoneyBillWave}
            value={`${statistics.livreurRevenue.toFixed(2)} €`} // Afficher les revenus avec 2 décimales
            color="#6D28D9"
          />
        </motion.div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StatisticsDashboard;