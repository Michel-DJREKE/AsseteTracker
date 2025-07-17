
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImportMaterielCSV } from './ImportMaterielCSV';

interface ImportMaterielModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportMaterielModal = ({ open, onOpenChange }: ImportMaterielModalProps) => {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Importer du matériel</DialogTitle>
        </DialogHeader>
        <ImportMaterielCSV onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};
