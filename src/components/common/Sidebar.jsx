import {
	BarChart2,
	DollarSign,
	Menu,
	Settings,
	ShoppingCart,
	TrendingUp,
	Users,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
	{
		name: "Aperçu",
		icon: BarChart2,
		color: "#042351",
		href: "/",
	},
	{ name: "Utilisateurs", icon: Users, color: "#EC4899", href: "/users" },
	{ name: "Ventes", icon: DollarSign, color: "#10B981", href: "/sales" },
	{ name: "Commandes", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
	{ name: "Analytique", icon: TrendingUp, color: "#3B82F6", href: "/analytics" },
	{ name: "Paramètres", icon: Settings, color: "#6EE7B7", href: "/settings" },
];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
				style={{ borderTopRightRadius: "30px", borderBottomRightRadius: "30px" }}
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
				<nav className="flex-grow">
					{SIDEBAR_ITEMS.map((item, index) => (
						<div key={item.href}>
							<Link to={item.href}>
								<motion.div
									className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
									whileHover={{ scale: 1.05 }}
									style={{
										backgroundColor: isSidebarOpen
											? "rgba(255, 255, 255, 0.1)"
											: "transparent",
									}}
								>
									{/* Sidebar Icon */}
									<item.icon
										size={24}
										style={{ color: item.color, minWidth: "24px" }}
									/>
									{/* Sidebar Item Name */}
									<AnimatePresence>
										{isSidebarOpen && (
											<motion.span
												className="ml-4 whitespace-nowrap"
												initial={{ opacity: 0, width: 0 }}
												animate={{ opacity: 1, width: "auto" }}
												exit={{ opacity: 0, width: 0 }}
												transition={{ duration: 0.2, delay: 0.3 }}
											>
												{item.name}
											</motion.span>
										)}
									</AnimatePresence>
								</motion.div>
							</Link>
							{/* Divider */}
							{index < SIDEBAR_ITEMS.length - 1 && (
								<div
									className="h-px my-1   "
									style={{ opacity: 0.5 }}
								></div>
							)}
						</div>
					))}
				</nav>
			</div>
		</motion.div>
	);
};

export default Sidebar;
