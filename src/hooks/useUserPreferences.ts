
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'fr' | 'en';
  timezone: string;
  items_per_page: number;
  auto_refresh: boolean;
  compact_view: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'fr',
  timezone: 'Europe/Paris',
  items_per_page: 10,
  auto_refresh: true,
  compact_view: false
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  const fetchPreferences = async () => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      // Simuler le stockage local pour les préférences
      const stored = localStorage.getItem(`user_preferences_${userId}`);
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      const updated = { ...preferences, ...newPreferences };
      
      // Sauvegarder localement (en attendant la table)
      localStorage.setItem(`user_preferences_${userId}`, JSON.stringify(updated));
      
      setPreferences(updated);
      toast.success('Préférences utilisateur mises à jour');
      
      return { data: updated, error: null };
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour des préférences');
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return {
    preferences,
    loading,
    updatePreferences
  };
};
