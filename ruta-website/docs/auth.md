# Authentication — sessions, cookies, hashing

Hand-rolled auth for Ruta / SakayMetrics. Guests get a session too, so nobody
browses the site without one.

---

## 1. Installation

**Nothing was installed. `package.json` is byte-for-byte unchanged.**

`npm install` was run, no dependency was added, and no lockfile entry changed.
Everything below is built from what the project already had:

| Need | What it uses | Where it comes from |
| --- | --- | --- |
| Password hashing | `scrypt`, `randomBytes`, `timingSafeEqual` | `node:crypto` (Node standard library) |
| Session tokens | `randomBytes`, `createHash` | `node:crypto` |
| Guest names | `randomInt` | `node:crypto` |
| Promisifying scrypt | `promisify` | `node:util` |
| Cookie writing | hand-written serializer | `src/server/auth/cookies.ts` |
| Cookie reading | `req.cookies` | Next.js API routes, built in |
| UI / routing / styling | React 19, Next 16, Tailwind 4, TypeScript 5 | already in the project |

There is **no** `bcrypt`, `argon2`, `next-auth`, `jsonwebtoken`, `cookie`,
`iron-session`, ORM, or database driver. `node:crypto` is compiled into Node —
it needs no build step and no native module, which is why scrypt was chosen over
bcrypt.

### Environment variables

None are required. `NODE_ENV` (which Next sets for you) is the only variable
read, and it only controls two things:

- `Secure` flag on the session cookie — on in production, off in dev so `http://localhost` works.
- `/api/auth/users` and the `devResetToken` field — available in development, disabled in production.

---

## 2. Commands used

Run from `ruta-website/`. These are the exact commands used to build and verify
this work — nothing here modifies dependencies.

Start the dev server:

```bash
npm run dev
```

Type-check the whole project (no emit):

```bash
npx tsc --noEmit
```

Lint the source tree:

```bash
npx eslint src
```

Production build:

```bash
npx next build
```

> **Note on chaining:** check exit codes separately rather than with `&&` piped
> into `tail` — a pipeline reports the exit code of the *last* command, so a
> failing `eslint` piped to `tail` looks like a pass. Use `npx eslint src; echo $?`.

### Verifying the API by hand

With `npm run dev` running, `-c`/`-b` give curl a cookie jar so the session
cookie survives between calls, exactly like a browser:

```bash
curl -s -c jar.txt -b jar.txt http://localhost:3000/api/auth/session
```

Register (this creates the account but does **not** sign you in — call `/login` next):

```bash
curl -s -c jar.txt -b jar.txt -X POST -H "Content-Type: application/json" -d "{\"username\":\"juandelacruz\",\"email\":\"juan@ruta.ph\",\"password\":\"Commuter123\",\"confirmPassword\":\"Commuter123\"}" http://localhost:3000/api/auth/register
```

Inspect what is stored (development only):

```bash
curl -s http://localhost:3000/api/auth/users
```

---

## 3. API reference

All routes live under `/api/auth/`. Errors are always `{ "error": "message" }`.
Success responses that resolve a session return the **session payload**:

```json
{
  "status": "authenticated" | "guest",
  "user": { "id": "...", "username": "...", "email": "...", "createdAt": "..." } | null,
  "guest": { "name": "User4f9c2a" } | null,
  "expiresAt": "2026-08-25T12:00:00.000Z"
}
```

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/session` | any | Who am I? Issues a guest session if there is no cookie. |
| `POST` | `/register` | any | Create account. Does **not** sign in — the user logs in afterwards. `409` if the email is taken. |
| `POST` | `/login` | any | Sign in. `401` on bad credentials. |
| `POST` | `/logout` | any | Destroy the session, hand back a **new guest** session. |
| `GET` | `/profile` | any | Same payload as `/session`. |
| `PATCH` | `/profile` | signed in | Save `username` / `email`. `401` for guests. |
| `POST` | `/change-password` | signed in | Needs `currentPassword`. Revokes all other sessions. |
| `POST` | `/forgot-password` | any | Creates a reset token. Always the same generic reply. |
| `POST` | `/reset-password` | any | Consumes the token, sets a new password. |
| `GET` | `/users` | dev only | Debug listing. `404` in production. |

---

## 4. How it works

### Password hashing — `src/server/auth/password.ts`

scrypt with a random 16-byte salt per password, 64-byte derived key, and
parameters `N=16384, r=8, p=1`. Stored as:

```
scrypt$16384$8$1$<salt base64>$<key base64>
```

Parameters live inside the string, so they can be raised later without breaking
existing hashes — `needsRehash()` spots the old ones and `login` transparently
upgrades them. Comparison uses `timingSafeEqual`, never `===`.

### Sessions — `src/server/auth/session.ts`

The browser holds a random 32-byte token. **Only its SHA-256 is stored**, so a
dump of the store cannot be replayed as a login — the same reason passwords are
hashed.

Cookie `ruta_session` is set with:

| Flag | Value | Why |
| --- | --- | --- |
| `HttpOnly` | always | JavaScript cannot read it, so XSS cannot steal it. |
| `SameSite` | `Lax` | Not sent on cross-site POSTs — blocks basic CSRF. |
| `Secure` | production only | HTTPS-only in prod; off in dev so localhost works. |
| `Path` | `/` | Sent to every route. |
| `Max-Age` | 30 days | Matches the stored `expiresAt`. |

Signing in and signing out both **issue a brand-new token and delete the old
one**, so a fixated or copied cookie cannot survive a privilege change.

### Guest sessions

A visitor with no cookie gets one from `GET /api/auth/session`: `userId` is
`null` and `guestName` is `User` + six random characters (e.g. `User4f9c2a`),
drawn from an alphabet with no `0/O/1/I/l` so it can be read aloud. Guests can
use the site and appear on the profile page as a read-only default profile.

Signing out does not strand anyone — it deletes the authenticated session and
immediately issues a fresh guest one.

### Storage — `src/server/store/authStore.ts`

There is **no database yet**. Users, sessions and reset tokens live in `Map`s
pinned to `globalThis` so they survive hot reloads, and are lost when the server
restarts.

Every function is `async` even though nothing awaits. That is deliberate: when
Neon/Prisma lands, only this one file changes and no call site has to be touched.

---

## 5. File map

```
src/
  server/                        server-only, never bundled to the browser
    auth/
      password.ts                scrypt hash / verify / needsRehash
      session.ts                 tokens, cookie lifecycle, guest fallback
      cookies.ts                 Set-Cookie serializer
      guest.ts                   guest name generator
    http/
      respond.ts                 method guard + JSON error helpers
    store/
      authStore.ts               in-memory users / sessions / resets
  services/api/auth/handlers/    one file per endpoint (the real logic)
  pages/api/auth/                thin re-exports that expose the routes
  providers/SessionProvider.tsx  client session context
  hooks/useSession.ts            the hook components call
  types/session.ts               payload types shared client + server
  types/page.ts                  NextPageWithLayout, for per-page layouts
  utils/validation.ts            rules shared by forms and handlers

  components/                    reusable across features
    ui/                          TextField, Checkbox, Alert, PrimaryButton,
                                 LabeledDivider, Button, FormField, Panel
    icons/                       inline SVG icon components
    brand/RutaLogo.tsx           wordmark used in nav and footer
  layouts/
    AppShell.tsx                 default site chrome (full navigation)
    AuthLayout.tsx               slim chrome for the auth screens
  features/auth/components/      auth-specific composition
    AuthCard.tsx                 the 480px panel
    AuthStatusStrip.tsx          status line under the card
    SocialAuthButtons.tsx        Google / Apple row
    LoginForm.tsx  RegisterForm.tsx  ForgotPasswordForm.tsx
```

Anything reusable lives under `components/`; anything that only makes sense for
one feature lives under `features/<feature>/components/`. Auth screens opt out of
the site navigation by exporting `getLayout` — see `types/page.ts`.

---

## 6. Identity fields

Accounts are keyed on **email**, which is the unique field. `username` is a
display name shown in the navbar, profile and greeting.

| Field | Rule |
| --- | --- |
| `username` | 3–24 chars, letters/digits/`_`/`.`, must start and end alphanumeric. No spaces. |
| `email` | Standard shape, lower-cased on save, **unique** — `409` on collision. |
| `password` | 8–128 chars, at least one letter and one digit. |

> `username` is **not** unique. Two accounts may share one; they are still
> distinct logins because email is the key. Add a uniqueness check in
> `createUser`/`updateUser` if that changes.

---

## 7. Next sprint — Neon

`authStore.ts` is the only file that needs to change. The intended path is
Prisma (`prisma` + `@prisma/client`), which **would** be the first dependency
added to this project.
