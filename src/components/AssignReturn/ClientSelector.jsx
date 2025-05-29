const ClientSelector = ({ clients, selectedClient, setSelectedClient, loading }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner un client</label>
      {loading ? (
        <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
      ) : (
        <select
          value={selectedClient?.id || ''}
          onChange={(e) => {
            const client = clients.find((c) => c.id === e.target.value);
            setSelectedClient(client || null);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Sélectionner un client"
        >
          <option value="">Choisir un client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} ({client.gouvernorat})
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ClientSelector;