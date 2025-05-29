import { useState, useEffect } from "react";
import { CheckCircle, Clock, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import OrdersTable from "../../components/orders/OrdersTable";
import OrderActions from "../../components/orders/OrderActions";
import FilterModal from "../../components/orders/FilterModal";
import config from "../../config.json";
import OrderDetailsDialog from "../../components/orders/OrderDetailsDialog";
import { toast } from "sonner";
import{X} from "lucide-react";
import PropTypes from "prop-types";

const statusOptions = [
  { value: "", label: "Tous les statuts" },
  { value: "EN_ATTENTE", label: "En Attente" },
  { value: "A_ENLEVER", label: "À Enlever" },
  { value: "ENLEVE", label: "Enlevé" },
  { value: "AU_DEPOT", label: "Au Dépôt" },
  { value: "RETOUR_DEPOT", label: "Retour Dépôt" },
  { value: "EN_COURS", label: "En Cours" },
  { value: "A_VERIFIER", label: "À Vérifier" },
  { value: "LIVRES", label: "Livré" },
  { value: "LIVRES_PAYE", label: "Livré Payé" },
  { value: "ECHANGE", label: "Échange" },
  { value: "RETOUR_DEFINITIF", label: "Retour Définitif" },
  { value: "RETOUR_INTER_AGENCE", label: "Retour Inter-Agence" },
  { value: "RETOUR_EXPEDITEURS", label: "Retour Expéditeurs" },
  { value: "RETOUR_RECU_PAYE", label: "Retour Reçu Payé" },
];

const API_URL = config.API_URL || "http://localhost:3000/api";

const NavexPage = () => {
  const navigate = useNavigate();
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    customerName: "",
    governorate: "",
  });

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Utilisateur non authentifié");
        }
        const response = await axios.get(`${API_URL}/stat/client/command`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const { results, totalOrders, totalRevenue } = response.data;
          const nonAbandonedOrders = totalOrders - (results?.ABANDONNEE?.count || 0);
          const nonAbandonedRevenue = totalRevenue - (results?.ABANDONNEE?.total || 0);
          setOrderStats({
            totalOrders: nonAbandonedOrders || 0,
            pendingOrders: results?.EN_ATTENTE?.count || 0,
            completedOrders: results?.LIVRES_PAYE?.count || 0,
            totalRevenue: nonAbandonedRevenue || 0,
          });
        } else {
          throw new Error("Erreur lors de la récupération des données");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.response?.data?.message || error.message || "Une erreur s'est produite");
        toast.error(`Erreur: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  const handleExport = () => {
    if (selectedOrders.length === 0) {
      toast.warning("Veuillez sélectionner au moins une commande à exporter.");
      return;
    }
    const escapeCsvField = (field) => {
      if (field == null) return "";
      const str = String(field);
      return `"${str.replace(/"/g, '""')}"`;
    };
    const csvContent = [
      ["ID", "Client", "Total", "Status", "Date", "Ville"],
      ...selectedOrders.map((orderId) => {
        const order = orders.find((o) => o.id === orderId);
        return [
          escapeCsvField(order.id),
          escapeCsvField(order.customer),
          escapeCsvField(order.total),
          escapeCsvField(order.status),
          escapeCsvField(order.date),
          escapeCsvField(order.gouvernorat || "-"),
        ];
      }),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders_export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Commandes exportées avec succès !");
  };

  const handlePrint = () => {
    if (selectedOrders.length === 0) {
      toast.warning("Veuillez sélectionner au moins une commande à imprimer.");
      return;
    }
    window.print();
    toast.success("Impression lancée !");
  };

  const handleEdit = () => {
    if (selectedOrders.length !== 1) {
      toast.warning("Veuillez sélectionner une seule commande pour modifier.");
      return;
    }
    toast.info("Veuillez utiliser le bouton Modifier dans la table pour éditer la commande.");
  };

  const handleDelete = async () => {
    if (selectedOrders.length === 0) {
      toast.warning("Veuillez sélectionner au moins une commande à supprimer.");
      return;
    }
    if (window.confirm(`Voulez-vous vraiment supprimer ${selectedOrders.length} commande(s) ?`)) {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Utilisateur non authentifié");
        }
        await Promise.all(
          selectedOrders.map((orderId) =>
            axios.delete(`${API_URL}/command/${orderId}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );
        setOrders((prev) => prev.filter((order) => !selectedOrders.includes(order.id)));
        setSelectedOrders([]);
        toast.success("Commandes supprimées avec succès !");
      } catch (error) {
        toast.error(`Erreur lors de la suppression : ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFilter = () => {
    console.log("Opening filter modal");
    setIsFilterModalOpen(true);
  };

  const handleApplyFilter = (newFilters) => {
    console.log("Applying new filters:", newFilters);
    setFilters(newFilters);
    setSelectedOrders([]);
    const statusLabel = statusOptions.find((opt) => opt.value === newFilters.status)?.label || "Tous les statuts";
    const filterSummary = [
      newFilters.status ? `Statut: ${statusLabel}` : "",
      newFilters.startDate ? `Du: ${newFilters.startDate}` : "",
      newFilters.endDate ? `Au: ${newFilters.endDate}` : "",
      newFilters.customerName ? `Client: ${newFilters.customerName}` : "",
      newFilters.governorate ? `Ville: ${newFilters.governorate}` : "",
    ]
      .filter(Boolean)
      .join(", ") || "Aucun filtre";
    toast.success(`Filtres appliqués : ${filterSummary}`);
    console.log("Closing modal (apply filters)");
    setIsFilterModalOpen(false);
  };

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title="Commandes" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total des Commandes"
            icon={ShoppingBag}
            value={orderStats.totalOrders.toString()}
            color="#6366F1"
          />
          <StatCard
            name="Commandes en attente"
            icon={Clock}
            value={`${orderStats.pendingOrders}`}
            color="#F59E0B"
          />
          <StatCard
            name="Commandes terminées"
            icon={CheckCircle}
            value={`${orderStats.completedOrders}`}
            color="#10B981"
          />
        </motion.div>
        <div className="flex justify-end">
          <OrderActions
            onExport={handleExport}
            onPrint={handlePrint}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFilter={handleFilter}
            selectedOrders={selectedOrders}
            disabled={loading}
          />
        </div>
        <OrdersTable
          filters={filters}
          selectedOrders={selectedOrders}
          setSelectedOrders={setSelectedOrders}
          statusMode="exclude-abandoned"
        />
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => {
            console.log("Closing modal (NavexPage onClose)");
            setIsFilterModalOpen(false);
          }}
          onApply={handleApplyFilter}
          currentFilters={filters}
        />
      </main>
    </div>
  );
};

NavexPage.propTypes = {
};

export default NavexPage;