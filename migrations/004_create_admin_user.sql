-- OpenDS - Create Admin User
-- Migration: 004_create_admin_user
-- Created: 2024-12-29

INSERT INTO users (id, email, password_hash, name, role, is_active, is_verified)
VALUES (
  '00000000-0000-4000-a000-000000000000',
  'admin@opends.local',
  '$2b$10$/s/uqPV7O1tRM0BIFS1oZekA.HccVI/gP4IglkO5TESgIt94VMQ6e',
  'Admin',
  'admin',
  1,
  1
)
ON CONFLICT(email) DO NOTHING;
