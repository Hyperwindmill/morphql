---
name: release
description: Cut a MorphQL release - write the CHANGELOG.md entry from the commits since the last tag, sync versions across all packages, commit, tag and push. Run only when the user asks for a release.
argument-hint: "[version, e.g. 0.1.47 — defaults to next patch]"
disable-model-invocation: true
---

# Release

Cuts the release end to end. Pushing the `v*` tag triggers `publish.yml` (npm, PHP, PyPI —
not reversible) and `build-extensions.yml` (draft GitHub release, whose body is the
CHANGELOG section for that version).

## 1. Preconditions

- Branch is `main` and the working tree is clean (`git status`). Otherwise stop and say why.
- `git fetch --tags origin`: local `main` must be level with `origin/main`
  (`git rev-list --left-right --count main...origin/main` gives `0 0`). Otherwise stop — the
  user pushes and pulls from GitHub Desktop, let them reconcile.
- Take the last tag: `git describe --tags --abbrev=0 --match 'v*'`.

## 2. Version

Use `$ARGUMENTS` if given (without the `v`), otherwise bump the patch of the last tag.
If the commits contain breaking changes or new features, propose a minor bump instead and ask.

## 3. Draft the changelog entry

Read the commits: `git log --no-merges --format='%h %s%n%b' <last-tag>..HEAD`.
Open the diff of any commit whose subject does not explain the user-visible effect.

Write a section in this shape, inserted right after the file header and above the previous
release:

```markdown
## [0.1.47] - YYYY-MM-DD

### Added
- **store**: `SELECT` supports bare column names.

### Fixed
- **core**: ...
```

Rules:
- Sections, in this order, only when non-empty: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
- One bullet per user-visible change, prefixed with the package in bold (`core`, `store`, `cli`, `server`, `playground`, `vscode`, `jetbrains`, `php`, `python`, `n8n`). Write what changed for the user, not the commit subject.
- Skip pure noise: version bumps, CI tweaks, refactors with no visible effect. Dependency updates that close security alerts go under `Security` as a single bullet.
- Date is today. The heading must be exactly `## [X.Y.Z]` — CI looks it up by that string.

Show the version and the drafted section to the user and wait for approval before writing
anything else. Say that approving means the release gets published: this is the only
confirmation step, everything after it runs straight through.

## 4. Sync versions

```bash
node scripts/sync-versions.js X.Y.Z
npm install --package-lock-only
```

Check `git status`: expect the root and every `packages/*/package.json`, `package-lock.json`,
`build.gradle.kts`, `cli/src/index.ts`, `Playground.tsx`, `pyproject.toml`,
`MorphQLTransform.ts`, `CHANGELOG.md`. Anything else is unexpected — stop and report.

## 5. Commit, tag, push

```bash
git commit -am "chore(release): vX.Y.Z"   # plus the usual attribution trailer
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin main
git push origin vX.Y.Z
```

Push `main` before the tag: `publish.yml` checks the tagged commit is already on
`origin/main` and refuses to publish otherwise. If either push fails, stop and report —
never force-push, never move or recreate a tag.

Finish with the links to the Actions runs (`https://github.com/Hyperwindmill/morphql/actions`)
and remind the user the GitHub release is a draft to publish by hand.
