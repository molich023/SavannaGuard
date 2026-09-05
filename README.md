# 🛡️ SavannaGuard Browser

**SavannaGuard** is an open-source, privacy-first browser prototype focused on user control, African-first information discovery, secure browsing, and transparent security engineering.

> **v0.2.0 — GitHub-ready prototype**
>
> This is not yet a production-grade browser engine and does not claim absolute anonymity or perfect protection.

## Goals
- Privacy-first browsing and data minimisation
- Tracking/common advertising-domain protection
- African-first and world-news discovery
- Independent search architecture with optional AI assistance
- Open mapping
- English and Kiswahili UI
- No behavioural advertising
- Local-first preferences
- OWASP/NIST-informed security engineering

## Security posture
The prototype uses Electron isolation features, including context isolation, sandboxing, disabled renderer Node integration, restrictive permissions, security headers, external-navigation controls, and prototype tracker-domain blocking.

A production browser still requires hardened process architecture, robust filtering, permission isolation, safe download handling, signed updates, reproducible builds, SBOMs, fuzzing, dependency governance, and independent security review.

## Structure
```text
SavannaGuard/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/security.yml
│   ├── CODEOWNERS
│   └── pull_request_template.md
├── docs/
│   ├── CODE_OF_CONDUCT.md
│   ├── CONTRIBUTING.md
│   ├── PRIVACY.md
│   ├── SECURITY.md
│   └── TERMS.md
├── src/
├── .gitattributes
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

## Roadmap
**v0.3:** controlled/self-hosted news service, stronger navigation/permission policy, download safety, improved content filtering, search-provider abstraction.

**v0.4:** stronger storage isolation, anti-fingerprinting work, signed releases, SBOM generation, expanded security regression testing.

**v1.0:** independent security assessment, reproducible builds, release signing, fuzzing, production threat-model review, stable distribution.

## Contributing
See [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md).

## Security
See [`docs/SECURITY.md`](docs/SECURITY.md). Never publish undisclosed vulnerabilities in public issues.

## Licence
Mozilla Public License 2.0.

## Independence
SavannaGuard is an independent project and is not affiliated with Google, Mozilla, Microsoft, Apple, Cloudflare, OpenAI, OWASP, NIST, or OpenStreetMap.

The name “SavannaGuard” is a project name; this repository does not represent trademark registration or legal trademark clearance.
