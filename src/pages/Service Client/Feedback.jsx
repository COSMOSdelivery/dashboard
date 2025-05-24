import React, { useState, useEffect } from 'react';
import config from "../../config.json";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileText, Printer, Trash2, Package, AlertCircle, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "../../components/common/Header";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const API_URL = config.API_URL;
const FeedbackPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
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
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/feedback/getAllFeedbacks`,{
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des feedbacks.');
        }

        setFeedbacks(response.data);
        setError('');
        } catch (err) {
        setError(err.message);
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
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <div className="flex-1 overflow-auto relative z-10">
          <Header title="Mes Feedback" />
          <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <CardTitle className="text-xl font-medium text-gray-800">Gestion des Feedbacks</CardTitle>
                          </div>
                        </div>
               </CardHeader>
               <CardContent>
                  {feedbacks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <Package className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700">Aucun Feedback disponible</h3>
                            <p className="text-gray-500 mt-2 max-w-md">
                              Vous n'avez pas encore de Feedback associé à votre compte.
                            </p>
                      </div>
                  ): (
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                    {feedbacks.map((feedback) => (
                      <AccordionItem key={feedback.id} value={`feedback-${feedback.id}`} className="border rounded-lg mb-4 overflow-hidden">
                                          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                                            <div className="flex items-center justify-between w-full">
                                              <div className="flex items-center space-x-3">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                  #{feedback.id}
                                                </Badge>
                                                <span className="font-medium">{feedback.titre}</span>
                                              </div>
                                              <div className="flex items-center space-x-3 text-gray-500 text-sm">
                                                <span>ID Client: {feedback.id_client}</span>
                                              </div>
                                            </div>
                                          </AccordionTrigger>
                                          <AccordionContent className="px-0">
                                            <div className="p-4 bg-gray-50">
                                              <div className="flex flex-wrap gap-3 mb-4">
                                                    <Dialog open={deleteDialogOpen && selectedFeedback === feedback.id} onOpenChange={(open) => {
                                                      setDeleteDialogOpen(open);
                                                      if (!open) setSelectedFeedback(null);
                                                      }}>
                                                      <DialogTrigger asChild>
                                                        <Button
                                                          variant="outline"
                                                          size="sm"
                                                          className="bg-white text-red-600 border-red-100 hover:bg-red-50"
                                                          onClick={() => setSelectedFeedback(feedback.id)}
                                                          >
                                                          <Trash2 className="h-4 w-4 mr-2" />
                                                            Supprimer FeedBack
                                                        </Button>
                                                      </DialogTrigger>
                                                      <DialogContent className="sm:max-w-md">
                                                        <DialogHeader>
                                                          <DialogTitle>Confirmer la suppression</DialogTitle>
                                                          <DialogDescription>
                                                            Cette action supprimera le Feedback #{feedback.id} .
                                                          </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter className="flex space-x-2 justify-end pt-4">
                                                          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
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
                                              <div className="bg-white rounded-lg border border-gray-100">
                                                <div className="p-3 border-b border-gray-100 bg-gray-50 text-sm text-gray-500 font-medium">
                                                  FeedBack
                                                </div>
                                                <ScrollArea className="h-64">
                                                  <div className="divide-y divide-gray-100">
                                                    <div className="flex justify-between items-center">
                                                      <p className="text-sm text-gray-600 mt-1">{feedback.commentaire}</p>
                                                    </div>
                                                  </div>
                                                </ScrollArea>
                                              </div>
                                            </div>
                                          </AccordionContent>
                                        </AccordionItem>
                      
                    ))}</Accordion>
                  </div>
                )}
               </CardContent>
          </Card>
  
        
      </div>
    );
  };
  
  export default FeedbackPage;


