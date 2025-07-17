
import React from 'react';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearch } from '@/hooks/useSearch';
import { toast } from 'sonner';

export const Recherche = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    searchType, 
    setSearchType, 
    searchResults 
  } = useSearch();

  const performSearch = () => {
    if (!searchTerm.trim()) {
      toast.error('Veuillez saisir un terme de recherche');
      return;
    }
    console.log('Recherche:', { searchTerm, searchType });
    toast.success(`${searchResults.length} résultat(s) trouvé(s)`);
  };

  const exportResults = () => {
    console.log('Export des résultats');
    toast.success('Export en cours...');
  };

  const getResultsByType = (type: string) => {
    if (type === 'all') return searchResults;
    return searchResults.filter(result => result.type === type);
  };

  const renderResult = (result: any) => (
    <div key={result.id} className="p-3 lg:p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="font-medium text-sm lg:text-base truncate">{result.title}</h3>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {result.type === 'materiel' ? 'Matériel' :
               result.type === 'utilisateur' ? 'Utilisateur' :
               result.type === 'attribution' ? 'Attribution' : 'Maintenance'}
            </Badge>
          </div>
          <p className="text-xs lg:text-sm text-gray-600 line-clamp-2">{result.description}</p>
        </div>
        <Button size="sm" variant="outline" className="flex-shrink-0 self-start sm:self-center">
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Recherche Globale</h1>
          <p className="text-sm lg:text-base text-gray-600">Recherchez dans toutes les données de l'application</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-base lg:text-lg">
              <Search className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Rechercher du matériel, utilisateurs, attributions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                    onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                  />
                </div>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Type de recherche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tout</SelectItem>
                    <SelectItem value="materiel">Matériel</SelectItem>
                    <SelectItem value="utilisateurs">Utilisateurs</SelectItem>
                    <SelectItem value="attributions">Attributions</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={performSearch} className="w-full sm:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <CardTitle className="text-base lg:text-lg">
                Résultats de recherche ({searchResults.length})
              </CardTitle>
              <Button variant="outline" onClick={exportResults} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid grid-cols-2 lg:grid-cols-5 mb-6 w-full">
                <TabsTrigger value="all" className="text-xs lg:text-sm">
                  Tous ({searchResults.length})
                </TabsTrigger>
                <TabsTrigger value="materiel" className="text-xs lg:text-sm">
                  Matériel ({getResultsByType('materiel').length})
                </TabsTrigger>
                <TabsTrigger value="utilisateur" className="text-xs lg:text-sm">
                  Utilisateurs ({getResultsByType('utilisateur').length})
                </TabsTrigger>
                <TabsTrigger value="attribution" className="text-xs lg:text-sm">
                  Attributions ({getResultsByType('attribution').length})
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="text-xs lg:text-sm">
                  Maintenance ({getResultsByType('maintenance').length})
                </TabsTrigger>
              </TabsList>

              {['all', 'materiel', 'utilisateur', 'attribution', 'maintenance'].map(tabValue => (
                <TabsContent key={tabValue} value={tabValue}>
                  <div className="space-y-3 lg:space-y-4">
                    {getResultsByType(tabValue).length === 0 ? (
                      <div className="text-center py-6 lg:py-8 text-gray-500">
                        <p className="text-sm lg:text-base">Aucun résultat trouvé</p>
                        {searchTerm && (
                          <p className="text-xs lg:text-sm mt-2">Essayez avec d'autres mots-clés</p>
                        )}
                      </div>
                    ) : (
                      getResultsByType(tabValue).map(renderResult)
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
