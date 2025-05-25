import React, { useState, useEffect } from 'react';
import axios from 'axios'; // AJOUT MANQUANT
import config from "../../config.json";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileText, Printer, Trash2, Package, AlertCircle, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "../../components/common/Header";

// AJOUTS MANQUANTS pour les Dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const API_URL = config.API_URL;

const FeedbackPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true); // AJOUT MANQUANT
    const [newFeedback, setNewFeedback] = useState({
        titre: '',
        commentaire: '',
        id_commande: '',
        id_client: '',
    });
    const [idCommandeFilter, setIdCommandeFilter] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true); // AJOUT
            const token = localStorage.getItem("authToken");
            if (!token) {
                throw new Error("Vous devez être connecté pour accéder à cette page.");
            }

            const response = await axios.get(`${API_URL}/feedback/getAllFeedbacks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Feedbacks response:", response.data);

            // Handle response data (array or object with data property)
            const feedbackData = Array.isArray(response.data) ? response.data : response.data.data || [];
            setFeedbacks(feedbackData);
            setError(''); // CORRECTION: utiliser chaîne vide au lieu de null
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
            setError(
                error.response?.data?.error ||
                error.message ||
                "Erreur lors de la récupération des feedbacks."
            );
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un feedback
    const handleDeleteFeedback = async (id) => {
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_URL}/feedback/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la suppression du feedback.');
            }

            setFeedbacks(feedbacks.filter((fb) => fb.id !== id));
            setSuccess('Feedback supprimé avec succès.');
            setDeleteDialogOpen(false); // AJOUT: fermer le dialog
            setSelectedFeedback(null); // AJOUT: réinitialiser la sélection
        } catch (err) {
            setError(err.message);
        }
    };

    // AJOUT: Affichage du loading
    if (loading) {
        return (
            <div className="flex-1 overflow-auto relative z-10">
                <Header title="Mes Feedback" />
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    <span className="ml-2 text-gray-500">Chargement des feedbacks...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Mes Feedback" />
            
            {/* AJOUT: Affichage des messages d'erreur et de succès */}
            {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
            )}
            
            {success && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
            )}

            <Card className="shadow-sm border-gray-100">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <CardTitle className="text-xl font-medium text-gray-800">
                                Gestion des Feedbacks ({feedbacks.length}) {/* AJOUT: compteur */}
                            </CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {feedbacks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <Package className="h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-700">Aucun Feedback disponible</h3>
                            <p className="text-gray-500 mt-2 max-w-md">
                                Aucun feedback n'a été trouvé dans le système.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Accordion type="single" collapsible className="w-full">
                                {feedbacks.map((feedback) => (
                                    <AccordionItem 
                                        key={feedback.id} 
                                        value={`feedback-${feedback.id}`} 
                                        className="border rounded-lg mb-4 overflow-hidden"
                                    >
                                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center space-x-3">
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                        #{feedback.id}
                                                    </Badge>
                                                    <span className="font-medium">{feedback.titre}</span>
                                                </div>
                                                <div className="flex items-center space-x-3 text-gray-500 text-sm">
                                                    <span>Commande: {feedback.id_commande}</span>
                                                    {/* AJOUT: Affichage des infos client si disponibles */}
                                                    {feedback.client && (
                                                        <span>Client: {feedback.client.utilisateur?.nom} {feedback.client.utilisateur?.prenom}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-0">
                                            <div className="p-4 bg-gray-50">
                                                <div className="flex flex-wrap gap-3 mb-4">
                                                    <Dialog 
                                                        open={deleteDialogOpen && selectedFeedback === feedback.id} 
                                                        onOpenChange={(open) => {
                                                            setDeleteDialogOpen(open);
                                                            if (!open) setSelectedFeedback(null);
                                                        }}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="bg-white text-red-600 border-red-100 hover:bg-red-50"
                                                                onClick={() => {
                                                                    setSelectedFeedback(feedback.id);
                                                                    setDeleteDialogOpen(true);
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Supprimer FeedBack
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-md">
                                                            <DialogHeader>
                                                                <DialogTitle>Confirmer la suppression</DialogTitle>
                                                                <DialogDescription>
                                                                    Cette action supprimera le Feedback #{feedback.id} définitivement.
                                                                    Cette action est irréversible.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter className="flex space-x-2 justify-end pt-4">
                                                                <Button 
                                                                    variant="outline" 
                                                                    onClick={() => {
                                                                        setDeleteDialogOpen(false);
                                                                        setSelectedFeedback(null);
                                                                    }}
                                                                >
                                                                    Annuler
                                                                </Button>
                                                                <Button 
                                                                    variant="destructive" 
                                                                    onClick={() => handleDeleteFeedback(feedback.id)}
                                                                >
                                                                    Supprimer
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog> 
                                                </div>
                                                
                                                {/* AJOUT: Informations détaillées du feedback */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div className="bg-white rounded-lg border border-gray-100 p-3">
                                                        <div className="text-sm font-medium text-gray-500 mb-2">Informations générales</div>
                                                        <div className="space-y-1 text-sm">
                                                            <div><span className="font-medium">Date:</span> {new Date(feedback.dateAjout).toLocaleDateString('fr-FR')}</div>
                                                            <div><span className="font-medium">ID Commande:</span> {feedback.id_commande}</div>
                                                            {feedback.commande && (
                                                                <>
                                                                    <div><span className="font-medium">Désignation:</span> {feedback.commande.designation}</div>
                                                                    <div><span className="font-medium">Prix:</span> {feedback.commande.prix} TND</div>
                                                                    <div><span className="font-medium">État:</span> 
                                                                        <Badge variant="outline" className="ml-1">{feedback.commande.etat}</Badge>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {feedback.client && (
                                                        <div className="bg-white rounded-lg border border-gray-100 p-3">
                                                            <div className="text-sm font-medium text-gray-500 mb-2">Informations client</div>
                                                            <div className="space-y-1 text-sm">
                                                                <div><span className="font-medium">Nom:</span> {feedback.client.utilisateur?.nom} {feedback.client.utilisateur?.prenom}</div>
                                                                <div><span className="font-medium">Email:</span> {feedback.client.utilisateur?.email}</div>
                                                                <div><span className="font-medium">Téléphone:</span> {feedback.client.utilisateur?.telephone1}</div>
                                                                <div><span className="font-medium">Shop:</span> {feedback.client.nomShop}</div>
                                                                <div><span className="font-medium">Ville:</span> {feedback.client.ville}, {feedback.client.gouvernorat}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="bg-white rounded-lg border border-gray-100">
                                                    <div className="p-3 border-b border-gray-100 bg-gray-50 text-sm text-gray-500 font-medium">
                                                        Commentaire du Feedback
                                                    </div>
                                                    <div className="p-4">
                                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{feedback.commentaire}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FeedbackPage;