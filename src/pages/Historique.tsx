
import React, { useState, useEffect } from 'react';
import { History, Search, Download, Filter, Calendar, User, Package, Wrench, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHistoriqueActivites } from '@/hooks/useHistoriqueActivites';
import { toast } from 'sonner';

export const Historique = () => {
  const { historique, loading } = useHistoriqueActivites();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredData = historique.filter(item => {
    const matchesSearch = 
      item.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type_activite.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || item.type_activite === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleExport = () => {
    try {
      const csvContent = [
        ['Date', 'Type', 'Titre', 'Description', 'Matériel', 'Utilisateur'].join(','),
        ...filteredData.map(item => [
          new Date(item.date_activite).toLocaleDateString('fr-FR'),
          item.type_activite,
          item.titre,
          item.description || '',
          item.materiel ? `${item.materiel.nom} (${item.materiel.numero_serie})` : '',
          item.utilisateur ? `${item.utilisateur.prenom} ${item.utilisateur.nom}` : ''
        ].map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `historique_${new Date().toISOString().split('T')[0]}.csv`);
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'acquisition':
      case 'ajout':
        return <Package className="w-4 h-4 text-green-600" />;
      case 'modification':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'suppression':
        return <Package className="w-4 h-4 text-red-600" />;
      case 'attribution':
        return <UserCheck className="w-4 h-4 text-purple-600" />;
      case 'retour':
        return <UserCheck className="w-4 h-4 text-orange-600" />;
      case 'maintenance_debut':
      case 'maintenance_fin':
        return <Wrench className="w-4 h-4 text-yellow-600" />;
      default:
        return <History className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'acquisition':
      case 'ajout':
        return { variant: 'default', color: 'bg-green-100 text-green-800', label: 'Ajout' };
      case 'modification':
        return { variant: 'default', color: 'bg-blue-100 text-blue-800', label: 'Modification' };
      case 'suppression':
        return { variant: 'destructive', color: 'bg-red-100 text-red-800', label: 'Suppression' };
      case 'attribution':
        return { variant: 'default', color: 'bg-purple-100 text-purple-800', label: 'Attribution' };
      case 'retour':
        return { variant: 'secondary', color: 'bg-orange-100 text-orange-800', label: 'Retour' };
      case 'maintenance_debut':
        return { variant: 'default', color: 'bg-yellow-100 text-yellow-800', label: 'Début maintenance' };
      case 'maintenance_fin':
        return { variant: 'outline', color: 'bg-yellow-50 text-yellow-700', label: 'Fin maintenance' };
      default:
        return { variant: 'secondary', color: 'bg-gray-100 text-gray-800', label: 'Autre' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Il y a quelques minutes';
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Chargement de l'historique...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Historique des Activités</h1>
          <p className="text-sm lg:text-base text-gray-600">
            Consultez l'historique complet de toutes les actions du système
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                <History className="w-4 h-4 lg:w-5 lg:h-5" />
                Activités récentes ({filteredData.length})
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher dans l'historique..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filtrer par type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les activités</SelectItem>
                    <SelectItem value="acquisition">Acquisitions</SelectItem>
                    <SelectItem value="modification">Modifications</SelectItem>
                    <SelectItem value="suppression">Suppressions</SelectItem>
                    <SelectItem value="attribution">Attributions</SelectItem>
                    <SelectItem value="retour">Retours</SelectItem>
                    <SelectItem value="maintenance_debut">Maintenances</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleExport} variant="outline" size="sm" className="flex-1 sm:flex-initial">
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Exporter</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Type</TableHead>
                    <TableHead className="min-w-[200px]">Activité</TableHead>
                    <TableHead className="hidden md:table-cell min-w-[300px]">Description</TableHead>
                    <TableHead className="hidden lg:table-cell min-w-[150px]">Matériel</TableHead>
                    <TableHead className="hidden lg:table-cell min-w-[150px]">Utilisateur</TableHead>
                    <TableHead className="min-w-[120px]">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => {
                    const badgeInfo = getActivityBadge(item.type_activite);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {getActivityIcon(item.type_activite)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-sm lg:text-base">{item.titre}</div>
                            <Badge className={`${badgeInfo.color} text-xs`}>
                              {badgeInfo.label}
                            </Badge>
                            <div className="md:hidden text-xs text-gray-500 line-clamp-2">
                              {item.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm text-gray-700 line-clamp-2">
                            {item.description || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {item.materiel ? (
                            <div className="space-y-1">
                              <div className="font-medium text-sm">{item.materiel.nom}</div>
                              <div className="text-xs text-gray-500">{item.materiel.numero_serie}</div>
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {item.utilisateur ? (
                            <div className="space-y-1">
                              <div className="font-medium text-sm">
                                {item.utilisateur.prenom} {item.utilisateur.nom}
                              </div>
                              <div className="text-xs text-gray-500">{item.utilisateur.email}</div>
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{formatDate(item.date_activite)}</div>
                            <div className="text-xs text-gray-500 lg:hidden">
                              {item.materiel?.nom && `${item.materiel.nom}`}
                              {item.utilisateur && ` - ${item.utilisateur.prenom} ${item.utilisateur.nom}`}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                        {searchTerm || filterType !== 'all' 
                          ? 'Aucune activité trouvée pour ces critères' 
                          : 'Aucune activité enregistrée'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
