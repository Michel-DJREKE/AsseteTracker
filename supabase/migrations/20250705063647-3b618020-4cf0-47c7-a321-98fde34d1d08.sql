
-- Supprimer les politiques publiques actuelles et créer des politiques basées sur l'utilisateur connecté
-- Cela permettra à chaque utilisateur d'avoir ses propres données isolées

-- 1. Supprimer les anciennes politiques publiques
DROP POLICY IF EXISTS "Public access" ON public.utilisateurs;
DROP POLICY IF EXISTS "Public access" ON public.materiel;
DROP POLICY IF EXISTS "Public access" ON public.incidents;
DROP POLICY IF EXISTS "Public access" ON public.maintenance;
DROP POLICY IF EXISTS "Public access" ON public.attributions;

-- 2. Ajouter une colonne owner_id pour lier chaque enregistrement à son propriétaire
ALTER TABLE public.utilisateurs ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.materiel ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.incidents ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.maintenance ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.attributions ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.historique_activites ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Créer des politiques RLS basées sur l'utilisateur connecté
-- Utilisateurs
CREATE POLICY "Users can manage their own utilisateurs" ON public.utilisateurs
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Matériel
CREATE POLICY "Users can manage their own materiel" ON public.materiel
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Incidents
CREATE POLICY "Users can manage their own incidents" ON public.incidents
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Maintenance
CREATE POLICY "Users can manage their own maintenance" ON public.maintenance
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Attributions
CREATE POLICY "Users can manage their own attributions" ON public.attributions
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Historique des activités
ALTER TABLE public.historique_activites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own activity history" ON public.historique_activites
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 4. Fonction pour initialiser les données d'un nouvel utilisateur
CREATE OR REPLACE FUNCTION public.initialize_user_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Créer quelques données de test pour le nouvel utilisateur mais avec des valeurs à zéro/vides
  
  -- Insérer un utilisateur de base
  INSERT INTO public.utilisateurs (owner_id, nom, prenom, email, service, poste, statut)
  VALUES (NEW.id, 'Test', 'User', NEW.email, 'Service Test', 'Poste Test', 'Actif');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger pour initialiser les données lors de la création d'un profil
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_data();

-- 6. Mettre à jour la fonction d'ajout d'historique pour inclure owner_id
CREATE OR REPLACE FUNCTION public.ajouter_historique_activite(
  p_materiel_id uuid, 
  p_type_activite text, 
  p_titre text, 
  p_utilisateur_id uuid DEFAULT NULL::uuid, 
  p_description text DEFAULT NULL::text, 
  p_details jsonb DEFAULT NULL::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
AS $function$
DECLARE
  historique_id UUID;
BEGIN
  INSERT INTO public.historique_activites (
    materiel_id, utilisateur_id, type_activite, titre, description, details, owner_id
  ) VALUES (
    p_materiel_id, p_utilisateur_id, p_type_activite, p_titre, p_description, p_details, auth.uid()
  ) RETURNING id INTO historique_id;
  
  RETURN historique_id;
END;
$function$;
