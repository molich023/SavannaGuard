#!/usr/bin/env python3
"""Evaluate a saved Savanna Search result set against graded judgments.

Input judgments JSON:
{"query": {"doc_id": 3, "url": 2, ...}}
Input results JSONL:
{"query":"...","results":[{"id":"doc_id"}, ...]}
"""
import json, math, sys

def dcg(vals):
    return sum((2**v - 1) / math.log2(i + 2) for i, v in enumerate(vals))

def main(judgments_path, results_path):
    judgments = json.load(open(judgments_path, encoding="utf-8"))
    rows = [json.loads(x) for x in open(results_path, encoding="utf-8") if x.strip()]
    p5=[]; p10=[]; ndcg10=[]
    for row in rows:
        q = row["query"]
        rel = judgments.get(q, {})
        ranked = [int(rel.get(str(r.get("id")), 0)) for r in row.get("results", [])]
        p5.append(sum(v > 0 for v in ranked[:5]) / max(1, min(5, len(ranked))))
        p10.append(sum(v > 0 for v in ranked[:10]) / max(1, min(10, len(ranked))))
        got = dcg(ranked[:10])
        ideal = dcg(sorted(rel.values(), reverse=True)[:10])
        ndcg10.append(got / ideal if ideal else 0)
    print(json.dumps({"queries": len(rows), "precision_at_5": sum(p5)/len(p5) if p5 else 0,
                      "precision_at_10": sum(p10)/len(p10) if p10 else 0,
                      "ndcg_at_10": sum(ndcg10)/len(ndcg10) if ndcg10 else 0}, indent=2))

if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("usage: evaluate_search.py judgments.json results.jsonl")
    main(*sys.argv[1:])
