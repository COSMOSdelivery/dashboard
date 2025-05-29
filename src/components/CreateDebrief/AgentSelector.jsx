import PropTypes from 'prop-types';

const AgentSelector = ({ agents, selectedAgent, setSelectedAgent, loading }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner un livreur</label>
    {loading ? (
      <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
    ) : (
      <select
        value={selectedAgent?.id || ''}
        onChange={(e) => {
          const agent = agents.find((a) => a.id === parseInt(e.target.value));
          setSelectedAgent(agent || null);
        }}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label="Sélectionner un livreur"
        disabled={agents.length === 0}
      >
        <option value="">-- Choisir un livreur --</option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name} ({agent.gouvernorat})
          </option>
        ))}
      </select>
    )}
  </div>
);

AgentSelector.propTypes = {
  agents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      gouvernorat: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedAgent: PropTypes.object,
  setSelectedAgent: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default AgentSelector;