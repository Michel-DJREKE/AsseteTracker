
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMateriel } from './useMateriel';
import { useMaintenance } from './useMaintenance';

interface Alert {
  id: string;
  type: 'warranty' | 'maintenance' | 'incidents' | 'maintenance_scheduled';
  title: string;
  count: number;
  description: string;
  priority: 'high' | 'medium' | 'low';
  color: 'red' | 'orange' | 'yellow' | 'blue';
}

export const useRealTimeAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { materiel } = useMateriel();
  const { maintenance } = useMaintenance();

  const calculateAlerts = () => {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Garanties expirées
    const expiredWarranties = materiel.filter(m => {
      if (!m.garantie_fin) return false;
      return new Date(m.garantie_fin) < now;
    }).length;

    // Maintenances en retard
    const overdueMaintenance = maintenance.filter(m => {
      if (!m.date_fin || m.statut === 'Terminé') return false;
      return new Date(m.date_fin) < now;
    }).length;

    // Incidents en attente (matériel en panne ou hors service)
    const pendingIncidents = materiel.filter(m => 
      m.statut === 'Hors service' || m.statut === 'En maintenance'
    ).length;

    // Maintenances programmées cette semaine
    const scheduledMaintenance = maintenance.filter(m => {
      if (!m.date_debut || m.statut === 'Terminé') return false;
      const startDate = new Date(m.date_debut);
      return startDate >= now && startDate <= oneWeekFromNow;
    }).length;

    const newAlerts: Alert[] = [
      {
        id: '1',
        type: 'warranty',
        title: 'Garanties expirées',
        count: expiredWarranties,
        description: `${expiredWarranties} équipement${expiredWarranties > 1 ? 's' : ''} avec garantie expirée`,
        priority: expiredWarranties > 0 ? 'high' : 'low',
        color: expiredWarranties > 0 ? 'red' : 'blue'
      },
      {
        id: '2',
        type: 'maintenance',
        title: 'Maintenances en retard',
        count: overdueMaintenance,
        description: `${overdueMaintenance} maintenance${overdueMaintenance > 1 ? 's' : ''} programmée${overdueMaintenance > 1 ? 's' : ''} en retard`,
        priority: overdueMaintenance > 0 ? 'high' : 'low',
        color: overdueMaintenance > 0 ? 'orange' : 'blue'
      },
      {
        id: '3',
        type: 'incidents',
        title: 'Incidents en attente',
        count: pendingIncidents,
        description: `${pendingIncidents} incident${pendingIncidents > 1 ? 's' : ''} en attente de traitement`,
        priority: pendingIncidents > 5 ? 'high' : pendingIncidents > 0 ? 'medium' : 'low',
        color: pendingIncidents > 5 ? 'red' : pendingIncidents > 0 ? 'yellow' : 'blue'
      },
      {
        id: '4',
        type: 'maintenance_scheduled',
        title: 'Maintenances programmées',
        count: scheduledMaintenance,
        description: `${scheduledMaintenance} maintenance${scheduledMaintenance > 1 ? 's' : ''} programmée${scheduledMaintenance > 1 ? 's' : ''} cette semaine`,
        priority: 'low',
        color: 'blue'
      }
    ];

    setAlerts(newAlerts);
  };

  useEffect(() => {
    calculateAlerts();
  }, [materiel, maintenance]);

  return { alerts };
};
