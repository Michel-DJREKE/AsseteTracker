
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useUtilisateurs } from '@/hooks/useUtilisateurs';

interface DeleteUtilisateurModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  utilisateur: any;
}

export const DeleteUtilisateurModal = ({ open, onOpenChange, utilisateur }: DeleteUtilisateurModalProps) => {
  const { deleteUtilisateur } = useUtilisateurs();

  const handleDelete = async () => {
    if (utilisateur?.id) {
      await deleteUtilisateur(utilisateur.id);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer l'utilisateur "{utilisateur?.prenom} {utilisateur?.nom}" ? 
            Cette action est irréversible et supprimera également toutes ses attributions de matériel.
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
