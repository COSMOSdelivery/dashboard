import { Route, Routes } from "react-router-dom";
import { LogOut } from "lucide-react"; // Ensure you have this import
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

const routes = [
    { path: "/", element: <OverviewPage />, requiresAuth: true },
    { path: "/users", element: <UsersPage />, requiresAuth: true, roles: ["ADMIN"] },
    { path: "/sales", element: <SalesPage />, requiresAuth: true },
    { path: "/orders", element: <OrdersPage />, requiresAuth: true },
    { path: "/analytics", element: <AnalyticsPage />, requiresAuth: true },
    { path: "/settings", element: <SettingsPage />, requiresAuth: true },
    { path: "/login", element: <LoginPage />, requiresAuth: false },
    { path: "*", element: <NotFoundPage />, requiresAuth: false },
];

function App() {
  const handleLogoutClick = () => {
    console.log("Logout button clicked"); // Placeholder for logout logic
  };

  return (
    <div className="flex h-screen bg-white text-gray-700 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      <Sidebar />

      {/* Top Right Section with Logo and Logout Button */}
      <div className="fixed top-4 right-7 z-20 flex items-center space-x-4">
        {/* Logout button */}
        <button
          onClick={handleLogoutClick}
          className="bg-white hover:bg-gray-200 text-gray-700 p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Log Out"
        >
          <LogOut size={24} />
        </button>
      </div>

      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;
