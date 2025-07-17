
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIncidents } from '@/hooks/useIncidents';
import { useMateriel } from '@/hooks/useMateriel';
import { useUtilisateurs } from '@/hooks/useUtilisateurs';

interface EditIncidentModalProps {
  incident: any;
  isOpen: boolean;
  onClose: () => void;
}

export const EditIncidentModal = ({ incident, isOpen, onClose }: EditIncidentModalProps) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    priorite: 'Moyenne' as 'Critique' | 'Haute' | 'Élevée' | 'Moyenne' | 'Basse' | 'Faible',
    statut: 'Ouvert' as 'Ouvert' | 'En cours' | 'Résolu' | 'Fermé',
    materiel_id: '',
    utilisateur_id: '',
    date_resolution: ''
  });
  const [loading, setLoading] = useState(false);

  const { updateIncident } = useIncidents();
  const { materiel } = useMateriel();
  const { utilisateurs } = useUtilisateurs();

  useEffect(() => {
    if (incident) {
      setFormData({
        titre: incident.titre || '',
        description: incident.description || '',
        priorite: incident.priorite || 'Moyenne',
        statut: incident.statut || 'Ouvert',
        materiel_id: incident.materiel_id || '',
        utilisateur_id: incident.utilisateur_id || '',
        date_resolution: incident.date_resolution ? 
          new Date(incident.date_resolution).toISOString().slice(0, 16) : ''
      });
    }
  }, [incident]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titre || !formData.description) return;

    setLoading(true);
    try {
      const updateData: any = {
        titre: formData.titre,
        description: formData.description,
        priorite: formData.priorite,
        statut: formData.statut,
        materiel_id: formData.materiel_id || null,
        utilisateur_id: formData.utilisateur_id || null
      };

      // Si le statut est "Résolu" ou "Fermé" et qu'il n'y a pas de date de résolution, l'ajouter
      if ((formData.statut === 'Résolu' || formData.statut === 'Fermé') && !incident.date_resolution) {
        updateData.date_resolution = new Date().toISOString();
      }

      // Si le statut n'est plus "Résolu" ou "Fermé", supprimer la date de résolution
      if (formData.statut !== 'Résolu' && formData.statut !== 'Fermé') {
        updateData.date_resolution = null;
      }

      const { error } = await updateIncident(incident.id, updateData);

      if (!error) {
        onClose();
      }
    } catch (error) {
      console.error('Error updating incident:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l'incident</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Titre de l'incident"
                required
              />
            </div>
            <div>
              <Label htmlFor="priorite">Priorité</Label>
              <Select
                value={formData.priorite}
                onValueChange={(value: any) => setFormData({ ...formData, priorite: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critique">Critique</SelectItem>
                  <SelectItem value="Haute">Haute</SelectItem>
                  <SelectItem value="Élevée">Élevée</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="Basse">Basse</SelectItem>
                  <SelectItem value="Faible">Faible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez l'incident en détail"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="materiel">Matériel concerné</Label>
              <Select
                value={formData.materiel_id}
                onValueChange={(value) => setFormData({ ...formData, materiel_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un matériel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun matériel</SelectItem>
                  {materiel.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.nom} - {item.numero_serie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="utilisateur">Utilisateur concerné</Label>
              <Select
                value={formData.utilisateur_id}
                onValueChange={(value) => setFormData({ ...formData, utilisateur_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun utilisateur</SelectItem>
                  {utilisateurs.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.prenom} {user.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="statut">Statut</Label>
            <Select
              value={formData.statut}
              onValueChange={(value: any) => setFormData({ ...formData, statut: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ouvert">Ouvert</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Résolu">Résolu</SelectItem>
                <SelectItem value="Fermé">Fermé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Modification...' : 'Modifier'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
