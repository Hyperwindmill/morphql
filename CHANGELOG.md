# Changelog

All notable changes to MorphQL are documented in this file.
All packages share a single version number.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.47] - 2026-11-01

### Fixed
- **cli**, **store**, **playground**: internal `@morphql/*` dependencies now use a matching version range (`^0.1.47`) instead of `*`, so installs no longer resolve stale versions of core/store.

### Security
- Dependencies refreshed and lockfile overrides added to close open Dependabot alerts (dompurify, form-data, multer, lodash-es, js-yaml).
