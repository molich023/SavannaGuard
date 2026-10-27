# D1 v0.6 migration

Apply `schema.sql` first (v0.5), then `schema-v0.6.sql`.

The migration is additive. It introduces link graph data, URL crawl properties, ranking signals, crawl observability and graded evaluation records.

Keep crawler/admin credentials outside source control. Use Cloudflare secrets/variables in deployment.
