import React, { useState } from "react";
import Header from "../../components/common/Header";
import StatCardClient from "../../components/Clients/StatCardClient";
import { motion } from "framer-motion";
import { Package, User, Truck, Calendar } from "lucide-react"; // Example icon library

const Searchcolis = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [foundPackage, setFoundPackage] = useState(null);

    const packageData = [
        {
            id: 1,
            noColis: "123456",
            destinataire: "John Doe",
            statut: "En cours",
            date: "2023-04-15",
            actions: ["Détails", "Annuler"],
        },
        {
            id: 2,
            noColis: "987654",
            destinataire: "Jane Smith",
            statut: "Livré",
            date: "2023-04-10",
            actions: ["Détails"],
        },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        const found = packageData.find((item) => item.noColis === searchTerm);
        setFoundPackage(found || null);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Header title="Recherche Colis" />

            <form onSubmit={handleSearch} className="mb-8">
                <input
                    type="text"
                    placeholder="Entrez le numéro de colis"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Rechercher
                </button>
            </form>

            {foundPackage ? (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCardClient name="No. Colis" icon={Package} value={foundPackage.noColis} color="#6366F1" />
                        <StatCardClient name="Destinataire" icon={User} value={foundPackage.destinataire} color="#8B5CF6" />
                        <StatCardClient name="Statut" icon={Truck} value={foundPackage.statut} color="#EC4899" />
                        <StatCardClient name="Date" icon={Calendar} value={foundPackage.date} color="#10B981" />
                    </div>

                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-left">No. Colis</th>
                                <th className="p-3 text-left">Destinataire</th>
                                <th className="p-3 text-left">Statut</th>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3">{foundPackage.noColis}</td>
                                <td className="p-3">{foundPackage.destinataire}</td>
                                <td className="p-3">{foundPackage.statut}</td>
                                <td className="p-3">{foundPackage.date}</td>
                                <td className="p-3">
                                    {foundPackage.actions.map((action, index) => (
                                        <button
                                            key={index}
                                            className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : searchTerm ? (
                <p className="text-gray-600">Aucun colis trouvé avec ce numéro.</p>
            ) : null}
        </motion.div>
    );
};

export default Searchcolis;