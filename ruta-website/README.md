# RUTA · SakayMetrics

A transit companion for Metro Manila commuters — route planning, live incident
reporting and a commuter guide. Built for the 6SEven capstone project.

Current version: **0.2.0** — see [CHANGELOG.md](./CHANGELOG.md)

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Getting started](#getting-started)
3. [Scripts](#scripts)
4. [Folder guide](#folder-guide)
5. [Where do I put a new file?](#where-do-i-put-a-new-file)
6. [Routes](#routes)
7. [API endpoints](#api-endpoints)
8. [Conventions](#conventions)
9. [Further reading](#further-reading)

---

## Tech stack

| Layer | Choice | Version | Notes |
| --- | --- | --- | --- |
| Language | **TypeScript** | 5.9.3 | `strict: true`. No `.js` source files. |
| Framework | **Next.js** | 16.2.10 | **Pages Router**, not App Router. |
| UI library | **React** | 19.2.4 | React Compiler enabled in `next.config.ts`. |
| Styling | **Tailwind CSS** | 4.3.3 | v4 — configured in CSS via `@theme`, no `tailwind.config.js`. |
| Linting | **ESLint** | 9.39.5 | Flat config, `eslint-config-next`. |
| Runtime | **Node.js** | 22.15.0 | Node 20+ required. |

### Languages used

- **TypeScript / TSX** — all application code
- **CSS** — one stylesheet, `src/styles/globals.css` (Tailwind import, theme tokens, base layer)
- **No JavaScript source files** — only config (`eslint.config.mjs`, `postcss.config.mjs`)
- **No SQL yet** — there is no database (see below)

### Dependencies

Runtime dependencies are **only** `next`, `react` and `react-dom`. Authentication
is built on Node's standard library — no `bcrypt`, `next-auth`, `jsonwebtoken`
or ORM. [docs/auth.md](./docs/auth.md) explains which `node:crypto` primitive
replaces each library you would normally install.

### Data

There is **no database yet**. Users, sessions and password-reset tokens live in
process memory (`src/server/store/authStore.ts`) and are lost when the server
restarts. Neon (Postgres) with Prisma is planned; every store function is
already `async`, so only that one file changes.

---

## Getting started

Requires Node 20 or newer.

```bash
npm install
```

```bash
npm run dev
```

Open <http://localhost:3000> — it redirects to `/home`.

No environment variables are required. `NODE_ENV`, which Next sets itself, is
the only variable the app reads.

> **"Another next dev server is already running"** means a previous server still
> holds the port. Stop it using the PID printed in that message:
> `taskkill /PID <pid> /F` on Windows.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build (run `build` first) |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type-check without emitting files |

Check exit codes separately rather than chaining with `&&` into a pipe — a
pipeline reports only the last command's status, so a failing lint can look
like a pass:

```bash
npx tsc --noEmit; echo $?
```

---

## Folder guide

Everything lives under `src/`. The `@/` alias maps to `src/`, so `@/lib/http`
means `src/lib/http.ts`.

```
src/
├── pages/          ROUTES. File path = URL. Keep these thin.
│   ├── _app.tsx        wraps every page: font, SessionProvider, layout
│   ├── _document.tsx   the HTML shell
│   ├── api/auth/       API endpoints (HTTP adapters only)
│   └── *.tsx           one file per page
│
├── server/         SERVER-ONLY. Never imported by a component.
│   ├── services/       business logic — plain async functions, no req/res
│   ├── store/          data access (in-memory today, database later)
│   ├── auth/           passwords, sessions, cookies, guest identities
│   ├── http/           request helpers, error mapping, rate limiting
│   └── errors.ts       typed domain errors
│
├── features/       FEATURE CODE. Grouped by domain, not by file type.
│   └── <feature>/
│       ├── api.ts          every browser API call this feature makes
│       └── components/     UI used only by this feature
│
├── components/     SHARED UI. Reusable across features.
│   ├── ui/             TextField · Checkbox · Alert · PrimaryButton · LabeledDivider
│   ├── icons/          inline SVG icons, exported from the Figma file
│   ├── brand/          RutaLogo
│   ├── navigation/     Navbar
│   └── PageMeta.tsx    per-page <title> and social tags
│
├── layouts/        PAGE CHROME. AppShell (site nav) · AuthLayout (slim)
├── providers/      REACT CONTEXT. SessionProvider
├── hooks/          SHARED HOOKS. useSession
├── lib/            SHARED HELPERS used by browser AND server
├── types/          SHARED TYPES. session.ts · page.ts
├── styles/         globals.css — the only stylesheet
└── assets/         images and brand marks imported by components
```

### The rule that explains the layout

**Server-only code lives in `server/`.** Anything a component imports can end up
in the browser bundle, so password hashing, session tokens and the data store
stay behind `server/` and are reached only through `pages/api/`.

### Why the API lives in `pages/api/`

In the Pages Router the file path *is* the URL — move `pages/api/auth/login.ts`
and the endpoint stops existing. So the route file is a **thin HTTP adapter**
(method guard, rate limit, parse body, map errors to status codes) and delegates
the real work to `server/services/`. About 80% of backend code sits outside
`pages/` for this reason.

---

## Where do I put a new file?

| I'm adding… | Put it in | Example |
| --- | --- | --- |
| A page | `pages/<name>.tsx` | `pages/fares.tsx` → `/fares` |
| An API endpoint | `pages/api/<area>/<name>.ts` | `pages/api/routes/search.ts` |
| Logic for that endpoint | `server/services/` | `server/services/routeService.ts` |
| A component used by one feature | `features/<feature>/components/` | `features/routes/components/FareTable.tsx` |
| A component used by 2+ features | `components/ui/` | `components/ui/Badge.tsx` |
| A browser call to your API | `features/<feature>/api.ts` | `searchRoutes()` |
| A helper for browser **and** server | `lib/` | `lib/formatDistance.ts` |
| A helper for the server only | `server/` | `server/http/…` |
| A type shared client ↔ server | `types/` | `types/route.ts` |

**Never call `fetch` directly in a component.** Add a function to that feature's
`api.ts`, which goes through `lib/http.ts` so credentials, JSON headers and
error handling stay consistent.

---

## Routes

### Pages

| URL | File | Layout | Description |
| --- | --- | --- | --- |
| `/` | — | — | Redirects to `/home` |
| `/home` | `pages/home.tsx` | AppShell | Landing page |
| `/dashboard` | `pages/dashboard/index.tsx` | AppShell | Incident overview and live feed |
| `/dashboard/profile` | `pages/dashboard/profile.tsx` | AppShell | Account details, commute preferences |
| `/dashboard/settings` | `pages/dashboard/settings.tsx` | AppShell | Display and privacy settings |
| `/routes` | `pages/routes.tsx` | AppShell | Route finder and map |
| `/commuter-guide` | `pages/commuter-guide.tsx` | AppShell | Fares, tips, how-to |
| `/about-us` | `pages/about-us.tsx` | AppShell | Team |
| `/auth/login` | `pages/auth/login.tsx` | AuthLayout | Sign in |
| `/auth/register` | `pages/auth/register.tsx` | AuthLayout | Create account |
| `/auth/forgot-password` | `pages/auth/forgot-password.tsx` | AuthLayout | Request a reset link |

### Redirects

Configured in `next.config.ts`:

| From | To | Type |
| --- | --- | --- |
| `/` | `/home` | 307 temporary |
| `/about_us` | `/about-us` | 308 permanent |
| `/commuter_guide` | `/commuter-guide` | 308 permanent |

The last two exist because routes were snake_case before v0.2.0.

### Layouts

Pages get `AppShell` (full site navigation) by default. A page opts out by
exporting `getLayout` — the auth screens use this to render `AuthLayout`, which
has only a "Back to Home" link:

```tsx
const LoginPage: NextPageWithLayout = () => <LoginForm />;
LoginPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
```

---

## API endpoints

All under `/api/auth/`. Errors are always `{ "error": "message" }`.

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/auth/session` | any | Who am I? Issues a guest session if there is no cookie |
| `POST` | `/api/auth/register` | any | Create an account. Does **not** sign in |
| `POST` | `/api/auth/login` | any | Sign in |
| `POST` | `/api/auth/logout` | any | Sign out, and hand back a fresh guest session |
| `GET` | `/api/auth/profile` | any | Same payload as `/session` |
| `PATCH` | `/api/auth/profile` | signed in | Save username / email |
| `POST` | `/api/auth/change-password` | signed in | Requires the current password |
| `POST` | `/api/auth/forgot-password` | any | Create a reset token |
| `POST` | `/api/auth/reset-password` | any | Consume the token, set a new password |
| `GET` | `/api/auth/users` | dev only | Debug listing — 404 in production |

Rate limits and the session-payload shape are in [docs/auth.md](./docs/auth.md).

### How a request flows

```
browser
 └─ features/<feature>/api.ts     typed call, e.g. login({ email, password })
     └─ lib/http.ts               fetch + credentials + ApiError
         └─ pages/api/…           HTTP: method, rate limit, parse, status codes
             └─ server/services/  business logic, throws domain errors
                 └─ server/store/ data access
```

---

## Conventions

- **Components** are PascalCase (`TextField.tsx`), one default export each.
- **Everything else** is camelCase (`authService.ts`, `useSession.ts`).
- **URLs** are kebab-case (`/about-us`, never `/about_us`).
- **Pages** are `pages/name.tsx`, not `pages/name/index.tsx` — use a folder only
  when the route genuinely has children, as `dashboard/` does.
- **Imports** use the `@/` alias, never `../../..`.
- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org/) —
  see [docs/versioning.md](./docs/versioning.md).

### Testing

There is **no test suite yet**, and this is the largest known gap.
`server/services/` is written to be testable — plain functions over domain
types, with no `req`/`res` to mock — so that is where to start.

---

## Further reading

| Document | Covers |
| --- | --- |
| [docs/auth.md](./docs/auth.md) | Hashing, sessions, cookies, guest identities, rate limits, full API reference |
| [docs/versioning.md](./docs/versioning.md) | SemVer rules, release process, commit format |
| [CHANGELOG.md](./CHANGELOG.md) | What changed in each version |
| [AGENTS.md](./AGENTS.md) | Note for AI coding assistants |
