# Savanna Search — Search Engine Architecture

## Purpose

Savanna Search is designed as an African-first, privacy-first search system. This document translates the supplied search-engine chapter into an implementable roadmap for the project.

The source chapter identifies the major search-engine stages as crawling/data acquisition, offline data processing, indexing, query processing, retrieval, ranking, snippet generation, result aggregation, and evaluation. It also identifies four major ranking dimensions: relevancy, authoritativeness, freshness, and preference. fileciteturn2file0L17-L25 fileciteturn2file7L393-L403

## Target architecture

```text
                         INTERNET
                            |
                  +---------v----------+
                  | Seed / Sitemap     |
                  | Discovery          |
                  +---------+----------+
                            |
                  +---------v----------+
                  | Crawl Scheduler    |
                  | robots + politeness|
                  +---------+----------+
                            |
                  +---------v----------+
                  | Fetch / Parse      |
                  | HTML + metadata    |
                  +---------+----------+
                            |
             +--------------v---------------+
             | Canonicalize / Deduplicate   |
             | Spam / quality classification|
             +--------------+---------------+
                            |
                 +----------v----------+
                 | Document Repository |
                 +----------+----------+
                            |
             +--------------v---------------+
             | Link / Anchor Extraction     |
             +--------------+---------------+
                            |
              +-------------v--------------+
              | Incremental Index Builder  |
              | FTS + metadata + signals   |
              +-------------+--------------+
                            |
                    +-------v-------+
                    | Savanna Search|
                    | Query Processor|
                    +-------+-------+
                            |
              +-------------v--------------+
              | Retrieval + Ranking        |
              | relevance/authority/       |
              | freshness/preference       |
              +-------------+--------------+
                            |
          +-----------------v------------------+
          | SERP aggregation: Web/News/Images |
          | Places/other verticals            |
          +-----------------+------------------+
                            |
                    +-------v-------+
                    | Evaluation    |
                    | quality + perf |
                    +---------------+
```

The chapter describes crawler components including downloading, DNS resolution, outgoing-link extraction/filtering, URL queues and scheduling. fileciteturn2file5L278-L320

## Phase plan

### Phase A — Corpus foundation
- Maintain approved seed domains and sitemaps.
- Store canonical URL, title, description, text, language, country/region, timestamps and content hash.
- Extract outgoing links and preserve anchor text.
- Reject unsafe schemes and obviously invalid URLs.
- Detect duplicates before they pollute the live corpus.

The source specifically describes duplicate filtering during link extraction and incremental duplicate detection in content analysis. fileciteturn2file5L315-L320 fileciteturn2file7L381-L385

### Phase B — Incremental indexing
Do not rebuild the entire index for every crawl cycle. The source describes an update manager that identifies new/meaningfully changed pages, creates new index partitions, and marks older records stale. fileciteturn2file8L435-L447

For our small/medium initial deployment, D1 remains the operational metadata/index store. The architecture leaves room for a larger dedicated index service later without changing the public Search API.

### Phase C — Query processing
Implement:
1. Unicode normalization.
2. Case folding.
3. whitespace/token normalization.
4. language hints.
5. intent hints: navigational, informational, news, places, images.
6. safe query length limits.
7. optional spelling/suggestion layer.

The chapter explicitly identifies language/location/time-sensitive/entity classification and case folding, stopword handling and spelling correction as query-processing techniques. fileciteturn2file7L404-L419

### Phase D — Retrieval and ranking
Ranking must not be a single keyword-count score. The source identifies document text, anchor text, URL text, click history, query classification, link citation, link popularity, freshness and preference as ranking signals. fileciteturn2file0L27-L55

Savanna v0.6 introduces an explicit signal model:

- lexical relevance
- title match
- phrase/proximity bonus
- URL match
- anchor-text match
- authority/link score
- freshness
- African geographic relevance
- source quality
- language match
- query intent match
- spam/quality penalty

Clicks are **not** used as a primary ranking signal until privacy-preserving, aggregated telemetry and anti-manipulation controls exist. The source notes click data is useful but noisy and incomplete. fileciteturn2file6L330-L356

### Phase E — Vertical aggregation
The source describes combining ordinary web results with vertical channels such as news, maps, images and videos. fileciteturn2file3L179-L185

Savanna Search will therefore expose a common result contract so Web, News, Images and Places can mature independently while sharing query processing and safety controls.

### Phase F — Evaluation
Quality is a product requirement, not an afterthought. The source discusses precision, recall and NDCG and notes that top-result precision is especially important for web search. fileciteturn2file4L224-L255

Initial evaluation suite:
- Precision@5
- Precision@10
- Recall on curated queries
- NDCG@10
- zero-result rate
- duplicate-result rate
- median/P95 search latency
- freshness lag for news
- unsafe-result detection rate
- language coverage
- African-source coverage

## Ranking policy

Start with a transparent hand-built scoring model. The source notes that manually built ranking can sometimes outperform automatically computed models through fine-grained tuning. fileciteturn2file4L221-L223

Only introduce learning-to-rank after we have a clean, consented/aggregated judgment dataset. The source describes point-wise, pair-wise and list-wise learning-to-rank approaches. fileciteturn2file9L502-L533

## Privacy requirements

- Do not store raw search queries by default.
- Do not build individual behavioral profiles for ranking.
- If anonymous aggregate telemetry is later introduced, retain only the minimum fields needed for quality measurement.
- Never expose crawler/admin tokens to the browser.
- Keep indexing credentials server-side.
- Provide a documented retention policy.

## Scaling path

```text
v0.5  D1 + bounded sitemap crawler
  |
v0.6  link graph + dedupe + explicit ranking + evaluation
  |
v0.7  stronger frontier scheduler + document repository + vertical APIs
  |
v0.8  distributed indexing/search service
  |
v1.x  large corpus + learning-to-rank research
```

The chapter's large-scale architecture uses distributed URL queues, repositories, link management, content analysis and incremental online index updates. Savanna should adopt those concepts progressively rather than prematurely building a global crawler. fileciteturn2file5L278-L318 fileciteturn2file8L440-L483
