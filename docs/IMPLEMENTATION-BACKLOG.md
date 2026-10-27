# Savanna Search v0.6 Implementation Backlog

## Must ship
- [x] Explicit ranking module
- [x] Query normalization/classification module
- [x] Link graph storage
- [x] URL property/frontier metadata
- [x] Crawl event observability
- [x] Evaluation schema
- [x] Precision@5/10 and NDCG@10 evaluator
- [x] Architecture documentation mapped to source chapter

## Next engineering sprint
- [ ] Upgrade crawler to persist extracted links into `links`.
- [ ] Canonical URL normalization and redirect handling.
- [ ] Stronger duplicate detection using content hashes plus near-duplicate fingerprints.
- [ ] Per-host crawl rate and backoff state.
- [ ] Source quality registry with reviewable rules.
- [ ] Link graph recomputation job for authority scores.
- [ ] Search result deduplication by canonical URL/content fingerprint.
- [ ] Snippet generator with safe text extraction.
- [ ] News vertical with strict freshness controls.
- [ ] Places vertical using OpenStreetMap-backed data without exposing a third-party shortcut on the homepage.
- [ ] Image vertical with explicit licensing/attribution metadata.
- [ ] Search-quality benchmark corpus covering English and Kiswahili queries.

## Later
- [ ] Distributed document repository.
- [ ] Partitioned/incremental index service.
- [ ] Learning-to-rank experiments only after reliable graded judgments exist.
- [ ] Privacy-preserving aggregate telemetry.
- [ ] Abuse-resistant click signals if telemetry is introduced.

## Non-goals for v0.6
- unrestricted global crawling
- storing raw personal search histories for ranking
- opaque ML ranking with no evaluation baseline
- CAPTCHA on ordinary search requests
