# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

While the version stays below `1.0.0`, the public surface is not considered
stable: breaking changes bump the **minor** number rather than the major one.

## [Unreleased]

### Added

- **Postgres persistence.** Accounts are now stored in Neon via Prisma 7, so a
  registered user survives a server restart. Verified end to end: registered an
  account, killed the server, restarted, and signed in with the same id.
  - `prisma/schema.prisma` — `User` model. `email` carries a unique index, so a
    duplicate is rejected by the database rather than by a check that could race.
  - `src/server/db/prisma.ts` — client singleton pinned to `globalThis`, so hot
    reload cannot open a new connection pool on every edit.
  - `src/server/store/userStore.ts` — the only module that touches `prisma.user`.
    It maps rows to a plain `UserRecord`, so nothing above it imports a Prisma type.
  - `docs/database.md`, `.env.example`.
- `postinstall` script running `prisma generate`. The client is generated code
  and gitignored, so without this a fresh clone fails with
  `Cannot find module '@/generated/prisma/client'`.
- Team onboarding and troubleshooting sections in `docs/database.md` — shared
  database vs a Neon branch per developer, when migrations are needed, and the
  five errors people actually hit.
- `src/server/testing/prismaDouble.ts` — an in-memory stand-in for `prisma.user`
  so unit tests stay fast and offline. It reproduces `P2002` (duplicate email)
  and `P2025` (missing row), the two codes the store actually branches on.
- **Test suite** — Vitest, 80 tests over the security-critical server logic:
  validation rules, scrypt hashing, rate-limit windows, and the auth service
  (registration, sign-in, profile, password change, reset). Verified by
  mutation: breaking password verification fails 8 tests, disabling the rate
  limiter fails 3, allowing spaces in usernames fails 6. Run with `npm test`.
  `vitest` is the project's first devDependency addition; runtime dependencies
  are still only `next`, `react` and `react-dom`.

- **Landing page rebuilt** from the Figma "Landing Page" frame: photo hero with
  a route planner, a four-metric status strip, "Your Frequent Rides", and the
  live-traffic section. Split into `HeroSearch`, `RoutePlannerCard`,
  `StatStrip`, `FrequentRides`/`RideCard` and `LiveTraffic`, all driven by
  `features/home/content.ts` so each section is one loop rather than repeated
  markup.
- `AccountMenu` — the navigation's account control and the only entry point to
  the auth screens. Signed out it reads **Sign In** over the guest identity;
  signed in it shows the **username**.
- `components/ui/Badge.tsx` and `components/ui/Avatar.tsx` — the design repeats
  the pill shape eight times and the avatar in three places.
- Photography of the actual locations each card names — BGC skyline, UP
  Diliman, SM Mall of Asia, Makati — from Wikimedia Commons, plus a generated
  map graphic and default avatar. Credited in [docs/attribution.md](./docs/attribution.md),
  which the CC BY-SA licence requires.

### Changed

- `authStore.ts` split along its real seam: `userStore.ts` (Postgres) and
  `sessionStore.ts` (memory). Only import lines changed in `authService`, the
  API routes and the session module — every signature stayed the same, which is
  why all 80 tests still pass untouched.
- `.gitignore` keeps `.env` ignored but now tracks `.env.example`.
- Navigation items moved to the **left**, beside the wordmark, with Help Center
  and the account control on the right — matching the design. Item labels and
  routes are unchanged. The active route is now highlighted.
- The route planner submits to `/routes?from=…&to=…` instead of doing nothing.
- Landing typography scaled down roughly 20% across the page so the hero no
  longer dwarfs the sections beneath it.
- **Folder structure.** `services/` and `utils/` are gone. Route handlers moved
  into `pages/api/auth/*` (the handler *is* the route), shared helpers into
  `lib/`, and everything server-only lives under `server/`.
- `/` now redirects to `/home` instead of rendering a second copy of the
  landing page.
- Renamed `aboutUs.tsx` → `AboutUs.tsx` and `commute_guide.tsx` →
  `CommuterGuide.tsx` to match the PascalCase convention.
- **Documentation restructured** to the conventional layout: `docs/versioning.md`
  became `CONTRIBUTING.md` at the repository root, and the README's duplicated
  API table and conventions list now live solely in `docs/auth.md` and
  `CONTRIBUTING.md`. `README.md` replaced the untouched `create-next-app`
  boilerplate, which still referenced a deleted `pages/index.tsx`.
- **Routes are kebab-case**: `/about_us` → `/about-us`, `/commuter_guide` →
  `/commuter-guide`. Permanent redirects keep old links working.
- Flattened nine `pages/<name>/index.tsx` files to `pages/<name>.tsx`. Only
  `dashboard/` stays a folder, because it actually has child routes.

### Removed

- `components/ui/Button.tsx` and `components/ui/Panel.tsx` — both only spread
  props onto a `<button>`/`<div>`, so call sites use the elements directly.
- `components/ui/FormField.tsx` — superseded by `TextField`, which the profile
  and route screens now share with the auth forms.
- `pages/index.tsx` — replaced by the redirect above.
- Six hand-rolled `fetch` blocks in components, now handled by the feature API
  modules.

### Fixed

- Stat cards were being clipped by the hero they overlap — the strip now sets
  `relative z-10` and the hero reserves bottom padding for it.
- **Blurry hero.** The photo was 1600px wide being upscaled to the full
  viewport. Re-fetched at 2560px, and every `fill` image now declares `sizes`
  so Next serves a source matched to its rendered box instead of guessing.
- **`quality` was silently ignored.** Next 16 changed `images.qualities` to
  default to `[75]` and coerce anything else to the nearest allowed value, so
  the hero's `quality={85}` was being downgraded without any warning.
  `next.config.ts` now declares `qualities: [75, 85]`.

- **Service layer** — `src/server/services/authService.ts` holds the auth
  business logic as plain async functions over domain types, with no `req`/`res`
  anywhere. The API routes are now thin adapters: method guard, rate limit,
  parse, call the service, map the error. Handlers dropped from 415 to 291
  lines and the logic became unit-testable without mocking HTTP.
- `src/server/errors.ts` — typed domain errors (`ValidationError`,
  `DuplicateEmailError`, `InvalidCredentialsError`, `NotFoundError`) and a
  single `handleError` in `respond.ts` that maps them to status codes, instead
  of each handler repeating the mapping.
- **Rate limiting** on `login`, `register`, `forgot-password`, `reset-password`
  and `change-password` (`src/server/http/rateLimit.ts`). Login is capped at 10
  attempts per 15 minutes, scoped by IP **and** email, and answers `429` with a
  `Retry-After` header. Counters are in-process; a multi-instance deployment
  needs a shared store, and only that one file changes.
- `PageMeta` — every page now sets a `<title>`, description and Open Graph tags.
  The app previously rendered no `<title>` at all.
- `features/auth/api.ts` and `features/account/api.ts` — all browser API calls
  for a feature in one module.
- `lib/http.ts` gained `getJson`/`postJson`/`patchJson` and an `ApiError`
  carrying the HTTP status.
- **Inter was never applied.** `next/font` defined `--font-inter`, but nothing
  mapped it to Tailwind's `--font-sans`, so every screen rendered in the system
  font stack while the webfont was downloaded and ignored. `globals.css` now
  wires it through an `@theme` block.
- Added base styles: a single `:focus-visible` ring, font smoothing, and a
  `prefers-reduced-motion` guard for the transitions used throughout the UI.

### Notes

- **Sessions are still in memory.** Accounts persist; sessions do not, so a
  restart signs everyone out. Moving them to Postgres is a follow-up and would
  not touch any call site.
- Prisma 7 differs from most tutorials: the connection URL lives in
  `prisma.config.ts` rather than the schema, a driver adapter is required, and
  the generated model type is `UserModel`.

## [0.2.0] — 2026-07-27

Login and sign-up rebuilt against the RUTA Figma design, and the account
display name changed from a full name to a username.

### Added

- Per-page layouts via `getLayout` (`src/types/page.ts`), so the auth screens
  render their own slim chrome instead of the full site navigation.
- `AuthLayout` — nav with "Back to Home", plus a footer whose links vary per screen.
- Reusable UI primitives in `src/components/ui/`: `TextField`, `Checkbox`,
  `Alert`, `PrimaryButton`, `LabeledDivider`.
- `src/components/icons/` — icon components using the vectors exported from Figma.
- `src/components/brand/RutaLogo.tsx` — wordmark shared by the nav and footer.
- Google and Facebook brand marks in `src/assets/brand/`, sourced from Simple
  Icons (CC0) and rendered through `next/image`.
- Inter webfont, self-hosted at build time via `next/font/google`.
- Terms-of-service checkbox on sign-up; submission is blocked until it is ticked.
- This changelog.

### Changed

- **Breaking** — the account display field is now `username`, not `fullName`.
  Affects the `/api/auth/register` and `PATCH /api/auth/profile` request bodies
  and the `user` object in every session payload.
- Username rules: 3–24 characters, letters/digits/underscore/period, must start
  and end alphanumeric. Spaces are no longer accepted, so previous full-name
  values would not validate.
- Login, sign-up and forgot-password screens rebuilt to the design: 480px card
  with a 32px radius, 56px fields, Inter, and the blue-600 primary action.
- Sign-up now sends `confirmPassword` mirroring the password field — the design
  has a single password input, and the API still validates the pair.
- Social sign-in offers Google and Facebook (Apple removed).
- `docs/auth.md` — added the identity-field rules and refreshed the file map.

### Removed

- `AuthPageLayout`, replaced by `AuthLayout` plus `AuthCard`.

### Notes

- Google and Facebook buttons are **presentation only**. There is no OAuth
  backend, so they show an explanatory message rather than failing silently.
- `username` is **not** unique; email remains the account key.

## [0.1.0] — 2026-07-26

First authentication implementation. No dependencies were added — password
hashing and sessions are built on Node's `crypto` module.

### Added

- scrypt password hashing with per-password salt, `timingSafeEqual` comparison,
  and embedded parameters so they can be raised without invalidating old hashes.
- Opaque cookie sessions: the browser holds a random 32-byte token, the store
  keeps only its SHA-256. Cookies are `HttpOnly`, `SameSite=Lax`, and `Secure`
  in production.
- Guest sessions — visitors who are not signed in still get a session and a
  generated `User…` display name, so they can use the site.
- Endpoints: `GET /session`, `POST /logout`, `GET|PATCH /profile`,
  `POST /change-password`, `POST /reset-password`.
- `SessionProvider` and the `useSession` hook.
- Navigation and landing page react to sign-in state; sign out works.
- `docs/auth.md`.

### Changed

- **Breaking** — registration no longer signs the user in; they are redirected
  to the login screen to enter their new credentials.
- Sign-in and sign-out both issue a brand-new session token and destroy the old
  one, so a fixated or copied cookie cannot survive a privilege change.

### Fixed

- `/api/auth/users` listed every account to anonymous callers; it now returns
  `404` outside development.
- `POST /api/auth/forgot-password` returned the reset token in its response
  body, letting anyone reset any account's password. The token is now
  development-only, and the response is identical whether or not the email
  exists.
- Passwords were stored and compared in plaintext.

### Removed

- `src/services/api/auth/store.ts`, replaced by `src/server/store/authStore.ts`.

[Unreleased]: https://github.com/YusCML/6SEven/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/YusCML/6SEven/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/YusCML/6SEven/releases/tag/v0.1.0
