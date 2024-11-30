import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import AdminTable from "../components/users/AdminTable";
import Livreur from "../components/users/Livreur";
import ServiceClientTable from "../components/users/ServiceClientTable";
const userStats = {
	totalUsers: 152845,
	newUsersToday: 243,
	activeUsers: 98520,
	churnRate: "2.4%",
};

const UsersPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Utilisateurs' />
			{/*here i want a button to add users(when clicked another component pop up appears) */}
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Utilisateurs totaux'
						icon={UsersIcon}
						value={userStats.totalUsers.toLocaleString()}
						color='#6366F1'
					/>
					<StatCard name='Nouveaux utilisateurs' icon={UserPlus} value={userStats.newUsersToday} color='#10B981' />
					<StatCard
						name='Utilisateurs actifs'
						icon={UserCheck}
						value={userStats.activeUsers.toLocaleString()}
						color='#F59E0B'
					/>
					<StatCard name='Taux de désabonnement' icon={UserX} value={userStats.churnRate} color='#EF4444' />
				</motion.div>
				<div className="tables" 
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						alignContent: "center",
						flexWrap: "nowrap",
						flexDirection: "column",
					  }}
					>
				<AdminTable />
				<ServiceClientTable />
				<Livreur />
				<UsersTable />
				
				
				
				</div>

				
			</main>
		</div>
	);
};
export default UsersPage;
