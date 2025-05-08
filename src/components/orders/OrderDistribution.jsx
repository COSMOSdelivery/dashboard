import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import config from "../../config.json";

const API_URL = config.API_URL;

const COLORS = ["#FFB74D", "#4FC3F7", "#039BE5", "#FFB74D", "#81D4FA"];

// États à exclure du graphique
const EXCLUDED_STATUSES = [
  "ENLEVE",
  "RETOUR_DEPOT",
  "A_VERIFIER",
  "LIVRES_PAYE",
  "RETOUR_DEFINITIF",
  "RETOUR_INTER_AGENCE",
  "RETOUR_EXPEDITEURS",
  "RETOUR_RECU_PAYE",
];

const OrderDistribution = () => {
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderStatusData = async () => {
      try {
        const response = await axios.get(`${API_URL}/stat/client/command`);
        if (response.status === 200) {
          // Transformer les données et exclure les états indésirables
          const transformedData = Object.entries(response.data.results)
            .map(([name, { count }]) => ({
              name,
              value: count,
            }))
            .filter((entry) => !EXCLUDED_STATUSES.includes(entry.name)); // Filtrer les états exclus

          setOrderStatusData(transformedData);
        } else {
          throw new Error("Failed to fetch order status data");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatusData();
  }, []);

  if (loading) {
    return <div>Loading order status data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <motion.div
      className="bg-white backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-black-700 mb-4">
        Répartition des statuts de commande
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={orderStatusData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent, value }) =>
                value === 0 ? null : `${name} ${(percent * 100).toFixed(0)}%`
              }
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            >
              {orderStatusData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
              formatter={(value) => <span className="text-gray-700">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default OrderDistribution;