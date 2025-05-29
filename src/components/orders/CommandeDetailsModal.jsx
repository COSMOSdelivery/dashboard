// ClientTable.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge"; // ✅ Correct
import { Package } from "lucide-react";
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

const CommandeDetailsModal = ({ commande, onClose }) => {
  const getCityLabel = (gouvernorat, ville) => {
    const cities = GOUVERNORAT_CITIES[gouvernorat?.toLowerCase()] || [];
    const city = cities.find((c) => c.value === ville);
    return city ? city.label : ville || "-";
  };

  if (!commande) return null;

  return (
    <Dialog open={!!commande} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-500" />
            Détails de la commande #{commande.code_a_barre}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">
                  {commande.nom_prioritaire} {commande.prenom_prioritaire}
                </p>
                <p className="text-sm text-gray-600">{commande.telephone1}</p>
                <p className="text-sm text-gray-600">
                  {commande.adresse}, {getCityLabel(commande.gouvernorat, commande.ville)},{" "}
                  {commande.gouvernorat}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">Désignation: {commande.designation}</p>
                <p className="text-sm text-gray-600">
                  Prix: {commande.prix.toFixed(2)} TND
                </p>
                <p className="text-sm text-gray-600">
                  Nombre d'articles: {commande.nb_article}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">État:</p>
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
                </div>
                <p className="text-sm text-gray-600">
                  Mode de paiement: {commande.mode_paiement}
                </p>
                <p className="text-sm text-gray-600">
                  Remarque: {commande.remarque || "Aucune remarque"}
                </p>
              </div>
            </CardContent>
          </Card>

          {commande.possible_echange && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Échange</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Code à barre d'échange: {commande.code_a_barre_echange || "-"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Nombre d'articles d'échange: {commande.nb_article_echange || "-"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-end">
          <Button onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommandeDetailsModal;
