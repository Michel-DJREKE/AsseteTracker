
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAttributions } from '@/hooks/useAttributions';
import { useMateriel } from '@/hooks/useMateriel';
import { useUtilisateurs } from '@/hooks/useUtilisateurs';

interface AddAttributionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddAttributionModal = ({ open, onOpenChange }: AddAttributionModalProps) => {
  const { addAttribution } = useAttributions();
  const { materiel } = useMateriel();
  const { utilisateurs } = useUtilisateurs();
  
  const [formData, setFormData] = useState({
    materielId: '',
    utilisateurId: '',
    dateAttribution: '',
    notes: ''
  });

  // Filtrer UNIQUEMENT le matériel avec statut "Disponible"
  const materielDisponible = materiel.filter(m => m.statut === 'Disponible');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAttribution = {
      materiel_id: formData.materielId,
      utilisateur_id: formData.utilisateurId,
      date_attribution: formData.dateAttribution,
      statut: 'Actif' as const,
      notes: formData.notes
    };

    const { error } = await addAttribution(newAttribution);
    if (!error) {
      onOpenChange(false);
      setFormData({
        materielId: '',
        utilisateurId: '',
        dateAttribution: '',
        notes: ''
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvelle attribution</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="materielId">Matériel disponible ({materielDisponible.length} disponible{materielDisponible.length > 1 ? 's' : ''})</Label>
            <Select value={formData.materielId} onValueChange={(value) => setFormData({ ...formData, materielId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un matériel" />
              </SelectTrigger>
              <SelectContent>
                {materielDisponible.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.nom} - {item.numero_serie}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {materielDisponible.length === 0 && (
              <p className="text-sm text-orange-600 mt-1">Aucun matériel disponible pour attribution</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="utilisateurId">Utilisateur</Label>
            <Select value={formData.utilisateurId} onValueChange={(value) => setFormData({ ...formData, utilisateurId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un utilisateur" />
              </SelectTrigger>
              <SelectContent>
                {utilisateurs.filter(u => u.statut === 'Actif').map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.prenom} {user.nom} - {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dateAttribution">Date d'attribution</Label>
            <Input
              id="dateAttribution"
              type="date"
              value={formData.dateAttribution}
              onChange={(e) => setFormData({ ...formData, dateAttribution: e.target.value })}
              required
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
            <Button type="submit" disabled={materielDisponible.length === 0}>
              Créer l'attribution
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
