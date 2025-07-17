
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, Briefcase, Save, Key, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const Parametres = () => {
  const { profile, loading, updateProfile, updatePassword } = useUserProfile();
  const [profileData, setProfileData] = useState({
    nom: '',
    prenom: '',
    email: '',
    service: '',
    poste: ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    emailNotifications: true,
    smsNotifications: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [resetConfirmation, setResetConfirmation] = useState({
    step1: false,
    step2: false,
    confirmText: ''
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        nom: profile.nom || '',
        prenom: profile.prenom || '',
        email: profile.email || '',
        service: profile.service || '',
        poste: profile.poste || ''
      });
    }
  }, [profile]);

  const handleProfileSave = async () => {
    await updateProfile(profileData);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    await updatePassword(passwordData.currentPassword, passwordData.newPassword);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleSystemReset = async () => {
    if (!resetConfirmation.step1 || !resetConfirmation.step2 || resetConfirmation.confirmText !== 'REINITIALISER') {
      toast.error('Veuillez confirmer la réinitialisation en suivant toutes les étapes');
      return;
    }

    try {
      // Supprimer toutes les données de l'utilisateur
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Utilisateur non connecté');
        return;
      }

      // Supprimer dans l'ordre pour éviter les erreurs de contraintes
      await supabase.from('attributions').delete().eq('owner_id', user.id);
      await supabase.from('maintenance').delete().eq('owner_id', user.id);
      await supabase.from('incidents').delete().eq('owner_id', user.id);
      await supabase.from('materiel').delete().eq('owner_id', user.id);
      await supabase.from('utilisateurs').delete().eq('owner_id', user.id);
      await supabase.from('historique_activites').delete().eq('owner_id', user.id);

      toast.success('Système réinitialisé avec succès');
      setResetConfirmation({ step1: false, step2: false, confirmText: '' });
      
      // Rediriger vers le dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error resetting system:', error);
      toast.error('Erreur lors de la réinitialisation du système');
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
          <p className="text-sm lg:text-base text-gray-600">Gérez votre profil et vos préférences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="text-xs lg:text-sm">Profil</TabsTrigger>
            <TabsTrigger value="security" className="text-xs lg:text-sm">Sécurité</TabsTrigger>
            <TabsTrigger value="preferences" className="text-xs lg:text-sm">Préférences</TabsTrigger>
            <TabsTrigger value="system" className="text-xs lg:text-sm">Système</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                  <User className="w-4 h-4 lg:w-5 lg:h-5" />
                  Informations personnelles
                </CardTitle>
                <CardDescription className="text-sm">
                  Mettez à jour vos informations personnelles et professionnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prenom" className="text-sm">Prénom</Label>
                    <Input
                      id="prenom"
                      value={profileData.prenom}
                      onChange={(e) => setProfileData({ ...profileData, prenom: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nom" className="text-sm">Nom</Label>
                    <Input
                      id="nom"
                      value={profileData.nom}
                      onChange={(e) => setProfileData({ ...profileData, nom: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="service" className="text-sm">Service</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="service"
                        className="pl-10"
                        value={profileData.service}
                        onChange={(e) => setProfileData({ ...profileData, service: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="poste" className="text-sm">Poste</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="poste"
                        className="pl-10"
                        value={profileData.poste}
                        onChange={(e) => setProfileData({ ...profileData, poste: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleProfileSave} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder les modifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                    <Key className="w-4 h-4 lg:w-5 lg:h-5" />
                    Changer le mot de passe
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Mettez à jour votre mot de passe pour sécuriser votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current-password" className="text-sm">Mot de passe actuel</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password" className="text-sm">Nouveau mot de passe</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password" className="text-sm">Confirmer le mot de passe</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                  <Button onClick={handlePasswordChange}>
                    Changer le mot de passe
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                    <Shield className="w-4 h-4 lg:w-5 lg:h-5" />
                    Paramètres de sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="two-factor" className="text-sm font-medium">Authentification à deux facteurs</Label>
                      <p className="text-xs lg:text-sm text-gray-500">Renforcez la sécurité de votre compte</p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="text-base lg:text-lg">Préférences de notification</CardTitle>
                <CardDescription className="text-sm">
                  Choisissez comment vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor="email-notif" className="text-sm font-medium">Notifications par email</Label>
                    <p className="text-xs lg:text-sm text-gray-500">Recevez des notifications par email</p>
                  </div>
                  <Switch
                    id="email-notif"
                    checked={securitySettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor="sms-notif" className="text-sm font-medium">Notifications SMS</Label>
                    <p className="text-xs lg:text-sm text-gray-500">Recevez des notifications par SMS</p>
                  </div>
                  <Switch
                    id="sms-notif"
                    checked={securitySettings.smsNotifications}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, smsNotifications: checked }))
                    }
                  />
                </div>

                <Button onClick={() => toast.success('Préférences sauvegardées')}>
                  Sauvegarder les préférences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg text-red-600">
                  <RotateCcw className="w-4 h-4 lg:w-5 lg:h-5" />
                  Réinitialisation du système
                </CardTitle>
                <CardDescription className="text-sm">
                  Supprime toutes vos données de manière permanente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-red-800 font-medium mb-2">⚠️ Attention - Action irréversible</h4>
                  <p className="text-red-700 text-sm">
                    Cette action supprimera définitivement toutes vos données : matériel, utilisateurs, 
                    attributions, maintenances et historique. Cette action ne peut pas être annulée.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="confirm-step1"
                      checked={resetConfirmation.step1}
                      onChange={(e) => setResetConfirmation(prev => ({ ...prev, step1: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="confirm-step1" className="text-sm">
                      Je comprends que cette action supprimera toutes mes données
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="confirm-step2"
                      checked={resetConfirmation.step2}
                      onChange={(e) => setResetConfirmation(prev => ({ ...prev, step2: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="confirm-step2" className="text-sm">
                      Je confirme vouloir réinitialiser complètement le système
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="confirm-text" className="text-sm">
                      Tapez "REINITIALISER" pour confirmer
                    </Label>
                    <Input
                      id="confirm-text"
                      value={resetConfirmation.confirmText}
                      onChange={(e) => setResetConfirmation(prev => ({ ...prev, confirmText: e.target.value }))}
                      placeholder="REINITIALISER"
                      className="mt-1"
                    />
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      disabled={!resetConfirmation.step1 || !resetConfirmation.step2 || resetConfirmation.confirmText !== 'REINITIALISER'}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Réinitialiser le système
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée. Cela supprimera définitivement toutes vos données 
                        et retirera toutes les informations de nos serveurs.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSystemReset} className="bg-red-600 hover:bg-red-700">
                        Oui, réinitialiser
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
