-- Savanna Search v0.6 incremental schema.
-- Apply after db/schema.sql from v0.5.

CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_document_id TEXT NOT NULL,
  target_url TEXT NOT NULL,
  anchor_text TEXT DEFAULT '',
  discovered_at TEXT NOT NULL,
  UNIQUE(source_document_id, target_url, anchor_text)
);
CREATE INDEX IF NOT EXISTS idx_links_target ON links(target_url);
CREATE INDEX IF NOT EXISTS idx_links_source ON links(source_document_id);

CREATE TABLE IF NOT EXISTS url_properties (
  url TEXT PRIMARY KEY,
  canonical_url TEXT NOT NULL,
  host TEXT NOT NULL,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  last_crawled_at TEXT,
  next_crawl_at TEXT,
  http_status INTEGER,
  content_hash TEXT,
  etag TEXT DEFAULT '',
  last_modified TEXT DEFAULT '',
  crawl_status TEXT DEFAULT 'pending',
  priority REAL DEFAULT 0,
  depth INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_url_next_crawl ON url_properties(next_crawl_at);
CREATE INDEX IF NOT EXISTS idx_url_host ON url_properties(host);

CREATE TABLE IF NOT EXISTS document_signals (
  document_id TEXT PRIMARY KEY,
  inbound_links INTEGER DEFAULT 0,
  authority_score REAL DEFAULT 0,
  source_quality REAL DEFAULT 0,
  spam_score REAL DEFAULT 0,
  language_score REAL DEFAULT 0,
  africa_score REAL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS crawl_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  event_type TEXT NOT NULL,
  status_code INTEGER,
  bytes INTEGER DEFAULT 0,
  duration_ms INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_crawl_events_created ON crawl_events(created_at);

CREATE TABLE IF NOT EXISTS search_evaluations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query_hash TEXT NOT NULL,
  doc_id TEXT NOT NULL,
  relevance INTEGER NOT NULL CHECK(relevance BETWEEN 0 AND 3),
  evaluator TEXT DEFAULT 'anonymous',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_eval_query ON search_evaluations(query_hash);

CREATE TABLE IF NOT EXISTS query_stats (
  day TEXT PRIMARY KEY,
  searches INTEGER DEFAULT 0,
  zero_results INTEGER DEFAULT 0,
  p50_latency_ms REAL DEFAULT 0,
  p95_latency_ms REAL DEFAULT 0
);
