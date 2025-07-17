
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useMateriel } from '@/hooks/useMateriel';
import { Tables } from '@/integrations/supabase/types';

interface DeleteMaterielModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materiel: Tables<'materiel'> | null;
}

export const DeleteMaterielModal = ({ open, onOpenChange, materiel }: DeleteMaterielModalProps) => {
  const { deleteMateriel } = useMateriel();

  const handleDelete = async () => {
    if (!materiel) return;
    
    const { error } = await deleteMateriel(materiel.id);
    if (!error) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer le matériel "{materiel?.nom}" ? 
            Cette action est irréversible et supprimera également toutes les attributions et maintenances associées.
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
