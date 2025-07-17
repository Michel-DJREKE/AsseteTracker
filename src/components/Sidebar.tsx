
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Monitor, 
  Users, 
  Wrench, 
  UserCheck, 
  Bell, 
  Search,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Matériel', href: '/materiel', icon: Monitor },
  { name: 'Attributions', href: '/attributions', icon: UserCheck },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Utilisateurs', href: '/utilisateurs', icon: Users },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Recherche', href: '/recherche', icon: Search },
  { name: 'Paramètres', href: '/parametres', icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie');
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        w-64 bg-white border-r border-gray-200 h-full fixed left-0 top-0 z-30 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Header avec bouton de fermeture pour mobile */}
        <div className="p-4 lg:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Monitor className="w-3 h-3 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold text-gray-900">AssetTracker</h1>
                <p className="text-xs lg:text-sm text-gray-500">Gestion de matériel</p>
              </div>
            </div>
            {/* Bouton de fermeture pour mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <nav className="mt-4 lg:mt-6 px-3 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>
        
        {/* Bouton de déconnexion */}
        <div className="p-4 flex-shrink-0">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-sm"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </>
  );
};
