
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Attribution = Tables<'attributions'> & {
  materiel?: {
    nom: string;
    numero_serie: string;
  };
  utilisateur?: {
    nom: string;
    prenom: string;
    email: string;
  };
};
type AttributionInsert = TablesInsert<'attributions'>;
type AttributionUpdate = TablesUpdate<'attributions'>;

export const useAttributions = () => {
  const [attributions, setAttributions] = useState<Attribution[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const fetchAttributions = async () => {
    try {
      const { data, error } = await supabase
        .from('attributions')
        .select(`
          *,
          materiel:materiel_id(nom, numero_serie),
          utilisateur:utilisateur_id(nom, prenom, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttributions(data || []);
    } catch (error) {
      console.error('Error fetching attributions:', error);
      toast.error('Erreur lors du chargement des attributions');
    } finally {
      setLoading(false);
    }
  };

  const addAttribution = async (newAttribution: AttributionInsert) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté pour ajouter une attribution');
        return { data: null, error: 'Not authenticated' };
      }

      // Commence une transaction pour créer l'attribution et mettre à jour le statut du matériel
      const { data: attributionData, error: attributionError } = await supabase
        .from('attributions')
        .insert([{
          ...newAttribution,
          owner_id: user.id
        }])
        .select()
        .single();

      if (attributionError) throw attributionError;

      // Met à jour le statut du matériel vers "Attribué"
      const { error: materielError } = await supabase
        .from('materiel')
        .update({ statut: 'Attribué' })
        .eq('id', newAttribution.materiel_id);

      if (materielError) throw materielError;

      toast.success('Attribution ajoutée avec succès');
      return { data: attributionData, error: null };
    } catch (error) {
      console.error('Error adding attribution:', error);
      toast.error('Erreur lors de l\'ajout de l\'attribution');
      return { data: null, error };
    }
  };

  const updateAttribution = async (id: string, updates: AttributionUpdate) => {
    try {
      // Récupère l'attribution actuelle pour connaître le matériel
      const { data: currentAttribution } = await supabase
        .from('attributions')
        .select('materiel_id, statut')
        .eq('id', id)
        .single();

      const { data, error } = await supabase
        .from('attributions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Si le statut passe à "Retourné", met à jour le matériel vers "Disponible"
      if (updates.statut === 'Retourné' && currentAttribution?.materiel_id) {
        await supabase
          .from('materiel')
          .update({ statut: 'Disponible' })
          .eq('id', currentAttribution.materiel_id);
      }

      toast.success('Attribution modifiée avec succès');
      return { data, error: null };
    } catch (error) {
      console.error('Error updating attribution:', error);
      toast.error('Erreur lors de la modification de l\'attribution');
      return { data: null, error };
    }
  };

  const deleteAttribution = async (id: string) => {
    try {
      // Récupère l'attribution pour connaître le matériel à libérer
      const { data: attribution } = await supabase
        .from('attributions')
        .select('materiel_id')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('attributions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remet le matériel en statut "Disponible"
      if (attribution?.materiel_id) {
        await supabase
          .from('materiel')
          .update({ statut: 'Disponible' })
          .eq('id', attribution.materiel_id);
      }

      toast.success('Attribution supprimée avec succès');
      return { error: null };
    } catch (error) {
      console.error('Error deleting attribution:', error);
      toast.error('Erreur lors de la suppression de l\'attribution');
      return { error };
    }
  };

  useEffect(() => {
    fetchAttributions();

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
        .channel(`attributions-changes-${Math.random()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'attributions'
          },
          () => {
            fetchAttributions();
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
    attributions,
    loading,
    addAttribution,
    updateAttribution,
    deleteAttribution,
    refetch: fetchAttributions
  };
};
