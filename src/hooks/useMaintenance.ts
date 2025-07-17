
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Maintenance = Tables<'maintenance'> & {
  materiel?: {
    nom: string;
    numero_serie: string;
  };
};
type MaintenanceInsert = TablesInsert<'maintenance'>;
type MaintenanceUpdate = TablesUpdate<'maintenance'>;

export const useMaintenance = () => {
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const fetchMaintenance = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance')
        .select(`
          *,
          materiel:materiel_id(nom, numero_serie)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Maintenance chargée:', data?.length, 'éléments');
      setMaintenance(data || []);
    } catch (error) {
      console.error('Error fetching maintenance:', error);
      toast.error('Erreur lors du chargement des maintenances');
    } finally {
      setLoading(false);
    }
  };

  const addMaintenance = async (newMaintenance: MaintenanceInsert) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté pour ajouter une maintenance');
        return { data: null, error: 'Not authenticated' };
      }

      console.log('Ajout de maintenance:', newMaintenance);

      // Ajouter la maintenance avec l'owner_id
      const { data, error } = await supabase
        .from('maintenance')
        .insert([{
          ...newMaintenance,
          owner_id: user.id
        }])
        .select(`
          *,
          materiel:materiel_id(nom, numero_serie)
        `)
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout de la maintenance:', error);
        throw error;
      }

      console.log('Maintenance ajoutée:', data);

      // Mettre à jour le statut du matériel vers "En maintenance" si la maintenance est en cours ou planifiée
      if ((newMaintenance.statut === 'En cours' || newMaintenance.statut === 'Planifié') && newMaintenance.materiel_id) {
        const { error: materielError } = await supabase
          .from('materiel')
          .update({ statut: 'En maintenance' })
          .eq('id', newMaintenance.materiel_id);

        if (materielError) {
          console.error('Erreur lors de la mise à jour du matériel:', materielError);
        } else {
          console.log('Statut matériel mis à jour vers "En maintenance"');
        }
      }

      toast.success('Maintenance ajoutée avec succès');
      await fetchMaintenance();
      
      return { data, error: null };
    } catch (error) {
      console.error('Error adding maintenance:', error);
      toast.error('Erreur lors de l\'ajout de la maintenance');
      return { data: null, error };
    }
  };

  const updateMaintenance = async (id: string, updates: MaintenanceUpdate) => {
    try {
      console.log('Mise à jour maintenance:', id, updates);
      
      // Récupérer la maintenance actuelle
      const { data: currentMaintenance } = await supabase
        .from('maintenance')
        .select('materiel_id, statut')
        .eq('id', id)
        .single();

      const { data, error } = await supabase
        .from('maintenance')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          materiel:materiel_id(nom, numero_serie)
        `)
        .single();

      if (error) throw error;

      console.log('Maintenance mise à jour:', data);

      // Mettre à jour le statut du matériel selon le statut de la maintenance
      if (currentMaintenance?.materiel_id) {
        let nouveauStatutMateriel: "Disponible" | "Attribué" | "En maintenance" | "Hors service" | null = null;
        
        if (updates.statut === 'En cours' || updates.statut === 'Planifié') {
          nouveauStatutMateriel = 'En maintenance';
        } else if (updates.statut === 'Terminé' || updates.statut === 'Annulé') {
          nouveauStatutMateriel = 'Disponible';
        }

        if (nouveauStatutMateriel) {
          const { error: materielError } = await supabase
            .from('materiel')
            .update({ statut: nouveauStatutMateriel })
            .eq('id', currentMaintenance.materiel_id);

          if (materielError) {
            console.error('Erreur lors de la mise à jour du matériel:', materielError);
          } else {
            console.log(`Statut matériel mis à jour vers "${nouveauStatutMateriel}"`);
          }
        }
      }

      toast.success('Maintenance modifiée avec succès');
      await fetchMaintenance();
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating maintenance:', error);
      toast.error('Erreur lors de la modification de la maintenance');
      return { data: null, error };
    }
  };

  const deleteMaintenance = async (id: string) => {
    try {
      console.log('Suppression maintenance:', id);
      
      // Récupérer la maintenance pour libérer le matériel
      const { data: maintenanceData } = await supabase
        .from('maintenance')
        .select('materiel_id, statut')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('maintenance')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remettre le matériel en statut "Disponible" si la maintenance était active
      if (maintenanceData?.materiel_id && (maintenanceData.statut === 'En cours' || maintenanceData.statut === 'Planifié')) {
        const { error: materielError } = await supabase
          .from('materiel')
          .update({ statut: 'Disponible' })
          .eq('id', maintenanceData.materiel_id);

        if (materielError) {
          console.error('Erreur lors de la mise à jour du matériel:', materielError);
        } else {
          console.log('Statut matériel remis à "Disponible"');
        }
      }

      toast.success('Maintenance supprimée avec succès');
      await fetchMaintenance();
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting maintenance:', error);
      toast.error('Erreur lors de la suppression de la maintenance');
      return { error };
    }
  };

  useEffect(() => {
    fetchMaintenance();

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
        .channel(`maintenance-changes-${Math.random()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'maintenance'
          },
          (payload) => {
            console.log('Changement détecté sur maintenance:', payload);
            fetchMaintenance();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'materiel'
          },
          (payload) => {
            console.log('Changement détecté sur materiel (depuis maintenance):', payload);
            fetchMaintenance();
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
    maintenance,
    loading,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    refetch: fetchMaintenance
  };
};
