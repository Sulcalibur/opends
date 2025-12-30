-- OpenDS - Documentation Pages Schema
-- Migration: 005_documentation_pages
-- Created: 2024-12-30
-- Description: Creates table for documentation pages with markdown content

-- =============================================================================
-- DOCUMENTATION PAGES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS documentation_pages (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '', -- Markdown content
  excerpt TEXT, -- Short description for listings
  category TEXT DEFAULT 'general',
  parent_id TEXT REFERENCES documentation_pages(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  
  -- Publishing status
  is_published INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  
  -- Metadata
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  
  -- Soft delete
  deleted_at TEXT
);

-- Indexes for documentation_pages table
CREATE INDEX IF NOT EXISTS idx_docs_slug ON documentation_pages(slug);
CREATE INDEX IF NOT EXISTS idx_docs_category ON documentation_pages(category);
CREATE INDEX IF NOT EXISTS idx_docs_parent_id ON documentation_pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_docs_is_published ON documentation_pages(is_published);
CREATE INDEX IF NOT EXISTS idx_docs_sort_order ON documentation_pages(sort_order);
CREATE INDEX IF NOT EXISTS idx_docs_deleted_at ON documentation_pages(deleted_at);

-- Trigger for updated_at
CREATE TRIGGER IF NOT EXISTS update_docs_timestamp 
AFTER UPDATE ON documentation_pages
BEGIN
  UPDATE documentation_pages SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- =============================================================================
-- INITIAL DOCUMENTATION PAGES
-- =============================================================================
INSERT OR IGNORE INTO documentation_pages (id, slug, title, content, category, is_published, sort_order) VALUES
  ('doc-getting-started', 'getting-started', 'Getting Started', '# Getting Started

Welcome to OpenDS! This guide will help you get up and running with our design system.

## Installation

Follow these steps to integrate OpenDS into your project...

## Quick Start

1. Configure your project
2. Import components
3. Start building!

', 'guides', 1, 1),
  ('doc-design-principles', 'design-principles', 'Design Principles', '# Design Principles

Our design system is built on the following core principles:

## Consistency
Maintain visual and behavioral consistency across all interfaces.

## Accessibility
Design for everyone, ensuring WCAG 2.1 AA compliance.

## Flexibility
Components should adapt to various contexts and use cases.

', 'guides', 1, 2);
