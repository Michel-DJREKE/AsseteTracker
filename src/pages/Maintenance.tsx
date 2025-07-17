
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Wrench, AlertTriangle, CheckCircle, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AddMaintenanceModal } from '@/components/Maintenance/AddMaintenanceModal';
import { EditMaintenanceModal } from '@/components/Maintenance/EditMaintenanceModal';
import { DeleteMaintenanceModal } from '@/components/Maintenance/DeleteMaintenanceModal';
import { useMaintenance } from '@/hooks/useMaintenance';
import { toast } from 'sonner';

export const Maintenance = () => {
  const { maintenance, loading } = useMaintenance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredData = maintenance.filter(item =>
    (item.materiel?.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.materiel?.numero_serie || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.probleme.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.technicien.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type_maintenance.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (maintenanceItem: any) => {
    setSelectedMaintenance(maintenanceItem);
    setIsEditModalOpen(true);
  };

  const handleDelete = (maintenanceItem: any) => {
    setSelectedMaintenance(maintenanceItem);
    setIsDeleteModalOpen(true);
  };

  const handleExport = () => {
    try {
      const csvContent = [
        ['Matériel', 'N° Série', 'Type', 'Problème', 'Statut', 'Date début', 'Date fin', 'Technicien', 'Coût'].join(','),
        ...filteredData.map(item => [
          item.materiel?.nom || '-',
          item.materiel?.numero_serie || '-',
          item.type_maintenance,
          item.probleme,
          item.statut,
          new Date(item.date_debut).toLocaleDateString('fr-FR'),
          item.date_fin ? new Date(item.date_fin).toLocaleDateString('fr-FR') : '-',
          item.technicien,
          item.cout ? item.cout.toString() : '-'
        ].map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `maintenance_${new Date().toISOString().split('T')[0]}.csv`);
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

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'En cours':
        return <Wrench className="w-3 h-3 mr-1" />;
      case 'Planifié':
        return <AlertTriangle className="w-3 h-3 mr-1" />;
      case 'Terminé':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (statut: string) => {
    switch (statut) {
      case 'En cours':
        return 'default';
      case 'Planifié':
        return 'secondary';
      case 'Terminé':
        return 'outline';
      default:
        return 'secondary';
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Gestion de la Maintenance</h1>
          <p className="text-sm lg:text-base text-gray-600">Suivez les opérations de maintenance du matériel</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle className="text-base lg:text-lg">Opérations de maintenance ({filteredData.length})</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher une maintenance..."
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
                    <span className="hidden sm:inline">Nouvelle maintenance</span>
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
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="min-w-[150px]">Problème</TableHead>
                    <TableHead className="min-w-[100px]">Statut</TableHead>
                    <TableHead className="hidden lg:table-cell">Date début</TableHead>
                    <TableHead className="hidden lg:table-cell">Date fin</TableHead>
                    <TableHead className="hidden xl:table-cell">Technicien</TableHead>
                    <TableHead className="hidden xl:table-cell">Coût</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {typeof item.materiel === 'object' && item.materiel ? item.materiel.nom : '-'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {typeof item.materiel === 'object' && item.materiel ? item.materiel.numero_serie : '-'}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{item.type_maintenance}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={item.probleme}>
                          {item.probleme}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(item.statut)} className="text-xs">
                          {getStatusIcon(item.statut)}
                          {item.statut}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(item.date_debut).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {item.date_fin ? new Date(item.date_fin).toLocaleDateString('fr-FR') : '-'}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">{item.technicien}</TableCell>
                      <TableCell className="hidden xl:table-cell">{item.cout ? `${item.cout}€` : '-'}</TableCell>
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
                      <TableCell colSpan={10} className="text-center text-gray-500 py-8">
                        {searchTerm ? 'Aucune maintenance trouvée pour cette recherche' : 'Aucune maintenance enregistrée'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <AddMaintenanceModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
        <EditMaintenanceModal 
          open={isEditModalOpen} 
          onOpenChange={setIsEditModalOpen}
          maintenance={selectedMaintenance}
        />
        <DeleteMaintenanceModal 
          open={isDeleteModalOpen} 
          onOpenChange={setIsDeleteModalOpen}
          maintenance={selectedMaintenance}
        />
      </div>
    </div>
  );
};
