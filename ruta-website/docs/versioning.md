# Versioning and release process

## Scheme

[Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) — `MAJOR.MINOR.PATCH`.

The version lives in one place: the `version` field of `package.json`. It is
currently `0.2.0`.

### While below 1.0.0

`0.y.z` means the public surface is still moving. The rule we follow:

| Change | Bump | Example |
| --- | --- | --- |
| Breaking API or data-shape change | **minor** — `0.2.0 → 0.3.0` | renaming `fullName` to `username` |
| New feature, backwards compatible | **minor** — `0.2.0 → 0.3.0` | adding an endpoint |
| Bug fix, no surface change | **patch** — `0.2.0 → 0.2.1` | fixing a validation message |

Breaking changes bump the minor while we are pre-1.0. Once `1.0.0` ships they
bump the major instead, and this table changes.

## Changelog

`CHANGELOG.md` follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

Every user-visible change gets an entry under `## [Unreleased]` in the pull
request that makes it. Entries are grouped under these headings, in this order,
omitting any that are empty:

`Added` · `Changed` · `Deprecated` · `Removed` · `Fixed` · `Security`

Mark anything that breaks a caller with a leading **Breaking** — and say what a
caller has to do about it, not just what changed.

## Cutting a release

1. Rename `## [Unreleased]` to `## [X.Y.Z] — YYYY-MM-DD` and add a fresh
   `## [Unreleased]` above it.
2. Update the `version` field in `package.json` to match.
3. Update the link definitions at the bottom of the changelog.
4. Verify — all three must exit `0`:

   ```bash
   npx tsc --noEmit
   ```

   ```bash
   npx eslint src
   ```

   ```bash
   npx next build
   ```

5. Commit as `chore(release): vX.Y.Z`, then tag:

   ```bash
   git tag -a vX.Y.Z -m "vX.Y.Z"
   ```

6. Push the branch and the tag:

   ```bash
   git push --follow-tags
   ```

Check exit codes individually rather than chaining with `&&` into a pipe — a
pipeline reports only the last command's status, so a failing lint can look
like a pass.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<scope>): <summary>
```

Types in use: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `style`.
Common scopes: `auth`, `ui`, `api`, `release`.

The type maps to the version bump: `feat` implies a minor, `fix` implies a
patch, and a `!` after the scope (`feat(auth)!:`) marks a breaking change.
