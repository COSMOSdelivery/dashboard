import { Route, Routes } from "react-router-dom";
import { LogOut } from "lucide-react"; // Ensure you have this import
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
    const handleLogoutClick = () => {
        console.log("Logout button clicked"); // Placeholder for logout logic
    };

    return (
        <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
            {/* Background */}
            <div className='fixed inset-0 z-0'>
                <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
                <div className='absolute inset-0 backdrop-blur-sm' />
            </div>

            <Sidebar />

            {/* Logout button */}
            <div className='fixed top-4 right-4 z-20'>
                <button 
                    onClick={handleLogoutClick}
                    className='bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    title="Log Out"
                >
                    <LogOut size={24} />
                </button>
            </div>

            <Routes>
                <Route path='/' element={<OverviewPage />} />
                <Route path='/users' element={<UsersPage />} />
                <Route path='/sales' element={<SalesPage />} />
                <Route path='/orders' element={<OrdersPage />} />
                <Route path='/analytics' element={<AnalyticsPage />} />
                <Route path='/settings' element={<SettingsPage />} />
            </Routes>
        </div>
    );
}

export default App;
