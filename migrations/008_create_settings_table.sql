-- OpenDS Settings Table Migration
-- Migration: 008_create_settings_table
-- Created: 2025-02-04
-- Description: Adds settings table for application configuration

-- =============================================================================
-- SETTINGS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for settings table
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_is_public ON settings(is_public);

-- Trigger for automatic updated_at updates
CREATE TRIGGER update_settings_updated_at 
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO settings (key, value, description, is_public) VALUES
    ('app.name', '"OpenDS"', 'Application name displayed in UI', true),
    ('app.description', '"Open-source design system documentation platform"', 'Application description', true),
    ('app.theme', '"dark"', 'Default UI theme (light/dark/system)', true),
    ('app.logo_url', 'null', 'URL to application logo', true),
    ('app.favicon_url', 'null', 'URL to favicon', true),
    ('auth.allow_registration', 'true', 'Whether new user registration is allowed', false),
    ('auth.require_email_verification', 'false', 'Whether email verification is required', false),
    ('design_system.name', '"My Design System"', 'Default design system name', true),
    ('design_system.version', '"1.0.0"', 'Design system version', true),
    ('design_system.repository_url', 'null', 'URL to design system repository', true)
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================