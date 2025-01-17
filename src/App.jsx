import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
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
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthenticated = Boolean(localStorage.getItem("authToken")); // Replace with actual auth logic
    const userRole = localStorage.getItem("userRole") || "GUEST"; // Replace with actual role logic

    const handleLogoutClick = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        navigate("/login");
    };

    // Helper function to check if route is accessible
    const isRouteAccessible = (route) => {
        if (!route.requiresAuth) return true; // Public routes are accessible
        if (!isAuthenticated) return false; // Block unauthenticated users
        if (route.roles && !route.roles.includes(userRole)) return false; // Block unauthorized roles
        return true;
    };

    // Conditionally show the sidebar and logout button
    const isLoginPage = location.pathname === "/login";

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
                <div className="absolute inset-0 backdrop-blur-sm" />
            </div>

            {!isLoginPage && isAuthenticated && (
                <>
                    <Sidebar currentPath={location.pathname} />
                    <div className="fixed top-4 right-7 z-20 flex items-center space-x-4">
                        <button
                            onClick={handleLogoutClick}
                            className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="Log Out"
                            aria-label="Log Out"
                        >
                            <LogOut size={24} />
                        </button>
                    </div>
                </>
            )}

            <Routes>
                {routes.map((route, index) => (
                    isRouteAccessible(route) ? (
                        <Route key={index} path={route.path} element={route.element} />
                    ) : (
                        <Route
                            key={index}
                            path={route.path}
                            element={<LoginPage />}
                        />
                    )
                ))}
            </Routes>
        </div>
    );
}

export default App;
