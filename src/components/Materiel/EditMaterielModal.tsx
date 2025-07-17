
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMateriel } from '@/hooks/useMateriel';
import { Tables } from '@/integrations/supabase/types';

interface EditMaterielModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materiel: Tables<'materiel'> | null;
}

export const EditMaterielModal = ({ open, onOpenChange, materiel }: EditMaterielModalProps) => {
  const { updateMateriel } = useMateriel();
  const [formData, setFormData] = useState({
    nom: '',
    modele: '',
    numero_serie: '',
    statut: '',
    fournisseur: '',
    date_achat: '',
    prix_achat: '',
    garantie_fin: '',
    description: ''
  });

  useEffect(() => {
    if (materiel) {
      setFormData({
        nom: materiel.nom || '',
        modele: materiel.modele || '',
        numero_serie: materiel.numero_serie || '',
        statut: materiel.statut || '',
        fournisseur: materiel.fournisseur || '',
        date_achat: materiel.date_achat || '',
        prix_achat: materiel.prix_achat?.toString() || '',
        garantie_fin: materiel.garantie_fin || '',
        description: materiel.description || ''
      });
    }
  }, [materiel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materiel) return;

    const updates = {
      nom: formData.nom,
      modele: formData.modele,
      numero_serie: formData.numero_serie,
      statut: formData.statut as any,
      fournisseur: formData.fournisseur || null,
      date_achat: formData.date_achat,
      prix_achat: formData.prix_achat ? parseFloat(formData.prix_achat) : null,
      garantie_fin: formData.garantie_fin || null,
      description: formData.description || null
    };

    const { error } = await updateMateriel(materiel.id, updates);
    if (!error) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le matériel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom du matériel</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="modele">Modèle</Label>
              <Input
                id="modele"
                value={formData.modele}
                onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="numero_serie">Numéro de série</Label>
              <Input
                id="numero_serie"
                value={formData.numero_serie}
                onChange={(e) => setFormData({ ...formData, numero_serie: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="statut">Statut</Label>
              <Select value={formData.statut} onValueChange={(value) => setFormData({ ...formData, statut: value })}>
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
                onChange={(e) => setFormData({ ...formData, fournisseur: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="date_achat">Date d'achat</Label>
              <Input
                id="date_achat"
                type="date"
                value={formData.date_achat}
                onChange={(e) => setFormData({ ...formData, date_achat: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="prix_achat">Prix d'achat (€)</Label>
              <Input
                id="prix_achat"
                type="number"
                step="0.01"
                value={formData.prix_achat}
                onChange={(e) => setFormData({ ...formData, prix_achat: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="garantie_fin">Fin de garantie</Label>
              <Input
                id="garantie_fin"
                type="date"
                value={formData.garantie_fin}
                onChange={(e) => setFormData({ ...formData, garantie_fin: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description détaillée du matériel..."
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
