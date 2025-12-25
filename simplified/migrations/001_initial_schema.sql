-- OpenDS Initial Database Schema
-- Migration: 001_initial_schema
-- Created: 2024-12-25
-- Description: Creates initial tables for authentication and user management

-- =============================================================================
-- USERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),  -- NULL if OAuth-only user
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer',  -- admin, editor, viewer
  
  -- Account status
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMP,
  
  -- Security
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  
  -- Constraints
  CONSTRAINT check_role CHECK (role IN ('admin', 'editor', 'viewer')),
  CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- =============================================================================
-- OAUTH CONNECTIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS oauth_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,  -- google, github, gitlab
  provider_user_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  profile_data JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Ensure one provider per user
  UNIQUE(provider, provider_user_id),
  CONSTRAINT check_provider CHECK (provider IN ('google', 'github', 'gitlab'))
);

-- Indexes for oauth_connections table
CREATE INDEX idx_oauth_user_id ON oauth_connections(user_id);
CREATE INDEX idx_oauth_provider ON oauth_connections(provider);

-- =============================================================================
-- SESSIONS TABLE (for JWT refresh tokens)
-- =============================================================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  
  -- Ensure valid expiry
  CONSTRAINT check_expiry CHECK (expires_at > created_at)
);

-- Indexes for sessions table
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- =============================================================================
-- INVITATIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer',
  invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_invitation_role CHECK (role IN ('admin', 'editor', 'viewer')),
  CONSTRAINT check_invitation_expiry CHECK (expires_at > created_at)
);

-- Indexes for invitations table
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_expires_at ON invitations(expires_at);

-- =============================================================================
-- AUDIT LOGS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,  -- login, logout, create_user, etc.
  resource_type VARCHAR(50),     -- user, component, token
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for audit_logs table
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =============================================================================
-- SETTINGS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB,
  description TEXT,
  is_public BOOLEAN DEFAULT false,  -- Can be read by non-admins
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for settings table
CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_is_public ON settings(is_public);

-- =============================================================================
-- COMPONENTS TABLE (for design system components)
-- =============================================================================
CREATE TABLE IF NOT EXISTS components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'draft',  -- draft, review, approved, deprecated
  spec JSONB NOT NULL,  -- Complete component specification
  preview_url TEXT,
  
  -- Metadata
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMP,
  
  -- Soft delete
  deleted_at TIMESTAMP,
  
  -- Constraints
  CONSTRAINT check_component_status CHECK (status IN ('draft', 'review', 'approved', 'deprecated'))
);

-- Indexes for components table
CREATE INDEX idx_components_name ON components(name);
CREATE INDEX idx_components_category ON components(category);
CREATE INDEX idx_components_status ON components(status);
CREATE INDEX idx_components_created_at ON components(created_at DESC);
CREATE INDEX idx_components_deleted_at ON components(deleted_at);

-- Full-text search index for components
CREATE INDEX idx_components_search ON components USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- =============================================================================
-- COMPONENT VERSIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS component_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  version VARCHAR(50) NOT NULL,
  spec JSONB NOT NULL,
  changelog TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Ensure unique versions per component
  UNIQUE(component_id, version)
);

-- Indexes for component_versions table
CREATE INDEX idx_component_versions_component_id ON component_versions(component_id);
CREATE INDEX idx_component_versions_created_at ON component_versions(created_at DESC);

-- =============================================================================
-- DESIGN TOKENS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS design_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,  -- color, typography, spacing, etc.
  value JSONB NOT NULL,
  description TEXT,
  
  -- Metadata
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMP
);

-- Indexes for design_tokens table
CREATE INDEX idx_tokens_name ON design_tokens(name);
CREATE INDEX idx_tokens_category ON design_tokens(category);
CREATE INDEX idx_tokens_deleted_at ON design_tokens(deleted_at);

-- =============================================================================
-- SYNC EVENTS TABLE (for tracking design tool sync)
-- =============================================================================
CREATE TABLE IF NOT EXISTS sync_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  source VARCHAR(50) NOT NULL,  -- penpot, figma, sketch
  file_id VARCHAR(255),
  file_name VARCHAR(255),
  status VARCHAR(50) NOT NULL,  -- started, completed, failed
  components_synced INTEGER DEFAULT 0,
  tokens_synced INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB,
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  
  -- Constraints
  CONSTRAINT check_sync_source CHECK (source IN ('penpot', 'figma', 'sketch', 'storybook')),
  CONSTRAINT check_sync_status CHECK (status IN ('started', 'completed', 'failed'))
);

-- Indexes for sync_events table
CREATE INDEX idx_sync_events_user_id ON sync_events(user_id);
CREATE INDEX idx_sync_events_source ON sync_events(source);
CREATE INDEX idx_sync_events_status ON sync_events(status);
CREATE INDEX idx_sync_events_started_at ON sync_events(started_at DESC);

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_oauth_connections_updated_at BEFORE UPDATE ON oauth_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON components
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tokens_updated_at BEFORE UPDATE ON design_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- INITIAL DATA
-- =============================================================================

-- Insert default settings
INSERT INTO settings (key, value, description, is_public) VALUES
  ('organization_name', '"OpenDS"', 'Organization name displayed in the app', true),
  ('allow_registration', 'false', 'Allow public user registration', false),
  ('require_email_verification', 'false', 'Require email verification for new users', false),
  ('oauth_google_enabled', 'false', 'Enable Google OAuth login', false),
  ('oauth_github_enabled', 'false', 'Enable GitHub OAuth login', false)
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
-- Schema version: 001
-- Date: 2024-12-25
