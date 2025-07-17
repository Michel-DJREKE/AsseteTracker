
import React, { useState } from 'react';
import { Plus, Edit, Trash2, UserCheck, UserX, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AddAttributionModal } from '@/components/Attributions/AddAttributionModal';
import { EditAttributionModal } from '@/components/Attributions/EditAttributionModal';
import { DeleteAttributionModal } from '@/components/Attributions/DeleteAttributionModal';
import { useAttributions } from '@/hooks/useAttributions';
import { toast } from 'sonner';

export const Attributions = () => {
  const { attributions, loading } = useAttributions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttribution, setSelectedAttribution] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredData = attributions.filter(item =>
    item.materiel?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.materiel?.numero_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.utilisateur?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.utilisateur?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.utilisateur?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (attribution: any) => {
    setSelectedAttribution(attribution);
    setIsEditModalOpen(true);
  };

  const handleDelete = (attribution: any) => {
    setSelectedAttribution(attribution);
    setIsDeleteModalOpen(true);
  };

  const handleExport = () => {
    try {
      const csvContent = [
        ['Matériel', 'N° Série', 'Utilisateur', 'Email', 'Date attribution', 'Date retour', 'Statut'].join(','),
        ...filteredData.map(item => [
          item.materiel?.nom || '-',
          item.materiel?.numero_serie || '-',
          item.utilisateur ? `${item.utilisateur.prenom} ${item.utilisateur.nom}` : '-',
          item.utilisateur?.email || '-',
          new Date(item.date_attribution).toLocaleDateString('fr-FR'),
          item.date_retour ? new Date(item.date_retour).toLocaleDateString('fr-FR') : '-',
          item.statut
        ].map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `attributions_${new Date().toISOString().split('T')[0]}.csv`);
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Gestion des Attributions</h1>
          <p className="text-sm lg:text-base text-gray-600">Gérez l'attribution du matériel aux utilisateurs</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle className="text-base lg:text-lg">Liste des attributions ({filteredData.length})</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher une attribution..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleExport} variant="outline" size="sm" className="flex-1 sm:flex-initial">
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Exporter</span>
                  </Button>
                  <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="flex-1 sm:flex-initial">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Nouvelle attribution</span>
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
                    <TableHead className="min-w-[120px]">Matériel</TableHead>
                    <TableHead className="hidden md:table-cell min-w-[120px]">N° Série</TableHead>
                    <TableHead className="min-w-[150px]">Utilisateur</TableHead>
                    <TableHead className="hidden lg:table-cell min-w-[200px]">Email</TableHead>
                    <TableHead className="hidden sm:table-cell">Date attribution</TableHead>
                    <TableHead className="hidden lg:table-cell">Date retour</TableHead>
                    <TableHead className="min-w-[80px]">Statut</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.materiel?.nom || '-'}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.materiel?.numero_serie || '-'}</TableCell>
                      <TableCell>
                        <div className="min-w-0">
                          <div className="font-medium truncate">
                            {item.utilisateur ? `${item.utilisateur.prenom} ${item.utilisateur.nom}` : '-'}
                          </div>
                          <div className="lg:hidden text-sm text-gray-500 truncate">
                            {item.utilisateur?.email || ''}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{item.utilisateur?.email || '-'}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(item.date_attribution).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {item.date_retour ? new Date(item.date_retour).toLocaleDateString('fr-FR') : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.statut === 'Actif' ? 'default' : 'secondary'} className="text-xs">
                          {item.statut === 'Actif' ? (
                            <>
                              <UserCheck className="w-3 h-3 mr-1" />
                              Actif
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3 mr-1" />
                              {item.statut}
                            </>
                          )}
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
                      <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                        {searchTerm ? 'Aucune attribution trouvée pour cette recherche' : 'Aucune attribution enregistrée'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <AddAttributionModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
        <EditAttributionModal 
          open={isEditModalOpen} 
          onOpenChange={setIsEditModalOpen}
          attribution={selectedAttribution}
        />
        <DeleteAttributionModal 
          open={isDeleteModalOpen} 
          onOpenChange={setIsDeleteModalOpen}
          attribution={selectedAttribution}
        />
      </div>
    </div>
  );
};
