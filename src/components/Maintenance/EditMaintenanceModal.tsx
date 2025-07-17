
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMaintenance } from '@/hooks/useMaintenance';
import { toast } from 'sonner';

interface EditMaintenanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance: any;
}

export const EditMaintenanceModal = ({ open, onOpenChange, maintenance }: EditMaintenanceModalProps) => {
  const { updateMaintenance } = useMaintenance();
  const [formData, setFormData] = useState({
    statut: '' as 'Planifié' | 'En cours' | 'Terminé' | 'Annulé',
    date_fin: '',
    notes: '',
    cout: ''
  });

  useEffect(() => {
    if (maintenance) {
      setFormData({
        statut: maintenance.statut || 'Planifié',
        date_fin: maintenance.date_fin || '',
        notes: maintenance.notes || '',
        cout: maintenance.cout || ''
      });
    }
  }, [maintenance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (maintenance?.id) {
      const updateData = {
        statut: formData.statut,
        date_fin: formData.date_fin || null,
        notes: formData.notes || null,
        cout: formData.cout ? parseFloat(formData.cout) : null
      };
      
      await updateMaintenance(maintenance.id, updateData);
      onOpenChange(false);
    }
  };

  // Extraction sécurisée des propriétés du matériel
  const materielName = typeof maintenance?.materiel === 'object' && maintenance?.materiel 
    ? maintenance.materiel.nom 
    : maintenance?.materiel || 'Matériel inconnu';
  
  const materielSerial = typeof maintenance?.materiel === 'object' && maintenance?.materiel 
    ? maintenance.materiel.numero_serie 
    : 'N/A';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier la maintenance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Matériel:</strong> {materielName}</p>
                <p><strong>N° Série:</strong> {materielSerial}</p>
                <p><strong>Type:</strong> {maintenance?.type_maintenance}</p>
                <p><strong>Problème:</strong> {maintenance?.probleme}</p>
              </div>
              <div>
                <p><strong>Technicien:</strong> {maintenance?.technicien}</p>
                <p><strong>Date début:</strong> {maintenance?.date_debut ? new Date(maintenance.date_debut).toLocaleDateString('fr-FR') : '-'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="statut">Statut</Label>
              <Select value={formData.statut} onValueChange={(value: 'Planifié' | 'En cours' | 'Terminé' | 'Annulé') => setFormData({ ...formData, statut: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planifié">Planifié</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                  <SelectItem value="Annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date_fin">Date de fin</Label>
              <Input
                id="date_fin"
                type="date"
                value={formData.date_fin}
                onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="cout">Coût de réparation (€)</Label>
              <Input
                id="cout"
                type="number"
                step="0.01"
                value={formData.cout}
                onChange={(e) => setFormData({ ...formData, cout: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes et observations</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes sur l'intervention, pièces changées, observations..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Modifier</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
