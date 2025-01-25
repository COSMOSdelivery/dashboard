import React, { useState, useEffect } from "react";
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
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));
  const userRole = 
    JSON.parse(localStorage.getItem("userInfo"))?.role || "GUEST";
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (userRole !== "ADMIN") return <Navigate to="/" replace />;
  
  return children;
};

const ProtectedRouteClient = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));
  const userRole = 
    JSON.parse(localStorage.getItem("userInfo"))?.role || "GUEST";
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (userRole !== "CLIENT") return <Navigate to="/" replace />;
  
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
      
      console.log("Checking auth status:", { token, userInfo });

      if (token && userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        console.log("Parsed user info:", parsedUserInfo);
        
        setIsAuthenticated(true);
        setUserRole(parsedUserInfo.role);
      } else {
        console.log("Not authenticated");
        setIsAuthenticated(false);
        setUserRole("GUEST");
      }
    };

    checkAuthStatus();

    const handleStorageChange = () => {
      console.log("Storage change detected");
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', checkAuthStatus);
    };
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    
    // Dispatch custom events to ensure state update
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('authChange'));
    
    setIsAuthenticated(false);
    setUserRole("GUEST");
    navigate("/login");
  };

  console.log("Render state:", { isAuthenticated, userRole });

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
            <ProtectedRouteClient>
              <OverviewPageClient />
            </ProtectedRouteClient>
          } 
        />
        <Route 
          path="/search-parcels" 
          element={
            <ProtectedRouteClient>
              <Searchcolis />
            </ProtectedRouteClient>
          } 
        />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <OverviewPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sales" 
          element={
            <ProtectedRoute>
              <SalesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;