---
description: how to synchronize versions across the monorepo
---

To synchronize all project versions (including IDE extensions and internal dependencies):

1. Update the version in the root `package.json`.
2. Run the sync script:

// turbo

```bash
node scripts/sync-versions.js
```

Alternatively, you can pass a specific version directly:

```bash
node scripts/sync-versions.js 0.1.7
```

This script will update:

- `package.json` in all `packages/*`
- Internal `@morphql/*` dependencies in those files
- `build.gradle.kts` in `packages/jetbrains-extension`
- `index.ts` in packages/cli/src