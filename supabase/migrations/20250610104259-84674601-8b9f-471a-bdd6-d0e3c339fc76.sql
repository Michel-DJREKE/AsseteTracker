
-- First, create the enum values in a separate transaction
DO $$ 
BEGIN
  -- Check if the enum type exists, if not create it
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priorite_incident') THEN
    CREATE TYPE priorite_incident AS ENUM ('Basse', 'Moyenne', 'Haute', 'Critique');
  ELSE
    -- Add missing enum values if they don't exist
    BEGIN
      ALTER TYPE priorite_incident ADD VALUE IF NOT EXISTS 'Basse';
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
      ALTER TYPE priorite_incident ADD VALUE IF NOT EXISTS 'Moyenne';
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
      ALTER TYPE priorite_incident ADD VALUE IF NOT EXISTS 'Haute';
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
      ALTER TYPE priorite_incident ADD VALUE IF NOT EXISTS 'Critique';
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;
