
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAttributions } from '@/hooks/useAttributions';
import { Database } from '@/integrations/supabase/types';

type StatutAttribution = Database['public']['Enums']['statut_attribution'];

interface EditAttributionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attribution: any;
}

export const EditAttributionModal = ({ open, onOpenChange, attribution }: EditAttributionModalProps) => {
  const { updateAttribution } = useAttributions();
  const [formData, setFormData] = useState<{
    dateRetour: string;
    statut: StatutAttribution;
    notes: string;
  }>({
    dateRetour: '',
    statut: 'Actif',
    notes: ''
  });

  useEffect(() => {
    if (attribution) {
      setFormData({
        dateRetour: attribution.date_retour || '',
        statut: attribution.statut || 'Actif',
        notes: attribution.notes || ''
      });
    }
  }, [attribution]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attribution?.id) {
      const updates = {
        date_retour: formData.dateRetour || null,
        statut: formData.statut,
        notes: formData.notes
      };
      await updateAttribution(attribution.id, updates);
      onOpenChange(false);
    }
  };

  const materielName = attribution?.materiel?.nom || 'Matériel inconnu';
  const utilisateurName = attribution?.utilisateur 
    ? `${attribution.utilisateur.prenom} ${attribution.utilisateur.nom}` 
    : 'Utilisateur inconnu';
  const dateAttribution = attribution?.date_attribution 
    ? new Date(attribution.date_attribution).toLocaleDateString('fr-FR')
    : 'Date inconnue';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier l'attribution</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm space-y-1">
              <p><strong>Matériel:</strong> {materielName}</p>
              <p><strong>Utilisateur:</strong> {utilisateurName}</p>
              <p><strong>Date d'attribution:</strong> {dateAttribution}</p>
            </div>
          </div>

          <div>
            <Label htmlFor="statut">Statut</Label>
            <Select value={formData.statut} onValueChange={(value: StatutAttribution) => setFormData({ ...formData, statut: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Actif">Actif</SelectItem>
                <SelectItem value="Retourné">Retourné</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dateRetour">Date de retour</Label>
            <Input
              id="dateRetour"
              type="date"
              value={formData.dateRetour}
              onChange={(e) => setFormData({ ...formData, dateRetour: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes sur l'attribution..."
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
