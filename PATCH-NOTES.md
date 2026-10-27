# Savanna Browser patch v0.6.1

This is a delta patch for the existing SavannaBrowser v0.6.0 repository. It contains only the updated crawler file plus these patch notes.

## Files to copy into the repository

- `workers/crawler.js` — replaces the previous crawler and fixes the unmatched closing brace that caused Wrangler's `Unexpected "}"` build error.

## GitHub upload steps

1. Extract this ZIP.
2. Copy `workers/crawler.js` into the same path in your existing repository, replacing the old file.
3. Commit with: `Fix crawler syntax and enforce document crawl limit`.
4. Check the next deployment log.

Do not upload this patch as a replacement for the entire repository. It is only a partial update, not a complete browser package.

## Configuration reminder

The crawler expects `SAVANNA_SEEDS`, `INGEST_URL`, and `SEARCH_ADMIN_TOKEN` in its Cloudflare Worker environment. Do not put secret values in source control. The browser Pages deployment and the crawler Worker are separate deployment targets.

## Scope and limitations

This patch fixes the syntax error and limits collected documents to 40 per scheduled run. It is not a claim of production readiness: the robots.txt parser is basic, redirects and SSRF protections need further hardening, and response text is currently read before truncation. Review these before large-scale crawling.
