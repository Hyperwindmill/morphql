# Security Policy

## Supported Versions

Only the latest released version receives security fixes.

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Use GitHub's [Private Vulnerability Reporting](https://github.com/Hyperwindmill/morphql/security/advisories/new) feature instead. This ensures the issue is handled confidentially before any public disclosure.

**What to include:**

- A clear description of the vulnerability
- Steps to reproduce or a proof-of-concept
- Affected package(s) and version(s)
- Potential impact

## Scope

MorphQL compiles transformation queries into JavaScript functions via `new Function()`. The `unsafe` mode is intentionally permissive and allows broader expression evaluation — this is by design, not a bug.

Deployments that process untrusted user input are the responsibility of the integrator. If you are running `@morphql/server` or embedding the engine in a multi-tenant context, ensure that appropriate input validation and sandboxing are in place at the application level.
Using trusted input is strongly recommended (staged queries/integrated queries)