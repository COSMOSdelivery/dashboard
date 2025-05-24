import { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/Admin/OverviewPage";
import OverviewPageClient from "./pages/Client/OverviewPageClient";
import UsersPage from "./pages/Admin/UsersPage";
import SalesPage from "./pages/Admin/SalesPage";
import OrdersPage from "./pages/Admin/OrdersPage";
import AnalyticsPage from "./pages/Admin/AnalyticsPage";
import SettingsPage from "./pages/Admin/SettingsPage";
import LoginPage from "./pages/Admin/LoginPage";
import NotFoundPage from "./pages/Admin/NotFoundPage";
import Searchcolis from "./pages/Client/Searchcolis";
import EditAdminPage from "./pages/Admin/EditAdminPage";
import EditClientPage from "./pages/Admin/EditClientPage";
import EditLivreurPage from "./pages/Admin/EditLivreurPage";
import EditServicePage from "./pages/Admin/EditServicePage";
import ForgotPassword from "./pages/Admin/ForgotPassword";
import VerifyOtp from "./pages/Admin/verify-OTP";
import ResetPassword from "./pages/Admin/resetPassword";
import CreateManifeste from "./pages/Client/CreateManifestePage";
import MesPaiements from "./pages/Client/MesPaiements";
import Manifeste from "./pages/Client/ManifestesPage";
import Retours from "./pages/Client/Retourspage";
import Orders from "./pages/Livreur/deliverypage";
import StatisticLivreur from "./pages/Livreur/StatisticsDashboard";
import ManifesteService from "./pages/Service Client/Manifests";
import Feedback from "./pages/Client/FeedbackPage";
import CreateFeedback from "./pages/Client/CreateFeedbackPage";
import FeedbackService from "./pages/Service Client/Feedback";


const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));
  let userRole = "GUEST";
  
  try {
    userRole = JSON.parse(localStorage.getItem("userInfo"))?.role || "GUEST";
    console.log("isAuthenticated:", isAuthenticated);
console.log("userRole:", userRole);
console.log("userInfo:", localStorage.getItem("userInfo"));
  } catch (error) {
    console.error("Error parsing userInfo:", error);
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userRole)) return <Navigate to="*" replace />;

  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("GUEST");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("authToken");
      const userInfo = localStorage.getItem("userInfo");

      if (token && userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo);
          setIsAuthenticated(true);
          setUserRole(parsedUserInfo.role);
        } catch (error) {
          console.error("Error parsing userInfo:", error);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole("GUEST");
      }
    };

    checkAuthStatus();

    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authStateChange", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStateChange", checkAuthStatus);
    };
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("authStateChange"));

    setIsAuthenticated(false);
    setUserRole("GUEST");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-white text-black-100 overflow-hidden">
      {isAuthenticated && (
        <>
          <Sidebar role={userRole} />
          <button
            onClick={handleLogoutClick}
            className="fixed top-4 right-7 z-20 bg-white hover:bg-gray-200 p-2 rounded-full"
          >
            <LogOut size={24} />
          </button>
        </>
      )}
      <Routes>
        <Route
          path="/client-dashboard"
          element={
            <ProtectedRoute allowedRoles={["CLIENT"]}>
              <OverviewPageClient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute allowedRoles={["CLIENT"]}>
              <Searchcolis />
            </ProtectedRoute>
          }
        />
        <Route path="/edit-admin/:userId" element={<EditAdminPage />} />
        <Route path="/edit-client/:userId" element={<EditClientPage />} />
        <Route path="/edit-livreur/:userId" element={<EditLivreurPage />} />
        <Route path="/edit-service-client/:userId" element={<EditServicePage />} />
        <Route path="/my-manifests" element={<Manifeste/>} />
        <Route path="/deliveries" element={<Orders/>} />
        <Route path="/statistics" element={<StatisticLivreur />} />
        <Route path="/my-payments" element={<MesPaiements/>} />



        <Route
          path="/search-parcels"
          element={
            <ProtectedRoute allowedRoles={["CLIENT"]}>
              <Searchcolis />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-OTP" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/create-manifest" element={<CreateManifeste/>} />
        <Route path="/my-returns" element={<Retours />} />
        <Route path="/my-feedbacks" element={<Feedback />} />
        <Route path="/create-feedback" element={<CreateFeedback/>} />
        <Route path="/manifests" element={<ManifesteService/>} />
        <Route path="/feedbacks" element={<FeedbackService/>} />


      
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <OverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SERVICECLIENT"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <SalesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SERVICECLIENT"]}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
              <SettingsPage />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;