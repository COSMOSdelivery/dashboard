import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

const productPerformanceData = [
  { name: "Product A", sales: 4000, revenue: 2400, profit: 2400 },
  { name: "Product B", sales: 3000, revenue: 1398, profit: 2210 },
  { name: "Product C", sales: 2000, revenue: 9800, profit: 2290 },
  { name: "Product D", sales: 2780, revenue: 3908, profit: 2000 },
  { name: "Product E", sales: 1890, revenue: 4800, profit: 2181 },
];

const ProductPerformance = () => {
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-black-100 mb-4">
        Product Performance
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={productPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FFB74D" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Bar dataKey="sales" fill="#039BE5" />
            <Bar dataKey="revenue" fill="#10B981" />
            <Bar dataKey="profit" fill="#81D4FA" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
export default ProductPerformance;
