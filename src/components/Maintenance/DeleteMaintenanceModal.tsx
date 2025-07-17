
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useMaintenance } from '@/hooks/useMaintenance';

interface DeleteMaintenanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance: any;
}

export const DeleteMaintenanceModal = ({ open, onOpenChange, maintenance }: DeleteMaintenanceModalProps) => {
  const { deleteMaintenance } = useMaintenance();

  const handleDelete = async () => {
    if (maintenance?.id) {
      await deleteMaintenance(maintenance.id);
      onOpenChange(false);
    }
  };

  const materielName = typeof maintenance?.materiel === 'object' && maintenance?.materiel 
    ? maintenance.materiel.nom 
    : maintenance?.materiel || 'matériel inconnu';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer l'opération de maintenance pour le matériel "{materielName}" ? 
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
