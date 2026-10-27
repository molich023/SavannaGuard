const AFRICA_TERMS = [
  "africa", "kenya", "uganda", "tanzania", "rwanda", "burundi", "ethiopia",
  "somalia", "ghana", "nigeria", "senegal", "south africa", "zambia", "zimbabwe",
  "malawi", "mozambique", "namibia", "botswana", "lesotho", "eswatini", "cameroon",
  "ivory coast", "cote d'ivoire", "drc", "congo", "sudan", "south sudan", "tunisia",
  "algeria", "morocco", "egypt", "libya", "sierra leone", "liberia", "mali", "niger",
  "burkina faso", "benin", "togo", "gabon", "angola", "madagascar", "mauritius"
];

function tokens(q) {
  return [...new Set(q.toLocaleLowerCase().normalize("NFKC").match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || [])].slice(0, 16);
}
function countTerms(text, ts) {
  const s = String(text || "").toLocaleLowerCase();
  return ts.reduce((n, t) => n + (s.includes(t) ? 1 : 0), 0);
}
function freshness(published) {
  const t = Date.parse(published || "");
  if (!Number.isFinite(t)) return 0;
  const age = Math.max(0, (Date.now() - t) / 86400000);
  return Math.max(0, 5 - Math.min(5, age / 2));
}

export function scoreDocument(doc, query, options = {}) {
  const ts = tokens(query);
  const title = doc.title || "";
  const body = `${doc.description || ""} ${doc.content || ""}`;
  const url = doc.url || "";
  const anchor = doc.anchor_text || "";
  const all = `${title} ${body} ${url} ${anchor}`.toLocaleLowerCase();

  let score = 0;
  score += countTerms(title, ts) * 8;
  score += countTerms(body, ts) * 2;
  score += countTerms(url, ts) * 3;
  score += countTerms(anchor, ts) * 4;

  const phrase = query.trim().toLocaleLowerCase();
  if (phrase.length >= 3 && all.includes(phrase)) score += 7;

  const africa = AFRICA_TERMS.some(x => all.includes(x));
  if (africa) score += options.africaBoost ?? 3;
  score += Number(doc.authority_score || 0);
  score += Number(doc.source_quality || 0);
  score += freshness(doc.published_at);
  score -= Number(doc.spam_score || 0);

  if (options.language && doc.language && doc.language === options.language) score += 3;
  if (options.intent === "news") score += doc.source_type === "news" ? 5 : 0;

  return score;
}
