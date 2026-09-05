# Security Policy

## Supported versions

| Version | Security support |
|---|---|
| 0.2.x | Development support |
| < 0.2 | Not supported |

## Reporting a vulnerability

**Do not post undisclosed vulnerabilities in public GitHub issues.**

Use GitHub's private security reporting mechanism when enabled, or contact the maintainers through the security contact published in the repository profile.

A useful report includes the affected version/commit, component, description, reproducible steps, impact, and suggested mitigation.

## Security baseline

SavannaGuard's engineering goals are informed by OWASP secure-development principles, OWASP ASVS/MASVS concepts where applicable, NIST Secure Software Development Framework concepts, secure Electron deployment guidance, and software supply-chain security practices.

## Security gates

The project intends to maintain dependency auditing, secret scanning, static analysis, dependency review, code scanning, SBOM generation, signed releases, reproducible-build work, security regression tests, fuzzing for security-critical parsers, and independent security review before production claims.

## Threat-model priorities

1. Remote-code execution
2. Navigation/origin confusion
3. Renderer-to-main privilege escalation
4. Unsafe external protocols
5. Malicious downloads
6. Web-permission abuse
7. Tracking/fingerprinting
8. Supply-chain compromise
9. Update-channel compromise
10. Local data leakage

No browser can guarantee perfect security, privacy, or anonymity.
