import React, { useState } from "react";
import { 
  X, Package, User, MapPin, Calendar, FileText, History, Phone, 
  CreditCard, Hash, Truck, Edit3, CheckCircle2, Clock, AlertCircle,
  Copy, ExternalLink, ChevronDown, ChevronUp, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const OrderDetailsDialog = ({ open, onClose, order, history }) => {
  const [expandedSections, setExpandedSections] = useState({
    client: true,
    order: true,
    technical: false,
    notes: false,
    history: true
  });

  const [copiedField, setCopiedField] = useState(null);

  if (!order) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      year: "numeric",
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status) => {
    const statusConfigs = {
      'EN_ATTENTE': { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: Clock,
        label: 'En Attente'
      },
      'A_ENLEVER': { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: Package,
        label: 'À Enlever'
      },
      'ENLEVE': { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: CheckCircle2,
        label: 'Enlevé'
      },
      'AU_DEPOT': { 
        color: 'bg-purple-100 text-purple-800 border-purple-200', 
        icon: Package,
        label: 'Au Dépôt'
      },
      'EN_COURS': { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: Truck,
        label: 'En Cours'
      },
      'LIVRES': { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: CheckCircle2,
        label: 'Livré'
      },
      'RETOUR_DEFINITIF': { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: AlertCircle,
        label: 'Retour Définitif'
      }
    };
    return statusConfigs[status] || { 
      color: 'bg-gray-100 text-gray-800 border-gray-200', 
      icon: AlertCircle,
      label: status
    };
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const CollapsibleSection = ({ id, icon: Icon, title, children, defaultExpanded = true, headerAction }) => (
    <motion.div 
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => toggleSection(id)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          {headerAction}
          {expandedSections[id] ? 
            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
            <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </div>
      </button>
      
      <AnimatePresence>
        {expandedSections[id] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 border-t border-gray-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const InfoItem = ({ label, value, highlight = false, copyable = false, prefix = "", suffix = "" }) => (
    <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-150">
      <span className="text-sm font-medium text-gray-600 min-w-0 flex-1">{label}:</span>
      <div className="flex items-center gap-2 ml-4">
        <span className={`text-sm text-right ${highlight ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
          {prefix}{value || "N/A"}{suffix}
        </span>
        {copyable && value && (
          <button
            onClick={() => copyToClipboard(value, label)}
            className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
            title="Copier"
          >
            {copiedField === label ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const config = getStatusConfig(status);
    const StatusIcon = config.icon;
    
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${config.color} shadow-sm`}>
        <StatusIcon className="w-4 h-4" />
        {config.label}
      </div>
    );
  };

  if (!open) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-6 py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-white">
                    Commande #{order.code_a_barre}
                  </h3>
                  <button
                    onClick={() => copyToClipboard(order.code_a_barre, 'order-id')}
                    className="p-1 hover:bg-white/20 rounded transition-colors duration-150"
                    title="Copier le numéro de commande"
                  >
                    {copiedField === 'order-id' ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <Copy className="w-5 h-5 text-white/80" />
                    )}
                  </button>
                </div>
                <StatusBadge status={order.etat} />
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-3 hover:bg-white/20 rounded-xl transition-colors duration-200 group"
              title="Fermer"
            >
              <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)] space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Informations Client */}
            <CollapsibleSection id="client" icon={User} title="Informations Client">
              <div className="space-y-1 mt-4">
                <InfoItem 
                  label="Nom complet" 
                  value={`${order.nom_prioritaire} ${order.prenom_prioritaire}`}
                  highlight={true}
                  copyable={true}
                />
                <InfoItem 
                  label="Téléphone" 
                  value={order.tel_prioritaire} 
                  copyable={true}
                />
                <InfoItem 
                  label="Ville" 
                  value={order.gouvernorat}
                />
                <InfoItem 
                  label="Adresse complète" 
                  value={order.adresse_prioritaire}
                  copyable={true}
                />
              </div>
            </CollapsibleSection>

            {/* Informations de Commande */}
            <CollapsibleSection id="order" icon={Package} title="Détails de la Commande">
              <div className="space-y-1 mt-4">
                <InfoItem 
                  label="Prix total" 
                  value={order.prix} 
                  suffix=" TND"
                  highlight={true}
                  copyable={true}
                />
                <InfoItem 
                  label="Quantité" 
                  value={order.quantite}
                />
                <InfoItem 
                  label="Contenu" 
                  value={order.contenu}
                  copyable={true}
                />
                <InfoItem 
                  label="Ouverture autorisée" 
                  value={order.autoriser_ouverture ? "Oui" : "Non"}
                />
              </div>
            </CollapsibleSection>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations Techniques */}
            <CollapsibleSection id="technical" icon={Hash} title="Informations Techniques" defaultExpanded={false}>
              <div className="space-y-1 mt-4">
                <InfoItem 
                  label="Code-barres externe" 
                  value={order.code_barre_externe}
                  copyable={true}
                />
                <InfoItem 
                  label="Source" 
                  value={order.source}
                />
                <InfoItem 
                  label="Date de création" 
                  value={formatDate(order.dateAjout)}
                />
                <InfoItem 
                  label="Dernière mise à jour" 
                  value={formatDate(order.dateModification || order.dateAjout)}
                />
              </div>
            </CollapsibleSection>

            {/* Notes */}
            <CollapsibleSection id="notes" icon={FileText} title="Notes" defaultExpanded={false}>
              <div className="mt-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 min-h-[120px] border border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {order.note || "Aucune note disponible pour cette commande."}
                  </p>
                </div>
                {order.note && (
                  <button
                    onClick={() => copyToClipboard(order.note, 'notes')}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors duration-150"
                  >
                    {copiedField === 'notes' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copier les notes
                      </>
                    )}
                  </button>
                )}
              </div>
            </CollapsibleSection>
          </div>

          {/* Historique */}
          <CollapsibleSection 
            id="history" 
            icon={History} 
            title={`Historique de la Commande (${history?.length || 0} entrées)`}
          >
            <div className="mt-4">
              {history && history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((entry, index) => (
                    <motion.div 
                      key={index}
                      className="relative pl-8 pb-4 last:pb-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {/* Timeline line */}
                      {index !== history.length - 1 && (
                        <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-gray-200"></div>
                      )}
                      
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-3 w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-white shadow-md"></div>
                      
                      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-200 transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <StatusBadge status={entry.etat} />
                          <span className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full">
                            {formatDate(entry.date)}
                          </span>
                        </div>
                        
                        {entry.note && (
                          <div className="mb-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-300">
                            <p className="text-sm text-gray-700 italic">{entry.note}</p>
                          </div>
                        )}
                        
                        {entry.livreur && (
                          <div className="flex items-center gap-2 text-sm">
                            <Truck className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-600 font-medium">
                              Assigné à: {entry.livreur}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-10 h-10 text-gray-300" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun historique</h4>
                  <p className="text-gray-500">Cette commande n'a pas encore d'historique de modifications.</p>
                </div>
              )}
            </div>
          </CollapsibleSection>
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Dernière mise à jour: {formatDate(order.dateModification || order.dateAjout)}
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150 flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Modifier
            </button>
            <button className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-150 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Suivre
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-150"
            >
              Fermer
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderDetailsDialog;