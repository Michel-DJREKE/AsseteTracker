
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Download, Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AddMaterielModal } from '@/components/Materiel/AddMaterielModal';
import { EditMaterielModal } from '@/components/Materiel/EditMaterielModal';
import { DeleteMaterielModal } from '@/components/Materiel/DeleteMaterielModal';
import { ImportMaterielModal } from '@/components/Materiel/ImportMaterielModal';
import { useMateriel } from '@/hooks/useMateriel';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Materiel = Tables<'materiel'>;

export const Materiel = () => {
  const { materiel, loading } = useMateriel();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMateriel, setSelectedMateriel] = useState<Materiel | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const filteredData = materiel.filter(item =>
    item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.numero_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.fournisseur && item.fournisseur.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (item: Materiel) => {
    setSelectedMateriel(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item: Materiel) => {
    setSelectedMateriel(item);
    setIsDeleteModalOpen(true);
  };

  const handleExport = () => {
    try {
      const csvContent = [
        ['Nom', 'Modèle', 'N° Série', 'Statut', 'Fournisseur', 'Date d\'achat', 'Prix', 'Description'].join(','),
        ...filteredData.map(item => [
          item.nom,
          item.modele,
          item.numero_serie,
          item.statut,
          item.fournisseur || '',
          new Date(item.date_achat).toLocaleDateString('fr-FR'),
          item.prix_achat ? item.prix_achat.toString() : '',
          item.description || ''
        ].map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `materiel_${new Date().toISOString().split('T')[0]}.csv`);
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

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'Attribué':
        return 'bg-blue-100 text-blue-800';
      case 'En maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hors service':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Gestion du Matériel</h1>
          <p className="text-sm lg:text-base text-gray-600">Gérez votre inventaire de matériel informatique</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle className="text-base lg:text-lg">Liste du matériel ({filteredData.length})</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher du matériel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setIsImportModalOpen(true)} variant="outline" size="sm" className="flex-1 sm:flex-initial">
                    <Upload className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Importer</span>
                  </Button>
                  <Button onClick={handleExport} variant="outline" size="sm" className="flex-1 sm:flex-initial">
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Exporter</span>
                  </Button>
                  <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="flex-1 sm:flex-initial">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Ajouter</span>
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
                    <TableHead className="min-w-[120px]">Nom</TableHead>
                    <TableHead className="min-w-[120px]">Modèle</TableHead>
                    <TableHead className="hidden md:table-cell min-w-[140px]">N° Série</TableHead>
                    <TableHead className="min-w-[100px]">Statut</TableHead>
                    <TableHead className="hidden lg:table-cell">Fournisseur</TableHead>
                    <TableHead className="hidden lg:table-cell">Date d'achat</TableHead>
                    <TableHead className="hidden xl:table-cell">Prix</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nom}</TableCell>
                      <TableCell>{item.modele}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.numero_serie}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.statut)}`}>
                          {item.statut}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{item.fournisseur || '-'}</TableCell>
                      <TableCell className="hidden lg:table-cell">{new Date(item.date_achat).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell className="hidden xl:table-cell">{item.prix_achat ? `${item.prix_achat}€` : '-'}</TableCell>
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
                        {searchTerm ? 'Aucun matériel trouvé pour cette recherche' : 'Aucun matériel enregistré'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <AddMaterielModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
        <EditMaterielModal 
          open={isEditModalOpen} 
          onOpenChange={setIsEditModalOpen}
          materiel={selectedMateriel}
        />
        <DeleteMaterielModal 
          open={isDeleteModalOpen} 
          onOpenChange={setIsDeleteModalOpen}
          materiel={selectedMateriel}
        />
        <ImportMaterielModal open={isImportModalOpen} onOpenChange={setIsImportModalOpen} />
      </div>
    </div>
  );
};
