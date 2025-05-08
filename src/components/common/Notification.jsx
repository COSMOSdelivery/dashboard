// components/common/Notification.js
import { motion } from "framer-motion";

const Notification = ({ message, type, onClose }) => {
  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-4 right-4 p-4 rounded-lg text-white ${bgColor} shadow-lg flex items-center justify-between`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4">
        ✕
      </button>
    </motion.div>
  );
};

export default Notification;