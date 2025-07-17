
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMateriel } from '@/hooks/useMateriel';
import { useMaintenance } from '@/hooks/useMaintenance';
import { useAttributions } from '@/hooks/useAttributions';

export const Charts = () => {
  const { materiel, loading: materielLoading } = useMateriel();
  const { maintenance, loading: maintenanceLoading } = useMaintenance();
  const { attributions, loading: attributionsLoading } = useAttributions();

  if (materielLoading || maintenanceLoading || attributionsLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 animate-pulse">
          <div className="h-60 lg:h-80 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 animate-pulse">
          <div className="h-60 lg:h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  console.log('Données pour les graphiques:', {
    materiel: materiel.length,
    maintenance: maintenance.length,
    attributions: attributions.length
  });

  // Calculer la répartition par statut du matériel (données réelles)
  const statutStats = materiel.reduce((acc, item) => {
    acc[item.statut] = (acc[item.statut] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('Statistiques par statut:', statutStats);

  const pieData = [
    { name: 'Disponible', value: statutStats['Disponible'] || 0, color: '#10B981' },
    { name: 'Attribué', value: statutStats['Attribué'] || 0, color: '#3B82F6' },
    { name: 'En maintenance', value: statutStats['En maintenance'] || 0, color: '#F59E0B' },
    { name: 'Hors service', value: statutStats['Hors service'] || 0, color: '#EF4444' }
  ].filter(item => item.value > 0);

  // Calculer les attributions et maintenances par mois (6 derniers mois) avec données réelles
  const now = new Date();
  const months = [];
  
  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59);
    
    // Compter les attributions du mois
    const attributionsCount = attributions.filter(a => {
      if (!a.date_attribution) return false;
      const dateAttribution = new Date(a.date_attribution);
      return !isNaN(dateAttribution.getTime()) && 
             dateAttribution >= monthStart && 
             dateAttribution <= monthEnd;
    }).length;
    
    // Compter les maintenances du mois (créées ou commencées)
    const maintenancesCount = maintenance.filter(m => {
      if (!m.date_debut) return false;
      const dateDebut = new Date(m.date_debut);
      return !isNaN(dateDebut.getTime()) && 
             dateDebut >= monthStart && 
             dateDebut <= monthEnd;
    }).length;
    
    console.log(`Mois ${targetDate.toLocaleDateString('fr-FR', { month: 'short' })}:`, {
      attributions: attributionsCount,
      maintenances: maintenancesCount
    });
    
    months.push({
      name: targetDate.toLocaleDateString('fr-FR', { month: 'short' }),
      attributions: attributionsCount,
      maintenances: maintenancesCount
    });
  }

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
      <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Répartition par statut du matériel</h3>
        <div className="h-60 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={window.innerWidth < 1024 ? 60 : 80}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} unités`, name]}
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: item.color }}></div>
              <span className="text-xs text-gray-600 truncate">{item.name} ({item.value})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Attributions vs Maintenances (6 derniers mois)</h3>
        <div className="h-60 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={months} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                fontSize={11}
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={11}
                tick={{ fontSize: 11 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '11px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="attributions" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Attributions" />
              <Bar dataKey="maintenances" fill="#EF4444" radius={[4, 4, 0, 0]} name="Maintenances" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
