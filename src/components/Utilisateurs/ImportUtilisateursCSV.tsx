
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useUtilisateurs } from '@/hooks/useUtilisateurs';

interface ImportUtilisateursCSVProps {
  onSuccess?: () => void;
}

export const ImportUtilisateursCSV = ({ onSuccess }: ImportUtilisateursCSVProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { addUtilisateur } = useUtilisateurs();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      toast.error('Veuillez sélectionner un fichier CSV valide');
    }
  };

  const downloadTemplate = () => {
    const csvContent = [
      'prenom,nom,email,telephone,service,poste,statut',
      'Jean,Dupont,jean.dupont@entreprise.com,0123456789,IT,Administrateur système,Actif',
      'Marie,Martin,marie.martin@entreprise.com,0987654321,Marketing,Chargée de communication,Actif'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'modele_utilisateurs.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Modèle CSV téléchargé');
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      if (values.length === headers.length) {
        const item: any = {};
        headers.forEach((header, index) => {
          item[header] = values[index];
        });
        data.push(item);
      }
    }

    return data;
  };

  const normalizeStatut = (statut: string): 'Actif' | 'Inactif' | 'Suspendu' => {
    const statutLower = statut.toLowerCase().trim();
    
    // Mapping des valeurs possibles vers les valeurs autorisées
    if (statutLower === 'actif' || statutLower === 'active') {
      return 'Actif';
    } else if (statutLower === 'inactif' || statutLower === 'inactive') {
      return 'Inactif';
    } else if (statutLower === 'suspendu' || statutLower === 'suspended' || 
               statutLower === 'en congé' || statutLower === 'en conge') {
      return 'Suspendu';
    }
    
    // Valeur par défaut
    return 'Actif';
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    setIsImporting(true);
    try {
      const text = await selectedFile.text();
      const data = parseCSV(text);

      if (data.length === 0) {
        toast.error('Aucune donnée valide trouvée dans le fichier');
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (const item of data) {
        try {
          const utilisateurData = {
            prenom: item.prenom || '',
            nom: item.nom || '',
            email: item.email || '',
            telephone: item.telephone || '',
            service: item.service || '',
            poste: item.poste || '',
            statut: normalizeStatut(item.statut || 'Actif')
          };

          const result = await addUtilisateur(utilisateurData);
          if (result.data) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
          console.error('Erreur import ligne:', error);
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} utilisateur(s) importé(s) avec succès`);
        if (onSuccess) onSuccess();
      }
      if (errorCount > 0) {
        toast.warning(`${errorCount} ligne(s) n'ont pas pu être importées`);
      }

      setSelectedFile(null);
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast.error('Erreur lors de l\'import du fichier');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
        <AlertCircle className="w-4 h-4" />
        <p className="text-sm">
          Assurez-vous que votre fichier CSV respecte le format du modèle
        </p>
      </div>
      
      <Button 
        variant="outline" 
        onClick={downloadTemplate}
        className="w-full"
      >
        <Download className="w-4 h-4 mr-2" />
        Télécharger le modèle CSV
      </Button>

      <div>
        <Label htmlFor="file">Sélectionner un fichier CSV</Label>
        <Input
          id="file"
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="mt-1"
        />
        {selectedFile && (
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <FileText className="w-4 h-4 mr-2" />
            {selectedFile.name}
          </div>
        )}
      </div>

      <Button 
        onClick={handleImport} 
        disabled={!selectedFile || isImporting}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        {isImporting ? 'Import en cours...' : 'Importer les utilisateurs'}
      </Button>
    </div>
  );
};
