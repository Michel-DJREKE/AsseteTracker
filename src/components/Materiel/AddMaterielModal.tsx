
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMateriel } from '@/hooks/useMateriel';
import { toast } from 'sonner';

interface AddMaterielModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddMaterielModal = ({ open, onOpenChange }: AddMaterielModalProps) => {
  const { addMateriel } = useMateriel();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    modele: '',
    numero_serie: '',
    fournisseur: '',
    date_achat: '',
    prix_achat: '',
    garantie_fin: '',
    description: '',
    statut: 'Disponible' as const
  });

  const resetForm = () => {
    setFormData({
      nom: '',
      modele: '',
      numero_serie: '',
      fournisseur: '',
      date_achat: '',
      prix_achat: '',
      garantie_fin: '',
      description: '',
      statut: 'Disponible'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs requis
    if (!formData.nom.trim()) {
      toast.error('Le nom du matériel est requis');
      return;
    }
    
    if (!formData.modele.trim()) {
      toast.error('Le modèle est requis');
      return;
    }
    
    if (!formData.numero_serie.trim()) {
      toast.error('Le numéro de série est requis');
      return;
    }
    
    if (!formData.date_achat) {
      toast.error('La date d\'achat est requise');
      return;
    }

    setLoading(true);
    
    try {
      const materielData = {
        nom: formData.nom.trim(),
        modele: formData.modele.trim(),
        numero_serie: formData.numero_serie.trim(),
        fournisseur: formData.fournisseur.trim() || null,
        date_achat: formData.date_achat,
        prix_achat: formData.prix_achat ? parseFloat(formData.prix_achat) : null,
        garantie_fin: formData.garantie_fin || null,
        description: formData.description.trim() || null,
        statut: formData.statut
      };

      const result = await addMateriel(materielData);
      
      if (result.error) {
        console.error('Erreur lors de l\'ajout:', result.error);
        toast.error('Erreur lors de l\'ajout du matériel');
      } else {
        toast.success('Matériel ajouté avec succès');
        resetForm();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Erreur lors de l\'ajout du matériel');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau matériel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom du matériel *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                placeholder="Ex: Ordinateur portable"
                required
              />
            </div>
            <div>
              <Label htmlFor="modele">Modèle *</Label>
              <Input
                id="modele"
                value={formData.modele}
                onChange={(e) => handleInputChange('modele', e.target.value)}
                placeholder="Ex: MacBook Pro 13"
                required
              />
            </div>
            <div>
              <Label htmlFor="numero_serie">Numéro de série *</Label>
              <Input
                id="numero_serie"
                value={formData.numero_serie}
                onChange={(e) => handleInputChange('numero_serie', e.target.value)}
                placeholder="Ex: ABC123456789"
                required
              />
            </div>
            <div>
              <Label htmlFor="statut">Statut</Label>
              <Select value={formData.statut} onValueChange={(value) => handleInputChange('statut', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="Attribué">Attribué</SelectItem>
                  <SelectItem value="En maintenance">En maintenance</SelectItem>
                  <SelectItem value="Hors service">Hors service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fournisseur">Fournisseur</Label>
              <Input
                id="fournisseur"
                value={formData.fournisseur}
                onChange={(e) => handleInputChange('fournisseur', e.target.value)}
                placeholder="Ex: Apple"
              />
            </div>
            <div>
              <Label htmlFor="date_achat">Date d'achat *</Label>
              <Input
                id="date_achat"
                type="date"
                value={formData.date_achat}
                onChange={(e) => handleInputChange('date_achat', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="prix_achat">Prix d'achat (€)</Label>
              <Input
                id="prix_achat"
                type="number"
                step="0.01"
                min="0"
                value={formData.prix_achat}
                onChange={(e) => handleInputChange('prix_achat', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="garantie_fin">Fin de garantie</Label>
              <Input
                id="garantie_fin"
                type="date"
                value={formData.garantie_fin}
                onChange={(e) => handleInputChange('garantie_fin', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description détaillée du matériel..."
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Ajout en cours...' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
