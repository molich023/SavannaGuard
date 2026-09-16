# SavannaGuard Browser v0.3.2

Cloudflare Pages-ready web edition.

## Pages settings
- Production branch: `main`
- Framework preset: None
- Build command: `exit 0`
- Build output directory: `web`

## Functions
The `/functions` directory provides `/api/search` and `/api/news` routes. Cloudflare Pages Functions can execute these routes on the Cloudflare network.

## Current privacy model
- Profiles, history and bookmarks are stored locally in the browser.
- No password is uploaded by this prototype.
- Password-vault UI is intentionally deferred until a native secure-keystore implementation.
- Do not treat browser localStorage as a password manager for production secrets.

## Turnstile
The CSP is prepared for Cloudflare Turnstile. Before enabling it, create a Turnstile widget and validate tokens server-side. Use it for login/signup and abuse-sensitive actions rather than forcing a challenge on every ordinary page refresh.
