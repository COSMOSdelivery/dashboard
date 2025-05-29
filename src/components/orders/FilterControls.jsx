import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const FilterControls = ({ searchTerm, setSearchTerm, filter, onFilterChange, filterOptions }) => {
  // Map etat values to human-readable labels
  const etatLabels = {
    all: "Tous les états",
    EN_ATTENTE: "En attente",
    A_ENLEVER: "À Enlever",
    AU_DEPOT: "Enlevé",
    RETOUR_DEPOT: "Retour Dépôt",
    EN_COURS: "En cours",
    A_VERIFIER: "À vérifier",
    LIVRES: "Livrées",
    LIVRES_PAYE: "Livrées payées",
    ECHANGE: "Échange",
    RETOUR_DEFINITIF: "Retour Définitif",
    RETOUR_INTER_AGENCE: "Retour Inter-Agence",
    RETOUR_EXPEDITEURS: "Retour Expéditeurs",
    RETOUR_RECU_PAYE: "Retour Reçu Payé",
    delivered: "Livrées (EN)",
    canceled: "Annulées (EN)",
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher une commande..."
          className="pl-10 w-full sm:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Select value={filter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filtrer par état" />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {etatLabels[option] || option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterControls;