
import React from 'react';
import { Monitor, Package, Wrench, Users } from 'lucide-react';
import { useMateriel } from '@/hooks/useMateriel';
import { useUtilisateurs } from '@/hooks/useUtilisateurs';
import { useMaintenance } from '@/hooks/useMaintenance';
import { useAttributions } from '@/hooks/useAttributions';

export const StatsCards = () => {
  const { materiel, loading: materielLoading } = useMateriel();
  const { utilisateurs, loading: utilisateursLoading } = useUtilisateurs();
  const { maintenance, loading: maintenanceLoading } = useMaintenance();
  const { attributions, loading: attributionsLoading } = useAttributions();

  if (materielLoading || utilisateursLoading || maintenanceLoading || attributionsLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const totalMateriel = materiel.length;
  const materielEnUtilisation = materiel.filter(m => m.statut === 'Attribué').length;
  const materielDisponible = materiel.filter(m => m.statut === 'Disponible').length;
  const materielEnMaintenance = materiel.filter(m => m.statut === 'En maintenance').length;

  console.log('Statistiques calculées (StatsCards):', {
    totalMateriel,
    materielEnUtilisation,
    materielDisponible,
    materielEnMaintenance,
    maintenanceActives: maintenance.filter(m => m.statut === 'En cours' || m.statut === 'Planifié').length,
    materielParStatut: {
      'Disponible': materiel.filter(m => m.statut === 'Disponible').length,
      'Attribué': materiel.filter(m => m.statut === 'Attribué').length,
      'En maintenance': materiel.filter(m => m.statut === 'En maintenance').length,
      'Hors service': materiel.filter(m => m.statut === 'Hors service').length,
    }
  });

  // Calculer les changements par rapport à la semaine dernière (simulation basée sur les données réelles)
  const calculateChange = (current: number) => {
    return Math.max(0, Math.floor(current * 0.1)); // Simulation d'une croissance de 10%
  };

  const stats = [
    {
      name: 'Total du matériel',
      value: totalMateriel.toString(),
      change: `+${calculateChange(totalMateriel)}`,
      changeType: 'positive' as const,
      icon: Monitor,
      color: 'blue' as const
    },
    {
      name: 'En utilisation',
      value: materielEnUtilisation.toString(),
      change: `+${calculateChange(materielEnUtilisation)}`,
      changeType: 'positive' as const,
      icon: Users,
      color: 'green' as const
    },
    {
      name: 'En maintenance',
      value: materielEnMaintenance.toString(),
      change: materielEnMaintenance > 0 ? `${materielEnMaintenance}` : '0',
      changeType: materielEnMaintenance > 0 ? 'negative' as const : 'positive' as const,
      icon: Wrench,
      color: 'orange' as const
    },
    {
      name: 'Matériel disponible',
      value: materielDisponible.toString(),
      change: `+${calculateChange(materielDisponible)}`,
      changeType: 'positive' as const,
      icon: Package,
      color: 'green' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div key={stat.name} className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1 truncate">{stat.name}</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <div className="flex items-center">
                  <span className={`text-xs lg:text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs lg:text-sm text-gray-500 ml-1 hidden sm:inline">cette semaine</span>
                </div>
              </div>
              <div className={`p-2 lg:p-3 rounded-lg flex-shrink-0 ml-2 ${
                stat.color === 'blue' ? 'bg-blue-100' :
                stat.color === 'green' ? 'bg-green-100' :
                stat.color === 'orange' ? 'bg-orange-100' : 'bg-red-100'
              }`}>
                <IconComponent className={`w-5 h-5 lg:w-6 lg:h-6 ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'orange' ? 'text-orange-600' : 'text-red-600'
                }`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
