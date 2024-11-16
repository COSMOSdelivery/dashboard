import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";

const APERÇUS = [
	{
		icon: TrendingUp,
		color: "text-green-500",
		insight: "Les revenus ont augmenté de 15 % par rapport au mois dernier, principalement grâce à une campagne par e-mail réussie.",
	},
	{
		icon: Users,
		color: "text-blue-500",
		insight: "La fidélisation des clients a augmenté de 8 % après le lancement du nouveau programme de fidélité.",
	},
	{
		icon: ShoppingBag,
		color: "text-purple-500",
		insight: 'La catégorie de produit "Électronique" présente le plus grand potentiel de croissance selon les tendances récentes du marché.',
	},
	{
		icon: DollarSign,
		color: "text-yellow-500",
		insight: "L'optimisation de la stratégie tarifaire pourrait potentiellement augmenter les marges bénéficiaires globales de 5 à 7 %. ",
	},
];

const APoweredInsights = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 1.0 }}
		>
			<h2 className='text-xl font-semibold text-gray-100 mb-4'>Aperçus Alimentés par l'IA</h2>
			<div className='space-y-4'>
				{APERÇUS.map((item, index) => (
					<div key={index} className='flex items-center space-x-3'>
						<div className={`p-2 rounded-full ${item.color} bg-opacity-20`}>
							<item.icon className={`size-6 ${item.color}`} />
						</div>
						<p className='text-gray-300'>{item.insight}</p>
					</div>
				))}
			</div>
		</motion.div>
	);
};
export default APoweredInsights;
