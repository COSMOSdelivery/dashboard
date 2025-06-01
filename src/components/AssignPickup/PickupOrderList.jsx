import { Package, Phone, MapPin } from 'lucide-react';

const PickupOrderList = ({ orders, onSelect, selectedAgent, selectedClient, getStatusColor, stats, loading }) => {
  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Commandes Disponibles pour Ramassage
          </h2>
          <div className="text-sm text-gray-600">
            Nombre: <span className="font-semibold">{stats.count}</span> | Articles:{' '}
            <span className="font-semibold">{stats.totalItems}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Aucune commande disponible</p>
              <p className="text-sm mt-1">
                {selectedAgent && selectedClient
                  ? 'Aucune commande correspondant au client et au livreur'
                  : 'Sélectionnez un client et un livreur'}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div
                key={order.code_a_barre}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect(order)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900">{order.code_a_barre}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.etat)}`}>
                        {order.etat}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{order.nom_prioritaire}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{order.telephone1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{order.gouvernorat}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold">{order.nb_article} articles</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupOrderList;