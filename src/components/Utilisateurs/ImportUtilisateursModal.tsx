
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImportUtilisateursCSV } from './ImportUtilisateursCSV';

interface ImportUtilisateursModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportUtilisateursModal = ({ open, onOpenChange }: ImportUtilisateursModalProps) => {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Importer des utilisateurs</DialogTitle>
        </DialogHeader>
        <ImportUtilisateursCSV onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};
