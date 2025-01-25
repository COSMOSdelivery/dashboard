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
const OverviewPageClient = () => {
  return (
    <div class="flex-1 overflow-auto relative z-10">
      <Header title="Aperçu" />

      <main class="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCardClient
            name="En Attente"
            icon={Loader}
            value="15"
            color="#6366F1"
          />
          <StatCardClient
            name="A Enlever"
            icon={Trash}
            value="18"
            color="#8B5CF6"
          />
          <StatCardClient
            name="Enlevés"
            icon={CheckCircle}
            value="783"
            color="#EC4899"
          />
          <StatCardClient
            name="Au dépot"
            icon={MapPin}
            value="18"
            color="#10B981"
          />
          <StatCardClient
            name="Retour dépots"
            icon={RotateCcw}
            value="14"
            color="#10B981"
          />
          <StatCardClient
            name="En cours"
            icon={Settings}
            value="70"
            color="#10B981"
          />
          <StatCardClient
            name="Á vérifier"
            icon={BarChart2}
            value="5"
            color="#10B981"
          />
          <StatCardClient
            name="Livrés"
            icon={Truck}
            value="23"
            color="#10B981"
          />
          <StatCardClient
            name="Livrés payés"
            icon={DollarSign}
            value="0"
            color="#10B981"
          />
          <StatCardClient
            name="Echanges"
            icon={RefreshCcw}
            value="28"
            color="#10B981"
          />
        </motion.div>

        <div class="grid grid-cols-4 gap-5">
  <StatCardClient
    name="Retour definitif"
    icon={RotateCcw}
    value="14.2%"
    color="#FFB6C1"
  />
  <StatCardClient
    name="Retour inter-agence"
    icon={RotateCcw}
    value="14.2%"
    color="#FFB6C1"
  />
  <StatCardClient
    name="Retour Expéditeurs"
    icon={RotateCcw}
    value="14.2%"
    color="#FFB6C1"
  />
  <StatCardClient
    name="Retour recu payés"
    icon={RotateCcw}
    value="14.2%"
    color="#FFB6C1"
  />
              </div>
              </main>
    </div>
  );
};
export default OverviewPageClient;
