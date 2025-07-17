
import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  History
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Matériel', href: '/materiel', icon: Monitor },
  { name: 'Attributions', href: '/attributions', icon: UserCheck },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Utilisateurs', href: '/utilisateurs', icon: Users },
  { name: 'Historique', href: '/historique', icon: History },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Recherche', href: '/recherche', icon: Search },
  { name: 'Paramètres', href: '/parametres', icon: Settings },
];

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { state } = useSidebar();

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

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === href;
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Monitor className="w-3 h-3 lg:w-5 lg:h-5 text-white" />
          </div>
          {state === "expanded" && (
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900">AssetTracker</h1>
              <p className="text-xs lg:text-sm text-gray-500">Gestion de matériel</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = isActiveRoute(item.href);
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.href}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className={`w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 ${
                          isActive ? 'text-blue-700' : ''
                        }`} />
                        {state === "expanded" && (
                          <span className={`ml-3 truncate ${
                            isActive ? 'font-semibold' : ''
                          }`}>{item.name}</span>
                        )}
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-700 rounded-r-full"></div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-sm"
        >
          <LogOut className="w-4 h-4" />
          {state === "expanded" && <span className="ml-3">Déconnexion</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
