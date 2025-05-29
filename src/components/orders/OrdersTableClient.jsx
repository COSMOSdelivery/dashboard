import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Printer, Trash2, Edit, RotateCcw } from "lucide-react";
import axios from "axios";
import config from "../../config.json";

const GOUVERNORAT_CITIES = {
  ariana: [
    { value: "ariana", label: "Ariana" },
    { value: "raoued", label: "Raoued" },
    { value: "sidi_thabet", label: "Sidi Thabet" },
    { value: "kalâat_l_andalous", label: "Kalâat l’Andalous" },
    { value: "la_soukra", label: "La Soukra" },
    { value: "borj_louzir", label: "Borj Louzir" },
    { value: "mnihla", label: "Mnihla" },
  ],
  tunis: [
    { value: "tunis", label: "Tunis" },
    { value: "la_marsa", label: "La Marsa" },
    { value: "carthage", label: "Carthage" },
    { value: "le_bardo", label: "Le Bardo" },
    { value: "sidi_bou_said", label: "Sidi Bou Saïd" },
    { value: "le_kram", label: "Le Kram" },
    { value: "la_goulette", label: "La Goulette" },
    { value: "sidi_hassine", label: "Sidi Hassine" },
    { value: "el_ouardia", label: "El Ouardia" },
    { value: "ezzouhour", label: "Ezzouhour" },
    { value: "bab_bhar", label: "Bab Bhar" },
    { value: "bab_souika", label: "Bab Souika" },
    { value: "cite_el_khadra", label: "Cité El Khadra" },
    { value: "jebel_jelloud", label: "Jebel Jelloud" },
    { value: "kabaria", label: "Kabaria" },
    { value: "medina", label: "Médina" },
  ],
  manouba: [
    { value: "manouba", label: "Manouba" },
    { value: "den_den", label: "Den Den" },
    { value: "douar_hicher", label: "Douar Hicher" },
    { value: "tebourba", label: "Tebourba" },
    { value: "bousalem", label: "Bousalem" },
    { value: "el_battan", label: "El Battan" },
    { value: "jedaida", label: "Jedaida" },
    { value: "mornag", label: "Mornag" },
    { value: "oued_ellil", label: "Oued Ellil" },
  ],
  ben_arous: [
    { value: "ben_arous", label: "Ben Arous" },
    { value: "hammam_lif", label: "Hammam Lif" },
    { value: "hammam_chott", label: "Hammam Chott" },
    { value: "ezzahra", label: "Ezzahra" },
    { value: "rades", label: "Radès" },
    { value: "megrine", label: "Mégrine" },
    { value: "bou_mhel_el_bassatine", label: "Bou Mhel El Bassatine" },
    { value: "fouchana", label: "Fouchana" },
    { value: "mohammedia", label: "Mohammedia" },
    { value: "el_mourouj", label: "El Mourouj" },
    { value: "khalidia", label: "Khalidia" },
  ],
};

const API_URL = config.API_URL;

const OrdersTable = ({ commandes, onViewDetails, onDelete, onEdit, onPrint, onRestore }) => {
  const getCityLabel = (gouvernorat, ville) => {
    const cities = GOUVERNORAT_CITIES[gouvernorat?.toLowerCase()] || [];
    const city = cities.find((c) => c.value === ville);
    return city ? city.label : ville || "-";
  };

  const handlePrint = async (commande) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/command/${commande.code_a_barre}/print`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      const printWindow = window.open(fileURL);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      } else {
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `commande_${commande.code_a_barre}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      URL.revokeObjectURL(fileURL);

      if (onPrint) onPrint();
    } catch (error) {
      console.error("Erreur lors de l'impression de la commande:", error);
      alert(error.response?.data?.error || "Erreur lors de l'impression de la commande");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Commande
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Client
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Ville
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Prix
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              État
            </th>
            <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {commandes.map((commande) => (
            <tr key={commande.code_a_barre} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{commande.code_a_barre}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {commande.nom_prioritaire} {commande.prenom_prioritaire}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getCityLabel(commande.gouvernorat, commande.ville)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {commande.prix.toFixed(2)} TND
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  variant={
                    commande.etat === "delivered"
                      ? "default"
                      : commande.etat === "EN_ATTENTE"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {commande.etat}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <Button
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-800 mr-2"
                  onClick={() => onViewDetails(commande)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {onPrint && commande.etat !== "ABANDONNEE" && (
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => handlePrint(commande)}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                )}
                {onEdit && commande.etat === "EN_ATTENTE" && !commande.est_imprimer && (
                  <Button
                    variant="ghost"
                    className="text-yellow-600 hover:text-yellow-800 mr-2"
                    onClick={() => onEdit(commande)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && commande.etat === "EN_ATTENTE" && (
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => onDelete(commande.code_a_barre)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                {onRestore && commande.etat === "ABANDONNEE" && (
                  <Button
                    variant="ghost"
                    className="text-green-600 hover:text-green-800"
                    onClick={() => onRestore(commande.code_a_barre)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;