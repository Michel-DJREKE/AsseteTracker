
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMaintenance } from '@/hooks/useMaintenance';
import { useMateriel } from '@/hooks/useMateriel';
import { toast } from 'sonner';

interface AddMaintenanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddMaintenanceModal = ({ open, onOpenChange }: AddMaintenanceModalProps) => {
  const { addMaintenance } = useMaintenance();
  const { materiel } = useMateriel();
  const [formData, setFormData] = useState({
    materiel_id: '',
    type_maintenance: '',
    probleme: '',
    technicien: '',
    date_debut: '',
    statut: 'Planifié' as 'Planifié' | 'En cours' | 'Terminé' | 'Annulé',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrer le matériel disponible et attribué (pas déjà en maintenance ou hors service)
  const materielDisponible = materiel.filter(item => 
    item.statut === 'Disponible' || item.statut === 'Attribué'
  );

  console.log('Matériel total:', materiel.length);
  console.log('Matériel disponible pour maintenance:', materielDisponible.length);
  console.log('Matériel filtré:', materielDisponible.map(m => ({ nom: m.nom, statut: m.statut })));

  const resetForm = () => {
    setFormData({
      materiel_id: '',
      type_maintenance: '',
      probleme: '',
      technicien: '',
      date_debut: '',
      statut: 'Planifié',
      notes: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.materiel_id || !formData.type_maintenance || !formData.probleme || !formData.technicien || !formData.date_debut) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    try {
      const maintenanceData = {
        materiel_id: formData.materiel_id,
        type_maintenance: formData.type_maintenance,
        probleme: formData.probleme,
        technicien: formData.technicien,
        date_debut: formData.date_debut,
        statut: formData.statut,
        notes: formData.notes || null
      };

      console.log('Données de maintenance à soumettre:', maintenanceData);

      const result = await addMaintenance(maintenanceData);
      if (result.data) {
        onOpenChange(false);
        resetForm();
        toast.success('Maintenance ajoutée avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error('Erreur lors de l\'ajout de la maintenance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle opération de maintenance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="materiel_id">Matériel *</Label>
              <Select 
                value={formData.materiel_id} 
                onValueChange={(value) => setFormData({ ...formData, materiel_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un matériel" />
                </SelectTrigger>
                <SelectContent>
                  {materielDisponible.length > 0 ? (
                    materielDisponible.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.nom} - {item.numero_serie} ({item.statut})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="disabled" disabled>
                      Aucun matériel disponible
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {materielDisponible.length === 0 && (
                <p className="text-sm text-amber-600 mt-1">
                  Aucun matériel disponible pour maintenance.
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="type_maintenance">Type de maintenance *</Label>
              <Select 
                value={formData.type_maintenance} 
                onValueChange={(value) => setFormData({ ...formData, type_maintenance: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Réparation">Réparation</SelectItem>
                  <SelectItem value="Maintenance préventive">Maintenance préventive</SelectItem>
                  <SelectItem value="Mise à jour">Mise à jour</SelectItem>
                  <SelectItem value="Nettoyage">Nettoyage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="statut">Statut</Label>
              <Select 
                value={formData.statut} 
                onValueChange={(value: 'Planifié' | 'En cours' | 'Terminé' | 'Annulé') => 
                  setFormData({ ...formData, statut: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
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
              <Label htmlFor="technicien">Technicien *</Label>
              <Input
                id="technicien"
                value={formData.technicien}
                onChange={(e) => setFormData({ ...formData, technicien: e.target.value })}
                placeholder="Nom du technicien"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="date_debut">Date de début *</Label>
              <Input
                id="date_debut"
                type="date"
                value={formData.date_debut}
                onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="probleme">Problème identifié *</Label>
            <Input
              id="probleme"
              value={formData.probleme}
              onChange={(e) => setFormData({ ...formData, probleme: e.target.value })}
              placeholder="Résumé du problème..."
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes et observations</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Description détaillée du problème et des actions à effectuer..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={materielDisponible.length === 0 || isSubmitting}
            >
              {isSubmitting ? 'Création...' : 'Créer la maintenance'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
