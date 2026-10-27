/* Savanna Search v0.6 frontier scheduler.
 * This worker intentionally manages a bounded, approved frontier.
 * It does not attempt unrestricted crawling.
 */

function validHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch { return false; }
}

export default {
  async scheduled(event, env, ctx) {
    const seeds = String(env.SAVANNA_SEEDS || "").split(",").map(s => s.trim()).filter(validHttpUrl).slice(0, 100);
    if (!seeds.length) return;
    const now = new Date().toISOString();
    // Frontier records are inserted by the ingest service.
    // This worker intentionally only emits a bounded batch for downstream processing.
    const batch = seeds.map(url => ({ url, discovered_at: now, priority: 10 }));
    if (env.FRONTIER_QUEUE) await env.FRONTIER_QUEUE.sendBatch(batch.map(body => ({ body })));
  }
};
