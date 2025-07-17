
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type HistoriqueActivite = Tables<'historique_activites'> & {
  materiel?: {
    id: string;
    nom: string;
    numero_serie: string;
    modele: string;
  };
  utilisateur?: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
  };
};

export const useHistoriqueActivites = () => {
  const [historique, setHistorique] = useState<HistoriqueActivite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistorique = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('historique_activites')
        .select(`
          *,
          materiel:materiel_id(
            id,
            nom,
            numero_serie,
            modele
          ),
          utilisateur:utilisateur_id(
            id,
            nom,
            prenom,
            email
          )
        `)
        .order('date_activite', { ascending: false })
        .limit(1000); // Limiter à 1000 entrées pour les performances

      if (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
        return;
      }

      setHistorique(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorique();

    // Écouter les changements en temps réel
    const channel = supabase
      .channel('historique-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'historique_activites'
        },
        (payload) => {
          console.log('Nouvelle activité détectée:', payload);
          // Recharger les données quand il y a des changements
          fetchHistorique();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    historique,
    loading,
    refetch: fetchHistorique
  };
};
