# SavannaGuard Browser v0.4.0 — Cloudflare deployment

## Pages/Workers
This package is structured for a Cloudflare Pages-style deployment with static files in `web/` and Pages Functions in `functions/`.

Recommended project settings:
- Production branch: `main`
- Framework preset: None
- Build command: `exit 0`
- Build output directory: `web`

The API routes are:
- `/api/search?q=...`
- `/api/news`

## v0.4 focus
- One centered Savanna Search box; duplicate browser search bar removed.
- Homepage History and Bookmarks removed.
- Search input limited to 240 characters and normalized before sending.
- Client and server validation.
- Safe URL allow-list (`http`/`https`).
- Search/news results rendered with `textContent`, not untrusted HTML.
- Upstream timeout for search.
- Security headers and CSP.
- News refresh target: 15 minutes.
- English + Kiswahili UI.
- Local profiles remain a web-app convenience only; they are not true cookie/session-isolated native browser profiles.
- Password vault is deliberately not implemented in localStorage.

## Important search-engine status
Savanna Search v0.4 is the search **layer and secure interface**, not yet a fully independent crawler/index. The current prototype uses upstream discovery data behind our API. The next major search milestone is our own crawler, index, and ranking pipeline.

## Security boundary
Client-side checks improve UX, but the server-side Function is the security boundary. Do not treat client-side filtering as sufficient protection.

For Cloudflare Workers/Pages deployment, add rate limiting/WAF controls at the Cloudflare layer before public production traffic. Do not store secrets in the client bundle.
