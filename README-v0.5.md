# SavannaGuard Browser v0.5.0 — Search Index Foundation

## Major update
- Savanna-owned D1 + FTS5 document index.
- Relevance ranking with textual match, African relevance and freshness signals.
- Search checks the Savanna Index first, then uses upstream discovery as a fallback while the index grows.
- Protected `/api/ingest` endpoint; token remains server-side.
- Separate bounded sitemap crawler Worker with robots.txt checks and hard limits.
- Web / News / Images / Places search-mode UI foundation.
- Existing XSS-safe result rendering and security headers retained.

## Deployment
1. Create Cloudflare D1.
2. Apply `db/schema.sql`.
3. Bind D1 as `DB` to Pages Functions.
4. Set `SEARCH_ADMIN_TOKEN` as a secret.
5. Deploy Pages.
6. Deploy `workers/crawler.js` separately with Cron.
7. Set `INGEST_URL` to `/api/ingest` and `SAVANNA_SEEDS` to approved sitemap URLs.

Never expose `SEARCH_ADMIN_TOKEN` in GitHub, HTML, JavaScript or public variables.

## Status
This is the first independent-index foundation, not a global crawler. We grow the corpus from approved seeds before expanding coverage.
