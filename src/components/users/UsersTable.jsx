import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

// Example of user data from JSON
const userData = [
	{
		nom: "العنزي",
		prenom: "سلمان",
		nomShop: "محل سلمان",
		email: "salman@example.com",
		gouvernerat: "تونس",
		ville: "منوبة",
		localité: "دوار هيشر",
		codePostal: "2001",
		adresse: "456 شارع النخيل",
		telephone: "98765432",
		codeTVA: "TVA456",
		cin: "CIN456",
		role: "Admin",
		dateInscription: "2023-01-05",
		derniereMiseAJour: "2023-01-06",
	},
	{
		nom: "حمدي",
		prenom: "أحمد",
		nomShop: "مخبز حمدي",
		email: "ahmed@example.com",
		gouvernerat: "صفاقس",
		ville: "صفاقس",
		localité: "المدينة العتيقة",
		codePostal: "3000",
		adresse: "789 شارع الحرية",
		telephone: "11122333",
		codeTVA: "TVA789",
		cin: "CIN789",
		role: "Livreur",
		dateInscription: "2023-01-10",
		derniereMiseAJour: "2023-01-11",
	},
	{
		nom: "السعيدي",
		prenom: "مريم",
		nomShop: "متجر مريم",
		email: "maryam@example.com",
		gouvernerat: "تونس",
		ville: "أريانة",
		localité: "منوبة",
		codePostal: "2002",
		adresse: "321 شارع الأمل",
		telephone: "22233444",
		codeTVA: "TVA321",
		cin: "CIN321",
		role: "Client",
		dateInscription: "2023-01-15",
		derniereMiseAJour: "2023-01-16",
	},
	{
		nom: "الجبالي",
		prenom: "يوسف",
		nomShop: "محل يوسف",
		email: "youssef@example.com",
		gouvernerat: "مدنين",
		ville: "جرجيس",
		localité: "سيدي مخلوف",
		codePostal: "5000",
		adresse: "654 شارع السعادة",
		telephone: "34567890",
		codeTVA: "TVA654",
		cin: "CIN654",
		role: "Customer",
		dateInscription: "2023-01-20",
		derniereMiseAJour: "2023-01-21",
	},
]; 

const UsersTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState(userData);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newUser, setNewUser] = useState({
		nom: "",
		prenom: "",
		nomShop: "",
		email: "",
		gouvernerat: "",
		ville: "",
		localité: "",
		codePostal: "",
		adresse: "",
		telephone: "",
		codeTVA: "",
		cin: "",
		role: "",
	});

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = userData.filter(
			(user) =>
				`${user.prenom} ${user.nom}`.toLowerCase().includes(term) ||
				user.email.toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewUser((prevUser) => ({
			...prevUser,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setFilteredUsers((prevUsers) => [...prevUsers, newUser]);
		setNewUser({
			nom: "",
			prenom: "",
			nomShop: "",
			email: "",
			gouvernerat: "",
			ville: "",
			localité: "",
			codePostal: "",
			adresse: "",
			telephone: "",
			codeTVA: "",
			cin: "",
			role: "",
		});
		setIsModalOpen(false);
	};

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Utilisateurs</h2>
				<button
					className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
					onClick={() => setIsModalOpen(true)}
				>
					Ajouter Utilisateur
				</button>
				<div className='relative'>
					<input
						type='text'
						placeholder='Recherche user...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			{/* Users Table */}
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Nom Complet</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Email</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Rôle</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{filteredUsers.map((user, index) => (
							<motion.tr
								key={index}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='flex-shrink-0 h-10 w-10'>
											<div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
												{user.prenom.charAt(0)}
											</div>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-medium text-gray-100'>{`${user.prenom} ${user.nom}`}</div>
										</div>
									</div>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>{user.email}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>
										{user.role}
									</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2'>Edit</button>
									<button className='text-red-400 hover:text-red-300'>Delete</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Modal for Adding New User */}
			
			{isModalOpen && (
	<motion.div
		className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
	>
		<motion.div className='bg-white rounded-lg p-6 shadow-lg min-w-[90vh] h-[400px] overflow-auto mb-4 relative'>
			{/* Close button */}
			<button
				className='absolute top-4 right-4 bg-red-500 text-white text-lg rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600'
				onClick={() => setIsModalOpen(false)}
				aria-label='Close'
			>
				&times; {/* This is the "X" character */}
			</button>

			<h3 className='text-lg font-bold text-black mb-4 text-center'>Ajouter un Utilisateur</h3>

			<form onSubmit={handleSubmit}>
				{/* Input fields for new user data */}
				{Object.keys(newUser).map((key) => (
					<div key={key} className='mb-4'>
						<label className='block text-gray-700 text-sm'>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
						<input
							type='text'
							name={key}
							value={newUser[key]}
							onChange={handleInputChange}
							className='mt-1 block w-full border border-gray-300 text-black rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
							required
						/>
					</div>
				))}
				<div className='flex justify-end'>
					<button type='button' className='bg-red-500 text-white px-4 py-2 rounded-lg mr-2' onClick={() => setIsModalOpen(false)}>
						Annuler
					</button>
					<button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded-lg'>
						Ajouter
					</button>
				</div>
			</form>
		</motion.div>
	</motion.div>
)}




		</motion.div>
	);
};

export default UsersTable;
