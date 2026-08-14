# RUTA / SakayMetrics

Smart route planning for Filipino commuters. The repository is split into a
frontend and a backend that run as two separate processes.

```
6SEven/
├── client/     Next.js frontend        -> http://localhost:3000
├── server/     Express API + Prisma    -> http://localhost:4000
└── shared/     Types used by both
```

## Requirements

- Node.js 20.9 or newer
- A PostgreSQL database (this project uses Neon)
- A Google OAuth 2.0 client, if you want Google sign-in

## Setup

Install dependencies in each workspace:

```bash
cd server && npm install
cd ../client && npm install
```

Create `server/.env`:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
PORT=4000
CLIENT_ORIGIN="http://localhost:3000"
```

The client needs no `.env` for local development. It reads
`NEXT_PUBLIC_API_ORIGIN` only if you want to point it at an API somewhere other
than `http://localhost:4000`.

Push the schema to your database:

```bash
cd server && npx prisma db push
```

## Running it

You need **two terminals** — the API and the frontend are separate processes.

Terminal 1, the API:

```bash
cd server && npm run dev
```

Terminal 2, the frontend:

```bash
cd client && npm run dev
```

Open <http://localhost:3000>.

Start the server first. The frontend proxies every `/api/*` request to the API,
so the browser only ever talks to port 3000 — that keeps session cookies
same-origin and means the Google redirect URI never has to change.

## Scripts

| Workspace | Command | What it does |
| --- | --- | --- |
| `server` | `npm run dev` | API with reload on change |
| `server` | `npm start` | API without watching |
| `server` | `npm test` | Vitest suite |
| `server` | `npm run typecheck` | tsc, no emit |
| `server` | `npm run prisma:push` | Sync schema to the database |
| `client` | `npm run dev` | Next dev server |
| `client` | `npm run build` | Production build |
| `client` | `npm start` | Serve the production build |
| `client` | `npm run lint` | ESLint |

Stop the client dev server before running `npm run build` — Next generates types
for dev and build into different folders, and the tsconfig picks up both, which
fails the build with a duplicate-identifier error.

## Layout

```
client/src/
├── assets/       images
├── components/   shared UI
├── features/     feature-specific components
├── hooks/        React hooks
├── layouts/      page shells
├── lib/          frontend utilities
├── pages/        Next routes
├── providers/    React context
├── services/     API requests
├── styles/       global CSS
└── types/        frontend-only types

server/src/
├── auth/          sessions, password hashing, cookies, Google OAuth
├── config/
├── controllers/   HTTP handlers
├── db/            Prisma client
├── generated/     generated Prisma client (not committed)
├── http/          response helpers
├── lib/           backend utilities, validation rules
├── middlewares/   rate limiting
├── repositories/  data access
├── routes/        Express routers
├── services/      business logic
├── testing/       test doubles
└── server.ts      entry point
```

Backend code never lives in `client/`. Anything genuinely needed by both sides
goes in `shared/`.

## Authentication

Sessions are cookie-based and hand-rolled on `node:crypto` — no auth library.
Passwords use scrypt; only the SHA-256 of a session token is stored. Guests get
a session too, so nobody browses without one.

Google sign-in uses the OAuth 2.0 authorization-code flow with PKCE. The `state`
parameter is compared in constant time, and the ID token's `iss`, `aud`, `exp`
and `sub` claims are all verified.

Accounts live in Postgres. Sessions and password-reset tokens are still held in
process memory, so restarting the API signs everyone out while accounts survive.
