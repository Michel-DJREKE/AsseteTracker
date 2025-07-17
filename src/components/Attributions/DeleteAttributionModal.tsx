
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAttributions } from '@/hooks/useAttributions';

interface DeleteAttributionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attribution: any;
}

export const DeleteAttributionModal = ({ open, onOpenChange, attribution }: DeleteAttributionModalProps) => {
  const { deleteAttribution } = useAttributions();

  const handleDelete = async () => {
    if (attribution?.id) {
      await deleteAttribution(attribution.id);
      onOpenChange(false);
    }
  };

  const materielName = attribution?.materiel?.nom || 'Matériel inconnu';
  const utilisateurName = attribution?.utilisateur 
    ? `${attribution.utilisateur.prenom} ${attribution.utilisateur.nom}` 
    : 'Utilisateur inconnu';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer l'attribution du matériel "{materielName}" 
            à l'utilisateur "{utilisateurName}" ? Cette action est irréversible.
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
