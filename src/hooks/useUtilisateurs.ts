
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Utilisateur = Tables<'utilisateurs'>;
type UtilisateurInsert = TablesInsert<'utilisateurs'>;
type UtilisateurUpdate = TablesUpdate<'utilisateurs'>;

export const useUtilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const fetchUtilisateurs = async () => {
    try {
      const { data, error } = await supabase
        .from('utilisateurs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUtilisateurs(data || []);
    } catch (error) {
      console.error('Error fetching utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const addUtilisateur = async (newUtilisateur: UtilisateurInsert) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté pour ajouter un utilisateur');
        return { data: null, error: 'Not authenticated' };
      }

      // Validation des champs requis
      if (!newUtilisateur.nom || !newUtilisateur.prenom || !newUtilisateur.email || 
          !newUtilisateur.service || !newUtilisateur.poste) {
        throw new Error('Les champs obligatoires sont manquants');
      }

      const { data, error } = await supabase
        .from('utilisateurs')
        .insert([{
          nom: newUtilisateur.nom,
          prenom: newUtilisateur.prenom,
          email: newUtilisateur.email,
          telephone: newUtilisateur.telephone || null,
          service: newUtilisateur.service,
          poste: newUtilisateur.poste,
          statut: newUtilisateur.statut || 'Actif',
          owner_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
        throw error;
      }
      
      toast.success('Utilisateur ajouté avec succès');
      await fetchUtilisateurs();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error adding utilisateur:', error);
      const errorMessage = error.message || 'Erreur lors de l\'ajout de l\'utilisateur';
      toast.error(errorMessage);
      return { data: null, error };
    }
  };

  const updateUtilisateur = async (id: string, updates: UtilisateurUpdate) => {
    try {
      const { data, error } = await supabase
        .from('utilisateurs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Utilisateur modifié avec succès');
      await fetchUtilisateurs();
      return { data, error: null };
    } catch (error) {
      console.error('Error updating utilisateur:', error);
      toast.error('Erreur lors de la modification de l\'utilisateur');
      return { data: null, error };
    }
  };

  const deleteUtilisateur = async (id: string) => {
    try {
      const { error } = await supabase
        .from('utilisateurs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Utilisateur supprimé avec succès');
      await fetchUtilisateurs();
      return { error: null };
    } catch (error) {
      console.error('Error deleting utilisateur:', error);
      toast.error('Erreur lors de la suppression de l\'utilisateur');
      return { error };
    }
  };

  useEffect(() => {
    fetchUtilisateurs();

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
        .channel(`utilisateurs-changes-${Math.random()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'utilisateurs'
          },
          () => {
            fetchUtilisateurs();
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
    utilisateurs,
    loading,
    addUtilisateur,
    updateUtilisateur,
    deleteUtilisateur,
    refetch: fetchUtilisateurs
  };
};
