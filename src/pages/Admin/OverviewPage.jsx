import { useState, useEffect } from "react";
import { BarChart2, ShoppingBag, Users, Zap, TrendingUp, Package, Clock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import axios from "axios";
import config from "../../config.json";
import Header from "../../components/common/Header";
const API_URL = config.API_URL;
const OverviewPage = () => {
  const [activeFilter, setActiveFilter] = useState('kpi'); // 'kpi' or 'commandes'
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayDelivered: 0,
    todayProfit: 0,
  });
  const [ordersByStatus, setOrdersByStatus] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage

  // Fetch data from endpoints
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch global statistics
        const globalStatsResponse = await axios.get(`${API_URL}/stat/admin/global-statistics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const globalStats = globalStatsResponse.data.global;

        // Fetch user counts
        const usersResponse = await axios.get(`${API_URL}/stat/usersNumbers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch order counts by status
        const commandResponse = await axios.get(`${API_URL}/stat/client/command`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch daily orders for charts
        const dailyOrdersResponse = await axios.get(`${API_URL}/stat/daily-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update orderStats
        setOrderStats({
          totalOrders: globalStats.totalOrders || 0,
          totalUsers: usersResponse.data.totalUsers || 0,
          totalRevenue: globalStats.totalRevenue || 0,
          todayOrders: dailyOrdersResponse.data.find(
            (item) => item.date === new Date().toISOString().split("T")[0]
          )?.total_orders || 0,
          todayDelivered: globalStats.deliveriesThisWeek || 0, // Adjust based on actual daily delivered data if available
          todayProfit: globalStats.totalLivreurRevenue || 0, // Adjust based on your profit calculation
        });

        // Update ordersByStatus
        setOrdersByStatus({
          "En Attente": commandResponse.data.results.EN_ATTENTE?.count || 0,
          "Prête pour enlèvement": commandResponse.data.results.A_ENLEVER?.count || 0,
          "Enlèvement confirmé": commandResponse.data.results.ENLEVE?.count || 0,
          "Échec de l'enlèvement": 0, // Add endpoint or logic if available
          "En stock": commandResponse.data.results.AU_DEPOT?.count || 0,
          "En cours de livraison": commandResponse.data.results.EN_COURS?.count || 0,
          "Livré aujourd'hui": globalStats.deliveriesThisWeek || 0, // Adjust if daily data is available
          "À vérifier": commandResponse.data.results.A_VERIFIER?.count || 0,
          "Livré non payé": 0, // Add endpoint or logic if available
          "Retour en stock": commandResponse.data.results.RETOUR_DEPOT?.count || 0,
          "Prêt pour retour": 0, // Add endpoint or logic if available
          "Retour en cours": commandResponse.data.results.RETOUR_INTER_AGENCE?.count || 0,
          "Échec du retour": commandResponse.data.results.RETOUR_EXPEDITEURS?.count || 0,
          "Livré et payé": commandResponse.data.results.LIVRES_PAYES?.count || 0,
        });

        // Update revenueData for chart
        setRevenueData(
          dailyOrdersResponse.data.slice(-8).map((item) => ({
            date: item.date,
            revenue: commandResponse.data.results[item.date]?.totalPrix || 0,
            profit: 0, // Adjust based on actual profit data if available
          }))
        );

        // Update deliveryData for chart
        setDeliveryData(
          dailyOrdersResponse.data.slice(-7).map((item, index) => ({
            day: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index % 7],
            ordered: item.total_orders || 0,
            delivered: commandResponse.data.results.LIVRES?.count || 0, // Adjust if daily delivered data is available
          }))
        );

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // StatCard component
  const StatCard = ({ name, icon: Icon, value, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{name}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div 
          className="p-3 rounded-full"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </div>
  );

  // StatusCard component
  const StatusCard = ({ category, statuses, color, icon: Icon }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center mb-4">
        <Icon size={20} style={{ color }} className="mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
      </div>
      <div className="space-y-3">
        {statuses.map(({ name, count, isHighlight }) => (
          <div key={name} className="flex justify-between items-center">
            <span className={`text-sm ${isHighlight ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
              {name}
            </span>
            <span className={`font-semibold ${isHighlight ? 'text-red-600' : 'text-gray-900'}`}>
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // SimpleChart component (unchanged, but now uses dynamic data)
  const SimpleChart = ({ data, type = 'line', title }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-64 flex items-end justify-between space-x-2">
        {type === 'line' ? (
          <div className="w-full h-full flex items-end justify-between">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-3 bg-blue-500 rounded-t"
                  style={{ height: `${(item.revenue / Math.max(...data.map(d => d.revenue))) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-1 transform -rotate-45">
                  {item.date.slice(-2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex items-end space-x-1 mb-2">
                <div 
                  className="w-4 bg-blue-600 rounded-t"
                  style={{ height: `${(item.ordered / Math.max(...data.map(d => d.ordered))) * 180}px` }}
                ></div>
                <div 
                  className="w-4 bg-blue-300 rounded-t"
                  style={{ height: `${(item.delivered / Math.max(...data.map(d => d.delivered))) * 180}px` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">{item.day}</span>
            </div>
          ))
        )}
      </div>
      {type === 'bar' && (
        <div className="flex justify-center mt-4 space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
            <span className="text-xs text-gray-600">Commandées</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-300 rounded mr-2"></div>
            <span className="text-xs text-gray-600">Livrées</span>
          </div>
        </div>
      )}
    </div>
  );

  // Commande status categories
  const commandeStatusCategories = [
    {
      category: "🟡 Commandes en cours",
      color: "#F59E0B",
      icon: Clock,
      statuses: [
        { name: "En Attente", count: ordersByStatus["En Attente"] },
        { name: "Prête pour enlèvement", count: ordersByStatus["Prête pour enlèvement"] },
        { name: "Enlèvement confirmé", count: ordersByStatus["Enlèvement confirmé"] },
        { name: "Échec de l'enlèvement", count: ordersByStatus["Échec de l'enlèvement"] },
      ],
    },
    {
      category: "🔵 Stock et Livraison",
      color: "#3B82F6",
      icon: Package,
      statuses: [
        { name: "En stock", count: ordersByStatus["En stock"] },
        { name: "En cours de livraison", count: ordersByStatus["En cours de livraison"] },
        { name: "Livré aujourd'hui", count: ordersByStatus["Livré aujourd'hui"] },
      ],
    },
    {
      category: "🟠 Vérification",
      color: "#F97316",
      icon: AlertCircle,
      statuses: [
        { name: "À vérifier", count: ordersByStatus["À vérifier"] },
        { name: "Livré non payé", count: ordersByStatus["Livré non payé"], isHighlight: true },
      ],
    },
    {
      category: "🔴 Retours",
      color: "#EF4444",
      icon: RefreshCw,
      statuses: [
        { name: "Retour en stock", count: ordersByStatus["Retour en stock"] },
        { name: "Prêt pour retour", count: ordersByStatus["Prêt pour retour"] },
        { name: "Retour en cours", count: ordersByStatus["Retour en cours"] },
        { name: "Échec du retour", count: ordersByStatus["Échec du retour"] },
      ],
    },
    {
      category: "🟢 Livraison réussie",
      color: "#10B981",
      icon: CheckCircle,
      statuses: [
        { name: "Livré et payé", count: ordersByStatus["Livré et payé"] },
      ],
    },
  ];

  return (
  <div className="flex-1 overflow-auto relative z-10 bg-gray-50 min-h-screen">
    {/* Header */}
    <Header title="Vue d'ensemble" />

    {/* Buttons */}
    <div className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveFilter('kpi')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeFilter === 'kpi'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} />
            <span>KPI</span>
          </div>
        </button>
        <button
          onClick={() => setActiveFilter('commandes')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeFilter === 'commandes'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >


          <div className="flex items-center space-x-2">
            <ShoppingBag size={16} />
            <span>Commandes</span>
          </div>
        </button>
      </div>
    </div>

    <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : activeFilter === 'kpi' ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              name="Commandes Aujourd'hui"
              icon={ShoppingBag}
              value={`${orderStats.todayOrders}`}
              color="#6366F1"
              subtitle="Montant total des commandes"
            />
            <StatCard
              name="Livré Aujourd'hui"
              icon={CheckCircle}
              value={`${orderStats.todayDelivered}`}
              color="#10B981"
              subtitle="Commandes livrées"
            />
            <StatCard
              name="Profit Aujourd'hui"
              icon={TrendingUp}
              value={`${orderStats.todayProfit} dt`}
              color="#F59E0B"
              subtitle="Bénéfice enregistré"
            />
            <StatCard
              name="Total Utilisateurs"
              icon={Users}
              value={orderStats.totalUsers.toString()}
              color="#8B5CF6"
              subtitle="Utilisateurs enregistrés"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SimpleChart 
              data={revenueData} 
              type="line" 
              title="Revenue & Profit" 
            />
            <SimpleChart 
              data={deliveryData} 
              type="bar" 
              title="Livré cette semaine" 
            />
          </div>
        </>
      ) : (
        <>
          {/* Commandes Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {commandeStatusCategories.map((category, index) => (
              <StatusCard
                key={index}
                category={category.category}
                statuses={category.statuses}
                color={category.color}
                icon={category.icon}
              />
            ))}
          </div>

          {/* Summary Stats for Commands */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              name="Total Commandes"
              icon={ShoppingBag}
              value={orderStats.totalOrders.toString()}
              color="#6366F1"
            />
            <StatCard
              name="En Cours"
              icon={Clock}
              value={(ordersByStatus["En Attente"] + ordersByStatus["Prête pour enlèvement"]).toString()}
              color="#F59E0B"
            />
            <StatCard
              name="Livrées"
              icon={CheckCircle}
              value={ordersByStatus["Livré et payé"].toString()}
              color="#10B981"
            />
            <StatCard
              name="Retours"
              icon={RefreshCw}
              value={(ordersByStatus["Retour en stock"] + ordersByStatus["Retour en cours"]).toString()}
              color="#EF4444"
            />
          </div>
        </>
      )}
    </main>
  </div>
);
};

export default OverviewPage;