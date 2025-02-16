import { motion } from "framer-motion";
import PropTypes from "prop-types";

const StatCardClient = ({ name, icon: Icon, value, color, showPrice = true }) => {
  // Split the value into count and price
  const [count, price] = value.split('  (');
  const formattedPrice = price ? price.replace(' DT)', '') : '';

  return (
    <motion.div
      className="bg-white backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-200"
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
    >
      <div className="px-4 py-5 sm:p-6">
        <span className="flex items-center text-sm font-medium text-gray-500">
          <Icon size={20} className="mr-2" style={{ color }} />
          {name}
        </span>
        <div>
          <p className="mt-1 text-3xl font-semibold text-gray-800">{count}</p>
          {showPrice && formattedPrice && (
            <p
              className="text-sm font-medium text-indigo-600 mt-1"
              style={{
                background: 'linear-gradient(90deg, #4f46e5, #6d28d9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {formattedPrice} DT
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
StatCardClient.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.string,
  showPrice: PropTypes.bool,
};

export default StatCardClient;
