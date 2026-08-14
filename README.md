# RUTA · SakayMetrics

**Saan ka pupunta?** Smart route planning for the modern Filipino commuter.

Getting across a Philippine city means stitching together jeepneys, tricycles,
buses and a lot of guesswork. RUTA turns that guesswork into a decision. Enter
where you are and where you need to be, and it lays out real options side by
side — how long each takes, what it costs, how much of it you spend walking, and
where the traffic is right now.

Built for people who just want to know which ride to take.

---

## What it does

**Compare routes, not just directions.** Every option shows total fare, travel
time, distance and a leg-by-leg breakdown of which vehicle to take and where to
transfer. Sort by fastest, cheapest, or least walking.

**See the city as it is.** An interactive map plots each route, and a live
incident feed surfaces heavy traffic, breakdowns and long queues before you
commit to a plan.

**Fares up front.** No more asking the driver. Each leg carries its own fare so
you know the total before you leave.

**Commute with an account or without.** Browse freely as a guest, or sign in with
email or Google to keep your profile and preferences.

**Made for the local commute.** Routes, fares and terminals reflect how people
actually move around Iloilo City — jeepney codes, tricycle hops, transfer points.

---

## The team

**Group 5** · Software Development III · Central Philippine University

| Member | Role |
| --- | --- |
| Bryan Del Rosario | Project Manager |
| Denver Neil Alejandro | Lead Developer |
| Joe Steven Bandong | Lead Backend Developer |
| Zephaniah Raye D. Belmis | Frontend Developer |
| Novie Glynn Farrol | Frontend Developer |
| Nherf Rossel Gempasao | QA Tester |

---

## Tech stack

The repository is split into a frontend and a backend that run as two separate
processes, communicating over HTTP.

### Frontend — `client/`

| Tool | Version | Why |
| --- | --- | --- |
| Next.js | 16.2.10 | React framework, Pages Router |
| React | 19.2.4 | UI library |
| TypeScript | 5 | Type safety across the app |
| Tailwind CSS | 4 | Styling |
| Leaflet + react-leaflet | 1.9 / 5.0 | Interactive route maps |
| React Compiler | 1.0 | Automatic memoisation |
| ESLint | 9 | Linting |

### Backend — `server/`

| Tool | Version | Why |
| --- | --- | --- |
| Express | 5.1 | HTTP server and routing |
| Prisma | 7.9 | ORM and schema management |
| `@prisma/adapter-pg` | 7.9 | Postgres driver adapter |
| Neon Postgres | — | Serverless database |
| cookie-parser | 1.4 | Reads session cookies |
| dotenv | 17.4 | Loads environment variables |
| tsx | 4.20 | Runs TypeScript directly |
| Vitest | 4.1 | Test runner |

### Notably absent

No authentication library. Sessions, password hashing and the Google OAuth flow
are built on Node's own `crypto` module — scrypt for passwords, SHA-256 for
session tokens, PKCE for OAuth. There is no `next-auth`, no `passport`, no
`bcrypt`, and no `jsonwebtoken`.

---

## Getting started

### Requirements

| Requirement | Version | Notes |
| --- | --- | --- |
| [Node.js](https://nodejs.org) | **20.9 or newer** | Next 16 will not run on Node 18 |
| npm | 10+ | Ships with Node |
| [Git](https://git-scm.com) | any | To clone the repository |
| PostgreSQL | any | A free [Neon](https://neon.tech) database is what this project uses |
| Google Cloud account | — | Only if you want Google sign-in; email/password works without it |

You will also need **two terminals** open — the API and the frontend run as
separate processes.

Check what you have:

```bash
node -v && npm -v
```

If `node -v` prints anything below `v20.9.0`, upgrade before continuing — the
build fails on older versions with errors that don't mention Node at all.

### 1. Install

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure the backend

Create `server/.env`:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler.REGION.aws.neon.tech/neondb?sslmode=require"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
PORT=4000
CLIENT_ORIGIN="http://localhost:3000"
```

The frontend needs no `.env` locally. It only reads `NEXT_PUBLIC_API_ORIGIN`, and
falls back to `http://localhost:4000`.

Get Google credentials from the
[Google Cloud Console](https://console.cloud.google.com/apis/credentials) —
create an **OAuth client ID → Web application**, then register
`http://localhost:3000` as an authorised origin and
`http://localhost:3000/api/auth/google/callback` as an authorised redirect URI.
While the app is unpublished, only accounts listed under **Test users** can sign
in.

### 3. Create the database tables

```bash
cd server && npx prisma db push
```

### 4. Run it

You need **two terminals** — the API and the frontend are separate processes.

Terminal 1 — the API:

```bash
cd server && npm run dev
```

Terminal 2 — the frontend:

```bash
cd client && npm run dev
```

Open **<http://localhost:3000>**.

Start the API first. The frontend proxies every `/api/*` request through to it,
so the browser only ever talks to port 3000 — which keeps session cookies
same-origin and means the Google redirect URI never has to change.

---

## Navigating the app

| Page | Path | What's there |
| --- | --- | --- |
| Home | `/home` | Route search, frequent rides, live traffic, service stats |
| Routes | `/routes` | Interactive map, route comparison, fare and segment breakdown |
| Dashboard | `/dashboard` | Incident reporting overview and commuter live feed |
| Commuter Guide | `/commuter-guide` | Tips for planning, fares and travel etiquette |
| About | `/about-us` | The project and the team behind it |
| Sign in | `/auth/login` | Email or Google |
| Register | `/auth/register` | Create an account |
| Forgot password | `/auth/forgot-password` | Request a reset link |
| Profile | `/dashboard/profile` | Nickname, username, email |
| Settings | `/dashboard/settings` | Account preferences |

You can browse Home, Routes, Commuter Guide and About without an account —
visitors get a guest session automatically.

---

## Project structure

```
6SEven/
├── client/                 Next.js frontend  ->  :3000
│   ├── public/             static files
│   └── src/
│       ├── assets/         images
│       ├── components/     shared UI (buttons, fields, icons, navigation)
│       ├── features/       feature-specific components
│       ├── hooks/          React hooks
│       ├── layouts/        page shells
│       ├── lib/            frontend utilities
│       ├── pages/          Next routes
│       ├── providers/      React context
│       ├── services/       API request modules
│       ├── styles/         global CSS
│       └── types/          frontend-only types
│
├── server/                 Express API  ->  :4000
│   ├── prisma/             database schema
│   └── src/
│       ├── auth/           sessions, password hashing, cookies, Google OAuth
│       ├── config/
│       ├── controllers/    HTTP handlers
│       ├── db/             Prisma client
│       ├── http/           response helpers
│       ├── lib/            backend utilities and validation rules
│       ├── middlewares/    rate limiting
│       ├── repositories/   data access
│       ├── routes/         Express routers
│       ├── services/       business logic
│       ├── testing/        test doubles
│       └── server.ts       entry point
│
└── shared/                 types both sides need
```

Backend code never lives in `client/`. Anything genuinely needed by both goes in
`shared/`.

---

## Scripts

| Workspace | Command | What it does |
| --- | --- | --- |
| `server` | `npm run dev` | API with reload on change |
| `server` | `npm start` | API without watching |
| `server` | `npm test` | Vitest suite (131 tests) |
| `server` | `npm run typecheck` | tsc, no emit |
| `server` | `npm run prisma:push` | Sync schema to the database |
| `client` | `npm run dev` | Next dev server |
| `client` | `npm run build` | Production build |
| `client` | `npm start` | Serve the production build |
| `client` | `npm run lint` | ESLint |

Stop the client dev server before running `npm run build`. Next writes types for
dev and build into different folders and the tsconfig picks up both, which fails
the build with a duplicate-identifier error.

---

## API

All endpoints live under `/api/auth`. Errors always return `{ "error": "..." }`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/session` | Who am I? Issues a guest session if there's no cookie |
| `POST` | `/register` | Create an account |
| `POST` | `/login` | Sign in |
| `POST` | `/logout` | Sign out, hand back a fresh guest session |
| `GET` | `/profile` | Current session payload |
| `PATCH` | `/profile` | Update nickname, username or email |
| `POST` | `/change-password` | Requires the current password |
| `POST` | `/forgot-password` | Request a reset token |
| `POST` | `/reset-password` | Consume a token, set a new password |
| `GET` | `/google/start` | Begin Google sign-in |
| `GET` | `/google/callback` | Complete Google sign-in |
| `GET` | `/users` | Debug listing — development only |

Login, registration and the password endpoints are rate-limited per IP, and login
additionally per email address.

---

## How authentication works

Sessions are cookie-based. The browser holds a random 32-byte token; only its
SHA-256 is stored, so a database dump cannot be replayed as a login. The cookie
is `HttpOnly`, `SameSite=Lax`, and `Secure` outside development.

Passwords use scrypt with a random salt per password, and comparisons are
constant-time. Signing in and out both issue a brand-new token, so a fixated
cookie cannot survive a privilege change.

Google sign-in uses the OAuth 2.0 authorization-code flow with PKCE. The `state`
parameter is compared in constant time to block CSRF, and the ID token's `iss`,
`aud`, `exp` and `sub` claims are all verified. An account is only linked to an
existing email when Google reports that address as verified.

Guests get a session too, so nobody browses without one.

Accounts live in Postgres. Sessions and password-reset tokens are still held in
process memory, so restarting the API signs everyone out while accounts survive.
