# Contributing

How to set up, write and ship changes to RUTA. Read [README.md](./README.md)
first for the stack and folder layout.

---

## Contents

1. [Setup](#setup)
2. [Workflow](#workflow)
3. [Before you push](#before-you-push)
4. [Testing](#testing)
5. [Code conventions](#code-conventions)
6. [Commit messages](#commit-messages)
7. [Versioning](#versioning)
8. [Changelog](#changelog)
9. [Releasing](#releasing)

---

## Setup

Requires Node 20 or newer.

```bash
npm install
```

```bash
npm run dev
```

No environment variables are needed. See
[README § Getting started](./README.md#getting-started).

---

## Workflow

1. Branch from `main`.
2. Make the change, keeping it to one concern.
3. Add a `## [Unreleased]` entry to [CHANGELOG.md](./CHANGELOG.md) in the same
   commit — not afterwards.
4. Run the checks below.
5. Open a pull request.

---

## Before you push

All four must exit `0`:

```bash
npx tsc --noEmit
```

```bash
npx eslint src
```

```bash
npm test
```

```bash
npx next build
```

Check the exit codes **separately**. A pipeline reports only the last command's
status, so `npx eslint src | tail` hides a failure — a real lint error was
missed that way once already:

```bash
npx eslint src; echo $?
```

---

## Testing

[Vitest](https://vitest.dev), running in a Node environment. Tests sit beside
the code they cover as `*.test.ts`.

```bash
npm test
```

```bash
npm run test:watch
```

### What is covered

| Area | File |
| --- | --- |
| Username / email / password rules | `src/lib/validation.test.ts` |
| scrypt hashing, verification, rehash detection | `src/server/auth/password.test.ts` |
| Rate-limit windows and isolation | `src/server/http/rateLimit.test.ts` |
| Register, sign-in, profile, password change, reset | `src/server/services/authService.test.ts` |

### What is not

React components are untested — that would need `jsdom` and Testing Library.
The API routes are untested directly; their logic lives in
`server/services/`, which is covered, and the routes themselves are thin
adapters.

### Writing tests

`server/services/` is the easiest place to test: plain async functions over
domain types with no `req`/`res` to mock. Reset the in-memory store first, since
it lives on `globalThis` and would otherwise leak between tests:

```ts
beforeEach(() => {
  globalThis.__rutaAuthTables = { users: new Map(), sessions: new Map(), passwordResets: new Map() };
});
```

Prefer asserting on behaviour a user would notice — "the old password stops
working" — over asserting on implementation details.

---

## Code conventions

| Rule | Detail |
| --- | --- |
| Components | PascalCase (`TextField.tsx`), one default export each |
| Everything else | camelCase (`authService.ts`, `useSession.ts`) |
| URLs | kebab-case (`/about-us`, never `/about_us`) |
| Pages | `pages/name.tsx` — use a folder only when the route has children |
| Imports | the `@/` alias, never `../../..` |
| Server-only code | must live under `server/` so it cannot reach the browser bundle |
| Browser API calls | go in `features/<feature>/api.ts` — never `fetch` in a component |

Where a new file belongs is tabulated in
[README § Where do I put a new file?](./README.md#where-do-i-put-a-new-file).

### Framework caveat

Next.js 16 has breaking changes that fail **silently**. Check
`node_modules/next/dist/docs/` before relying on an API — `images.qualities`,
for example, now defaults to `[75]` and quietly coerces any other `quality`
prop to the nearest allowed value. See [AGENTS.md](./AGENTS.md).

---

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<scope>): <summary>
```

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `style`.
Scopes in use: `auth`, `ui`, `api`, `release`.

Mark a breaking change with `!` after the scope and a footer:

```
feat(auth)!: require explicit sign-in after registration

BREAKING CHANGE: registration no longer returns a session.
```

---

## Versioning

[Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) —
`MAJOR.MINOR.PATCH`, held in the `version` field of `package.json`.

### While below 1.0.0

| Change | Bump | Example |
| --- | --- | --- |
| Breaking API or data-shape change | **minor** — `0.2.0 → 0.3.0` | renaming `fullName` to `username` |
| New feature, backwards compatible | **minor** — `0.2.0 → 0.3.0` | adding an endpoint |
| Bug fix, no surface change | **patch** — `0.2.0 → 0.2.1` | fixing a validation message |

Breaking changes bump the *minor* while pre-1.0. Once `1.0.0` ships they bump
the major instead, and this table changes.

The commit type maps to the bump: `feat` implies a minor, `fix` a patch.

---

## Changelog

[CHANGELOG.md](./CHANGELOG.md) follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

Every user-visible change gets an entry under `## [Unreleased]` in the pull
request that makes it, grouped under these headings in this order, omitting any
that are empty:

`Added` · `Changed` · `Deprecated` · `Removed` · `Fixed` · `Security`

Prefix anything that breaks a caller with **Breaking**, and say what they have
to do about it — not just what changed.

---

## Releasing

1. Rename `## [Unreleased]` to `## [X.Y.Z] — YYYY-MM-DD`, and add a fresh
   `## [Unreleased]` above it.
2. Set the matching `version` in `package.json`.
3. Update the link definitions at the bottom of the changelog.
4. Run everything under [Before you push](#before-you-push).
5. Commit and tag:

   ```bash
   git commit -am "chore(release): vX.Y.Z"
   ```

   ```bash
   git tag -a vX.Y.Z -m "vX.Y.Z"
   ```

6. Push the branch and the tag:

   ```bash
   git push --follow-tags
   ```
