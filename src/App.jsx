import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
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
  const handleLogoutClick = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  const isAuthenticated = Boolean(localStorage.getItem("authToken"));
  const userRole =
    JSON.parse(localStorage.getItem("userInfo"))?.role || "GUEST";

  return (
    <div className="flex h-screen bg-white text-gray-100 overflow-hidden">
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
              <OverviewPageClient/>
            </ProtectedRouteClient>
          }
              />
                      <Route
          path="/search-parcels"
          element={
            <ProtectedRouteClient>
              <Searchcolis/>
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
