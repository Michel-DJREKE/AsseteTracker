
import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Maintenance en retard',
      message: 'La maintenance de l\'ordinateur portable HP-001 est en retard de 3 jours.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Nouveau matériel ajouté',
      message: 'Un nouvel ordinateur portable MacBook Pro a été ajouté à l\'inventaire.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: false
    },
    {
      id: '3',
      type: 'success',
      title: 'Attribution terminée',
      message: 'L\'ordinateur HP-003 a été attribué avec succès à Jean Dupont.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true
    },
    {
      id: '4',
      type: 'error',
      title: 'Garantie expirée',
      message: 'La garantie de l\'imprimante Canon-005 a expiré hier.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true
    }
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    maintenanceAlerts: true,
    warrantyExpiration: true,
    newAssignments: false
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast.success('Toutes les notifications ont été marquées comme lues');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success('Notification supprimée');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-orange-100 text-orange-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Il y a quelques minutes';
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm lg:text-base text-gray-600">
                  Gérez vos notifications et préférences
                </p>
                {unreadCount > 0 && (
                  <Badge className="bg-red-100 text-red-800 text-xs">
                    {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Liste des notifications */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                  <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                  Notifications récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 lg:space-y-4">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 lg:py-8 text-gray-500">
                      <p className="text-sm lg:text-base">Aucune notification</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 lg:p-4 rounded-lg border transition-all ${
                          notification.read 
                            ? 'bg-gray-50 border-gray-200' 
                            : 'bg-white border-blue-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start space-x-2 lg:space-x-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h4 className={`font-medium text-sm lg:text-base truncate ${
                                  notification.read ? 'text-gray-700' : 'text-gray-900'
                                }`}>
                                  {notification.title}
                                </h4>
                                <Badge className={`${getNotificationBadgeColor(notification.type)} text-xs flex-shrink-0`}>
                                  {notification.type}
                                </Badge>
                              </div>
                              <p className={`text-xs lg:text-sm line-clamp-2 ${
                                notification.read ? 'text-gray-500' : 'text-gray-700'
                              }`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1 lg:mt-2">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 flex-shrink-0">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs px-2 py-1 h-auto"
                              >
                                <span className="hidden sm:inline">Marquer comme lu</span>
                                <span className="sm:hidden">Lu</span>
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 h-auto"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Paramètres de notification */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                  <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
                  Préférences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="text-sm font-medium flex-1">
                    Notifications par email
                  </Label>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance-alerts" className="text-sm font-medium flex-1">
                    Alertes de maintenance
                  </Label>
                  <Switch
                    id="maintenance-alerts"
                    checked={settings.maintenanceAlerts}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, maintenanceAlerts: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="warranty-expiration" className="text-sm font-medium flex-1">
                    Expiration de garantie
                  </Label>
                  <Switch
                    id="warranty-expiration"
                    checked={settings.warrantyExpiration}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, warrantyExpiration: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-assignments" className="text-sm font-medium flex-1">
                    Nouvelles attributions
                  </Label>
                  <Switch
                    id="new-assignments"
                    checked={settings.newAssignments}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, newAssignments: checked }))
                    }
                  />
                </div>

                <Button 
                  className="w-full mt-4" 
                  size="sm"
                  onClick={() => toast.success('Préférences sauvegardées')}
                >
                  Sauvegarder les préférences
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
