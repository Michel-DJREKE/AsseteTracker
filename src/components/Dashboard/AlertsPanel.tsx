
import React from 'react';
import { AlertTriangle, Clock, Shield, Wrench } from 'lucide-react';
import { useRealTimeAlerts } from '@/hooks/useRealTimeAlerts';

const getIcon = (type: string) => {
  switch (type) {
    case 'warranty': return Shield;
    case 'maintenance': return Clock;
    case 'incidents': return AlertTriangle;
    case 'maintenance_scheduled': return Wrench;
    default: return AlertTriangle;
  }
};

export const AlertsPanel = () => {
  const { alerts } = useRealTimeAlerts();
  const urgentAlerts = alerts.filter(alert => alert.priority === 'high').length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-2">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900">Alertes et notifications</h3>
        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full self-start">
          {urgentAlerts} urgente{urgentAlerts > 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.map((alert) => {
          const IconComponent = getIcon(alert.type);
          return (
            <div key={alert.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 rounded-lg border-l-4 gap-3 ${
              alert.color === 'red' ? 'bg-red-50 border-red-400' :
              alert.color === 'orange' ? 'bg-orange-50 border-orange-400' :
              alert.color === 'yellow' ? 'bg-yellow-50 border-yellow-400' : 'bg-blue-50 border-blue-400'
            }`}>
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <IconComponent className={`w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 ${
                  alert.color === 'red' ? 'text-red-600' :
                  alert.color === 'orange' ? 'text-orange-600' :
                  alert.color === 'yellow' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm lg:text-base truncate">{alert.title}</p>
                  <p className="text-xs lg:text-sm text-gray-600 line-clamp-2 break-words">{alert.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end space-x-3 flex-shrink-0">
                <span className={`px-2 py-1 text-lg lg:text-xl font-bold rounded-full ${
                  alert.color === 'red' ? 'text-red-600' :
                  alert.color === 'orange' ? 'text-orange-600' :
                  alert.color === 'yellow' ? 'text-yellow-600' : 'text-blue-600'
                }`}>
                  {alert.count}
                </span>
                {alert.count > 0 && (
                  <button className={`text-xs lg:text-sm font-medium px-3 py-1 rounded-lg transition-colors duration-200 ${
                    alert.color === 'red' ? 'text-red-700 hover:bg-red-100' :
                    alert.color === 'orange' ? 'text-orange-700 hover:bg-orange-100' :
                    alert.color === 'yellow' ? 'text-yellow-700 hover:bg-yellow-100' : 'text-blue-700 hover:bg-blue-100'
                  }`}>
                    Traiter
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
