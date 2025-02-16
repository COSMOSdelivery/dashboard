import React, { useEffect, useState } from "react";
import axios from "axios";
import StatCardClient from "../../components/Clients/StatCardClient";
import Header from "../../components/common/Header";
import { motion } from "framer-motion";
import {
  Loader,
  MapPin,
  Truck,
  Trash,
  CheckCircle,
  Settings,
  BarChart2,
  RotateCcw,
  DollarSign,
  RefreshCcw,
} from "lucide-react";
import config from "../../config.json";

const API_URL = config.API_URL;

const OverviewPageClient = () => {
  const [resultsByEtat, setResultsByEtat] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCount = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/stat/client/command`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setResultsByEtat(response.data.results);
      } else {
        throw new Error("Erreur lors de la récupération des données");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Aperçu" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCardClient
            name="En Attente"
            icon={Loader}
            value={`${resultsByEtat.EN_ATTENTE?.count || 0}  (${resultsByEtat.EN_ATTENTE?.totalPrix || 0} DT)`}
            color="#FFA726" // Orange clair
            showPrice={true}
          />
          <StatCardClient
            name="A Enlever"
            icon={Trash}
            value={`${resultsByEtat.A_ENLEVER?.count || 0}  (${resultsByEtat.A_ENLEVER?.totalPrix || 0} DT)`}
            color="#FB8C00" // Orange foncé
            showPrice={true}
          />
          <StatCardClient
            name="Enlevés"
            icon={CheckCircle}
            value={`${resultsByEtat.ENLEVE?.count || 0}  (${resultsByEtat.ENLEVE?.totalPrix || 0} DT)`}
            color="#29B6F6" // Bleu clair
            showPrice={true}
          />
          <StatCardClient
            name="Au dépot"
            icon={MapPin}
            value={`${resultsByEtat.AU_DEPOT?.count || 0}  (${resultsByEtat.AU_DEPOT?.totalPrix || 0} DT)`}
            color="#0277BD" // Bleu foncé
            showPrice={true}
          />
          <StatCardClient
            name="Retour dépots"
            icon={RotateCcw}
            value={`${resultsByEtat.RETOUR_DEPOT?.count || 0}  (${resultsByEtat.RETOUR_DEPOT?.totalPrix || 0} DT)`}
            color="#FFA726" // Orange clair
            showPrice={true}
          />
          <StatCardClient
            name="En cours"
            icon={Settings}
            value={`${resultsByEtat.EN_COURS?.count || 0}  (${resultsByEtat.EN_COURS?.totalPrix || 0} DT)`}
            color="#FB8C00" // Orange foncé
            showPrice={true}
          />
          <StatCardClient
            name="Á vérifier"
            icon={BarChart2}
            value={`${resultsByEtat.A_VERIFIER?.count || 0}  (${resultsByEtat.A_VERIFIER?.totalPrix || 0} DT)`}
            color="#29B6F6" // Bleu clair
            showPrice={true}
          />
          <StatCardClient
            name="Livrés"
            icon={Truck}
            value={`${resultsByEtat.LIVRES?.count || 0}  (${resultsByEtat.LIVRES?.totalPrix || 0} DT)`}
            color="#0277BD" // Bleu foncé
            showPrice={true}
          />
          <StatCardClient
            name="Livrés payés"
            icon={DollarSign}
            value={`${resultsByEtat.LIVRES_PAYE?.count || 0}  (${resultsByEtat.LIVRES_PAYE?.totalPrix || 0} DT)`}
            color="#FFA726" // Orange clair
            showPrice={true}
          />
          <StatCardClient
            name="Echanges"
            icon={RefreshCcw}
            value={`${resultsByEtat.ECHANGE?.count || 0}  (${resultsByEtat.ECHANGE?.totalPrix || 0} DT)`}
            color="#FB8C00" // Orange foncé
            showPrice={true}
          />
        </motion.div>

        <div className="grid grid-cols-4 gap-5">
          <StatCardClient
            name="Retour definitif"
            icon={RotateCcw}
            value={`${resultsByEtat.RETOUR_DEFINITIF?.count || 0}  (${resultsByEtat.RETOUR_DEFINITIF?.totalPrix || 0} DT)`}
            color="#F44336" // Rouge
            showPrice={true}
          />
          <StatCardClient
            name="Retour inter-agence"
            icon={RotateCcw}
            value={`${resultsByEtat.RETOUR_INTER_AGENCE?.count || 0}  (${resultsByEtat.RETOUR_INTER_AGENCE?.totalPrix || 0} DT)`}
            color="#E53935" // Rouge foncé
            showPrice={true}
          />
          <StatCardClient
            name="Retour Expéditeurs"
            icon={RotateCcw}
            value={`${resultsByEtat.RETOUR_EXPEDITEURS?.count || 0}  (${resultsByEtat.RETOUR_EXPEDITEURS?.totalPrix || 0} DT)`}
            color="#D32F2F" // Rouge encore plus foncé
            showPrice={true}
          />
          <StatCardClient
            name="Retour recu payés"
            icon={RotateCcw}
            value={`${resultsByEtat.RETOUR_RECU_PAYE?.count || 0}  (${resultsByEtat.RETOUR_RECU_PAYE?.totalPrix || 0} DT)`}
            color="#C62828" // Rouge intense
            showPrice={true}
          />
        </div>
      </main>
    </div>
  );
};

export default OverviewPageClient;
