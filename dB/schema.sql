CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY,url TEXT NOT NULL UNIQUE,title TEXT NOT NULL,description TEXT DEFAULT '',content TEXT DEFAULT '',language TEXT DEFAULT 'und',country TEXT DEFAULT '',region TEXT DEFAULT '',source_type TEXT DEFAULT 'web',image_url TEXT DEFAULT '',published_at TEXT,crawled_at TEXT NOT NULL,content_hash TEXT DEFAULT '');
CREATE INDEX IF NOT EXISTS idx_documents_published ON documents(published_at);
CREATE INDEX IF NOT EXISTS idx_documents_country ON documents(country);
CREATE INDEX IF NOT EXISTS idx_documents_region ON documents(region);
CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts USING fts5(title,description,content,url UNINDEXED,content='documents',content_rowid='rowid');
CREATE TRIGGER IF NOT EXISTS documents_ai AFTER INSERT ON documents BEGIN INSERT INTO documents_fts(rowid,title,description,content,url) VALUES (new.rowid,new.title,new.description,new.content,new.url); END;
CREATE TRIGGER IF NOT EXISTS documents_ad AFTER DELETE ON documents BEGIN INSERT INTO documents_fts(documents_fts,rowid,title,description,content,url) VALUES('delete',old.rowid,old.title,old.description,old.content,old.url); END;
CREATE TRIGGER IF NOT EXISTS documents_au AFTER UPDATE ON documents BEGIN INSERT INTO documents_fts(documents_fts,rowid,title,description,content,url) VALUES('delete',old.rowid,old.title,old.description,old.content,old.url); INSERT INTO documents_fts(rowid,title,description,content,url) VALUES (new.rowid,new.title,new.description,new.content,new.url); END;
