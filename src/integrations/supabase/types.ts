export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attributions: {
        Row: {
          created_at: string | null
          date_attribution: string
          date_retour: string | null
          id: string
          materiel_id: string | null
          notes: string | null
          owner_id: string | null
          statut: Database["public"]["Enums"]["statut_attribution"]
          updated_at: string | null
          utilisateur_id: string | null
        }
        Insert: {
          created_at?: string | null
          date_attribution?: string
          date_retour?: string | null
          id?: string
          materiel_id?: string | null
          notes?: string | null
          owner_id?: string | null
          statut?: Database["public"]["Enums"]["statut_attribution"]
          updated_at?: string | null
          utilisateur_id?: string | null
        }
        Update: {
          created_at?: string | null
          date_attribution?: string
          date_retour?: string | null
          id?: string
          materiel_id?: string | null
          notes?: string | null
          owner_id?: string | null
          statut?: Database["public"]["Enums"]["statut_attribution"]
          updated_at?: string | null
          utilisateur_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attributions_materiel_id_fkey"
            columns: ["materiel_id"]
            isOneToOne: false
            referencedRelation: "materiel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attributions_utilisateur_id_fkey"
            columns: ["utilisateur_id"]
            isOneToOne: false
            referencedRelation: "utilisateurs"
            referencedColumns: ["id"]
          },
        ]
      }
      historique_activites: {
        Row: {
          created_at: string
          date_activite: string
          description: string | null
          details: Json | null
          id: string
          materiel_id: string | null
          owner_id: string | null
          titre: string
          type_activite: string
          updated_at: string
          utilisateur_id: string | null
        }
        Insert: {
          created_at?: string
          date_activite?: string
          description?: string | null
          details?: Json | null
          id?: string
          materiel_id?: string | null
          owner_id?: string | null
          titre: string
          type_activite: string
          updated_at?: string
          utilisateur_id?: string | null
        }
        Update: {
          created_at?: string
          date_activite?: string
          description?: string | null
          details?: Json | null
          id?: string
          materiel_id?: string | null
          owner_id?: string | null
          titre?: string
          type_activite?: string
          updated_at?: string
          utilisateur_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historique_activites_materiel_id_fkey"
            columns: ["materiel_id"]
            isOneToOne: false
            referencedRelation: "materiel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historique_activites_utilisateur_id_fkey"
            columns: ["utilisateur_id"]
            isOneToOne: false
            referencedRelation: "utilisateurs"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          created_at: string | null
          date_creation: string | null
          date_resolution: string | null
          description: string
          id: string
          materiel_id: string | null
          owner_id: string | null
          priorite: Database["public"]["Enums"]["priorite_incident"]
          statut: Database["public"]["Enums"]["statut_incident"]
          titre: string
          updated_at: string | null
          utilisateur_id: string | null
        }
        Insert: {
          created_at?: string | null
          date_creation?: string | null
          date_resolution?: string | null
          description: string
          id?: string
          materiel_id?: string | null
          owner_id?: string | null
          priorite?: Database["public"]["Enums"]["priorite_incident"]
          statut?: Database["public"]["Enums"]["statut_incident"]
          titre: string
          updated_at?: string | null
          utilisateur_id?: string | null
        }
        Update: {
          created_at?: string | null
          date_creation?: string | null
          date_resolution?: string | null
          description?: string
          id?: string
          materiel_id?: string | null
          owner_id?: string | null
          priorite?: Database["public"]["Enums"]["priorite_incident"]
          statut?: Database["public"]["Enums"]["statut_incident"]
          titre?: string
          updated_at?: string | null
          utilisateur_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_materiel_id_fkey"
            columns: ["materiel_id"]
            isOneToOne: false
            referencedRelation: "materiel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_utilisateur_id_fkey"
            columns: ["utilisateur_id"]
            isOneToOne: false
            referencedRelation: "utilisateurs"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance: {
        Row: {
          cout: number | null
          created_at: string | null
          date_debut: string
          date_fin: string | null
          id: string
          materiel_id: string | null
          notes: string | null
          owner_id: string | null
          probleme: string
          statut: Database["public"]["Enums"]["statut_maintenance"]
          technicien: string
          type_maintenance: string
          updated_at: string | null
        }
        Insert: {
          cout?: number | null
          created_at?: string | null
          date_debut: string
          date_fin?: string | null
          id?: string
          materiel_id?: string | null
          notes?: string | null
          owner_id?: string | null
          probleme: string
          statut?: Database["public"]["Enums"]["statut_maintenance"]
          technicien: string
          type_maintenance: string
          updated_at?: string | null
        }
        Update: {
          cout?: number | null
          created_at?: string | null
          date_debut?: string
          date_fin?: string | null
          id?: string
          materiel_id?: string | null
          notes?: string | null
          owner_id?: string | null
          probleme?: string
          statut?: Database["public"]["Enums"]["statut_maintenance"]
          technicien?: string
          type_maintenance?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_materiel_id_fkey"
            columns: ["materiel_id"]
            isOneToOne: false
            referencedRelation: "materiel"
            referencedColumns: ["id"]
          },
        ]
      }
      materiel: {
        Row: {
          created_at: string | null
          date_achat: string
          description: string | null
          fournisseur: string | null
          garantie_fin: string | null
          id: string
          modele: string
          nom: string
          numero_serie: string
          owner_id: string | null
          prix_achat: number | null
          statut: Database["public"]["Enums"]["statut_materiel"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_achat: string
          description?: string | null
          fournisseur?: string | null
          garantie_fin?: string | null
          id?: string
          modele: string
          nom: string
          numero_serie: string
          owner_id?: string | null
          prix_achat?: number | null
          statut?: Database["public"]["Enums"]["statut_materiel"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_achat?: string
          description?: string | null
          fournisseur?: string | null
          garantie_fin?: string | null
          id?: string
          modele?: string
          nom?: string
          numero_serie?: string
          owner_id?: string | null
          prix_achat?: number | null
          statut?: Database["public"]["Enums"]["statut_materiel"]
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nom: string
          poste: string | null
          prenom: string
          service: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          nom: string
          poste?: string | null
          prenom: string
          service?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nom?: string
          poste?: string | null
          prenom?: string
          service?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      utilisateurs: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nom: string
          owner_id: string | null
          poste: string
          prenom: string
          service: string
          statut: Database["public"]["Enums"]["statut_utilisateur"]
          telephone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          nom: string
          owner_id?: string | null
          poste: string
          prenom: string
          service: string
          statut?: Database["public"]["Enums"]["statut_utilisateur"]
          telephone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nom?: string
          owner_id?: string | null
          poste?: string
          prenom?: string
          service?: string
          statut?: Database["public"]["Enums"]["statut_utilisateur"]
          telephone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ajouter_historique_activite: {
        Args: {
          p_materiel_id: string
          p_type_activite: string
          p_titre: string
          p_utilisateur_id?: string
          p_description?: string
          p_details?: Json
        }
        Returns: string
      }
    }
    Enums: {
      priorite_incident:
        | "Faible"
        | "Moyenne"
        | "Élevée"
        | "Critique"
        | "Basse"
        | "Haute"
      statut_attribution: "Actif" | "Retourné" | "En attente"
      statut_incident: "Ouvert" | "En cours" | "Résolu" | "Fermé"
      statut_maintenance: "Planifié" | "En cours" | "Terminé" | "Annulé"
      statut_materiel:
        | "Disponible"
        | "Attribué"
        | "En maintenance"
        | "Hors service"
      statut_utilisateur: "Actif" | "Inactif" | "Suspendu"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      priorite_incident: [
        "Faible",
        "Moyenne",
        "Élevée",
        "Critique",
        "Basse",
        "Haute",
      ],
      statut_attribution: ["Actif", "Retourné", "En attente"],
      statut_incident: ["Ouvert", "En cours", "Résolu", "Fermé"],
      statut_maintenance: ["Planifié", "En cours", "Terminé", "Annulé"],
      statut_materiel: [
        "Disponible",
        "Attribué",
        "En maintenance",
        "Hors service",
      ],
      statut_utilisateur: ["Actif", "Inactif", "Suspendu"],
    },
  },
} as const
