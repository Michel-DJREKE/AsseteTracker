
import React from 'react';
import { StatsCards } from '../components/Dashboard/StatsCards';
import { Charts } from '../components/Dashboard/Charts';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import { AlertsPanel } from '../components/Dashboard/AlertsPanel';

export const Dashboard = () => {
  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
          <p className="text-sm lg:text-base text-gray-600">Aperçu complet de votre parc informatique</p>
        </div>
        
        <StatsCards />
        
        <Charts />
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          <RecentActivity />
          <AlertsPanel />
        </div>
      </div>
    </div>
  );
};
