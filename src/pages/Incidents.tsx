
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useIncidents } from '@/hooks/useIncidents';
import { AddIncidentModal } from '@/components/Incidents/AddIncidentModal';
import { EditIncidentModal } from '@/components/Incidents/EditIncidentModal';
import { DeleteIncidentModal } from '@/components/Incidents/DeleteIncidentModal';
import { Skeleton } from '@/components/ui/skeleton';

export const Incidents = () => {
  const { incidents, loading } = useIncidents();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editIncident, setEditIncident] = useState<any>(null);
  const [deleteIncident, setDeleteIncident] = useState<any>(null);

  const getStatusBadge = (statut: string) => {
    const statusConfig = {
      'Ouvert': { variant: 'destructive' as const, icon: AlertTriangle },
      'En cours': { variant: 'default' as const, icon: Clock },
      'Résolu': { variant: 'secondary' as const, icon: CheckCircle },
      'Fermé': { variant: 'outline' as const, icon: XCircle }
    };

    const config = statusConfig[statut as keyof typeof statusConfig] || statusConfig['Ouvert'];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statut}
      </Badge>
    );
  };

  const getPriorityBadge = (priorite: string) => {
    const priorityColors = {
      'Critique': 'bg-red-100 text-red-800 border-red-200',
      'Haute': 'bg-orange-100 text-orange-800 border-orange-200',
      'Élevée': 'bg-orange-100 text-orange-800 border-orange-200',
      'Moyenne': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Basse': 'bg-green-100 text-green-800 border-green-200',
      'Faible': 'bg-green-100 text-green-800 border-green-200'
    };

    const colorClass = priorityColors[priorite as keyof typeof priorityColors] || priorityColors['Moyenne'];

    return (
      <Badge className={colorClass}>
        {priorite}
      </Badge>
    );
  };

  const filteredIncidents = incidents.filter(incident =>
    incident.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.materiel?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.utilisateur?.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Incidents</h1>
            <p className="text-sm lg:text-base text-gray-600 mt-1">
              Gestion des incidents et problèmes techniques
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau incident
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par titre, description, matériel ou utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredIncidents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun incident trouvé</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm 
                    ? 'Aucun incident ne correspond à votre recherche.' 
                    : 'Commencez par ajouter un incident.'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un incident
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredIncidents.map((incident) => (
              <Card key={incident.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{incident.titre}</CardTitle>
                      <p className="text-sm text-gray-600 mb-3">{incident.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {getStatusBadge(incident.statut)}
                        {getPriorityBadge(incident.priorite)}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditIncident(incident)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteIncident(incident)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Matériel :</span>
                      <p className="text-gray-600 mt-1">
                        {incident.materiel ? 
                          `${incident.materiel.nom} - ${incident.materiel.numero_serie}` : 
                          'Non défini'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Utilisateur :</span>
                      <p className="text-gray-600 mt-1">
                        {incident.utilisateur ? 
                          `${incident.utilisateur.prenom} ${incident.utilisateur.nom}` : 
                          'Non défini'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Date de création :</span>
                      <p className="text-gray-600 mt-1">{formatDate(incident.date_creation)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Date de résolution :</span>
                      <p className="text-gray-600 mt-1">{formatDate(incident.date_resolution)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <AddIncidentModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
        />
        
        {editIncident && (
          <EditIncidentModal 
            incident={editIncident}
            isOpen={!!editIncident} 
            onClose={() => setEditIncident(null)} 
          />
        )}
        
        {deleteIncident && (
          <DeleteIncidentModal 
            incident={deleteIncident}
            isOpen={!!deleteIncident} 
            onClose={() => setDeleteIncident(null)} 
          />
        )}
      </div>
    </div>
  );
};
