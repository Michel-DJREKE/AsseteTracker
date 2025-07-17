
import { useState, useMemo } from 'react';
import { useMateriel } from './useMateriel';
import { useUtilisateurs } from './useUtilisateurs';
import { useAttributions } from './useAttributions';
import { useMaintenance } from './useMaintenance';

export interface SearchResult {
  id: string;
  type: 'materiel' | 'utilisateur' | 'attribution' | 'maintenance';
  title: string;
  description: string;
  data: any;
}

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  
  const { materiel } = useMateriel();
  const { utilisateurs } = useUtilisateurs();
  const { attributions } = useAttributions();
  const { maintenance } = useMaintenance();

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();
    const results: SearchResult[] = [];

    // Recherche dans le matériel
    if (searchType === 'all' || searchType === 'materiel') {
      const materielResults = materiel.filter(item =>
        item.nom.toLowerCase().includes(term) ||
        item.modele.toLowerCase().includes(term) ||
        item.numero_serie.toLowerCase().includes(term) ||
        item.fournisseur?.toLowerCase().includes(term) ||
        item.statut.toLowerCase().includes(term)
      ).map(item => ({
        id: `materiel-${item.id}`,
        type: 'materiel' as const,
        title: `${item.nom} - ${item.modele}`,
        description: `N° Série: ${item.numero_serie} - Statut: ${item.statut}`,
        data: item
      }));
      results.push(...materielResults);
    }

    // Recherche dans les utilisateurs
    if (searchType === 'all' || searchType === 'utilisateurs') {
      const utilisateursResults = utilisateurs.filter(user =>
        user.nom.toLowerCase().includes(term) ||
        user.prenom.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.service.toLowerCase().includes(term) ||
        user.poste.toLowerCase().includes(term)
      ).map(user => ({
        id: `utilisateur-${user.id}`,
        type: 'utilisateur' as const,
        title: `${user.prenom} ${user.nom}`,
        description: `${user.email} - ${user.service}`,
        data: user
      }));
      results.push(...utilisateursResults);
    }

    // Recherche dans les attributions
    if (searchType === 'all' || searchType === 'attributions') {
      const attributionsResults = attributions
        .filter(attr => {
          const materielItem = materiel.find(m => m.id === attr.materiel_id);
          const utilisateurItem = utilisateurs.find(u => u.id === attr.utilisateur_id);
          return (
            materielItem?.nom.toLowerCase().includes(term) ||
            materielItem?.numero_serie.toLowerCase().includes(term) ||
            utilisateurItem?.nom.toLowerCase().includes(term) ||
            utilisateurItem?.prenom.toLowerCase().includes(term) ||
            attr.statut.toLowerCase().includes(term)
          );
        })
        .map(attr => {
          const materielItem = materiel.find(m => m.id === attr.materiel_id);
          const utilisateurItem = utilisateurs.find(u => u.id === attr.utilisateur_id);
          return {
            id: `attribution-${attr.id}`,
            type: 'attribution' as const,
            title: `Attribution: ${materielItem?.nom || 'Matériel inconnu'}`,
            description: `Utilisateur: ${utilisateurItem?.prenom} ${utilisateurItem?.nom} - Statut: ${attr.statut}`,
            data: { ...attr, materiel: materielItem, utilisateur: utilisateurItem }
          };
        });
      results.push(...attributionsResults);
    }

    // Recherche dans les maintenances
    if (searchType === 'all' || searchType === 'maintenance') {
      const maintenanceResults = maintenance
        .filter(maint => {
          const materielItem = materiel.find(m => m.id === maint.materiel_id);
          return (
            maint.type_maintenance.toLowerCase().includes(term) ||
            maint.probleme.toLowerCase().includes(term) ||
            maint.technicien.toLowerCase().includes(term) ||
            maint.statut.toLowerCase().includes(term) ||
            materielItem?.nom.toLowerCase().includes(term)
          );
        })
        .map(maint => {
          const materielItem = materiel.find(m => m.id === maint.materiel_id);
          return {
            id: `maintenance-${maint.id}`,
            type: 'maintenance' as const,
            title: `Maintenance: ${maint.type_maintenance}`,
            description: `Matériel: ${materielItem?.nom || 'Inconnu'} - Statut: ${maint.statut}`,
            data: { ...maint, materiel: materielItem }
          };
        });
      results.push(...maintenanceResults);
    }

    return results;
  }, [searchTerm, searchType, materiel, utilisateurs, attributions, maintenance]);

  return {
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    searchResults
  };
};
