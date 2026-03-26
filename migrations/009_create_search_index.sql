-- Migration: 009_create_search_index
-- Description: Create search index table with full-text search capabilities

-- =============================================================================
-- SEARCH INDEX TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS search_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('token', 'component', 'doc')),
  content_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  search_vector tsvector,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Unique constraint to prevent duplicate entries
  UNIQUE(content_type, content_id)
);

-- Indexes for search performance
CREATE INDEX IF NOT EXISTS idx_search_vector ON search_index USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_search_content_type ON search_index(content_type);
CREATE INDEX IF NOT EXISTS idx_search_updated_at ON search_index(updated_at);

-- =============================================================================
-- TRIGGER FUNCTION: UPDATE TOKEN SEARCH INDEX
-- =============================================================================
CREATE OR REPLACE FUNCTION update_token_search_index()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO search_index (content_type, content_id, title, content, search_vector)
    VALUES (
      'token',
      NEW.id,
      NEW.name,
      COALESCE(NEW.description, ''),
      to_tsvector('english', COALESCE(NEW.name, '') || ' ' || COALESCE(NEW.description, ''))
    );
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE search_index
    SET title = NEW.name,
        content = COALESCE(NEW.description, ''),
        search_vector = to_tsvector('english', COALESCE(NEW.name, '') || ' ' || COALESCE(NEW.description, '')),
        updated_at = CURRENT_TIMESTAMP
    WHERE content_type = 'token' AND content_id = NEW.id;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM search_index WHERE content_type = 'token' AND content_id = OLD.id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER token_search_index_trigger
AFTER INSERT OR UPDATE OR DELETE ON design_tokens
FOR EACH ROW EXECUTE FUNCTION update_token_search_index();

-- =============================================================================
-- TRIGGER FUNCTION: UPDATE COMPONENT SEARCH INDEX
-- =============================================================================
CREATE OR REPLACE FUNCTION update_component_search_index()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO search_index (content_type, content_id, title, content, search_vector)
    VALUES (
      'component',
      NEW.id,
      COALESCE(NEW.display_name, NEW.name),
      COALESCE(NEW.description, ''),
      to_tsvector('english',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.display_name, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.category, '')
      )
    );
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE search_index
    SET title = COALESCE(NEW.display_name, NEW.name),
        content = COALESCE(NEW.description, ''),
        search_vector = to_tsvector('english',
          COALESCE(NEW.name, '') || ' ' ||
          COALESCE(NEW.display_name, '') || ' ' ||
          COALESCE(NEW.description, '') || ' ' ||
          COALESCE(NEW.category, '')
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE content_type = 'component' AND content_id = NEW.id;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM search_index WHERE content_type = 'component' AND content_id = OLD.id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER component_search_index_trigger
AFTER INSERT OR UPDATE OR DELETE ON components
FOR EACH ROW EXECUTE FUNCTION update_component_search_index();

-- =============================================================================
-- TRIGGER FUNCTION: UPDATE DOCUMENTATION SEARCH INDEX
-- =============================================================================
CREATE OR REPLACE FUNCTION update_doc_search_index()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_published = 1 THEN
    INSERT INTO search_index (content_type, content_id, title, content, search_vector)
    VALUES (
      'doc',
      NEW.id,
      NEW.title,
      COALESCE(NEW.content, ''),
      to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, ''))
    );
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.is_published = 1 THEN
      INSERT INTO search_index (content_type, content_id, title, content, search_vector)
      VALUES (
        'doc',
        NEW.id,
        NEW.title,
        COALESCE(NEW.content, ''),
        to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, ''))
      )
      ON CONFLICT (content_type, content_id) DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        search_vector = EXCLUDED.search_vector,
        updated_at = CURRENT_TIMESTAMP;
    ELSE
      DELETE FROM search_index WHERE content_type = 'doc' AND content_id = NEW.id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM search_index WHERE content_type = 'doc' AND content_id = OLD.id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER doc_search_index_trigger
AFTER INSERT OR UPDATE OR DELETE ON documentation_pages
FOR EACH ROW EXECUTE FUNCTION update_doc_search_index();

-- =============================================================================
-- POPULATE EXISTING DATA
-- =============================================================================
-- Index existing tokens
INSERT INTO search_index (content_type, content_id, title, content, search_vector)
SELECT
  'token',
  id,
  name,
  COALESCE(description, ''),
  to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, ''))
FROM design_tokens
WHERE deleted_at IS NULL
ON CONFLICT (content_type, content_id) DO NOTHING;

-- Index existing components
INSERT INTO search_index (content_type, content_id, title, content, search_vector)
SELECT
  'component',
  id,
  COALESCE(display_name, name),
  COALESCE(description, ''),
  to_tsvector('english',
    COALESCE(name, '') || ' ' ||
    COALESCE(display_name, '') || ' ' ||
    COALESCE(description, '') || ' ' ||
    COALESCE(category, '')
  )
FROM components
WHERE deleted_at IS NULL
ON CONFLICT (content_type, content_id) DO NOTHING;

-- Index existing published documentation
INSERT INTO search_index (content_type, content_id, title, content, search_vector)
SELECT
  'doc',
  id,
  title,
  COALESCE(content, ''),
  to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(content, ''))
FROM documentation_pages
WHERE is_published = 1 AND deleted_at IS NULL
ON CONFLICT (content_type, content_id) DO NOTHING;
