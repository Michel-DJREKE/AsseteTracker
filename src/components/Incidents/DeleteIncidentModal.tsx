
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useIncidents } from '@/hooks/useIncidents';

interface DeleteIncidentModalProps {
  incident: any;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteIncidentModal = ({ incident, isOpen, onClose }: DeleteIncidentModalProps) => {
  const [loading, setLoading] = useState(false);
  const { deleteIncident } = useIncidents();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await deleteIncident(incident.id);
      if (!error) {
        onClose();
      }
    } catch (error) {
      console.error('Error deleting incident:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <DialogTitle>Supprimer l'incident</DialogTitle>
          </div>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cet incident ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900">{incident?.titre}</h4>
            <p className="text-sm text-gray-600 mt-1">{incident?.description}</p>
            {incident?.materiel && (
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium">Matériel :</span> {incident.materiel.nom} - {incident.materiel.numero_serie}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
