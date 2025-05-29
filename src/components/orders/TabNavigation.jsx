import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";

const TabNavigation = ({ activeTab, setActiveTab, showForm, setShowForm, setEditingCommande }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowForm(false);
    setEditingCommande(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Tab Buttons */}
        <div className="flex gap-4">
          <Button
            variant={activeTab === "commandes" ? "default" : "outline"}
            onClick={() => handleTabClick("commandes")}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm
              transition-all duration-300
              ${
                activeTab === "commandes"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-gray-600 hover:bg-gray-100 border-gray-300"
              }
            `}
            aria-current={activeTab === "commandes" ? "page" : undefined}
            aria-label="Afficher les commandes en cours"
          >
            <List className="h-4 w-4" />
            <span>Commandes en cours</span>
          </Button>
          <Button
            variant={activeTab === "abandonnees" ? "default" : "outline"}
            onClick={() => handleTabClick("abandonnees")}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm
              transition-all duration-300
              ${
                activeTab === "abandonnees"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-gray-600 hover:bg-gray-100 border-gray-300"
              }
            `}
            aria-current={activeTab === "abandonnees" ? "page" : undefined}
            aria-label="Afficher les commandes abandonnées"
          >
            <List className="h-4 w-4" />
            <span>Commandes abandonnées</span>
          </Button>
        </div>

        {/* Nouvelle Commande Button */}
        {!showForm && (
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingCommande(null);
            }}
            disabled={showForm}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-full bg-green-500 text-white
              font-semibold transition-all duration-300 transform hover:scale-105
              disabled:bg-gray-400 disabled:cursor-not-allowed
            `}
            aria-label="Créer une nouvelle commande"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle Commande</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;