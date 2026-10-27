// 
/**
 * Savanna Search — bounded sitemap crawler.
 * Deploy as a separate Cloudflare Worker with a Cron trigger.
 */

const MAX_URLS = 40;
const MAX_BYTES = 250_000;
const MAX_SEEDS = 10;
const USER_AGENT = "SavannaSearchBot/0.5";

function http(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol)
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function text(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12_000);
}

function title(html) {
  const match = html.match(
    /<title[^>]*>([\s\S]*?)<\/title>/i
  );

  return match ? text(match[1]).slice(0, 300) : "";
}

function locs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((match) => http(match[1].trim()))
    .filter(Boolean)
    .slice(0, MAX_URLS);
}

async function allowed(url) {
  try {
    const parsed = new URL(url);
    const response = await fetch(
      `${parsed.origin}/robots.txt`,
      {
        headers: { "user-agent": USER_AGENT },
      }
    );

    // Fail closed when robots.txt cannot be checked.
    if (!response.ok) return false;

    const rules = await response.text();
    const wildcardSection = rules
      .split(/^\s*user-agent:\s*/im)
      .find((section) => section.trim().startsWith("*"));

    if (!wildcardSection) return true;

    return !/^\s*disallow:\s*\/\s*$/im.test(
      wildcardSection
    );
  } catch {
    return false;
  }
}

export default {
  async scheduled(_event, env) {
    if (
      !env.SAVANNA_SEEDS ||
      !env.INGEST_URL ||
      !env.SEARCH_ADMIN_TOKEN
    ) {
      console.error("Crawler configuration is incomplete.");
      return;
    }

    const seeds = env.SAVANNA_SEEDS
      .split(",")
      .map((seed) => http(seed.trim()))
      .filter(Boolean)
      .slice(0, MAX_SEEDS);

    const documents = [];
    const visited = new Set();

    for (const seed of seeds) {
      if (documents.length >= MAX_URLS) break;
      if (!(await allowed(seed))) continue;

      try {
        const sitemapResponse = await fetch(seed, {
          headers: { "user-agent": USER_AGENT },
        });

        if (!sitemapResponse.ok) continue;

        const sitemap = (
          await sitemapResponse.text()
        ).slice(0, 1_000_000);

        for (const url of locs(sitemap)) {
          if (documents.length >= MAX_URLS) break;
          if (visited.has(url)) continue;

          visited.add(url);

          if (!(await allowed(url))) continue;

          try {
            const response = await fetch(url, {
              headers: { "user-agent": USER_AGENT },
            });

            if (!response.ok) continue;

            const contentType =
              response.headers.get("content-type") || "";

            if (!contentType.includes("text/html")) continue;

            const html = (
              await response.text()
            ).slice(0, MAX_BYTES);

            const body = text(html);

            documents.push({
              url,
              title: title(html) || url,
              description: body.slice(0, 700),
              content: body,
              source_type: "web",
            });
          } catch (error) {
            console.error(
              "Page fetch failed:",
              error instanceof Error ? error.message : "Unknown error"
            );
          }
        }
      } catch (error) {
        console.error(
          "Sitemap fetch failed:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }

    if (documents.length === 0) {
      console.log("Crawler finished: no documents collected.");
      return;
    }

    const ingestUrl = http(env.INGEST_URL);

    if (!ingestUrl) {
      console.error("INGEST_URL must be a valid HTTP(S) URL.");
      return;
    }

    try {
      const response = await fetch(ingestUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${env.SEARCH_ADMIN_TOKEN}`,
        },
        body: JSON.stringify({ documents }),
      });

      if (!response.ok) {
        console.error(
          "Ingestion failed with HTTP status:",
          response.status
        );
        return;
      }

      console.log(
        `Crawler finished: submitted ${documents.length} documents.`
      );
    } catch (error) {
      console.error(
        "Ingestion request failed:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  },
};
