
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Mail, Phone, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AddUtilisateurModal } from '@/components/Utilisateurs/AddUtilisateurModal';
import { EditUtilisateurModal } from '@/components/Utilisateurs/EditUtilisateurModal';
import { DeleteUtilisateurModal } from '@/components/Utilisateurs/DeleteUtilisateurModal';
import { useUtilisateurs } from '@/hooks/useUtilisateurs';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Utilisateur = Tables<'utilisateurs'>;

export const Utilisateurs = () => {
  const { utilisateurs, loading } = useUtilisateurs();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUtilisateur, setSelectedUtilisateur] = useState<Utilisateur | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredData = utilisateurs.filter(item =>
    item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.poste.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (utilisateur: Utilisateur) => {
    setSelectedUtilisateur(utilisateur);
    setIsEditModalOpen(true);
  };

  const handleDelete = (utilisateur: Utilisateur) => {
    setSelectedUtilisateur(utilisateur);
    setIsDeleteModalOpen(true);
  };

  const handleExport = () => {
    try {
      const csvContent = [
        ['Nom', 'Prénom', 'Email', 'Téléphone', 'Service', 'Poste', 'Statut'].join(','),
        ...filteredData.map(item => [
          item.nom,
          item.prenom,
          item.email,
          item.telephone || '',
          item.service,
          item.poste,
          item.statut
        ].map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Export réalisé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  const getInitials = (nom: string, prenom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Chargement...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Gestion des Utilisateurs</h1>
          <p className="text-sm lg:text-base text-gray-600">Gérez les utilisateurs et leurs accès au matériel</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle>Liste des utilisateurs ({filteredData.length})</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleExport} variant="outline" className="flex-1 sm:flex-initial">
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Exporter</span>
                  </Button>
                  <Button onClick={() => setIsAddModalOpen(true)} className="flex-1 sm:flex-initial">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Nouvel utilisateur</span>
                    <span className="sm:hidden">Nouveau</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Utilisateur</TableHead>
                    <TableHead className="hidden md:table-cell min-w-[200px]">Email</TableHead>
                    <TableHead className="hidden lg:table-cell">Téléphone</TableHead>
                    <TableHead className="hidden sm:table-cell">Service</TableHead>
                    <TableHead className="hidden sm:table-cell">Poste</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src="" alt={`${item.prenom} ${item.nom}`} />
                            <AvatarFallback>{getInitials(item.nom, item.prenom)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{item.prenom} {item.nom}</div>
                            <div className="md:hidden text-sm text-gray-500 truncate">{item.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{item.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {item.telephone ? (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{item.telephone}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="truncate">{item.service}</span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="truncate">{item.poste}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.statut === 'Actif' ? 'default' : 'secondary'}>
                          {item.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(item)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                        {searchTerm ? 'Aucun utilisateur trouvé pour cette recherche' : 'Aucun utilisateur enregistré'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <AddUtilisateurModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
        <EditUtilisateurModal 
          open={isEditModalOpen} 
          onOpenChange={setIsEditModalOpen}
          utilisateur={selectedUtilisateur}
        />
        <DeleteUtilisateurModal 
          open={isDeleteModalOpen} 
          onOpenChange={setIsDeleteModalOpen}
          utilisateur={selectedUtilisateur}
        />
      </div>
    </div>
  );
};
