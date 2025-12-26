-- OpenDS Component System - Initial Schema
-- Migration: 003_component_system_init
-- Created: 2024-12-25
-- Description: Initial database schema for component system

-- =============================================================================
-- COMPONENTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(100),

  -- Component structure
  props JSONB DEFAULT '[]',
  slots JSONB DEFAULT '[]',
  events JSONB DEFAULT '[]',
  examples JSONB DEFAULT '[]',

  -- Metadata
  usage TEXT,
  notes JSONB DEFAULT '[]',

  -- System fields
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,

  -- Search optimization
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(name, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(category, '') || ' ' ||
      coalesce(usage, '')
    )
  ) STORED
);

-- Indexes for components table
CREATE INDEX idx_components_category ON components(category);
CREATE INDEX idx_components_created_at ON components(created_at DESC);
CREATE INDEX idx_components_updated_at ON components(updated_at DESC);
CREATE INDEX idx_components_search ON components USING gin(search_vector);

-- =============================================================================
-- COMPONENT VERSIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS component_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,

  version VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),

  -- Versioned component structure
  props JSONB DEFAULT '[]',
  slots JSONB DEFAULT '[]',
  events JSONB DEFAULT '[]',
  examples JSONB DEFAULT '[]',
  usage TEXT,
  notes JSONB DEFAULT '[]',

  changelog TEXT,
  is_published BOOLEAN DEFAULT false,

  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Ensure unique versions per component
  UNIQUE(component_id, version)
);

-- Indexes for component_versions table
CREATE INDEX idx_component_versions_component_id ON component_versions(component_id);
CREATE INDEX idx_component_versions_version ON component_versions(version);
CREATE INDEX idx_component_versions_created_at ON component_versions(created_at DESC);

-- =============================================================================
-- COMPONENT TAGS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS component_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Ensure unique tag per component
  UNIQUE(component_id, tag)
);

-- Indexes for component_tags table
CREATE INDEX idx_component_tags_component_id ON component_tags(component_id);
CREATE INDEX idx_component_tags_tag ON component_tags(tag);

-- =============================================================================
-- COMPONENT DEPENDENCIES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS component_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  dependency_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,

  dependency_type VARCHAR(50) NOT NULL DEFAULT 'requires', -- requires, optional, conflicts

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Prevent self-references and duplicates
  CHECK (component_id != dependency_id),
  UNIQUE(component_id, dependency_id, dependency_type)
);

-- Indexes for component_dependencies table
CREATE INDEX idx_component_dependencies_component_id ON component_dependencies(component_id);
CREATE INDEX idx_component_dependencies_dependency_id ON component_dependencies(dependency_id);

-- =============================================================================
-- USERS TABLE (if not exists)
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================================================

-- Apply updated_at trigger to components
CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON components
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- INITIAL DATA
-- =============================================================================

-- Insert default admin user (password will be hashed by application)
INSERT INTO users (username, email, password_hash, role)
VALUES ('admin', 'admin@opends.local', '$2b$10$rOz8vZxZxZxZxZxZxZxZxO8vZxZxZxZxZxZxZxZxZxZxZxZxZx', 'admin')
ON CONFLICT (username) DO NOTHING;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
-- Schema version: 003
-- Date: 2024-12-25