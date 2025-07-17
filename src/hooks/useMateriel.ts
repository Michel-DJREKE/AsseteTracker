
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Materiel = Tables<'materiel'>;
type MaterielInsert = TablesInsert<'materiel'>;
type MaterielUpdate = TablesUpdate<'materiel'>;

export const useMateriel = () => {
  const [materiel, setMateriel] = useState<Materiel[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const fetchMateriel = async () => {
    try {
      const { data, error } = await supabase
        .from('materiel')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Matériel chargé:', data?.length, 'éléments');
      console.log('Répartition par statut:', data?.reduce((acc, item) => {
        acc[item.statut] = (acc[item.statut] || 0) + 1;
        return acc;
      }, {} as Record<string, number>));
      setMateriel(data || []);
    } catch (error) {
      console.error('Error fetching materiel:', error);
      toast.error('Erreur lors du chargement du matériel');
    } finally {
      setLoading(false);
    }
  };

  const addMateriel = async (newMateriel: MaterielInsert) => {
    try {
      console.log('Ajout de matériel:', newMateriel);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté pour ajouter du matériel');
        return { data: null, error: 'Not authenticated' };
      }

      // Validation des champs requis côté client
      if (!newMateriel.nom || !newMateriel.modele || !newMateriel.numero_serie || !newMateriel.date_achat) {
        throw new Error('Les champs obligatoires sont manquants');
      }

      const { data, error } = await supabase
        .from('materiel')
        .insert([{
          nom: newMateriel.nom,
          modele: newMateriel.modele,
          numero_serie: newMateriel.numero_serie,
          fournisseur: newMateriel.fournisseur || null,
          date_achat: newMateriel.date_achat,
          prix_achat: newMateriel.prix_achat || null,
          garantie_fin: newMateriel.garantie_fin || null,
          description: newMateriel.description || null,
          statut: newMateriel.statut || 'Disponible',
          owner_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase lors de l\'ajout:', error);
        throw error;
      }
      
      console.log('Matériel ajouté avec succès:', data);
      toast.success('Matériel ajouté avec succès');
      
      // Rafraîchir immédiatement la liste
      await fetchMateriel();
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Error adding materiel:', error);
      const errorMessage = error.message || 'Erreur lors de l\'ajout du matériel';
      toast.error(errorMessage);
      return { data: null, error };
    }
  };

  const updateMateriel = async (id: string, updates: MaterielUpdate) => {
    try {
      console.log('Mise à jour matériel:', id, updates);
      
      // Récupérer l'état actuel du matériel
      const { data: currentMateriel } = await supabase
        .from('materiel')
        .select('*')
        .eq('id', id)
        .single();

      const { data, error } = await supabase
        .from('materiel')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      console.log('Matériel mis à jour:', data);

      // Si le statut passe à "En maintenance", créer automatiquement une entrée de maintenance
      if (currentMateriel && 
          currentMateriel.statut !== 'En maintenance' && 
          updates.statut === 'En maintenance') {
        
        console.log('Création automatique d\'une maintenance pour le matériel:', id);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const maintenanceData = {
            materiel_id: id,
            type_maintenance: 'Maintenance préventive',
            probleme: 'Maintenance programmée automatiquement',
            technicien: 'Technicien assigné',
            date_debut: new Date().toISOString().split('T')[0],
            statut: 'En cours' as const,
            notes: 'Maintenance créée automatiquement lors du changement de statut du matériel',
            owner_id: user.id
          };

          const { error: maintenanceError } = await supabase
            .from('maintenance')
            .insert([maintenanceData]);

          if (maintenanceError) {
            console.error('Erreur lors de la création de la maintenance:', maintenanceError);
          } else {
            console.log('Maintenance créée automatiquement');
            toast.success('Matériel mis à jour et maintenance créée automatiquement');
          }
        }
      } else {
        toast.success('Matériel modifié avec succès');
      }

      await fetchMateriel();
      return { data, error: null };
    } catch (error) {
      console.error('Error updating materiel:', error);
      toast.error('Erreur lors de la modification du matériel');
      return { data: null, error };
    }
  };

  const deleteMateriel = async (id: string) => {
    try {
      console.log('Suppression matériel:', id);
      
      const { error } = await supabase
        .from('materiel')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Matériel supprimé avec succès');
      await fetchMateriel();
      return { error: null };
    } catch (error) {
      console.error('Error deleting materiel:', error);
      toast.error('Erreur lors de la suppression du matériel');
      return { error };
    }
  };

  useEffect(() => {
    fetchMateriel();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      const channel = supabase
        .channel(`materiel-changes-${Math.random()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'materiel'
          },
          (payload) => {
            console.log('Changement détecté sur materiel:', payload);
            fetchMateriel();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'maintenance'
          },
          (payload) => {
            console.log('Changement détecté sur maintenance (depuis materiel):', payload);
            fetchMateriel();
          }
        )
        .subscribe();

      channelRef.current = channel;

      return () => {
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      };
    }
  }, [loading]);

  return {
    materiel,
    loading,
    addMateriel,
    updateMateriel,
    deleteMateriel,
    refetch: fetchMateriel
  };
};
