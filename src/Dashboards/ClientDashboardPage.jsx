import { Outlet, NavLink } from "react-router-dom";

const ClientDashboardPage = () => {
    return (
        <div className="flex h-screen">
            {/* Sidebar for navigation */}
            <aside className="w-64 bg-gray-800 text-white p-4">
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/client-dashboard" end className="block py-2 px-4 hover:bg-gray-700">
                                Overview
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/client-dashboard/orders" className="block py-2 px-4 hover:bg-gray-700">
                                Orders
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/client-dashboard/profile" className="block py-2 px-4 hover:bg-gray-700">
                                Profile
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/client-dashboard/settings" className="block py-2 px-4 hover:bg-gray-700">
                                Settings
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 bg-gray-100">
                <Outlet />
            </main>
        </div>
    );
};

export default ClientDashboardPage;
