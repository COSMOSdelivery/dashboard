import { motion } from "framer-motion";
import { Frown } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <header className="bg-white text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-semibold">Page Introuvable</h1>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6 lg:px-8 text-center">
        <motion.div
          className="flex flex-col items-center justify-center space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Frown size={100} className="text-red-500" />
          <h1 className="text-4xl font-bold text-black-200">
            404 - Page Non Trouvée
          </h1>
          <p className="text-lg text-black-400">
            Désolé, la page que vous recherchez est introuvable. Elle a
            peut-être été supprimée ou n’existe pas.
          </p>
          <a
            href="/"
            className="mt-6 inline-block px-6 py-3 bg-blue-400 hover:bg-blue-700 text-white font-medium rounded-md shadow-lg transition duration-300"
          >
            Retourner à la Page d'Accueil
          </a>
        </motion.div>
      </main>
    </div>
  );
};

export default NotFoundPage;
