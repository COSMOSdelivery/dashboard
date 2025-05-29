import { useState, useEffect } from "react";
import { Package, Scan, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import QrScanner from "react-qr-scanner";
import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import OrdersTable from "../../components/orders/OrdersTable";
import config from "../../config.json";

const API_URL = config.API_URL;

const StockPage = () => {
  const [stockStats, setStockStats] = useState({
    totalInStock: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedOrders, setScannedOrders] = useState([]);
  const [refreshTable, setRefreshTable] = useState(false);
  const [scannerError, setScannerError] = useState(null);
  // Use a single status to avoid toUpperCase error
  const [tableFilters, setTableFilters] = useState({
    status: "AU_DEPOT", // Single status to match OrdersTable expectation
    refreshKey: Date.now(),
  });

  useEffect(() => {
    const fetchStockStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/stat/client/command`);

        if (response.status === 200) {
          const { results } = response.data;
          setStockStats({
            totalInStock: results?.AU_DEPOT?.count || 0,
          });
        } else {
          throw new Error("Erreur lors de la récupération des données");
        }
      } catch (error) {
        setError(error.response?.data?.message || error.message || "Une erreur s'est produite");
      } finally {
        setLoading(false);
      }
    };

    fetchStockStats();
  }, [refreshTable]);

  const handleBarcodeScan = async (scannedCode) => {
    try {
      const response = await axios.get(`${API_URL}/commandHistory/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        params: { code_a_barre: scannedCode },
      });

      if (response.status === 200) {
        const order = response.data.command;
        if (!["AU_DEPOT", "RETOUR_DEPOT"].includes(order.etat)) {
          toast.error(`La commande ${scannedCode} n'est pas dans le stock (état: ${order.etat})`);
          return;
        }

        await axios.post(
          `${API_URL}/command/updateStatus`,
          { code_a_barre: scannedCode, newStatus: "EN_COURS" },
          { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
        );

        toast.success(`Commande ${scannedCode} passée à l'état EN_COURS`);

        setScannedOrders((prev) => [
          ...prev,
          {
            id: order.code_a_barre,
            customer: `${order.nom_prioritaire} ${order.prenom_prioritaire || ''}`.trim(),
            status: "EN_COURS",
            date: new Date(order.dateAjout).toISOString().split("T")[0],
          },
        ]);

        const statsResponse = await axios.get(`${API_URL}/stat/client/command`);
        if (statsResponse.status === 200) {
          setStockStats({
            totalInStock: statsResponse.data.results?.AU_DEPOT?.count || 0,
          });
        }

        setRefreshTable((prev) => !prev);
        setTableFilters((prev) => ({ ...prev, refreshKey: Date.now() }));
      } else {
        toast.error("Commande non trouvée");
      }
    } catch (error) {
      toast.error(`Erreur: ${error.response?.data?.msg || error.message}`);
    } finally {
      setBarcode("");
    }
  };

  const handleQrScan = (data) => {
    if (data?.text) {
      handleBarcodeScan(data.text);
    }
  };

  const handleQrError = (err) => {
    console.error("Erreur de scan QR:", err);
    setScannerError("Impossible d'accéder à la caméra. Vérifiez les permissions ou utilisez la saisie manuelle.");
  };

  const openScanner = () => {
    setScannedOrders([]);
    setScannerError(null);
    setIsScannerOpen(true);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
    setScannerError(null);
  };

  const qrScannerConstraints = {
    video: { facingMode: "environment" },
  };

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title="Stock" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Commandes en stock"
            icon={Package}
            value={stockStats.totalInStock.toString()}
            color="#8B5CF6"
          />
        </motion.div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Scanner le code-barres..."
              className="bg-gray-200 text-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none w-full"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && barcode) {
                  handleBarcodeScan(barcode);
                }
              }}
              autoFocus
              aria-label="Saisir ou scanner un code-barres"
            />
            <svg
              className="absolute left-3 top-2.5 text-gray-700"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
              <line x1="8" y1="6" x2="8" y2="18" />
              <line x1="12" y1="6" x2="12" y2="18" />
              <line x1="16" y1="6" x2="16" y2="18" />
            </svg>
          </div>
          <button
            onClick={openScanner}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            aria-label="Ouvrir le scanner de code-barres"
          >
            <Scan size={18} />
            Scanner
          </button>
        </div>



        <style jsx>{`
          .stock-orders-table th:nth-child(1),
          .stock-orders-table td:nth-child(1),
          .stock-orders-table th:nth-child(8),
          .stock-orders-table td:nth-child(8) {
            display: none;
          }
        `}</style>
        <div className="stock-orders-table">
          <OrdersTable filters={tableFilters} key={refreshTable} />
        </div>

        <AnimatePresence>
          {isScannerOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Scanner les commandes</h3>
                  <button
                    onClick={closeScanner}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Fermer le scanner"
                  >
                    <X size={24} />
                  </button>
                </div>

                {scannerError ? (
                  <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p>{scannerError}</p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <QrScanner
                      delay={300}
                      onError={handleQrError}
                      onScan={handleQrScan}
                      style={{ width: "100%", maxHeight: "300px" }}
                      constraints={qrScannerConstraints}
                    />
                  </div>
                )}

                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Saisir le code-barres manuellement..."
                    className="bg-gray-200 text-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none w-full"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && barcode) {
                        handleBarcodeScan(barcode);
                      }
                    }}
                    aria-label="Saisir un code-barres manuellement"
                  />
                  <svg
                    className="absolute left-3 top-2.5 text-gray-700"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
                    <line x1="8" y1="6" x2="8" y2="18" />
                    <line x1="12" y1="6" x2="12" y2="18" />
                    <line x1="16" y1="6" x2="16" y2="18" />
                  </svg>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          ID Commande
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          État
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {scannedOrders.length > 0 ? (
                        scannedOrders.map((order, index) => (
                          <motion.tr
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <td className="px-6 py-3 whitespace-nowrap text-sm text-blue-600">
                              {order.id}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                              {order.customer}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm">
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-800">
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                              {order.date}
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-4 text-center text-sm text-gray-500"
                          >
                            Aucune commande scannée
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default StockPage;