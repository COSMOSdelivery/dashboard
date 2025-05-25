import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import config from "../../config.json";

const API_URL = config.API_URL;

const SalesOverviewChart = () => {
  const [monthlyOrdersData, setMonthlyOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyOrdersData = async () => {
      try {
        const response = await axios.get(`${API_URL}/stat/monthly-orders`);

        if (response.status === 200) {
          // Transform data to match Recharts format
          const transformedData = response.data.map((item) => ({
            month: item.month, // e.g., "2025-05"
            Commandes: item.total_orders,
          }));
          setMonthlyOrdersData(transformedData);
        } else {
          throw new Error("Échec de la récupération des données mensuelles.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyOrdersData();
  }, []);
  if (loading) {
    return <div>Loading daily orders data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <motion.div
      className="bg-white backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Commandes par mois
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={monthlyOrdersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => <span className="text-gray-700">{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="Commandes"
              stroke="#29B6F6"
              strokeWidth={2}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
export default SalesOverviewChart;