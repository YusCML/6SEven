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

## Route data and sources

The Routes page lists the 25 official jeepney loops of Iloilo City's Enhanced
Local Public Transport Route Plan (ELPTRP). The data lives in
`server/prisma/data/routes.json` and is loaded by the seed script.

- **Street sequence.** Each route follows the official street-by-street list
  published by the city's traffic office (ICTMU) and transcribed in the
  [Iloilo City jeepney route guide](https://shemaegomez.com/iloilo-city-jeepney-routes/).
- **Map geometry.** Each path is drawn on real roads from
  [OpenStreetMap](https://www.openstreetmap.org/copyright), snapped with
  [OSRM](https://project-osrm.org/), and respects one-way streets. The Drilon
  Bridge crossing follows [SunStar's report on the bridge](https://www.sunstar.com.ph/more-articles/new-p140-m-bridge-up-at-iloilo-river-).
- **Fares.** Fares use the traditional jeepney rate: ₱13 for the first 4 km, then
  ₱1.80 per km, rounded to 25 centavos. Students, seniors and PWDs get 20% off.
  The ₱14 increase approved in March 2026
  [was suspended](https://newsinfo.inquirer.net/2197784/marcos-orders-suspension-of-fare-hike),
  which the [Iloilo 2026 transport guide](https://iloilodirectory.com/complete-transportation-guide-to-iloilo-city-for-commuters-and-tourists-2026/)
  confirms.
- **Times.** Travel times are estimates at an average of 16 km/h, stops
  included.
- **Stops.** The numbered markers on the map are the landmarks in each official
  list, placed on the route in riding order. They use
  [OpenStreetMap](https://www.openstreetmap.org/copyright) places and the
  guide's Google My Maps placemarks.
- **Jeep names.** Each card also shows the older names commuters still use for
  the jeep, from the guide's
  [old and new route names](https://shemaegomez.com/iloilo-city-jeepneys-names/).
  Routes 18 to 24 are new in the 2024 plan and have no older name.

Every route is a loop. **Loop** shows the whole trip out and back. **One way**
shows the terminal to the far end, with that ride's distance, time and fare.

Two routes can't follow the official path exactly because OpenStreetMap is
missing a road. So-oc Road is cut at C. Aquino Avenue (route 20), and there is
no Sto. Domingo Street link near Tatoy's (route 17).

### Trip planner

Pin a starting point and a destination on the map. You can drag pins, and Swap
flips them. The planner then lists the ways to get there. Each option says
which jeeps to take, where to board, where to get off and change, and the fare
for each ride and in total. Rides are drawn in the route's color, and walking is
a dashed trail.

- It rides only in each loop's direction of travel. It walks as far as needed
  to the first jeep and from the last one, up to 20 miles, and up to 300 m
  between jeeps. It assumes about 4 minutes of waiting per jeep, and counts
  each change of jeep as about 5 minutes more so that fewer rides rank higher.
- A pin must be on land, meaning within about 600 m of an
  [OpenStreetMap](https://www.openstreetmap.org/copyright) road or a jeep route,
  which keeps pins off the sea and Guimaras. It must also be within 20 miles of
  a jeep route.
- Place names come from
  [Nominatim reverse geocoding](https://nominatim.org/release-docs/latest/api/Reverse/).
  Walking trails come from the
  [OpenStreetMap foot router](https://routing.openstreetmap.de/). If either
  service is down, the app falls back to the nearest official stop and a
  straight dashed line.

---

## The team

**Group 5** · Software Development III


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
| bcrypt | 6.0 | Password hashing |
| Prisma | 7.9 | ORM and schema management |
| `@prisma/adapter-pg` | 7.9 | Postgres driver adapter |
| Neon Postgres | — | Serverless database |
| cookie-parser | 1.4 | Reads session cookies |
| dotenv | 17.4 | Loads environment variables |
| tsx | 4.20 | Runs TypeScript directly |
| Vitest | 4.1 | Test runner |

### Notably absent

No authentication library. Passwords are hashed with `bcrypt`; sessions and the
Google OAuth flow are built on Node's own `crypto` module. There is no
`next-auth`, no `passport`, and no `jsonwebtoken` — the sign-in, session and
OAuth code is all written by hand.

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

Then load the 25 official jeepney routes:

```bash
cd server && npm run prisma:seed
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
| Routes | `/routes` | Trip planner (pin origin and destination), the 25 official jeep routes, stops and fares |
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
| `server` | `npm run prisma:seed` | Load the 25 official jeepney routes |
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

Passwords are hashed with `bcrypt`, which generates a random salt for every
password and stores it inside the hash, so two people with the same password
still get different hashes. Signing in and out both issue a brand-new token, so
a fixated cookie cannot survive a privilege change.

Google sign-in uses the OAuth 2.0 authorization-code flow with PKCE. The `state`
parameter is compared in constant time to block CSRF, and the ID token's `iss`,
`aud`, `exp` and `sub` claims are all verified. An account is only linked to an
existing email when Google reports that address as verified.

Guests get a session too, so nobody browses without one.

Accounts live in Postgres. Sessions and password-reset tokens are still held in
process memory, so restarting the API signs everyone out while accounts survive.
