# SavannaGuard Browser — Netlify Web Edition v0.3.0

This is a working responsive web/PWA browser interface for Netlify testing.

Features:
- Browser-style address/search bar
- Private-search launch using DuckDuckGo/Bing/Google selection
- Africa/world news directory
- OpenStreetMap, OWASP and NIST resources
- Local bookmarks and local history
- Clear local browsing data
- Settings foundation for English/Kiswahili
- PWA service-worker shell
- Basic security headers
- No analytics SDK or advertising SDK

Important: a website hosted on Netlify cannot become a full native browser engine. It cannot freely intercept all network traffic, bypass other sites' iframe policies, or enforce OS-level ad/tracker filtering. This edition therefore opens destinations in the user's normal browser.

The production SavannaGuard application should use a native browser engine and implement network filtering, safe navigation, downloads, permissions, isolation, updates and signed releases.

Netlify deployment: connect the GitHub repository, use the root netlify.toml, and deploy. The publish directory is web.
