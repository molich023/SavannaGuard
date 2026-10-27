# SavannaGuard Browser / Savanna Search v0.6.0

v0.6 turns the v0.5 search-index foundation into a documented search-engine architecture with explicit query processing, ranking signals, link-graph storage, crawl frontier metadata and evaluation tooling.

## Added

- `docs/SEARCH-ENGINE-ARCHITECTURE.md` — full implementation roadmap based on the supplied search-engine chapter.
- `docs/RANKING-SIGNALS.md` — transparent ranking model.
- `docs/IMPLEMENTATION-BACKLOG.md` — staged engineering plan.
- `db/schema-v0.6.sql` — links, URL properties, document signals, crawl events and evaluation data.
- `functions/api/rank.js` — reusable ranking function.
- `functions/api/query.js` — query normalization and intent classification.
- `workers/frontier.js` — bounded frontier scheduler foundation.
- `tools/evaluate_search.py` — Precision@5, Precision@10 and NDCG@10 evaluator.
- tests for query and ranking behavior.

## Source alignment

The supplied chapter describes crawling, link extraction/filtering, scheduling, incremental indexing, query processing, ranking, vertical aggregation and search-quality evaluation. Savanna v0.6 maps those concepts into small, testable components rather than attempting a global-scale architecture immediately.

## Important

This is still an early independent search engine. It is not comparable in corpus size or infrastructure to a mature global search provider. The objective is to build the architecture correctly, grow the corpus deliberately, measure quality, and scale only when the data and workload justify it.
