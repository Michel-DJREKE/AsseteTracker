
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Incident = Tables<'incidents'> & {
  materiel?: {
    nom: string;
    numero_serie: string;
    modele: string;
  };
  utilisateur?: {
    nom: string;
    prenom: string;
    email: string;
  };
};
type IncidentInsert = TablesInsert<'incidents'>;
type IncidentUpdate = TablesUpdate<'incidents'>;

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const fetchIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          *,
          materiel:materiel_id(nom, numero_serie, modele),
          utilisateur:utilisateur_id(nom, prenom, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIncidents(data || []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      toast.error('Erreur lors du chargement des incidents');
    } finally {
      setLoading(false);
    }
  };

  const addIncident = async (newIncident: IncidentInsert) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté pour ajouter un incident');
        return { data: null, error: 'Not authenticated' };
      }

      const { data, error } = await supabase
        .from('incidents')
        .insert([{
          ...newIncident,
          owner_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      toast.success('Incident ajouté avec succès');
      return { data, error: null };
    } catch (error) {
      console.error('Error adding incident:', error);
      toast.error('Erreur lors de l\'ajout de l\'incident');
      return { data: null, error };
    }
  };

  const updateIncident = async (id: string, updates: IncidentUpdate) => {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Incident modifié avec succès');
      return { data, error: null };
    } catch (error) {
      console.error('Error updating incident:', error);
      toast.error('Erreur lors de la modification de l\'incident');
      return { data: null, error };
    }
  };

  const deleteIncident = async (id: string) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Incident supprimé avec succès');
      return { error: null };
    } catch (error) {
      console.error('Error deleting incident:', error);
      toast.error('Erreur lors de la suppression de l\'incident');
      return { error };
    }
  };

  useEffect(() => {
    fetchIncidents();

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
        .channel(`incidents-changes-${Math.random()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'incidents'
          },
          () => {
            fetchIncidents();
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
    incidents,
    loading,
    addIncident,
    updateIncident,
    deleteIncident,
    refetch: fetchIncidents
  };
};
