
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NotificationPreferences {
  email_maintenance: boolean;
  email_attributions: boolean;
  email_incidents: boolean;
  email_alerts: boolean;
  push_maintenance: boolean;
  push_attributions: boolean;
  push_incidents: boolean;
  push_alerts: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  email_maintenance: true,
  email_attributions: true,
  email_incidents: true,
  email_alerts: true,
  push_maintenance: true,
  push_attributions: false,
  push_incidents: true,
  push_alerts: true,
  frequency: 'immediate'
};

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  const fetchPreferences = async () => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      // Simuler le stockage local pour les préférences
      const stored = localStorage.getItem(`notification_preferences_${userId}`);
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      const updated = { ...preferences, ...newPreferences };
      
      // Sauvegarder localement (en attendant la table)
      localStorage.setItem(`notification_preferences_${userId}`, JSON.stringify(updated));
      
      setPreferences(updated);
      toast.success('Préférences de notification mises à jour');
      
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
