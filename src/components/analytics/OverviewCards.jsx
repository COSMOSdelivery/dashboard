import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  ShoppingBag,
  Eye,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

const overviewData = [
  { name: "Revenu", value: "1,234,567 TND", change: 12.5, icon: DollarSign },
  { name: "Utilisateurs", value: "45,678", change: 8.3, icon: Users },
  { name: "Commandes", value: "9,876", change: -3.2, icon: ShoppingBag },
  { name: "Vues de pages", value: "1,234,567", change: 15.7, icon: Eye },
];

const OverviewCards = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {overviewData.map((item, index) => (
        <motion.div
          key={item.name}
          className="bg-white   backdrop-filter backdrop-blur-lg shadow-lg
            rounded-xl p-6 border border-gray-200
          "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-black-700">
                {item.name}
              </h3>
              <p className="mt-1 text-xl font-semibold text-black-700">
                {item.value}
              </p>
            </div>

            <div
              className={`
              p-3 rounded-full bg-opacity-20 ${
                item.change >= 0 ? "bg-green-500" : "bg-red-500"
              }
              `}
            >
              <item.icon
                className={`size-6  ${
                  item.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              />
            </div>
          </div>
          <div
            className={`
              mt-4 flex items-center ${
                item.change >= 0 ? "text-green-500" : "text-red-500"
              }
            `}
          >
            {item.change >= 0 ? (
              <ArrowUpRight size="20" />
            ) : (
              <ArrowDownRight size="20" />
            )}
            <span className="ml-1 text-sm font-medium">
              {Math.abs(item.change)}%
            </span>
            <span className="ml-2 text-sm text-black-700">
              par rapport à la période précédente
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewCards;
