const MAX_QUERY = 240;

export function normalizeQuery(input) {
  return String(input || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, MAX_QUERY);
}

export function classifyQuery(query) {
  const q = query.toLocaleLowerCase();
  const news = /\b(latest|today|news|breaking|habari|leo|sasa)\b/.test(q);
  const places = /\b(near|nearby|map|maps|where|location|karibu|wapi)\b/.test(q);
  const images = /\b(image|images|photo|photos|picture|picha)\b/.test(q);
  const navigational = /\.(com|org|net|ke|tz|ug|za)\b/.test(q) || /\b(login|official website)\b/.test(q);
  return {
    intent: news ? "news" : places ? "places" : images ? "images" : navigational ? "navigational" : "informational",
    language: /\b(na|ya|wa|kwa|habari|wapi|leo|karibu)\b/.test(q) ? "sw" : "und"
  };
}
