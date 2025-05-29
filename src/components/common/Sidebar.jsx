import {
  BarChart2,
  Menu,
  Settings,
  ShoppingCart,
  TrendingUp,
  Users,
  ScrollText,
  ClipboardList,
  Truck,
  MessageSquare,
  CreditCard,
  RefreshCw,
  MapPin,
  Package,
  ChevronDown,
} from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  const getSidebarItems = () => {
    switch (role) {
      case "ADMIN":
        return [
          { name: "Aperçu", icon: BarChart2, color: "#042351", href: "/" },
          {
            name: "Utilisateurs",
            icon: Users,
            color: "#EC4899",
            href: "/users",
          },
          {
            name: "Commandes",
            icon: ShoppingCart,
            color: "#F59E0B",
            href: "/orders",
            subItems: [
              {
                name: "Créer une commande",
                href: "/orders/create",
                color: "#F59E0B",
              },
              {
                name: "Toutes les commandes",
                href: "/orders",
                color: "#F59E0B",
              },
              {
                name: "Commandes supprimées",
                href: "/orders/deleted",
                color: "#F59E0B",
              },
            ],
          },
          {
            name: "Feedbacks",
            icon: MessageSquare,
            color: "#3B82F6",
            href: "/Allfeedbacks",
          },
          {
            name: "Pickup",
            icon: Truck,
            color: "#8B5CF6",
            href: "/Pickup",
          },

          {
            name: "Paiements",
            icon: CreditCard,
            color: "#8B5CF6",
            href: "/payments",
          },
          {
            name: "Statistiques",
            icon: TrendingUp,
            color: "#EF4444",
            href: "/stat-livraison",
          },
          {
            name: "Navex",
            icon: MapPin,
            color: "#D946EF",
            href: "/navex",
          },
          {
            name: "Stock",
            icon: Package,
            color: "#4B5563",
            href: "/stock",
          },
          {
            name: "Retours",
            icon: RefreshCw,
            color: "#0284C7",
            href: "/returns",
          },
          {
            name: "Paramètres",
            icon: Settings,
            color: "#6EE7B7",
            href: "/settings",
          },
        ];
      case "SERVICECLIENT":
        return [
          {
            name: "Commandes",
            icon: ShoppingCart,
            color: "#F59E0B",
            href: "/orders",
            subItems: [
              {
                name: "Créer une commande",
                href: "/orders/create",
                color: "#F59E0B",
              },
              { name: "Toutes les commandes", href: "", color: "#F59E0B" },
              {
                name: "Commandes supprimées",
                href: "/orders/deleted",
                color: "#F59E0B",
              },
            ],
          },
          {
            name: "Utilisateurs",
            icon: Users,
            color: "#EC4899",
            href: "/users",
          },
          {
            name: "Debriefs",
            icon: ScrollText,
            color: "#2563EB",
            href: "/debriefs",
          },
          {
            name: "Feedbacks",
            icon: MessageSquare,
            color: "#3B82F6",
            href: "/Allfeedbacks",
          },
          {
            name: "Navex",
            icon: MapPin,
            color: "#D946EF",
            href: "/navex",
          },
          {
            name: "Stock",
            icon: Package,
            color: "#4B5563",
            href: "/stock",
          },
          {
            name: "Retours",
            icon: RefreshCw,
            color: "#0284C7",
            href: "/returns",
          },
          {
            name: "Paramètres",
            icon: Settings,
            color: "#6EE7B7",
            href: "/settings",
          },
        ];
      case "LIVREUR":
        return [
          {
            name: "Commandes à Livrer",
            icon: Truck,
            color: "#F59E0B",
            href: "/deliveries",
          },
          {
            name: "Statistiques",
            icon: TrendingUp,
            color: "#3B82F6",
            href: "/statistics",
          },
          {
            name: "Paramètres",
            icon: Settings,
            color: "#6EE7B7",
            href: "/settings",
          },
        ];
      case "CLIENT":
        return [
          {
            name: "Tableau de bord",
            icon: BarChart2,
            color: "#1D4ED8",
            href: "/client-dashboard",
          },
          {
            name: "Mes Commandes",
            icon: ShoppingCart,
            color: "#F97316",
            href: "/search-parcels",
          },
          {
            name: "Mes Retours",
            icon: RefreshCw,
            color: "#0284C7",
            href: "/my-returns",
          },
          {
            name: "Mes Paiements",
            icon: CreditCard,
            color: "#8B5CF6",
            href: "/my-payments",
          },
          {
            name: "Mes Feedbacks",
            icon: MessageSquare,
            color: "#3B82F6",
            href: "/my-feedbacks",
          },
          {
            name: "Paramètres",
            icon: Settings,
            color: "#6EE7B7",
            href: "/settings",
          },
        ];
      default:
        return [];
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(null); // Track which submenu is open
  const SIDEBAR_ITEMS = getSidebarItems();

  const toggleSubmenu = (href) => {
    setOpenSubmenu(openSubmenu === href ? null : href);
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 bg-white text-[#042351]`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
      style={{
        borderTopRightRadius: "30px",
        borderBottomRightRadius: "30px",
      }}
    >
      <div
        className="h-full p-4 flex flex-col"
        style={{
          borderTopRightRadius: "30px",
          borderBottomRightRadius: "30px",
        }}
      >
        {/* Menu Button and Logo Section */}
        <div
          className="flex items-center justify-start mb-6"
          style={{
            padding: "10px",
          }}
        >
          {/* Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center"
            style={{ backgroundColor: "#f3f4f6" }}
          >
            <Menu size={24} />
          </motion.button>

          {/* Logo */}
          {isSidebarOpen && (
            <motion.img
              src="/logo.PNG"
              alt="Logo"
              style={{
                height: "100px",
                maxWidth: "150px",
                objectFit: "contain",
                marginLeft: "35px",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-grow overflow-y-auto max-h-[calc(100vh-160px)]">
          {SIDEBAR_ITEMS.map((item, index) => (
            <div key={item.href}>
              <div className="flex flex-col">
                <Link to={item.href}>
                  <motion.div
                    className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    style={{
                      backgroundColor: isSidebarOpen
                        ? "rgba(255, 255, 255, 0.1)"
                        : "transparent",
                    }}
                    onClick={(e) => {
                      if (item.subItems) {
                        e.preventDefault(); // Prevent navigation if subitems exist
                        toggleSubmenu(item.href);
                      }
                    }}
                  >
                    <item.icon
                      size={24}
                      style={{ color: item.color, minWidth: "24px" }}
                    />
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          className="ml-4 flex-1 whitespace-nowrap"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2, delay: 0.3 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {item.subItems && isSidebarOpen && (
                      <motion.div
                        animate={{
                          rotate: openSubmenu === item.href ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={20} style={{ color: item.color }} />
                      </motion.div>
                    )}
                  </motion.div>
                </Link>
                {/* Submenu remains the same */}

                {/* Submenu */}
                {item.subItems &&
                  openSubmenu === item.href &&
                  isSidebarOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-8"
                    >
                      {item.subItems.map((subItem) => (
                        <Link key={subItem.href} to={subItem.href}>
                          <motion.div
                            className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                            }}
                          >
                            <span
                              className="whitespace-nowrap"
                              style={{ color: subItem.color }}
                            >
                              {subItem.name}
                            </span>
                          </motion.div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
              </div>

              {/* Divider */}
              {index < SIDEBAR_ITEMS.length - 1 && (
                <div className="h-px my-1" style={{ opacity: 0.5 }}></div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

Sidebar.propTypes = {
  role: PropTypes.string.isRequired,
};

export default Sidebar;
