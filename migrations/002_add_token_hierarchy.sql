-- OpenDS Token Hierarchy Migration
-- Migration: 002_add_token_hierarchy
-- Created: 2024-12-25
-- Description: Adds hierarchical relationships and references to design tokens

-- =============================================================================
-- MODIFY DESIGN_TOKENS TABLE FOR HIERARCHY
-- =============================================================================

-- Add hierarchy columns
ALTER TABLE design_tokens
ADD COLUMN parent_id UUID REFERENCES design_tokens(id) ON DELETE CASCADE,
ADD COLUMN path VARCHAR(1000),  -- Full path like 'color/primary/500'
ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'value',  -- value, reference, alias
ADD COLUMN references JSONB,  -- Array of referenced token IDs
ADD COLUMN metadata JSONB;  -- Additional flexible metadata

-- Add constraints
ALTER TABLE design_tokens
ADD CONSTRAINT check_token_type CHECK (type IN ('value', 'reference', 'alias')),
ADD CONSTRAINT check_path_format CHECK (path ~ '^([a-zA-Z0-9_-]+/)*[a-zA-Z0-9_-]+$');

-- Drop old unique constraint on name and create new one with path
ALTER TABLE design_tokens DROP CONSTRAINT design_tokens_name_key;
ALTER TABLE design_tokens ADD CONSTRAINT design_tokens_path_key UNIQUE (path);

-- Update existing tokens to have paths equal to names for backward compatibility
UPDATE design_tokens SET path = name WHERE path IS NULL;

-- Make path not null after updating
ALTER TABLE design_tokens ALTER COLUMN path SET NOT NULL;

-- Add indexes for hierarchy
CREATE INDEX idx_tokens_parent_id ON design_tokens(parent_id);
CREATE INDEX idx_tokens_path ON design_tokens(path);
CREATE INDEX idx_tokens_type ON design_tokens(type);
CREATE INDEX idx_tokens_references ON design_tokens USING gin(references);
CREATE INDEX idx_tokens_metadata ON design_tokens USING gin(metadata);

-- =============================================================================
-- TOKEN VERSIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS token_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID NOT NULL REFERENCES design_tokens(id) ON DELETE CASCADE,
  version VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  path VARCHAR(1000) NOT NULL,
  type VARCHAR(50) NOT NULL,
  references JSONB,
  metadata JSONB,
  changelog TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Ensure unique versions per token
  UNIQUE(token_id, version)
);

-- Indexes for token_versions table
CREATE INDEX idx_token_versions_token_id ON token_versions(token_id);
CREATE INDEX idx_token_versions_created_at ON token_versions(created_at DESC);

-- =============================================================================
-- TOKEN USAGE TABLE (for tracking where tokens are used)
-- =============================================================================

CREATE TABLE IF NOT EXISTS token_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID NOT NULL REFERENCES design_tokens(id) ON DELETE CASCADE,
  component_id UUID REFERENCES components(id) ON DELETE CASCADE,
  usage_type VARCHAR(50) NOT NULL,  -- 'css', 'component-prop', 'style'
  usage_context TEXT,  -- CSS selector, component path, etc.
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Ensure no duplicate usage records
  UNIQUE(token_id, component_id, usage_type, usage_context)
);

-- Indexes for token_usage table
CREATE INDEX idx_token_usage_token_id ON token_usage(token_id);
CREATE INDEX idx_token_usage_component_id ON token_usage(component_id);
CREATE INDEX idx_token_usage_type ON token_usage(usage_type);

-- Apply updated_at trigger to token_usage
CREATE TRIGGER update_token_usage_updated_at BEFORE UPDATE ON token_usage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- FUNCTIONS FOR TOKEN HIERARCHY
-- =============================================================================

-- Function to update path when parent changes
CREATE OR REPLACE FUNCTION update_token_path()
RETURNS TRIGGER AS $$
DECLARE
  parent_path VARCHAR(1000);
BEGIN
  IF NEW.parent_id IS NULL THEN
    NEW.path := NEW.name;
  ELSE
    SELECT path INTO parent_path FROM design_tokens WHERE id = NEW.parent_id;
    IF parent_path IS NOT NULL THEN
      NEW.path := parent_path || '/' || NEW.name;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain path
CREATE TRIGGER maintain_token_path BEFORE INSERT OR UPDATE ON design_tokens
  FOR EACH ROW EXECUTE FUNCTION update_token_path();

-- Function to resolve token references recursively
CREATE OR REPLACE FUNCTION resolve_token_value(token_id UUID)
RETURNS JSONB AS $$
DECLARE
  token_record RECORD;
  resolved_value JSONB;
  ref_id UUID;
BEGIN
  SELECT * INTO token_record FROM design_tokens WHERE id = token_id AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  IF token_record.type = 'value' THEN
    RETURN token_record.value;
  ELSIF token_record.type = 'reference' AND token_record.references IS NOT NULL THEN
    -- For simplicity, take first reference
    ref_id := (token_record.references->>0)::UUID;
    RETURN resolve_token_value(ref_id);
  ELSE
    RETURN token_record.value;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
-- Schema version: 002
-- Date: 2024-12-25