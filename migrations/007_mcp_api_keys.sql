-- OpenDS MCP API Keys Migration
-- Migration: 007_mcp_api_keys
-- Created: 2025-01-04
-- Description: Create table for MCP server authentication keys

-- =============================================================================
-- MCP API KEYS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS mcp_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_hash VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  scope JSONB DEFAULT '["read:tokens", "read:components"]', -- Permission scoping
  expires_at TIMESTAMP,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Indexes for performance and security
CREATE INDEX idx_mcp_keys_user_id ON mcp_api_keys(user_id);
CREATE INDEX idx_mcp_keys_hash ON mcp_api_keys(key_hash);
CREATE INDEX idx_mcp_keys_expires ON mcp_api_keys(expires_at);
CREATE INDEX idx_mcp_keys_deleted_at ON mcp_api_keys(deleted_at);

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update last used timestamp
CREATE OR REPLACE FUNCTION update_mcp_key_last_used()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_used_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to update last_used_at when key is used
CREATE TRIGGER update_mcp_key_last_used
  BEFORE UPDATE ON mcp_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_mcp_key_last_used();

-- =============================================================================
-- AUDIT LOGGING TRIGGER
-- =============================================================================

-- Function to log MCP key usage for auditing
CREATE OR REPLACE FUNCTION log_mcp_key_audit()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.deleted_at IS NULL THEN
    INSERT INTO audit_logs (action, resource_type, resource_id, details, ip_address, user_agent, created_at)
    VALUES (
      'mcp_key_created',
      'mcp_key',
      NEW.id,
      jsonb_build_object(
        'action', 'key_created',
        'key_name', NEW.name,
        'scope', NEW.scope,
        'user_id', NEW.user_id,
        'expires_at', NEW.expires_at
      ),
      pg_stat_statements.ip_address,
      pg_stat_statements.user_agent,
      NOW()
    );
  END IF;
  
  IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
    INSERT INTO audit_logs (action, resource_type, resource_id, details, created_at)
    VALUES (
      'mcp_key_revoked',
      'mcp_key',
      OLD.id,
      jsonb_build_object(
        'action', 'key_revoked',
        'key_name', OLD.name,
        'user_id', OLD.user_id,
        'was_used', OLD.last_used_at IS NOT NULL
      ),
      NULL, -- Will be populated by application context
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply audit trigger to MCP keys table
CREATE TRIGGER log_mcp_key_audit
  AFTER INSERT OR UPDATE ON mcp_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION log_mcp_key_audit();

-- =============================================================================
-- SAMPLE DATA (optional)
-- =============================================================================

-- Create default read-only scope for non-admin users (will be enforced by application logic)
COMMENT ON COLUMN mcp_api_keys.scope IS 'JSON array of allowed scopes: ["read:tokens", "write:tokens", "read:components", "write:components", "read:docs", "write:docs"]';

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
-- Schema version: 007
-- Date: 2025-01-04