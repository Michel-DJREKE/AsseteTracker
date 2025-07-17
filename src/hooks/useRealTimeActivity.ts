
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMateriel } from './useMateriel';
import { useMaintenance } from './useMaintenance';
import { useAttributions } from './useAttributions';
import { Monitor, Wrench, UserPlus, AlertTriangle } from 'lucide-react';

interface Activity {
  id: string;
  type: 'acquisition' | 'maintenance' | 'attribution' | 'incident';
  title: string;
  description: string;
  time: string;
  icon: any;
  color: string;
}

export const useRealTimeActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { materiel } = useMateriel();
  const { maintenance } = useMaintenance();
  const { attributions } = useAttributions();

  const generateActivities = () => {
    const now = new Date();
    const newActivities: Activity[] = [];

    console.log('Génération des activités avec:', {
      materiel: materiel.length,
      maintenance: maintenance.length,
      attributions: attributions.length
    });

    // Récentes acquisitions (derniers ajouts de matériel)
    const recentMateriel = materiel
      .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
      .slice(0, 3);

    recentMateriel.forEach((item) => {
      const createdAt = new Date(item.created_at || '');
      const timeDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));
      
      newActivities.push({
        id: `materiel-${item.id}`,
        type: 'acquisition',
        title: `Nouveau ${item.nom} ${item.modele}`,
        description: `Ajouté au parc informatique - ${item.fournisseur || 'Fournisseur non spécifié'}`,
        time: timeDiff < 1 ? 'Il y a quelques minutes' : `Il y a ${timeDiff} heure${timeDiff > 1 ? 's' : ''}`,
        icon: Monitor,
        color: 'blue'
      });
    });

    // Récentes maintenances
    const recentMaintenance = maintenance
      .sort((a, b) => new Date(b.created_at || b.date_debut).getTime() - new Date(a.created_at || a.date_debut).getTime())
      .slice(0, 3);

    recentMaintenance.forEach((item) => {
      const createdAt = new Date(item.created_at || item.date_debut);
      const timeDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));
      
      newActivities.push({
        id: `maintenance-${item.id}`,
        type: 'maintenance',
        title: item.statut === 'Terminé' ? 'Maintenance terminée' : 'Maintenance programmée',
        description: `${item.type_maintenance} - ${item.probleme || 'Maintenance système'}`,
        time: timeDiff < 1 ? 'Il y a quelques minutes' : `Il y a ${timeDiff} heure${timeDiff > 1 ? 's' : ''}`,
        icon: Wrench,
        color: item.statut === 'Terminé' ? 'green' : 'purple'
      });
    });

    // Récentes attributions
    const recentAttributions = attributions
      .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
      .slice(0, 2);

    recentAttributions.forEach((item) => {
      const createdAt = new Date(item.created_at || '');
      const timeDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));
      
      newActivities.push({
        id: `attribution-${item.id}`,
        type: 'attribution',
        title: item.statut === 'Retourné' ? 'Matériel retourné' : 'Matériel attribué',
        description: `Attribution ${item.statut === 'Retourné' ? 'terminée' : 'active'}`,
        time: timeDiff < 1 ? 'Il y a quelques minutes' : `Il y a ${timeDiff} heure${timeDiff > 1 ? 's' : ''}`,
        icon: UserPlus,
        color: item.statut === 'Retourné' ? 'gray' : 'green'
      });
    });

    // Incidents (matériel hors service récent)
    const incidents = materiel.filter(item => item.statut === 'Hors service' || item.statut === 'En maintenance');
    if (incidents.length > 0) {
      const latestIncident = incidents[0];
      newActivities.push({
        id: `incident-${latestIncident.id}`,
        type: 'incident',
        title: `Statut ${latestIncident.statut.toLowerCase()} - ${latestIncident.nom}`,
        description: `${latestIncident.modele} - Nécessite une attention`,
        time: 'Il y a 2 heures',
        icon: AlertTriangle,
        color: latestIncident.statut === 'Hors service' ? 'red' : 'orange'
      });
    }

    // Trier par pertinence et limiter à 6 activités
    const sortedActivities = newActivities
      .sort((a, b) => {
        const priorities = { 'incident': 4, 'maintenance': 3, 'acquisition': 2, 'attribution': 1 };
        return priorities[b.type] - priorities[a.type];
      })
      .slice(0, 6);

    console.log('Activités générées:', sortedActivities.length);
    setActivities(sortedActivities);
  };

  useEffect(() => {
    if (materiel.length > 0 || maintenance.length > 0 || attributions.length > 0) {
      generateActivities();
    }
  }, [materiel, maintenance, attributions]);

  return { activities };
};
