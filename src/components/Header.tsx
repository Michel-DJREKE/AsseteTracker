
import React from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuthWithProfiles } from '@/hooks/useAuthWithProfiles';
import { toast } from 'sonner';

export const Header = () => {
  const navigate = useNavigate();
  const { signOut, profile } = useAuthWithProfiles();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
      <SidebarTrigger className="-ml-1" />
      
      <div className="flex items-center flex-1 justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
            AssetTracker
          </h2>
          {profile && (
            <span className="hidden lg:block text-sm text-gray-500">
              Bonjour, {profile.prenom} {profile.nom}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/notifications')}
            className="relative"
          >
            <Bell className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
          </Button>
          
          {/* Menu utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {profile ? `${profile.prenom} ${profile.nom}` : 'Mon compte'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/parametres')}>
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/notifications')}>
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
