# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

While the version stays below `1.0.0`, the public surface is not considered
stable: breaking changes bump the **minor** number rather than the major one.

## [Unreleased]

Nothing yet.

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
