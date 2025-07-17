
import React from 'react';
import { useRealTimeActivity } from '@/hooks/useRealTimeActivity';

export const RecentActivity = () => {
  const { activities } = useRealTimeActivity();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
      <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6">Activité récente</h3>
      
      <div className="space-y-3 lg:space-y-4 max-h-96 overflow-y-auto">
        {activities.length > 0 ? (
          activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3 lg:space-x-4 p-2 lg:p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  activity.color === 'blue' ? 'bg-blue-100' :
                  activity.color === 'green' ? 'bg-green-100' :
                  activity.color === 'purple' ? 'bg-purple-100' : 'bg-red-100'
                }`}>
                  <IconComponent className={`w-3 h-3 lg:w-4 lg:h-4 ${
                    activity.color === 'blue' ? 'text-blue-600' :
                    activity.color === 'green' ? 'text-green-600' :
                    activity.color === 'purple' ? 'text-purple-600' : 'text-red-600'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                  <p className="text-xs lg:text-sm text-gray-500 mt-1 line-clamp-2 break-words">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-6 lg:py-8">
            <p className="text-sm lg:text-base">Aucune activité récente</p>
            <p className="text-xs lg:text-sm mt-2">Les nouvelles activités apparaîtront ici</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 lg:mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
          Voir toutes les activités
        </button>
      </div>
    </div>
  );
};
