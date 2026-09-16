# Savanna Search Index

v0.5 adds a Cloudflare D1 document index using SQLite FTS5. Apply `schema.sql`, bind the database to Pages Functions as `DB`, and keep `SEARCH_ADMIN_TOKEN` server-side.

`workers/crawler.js` is a bounded sitemap crawler for approved seed URLs. It is deliberately not a general-purpose scraper: it checks robots.txt, caps domains/pages/work, and sends normalized records to the protected ingestion endpoint.
