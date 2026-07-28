# Database

Postgres on [Neon](https://neon.tech), accessed through [Prisma](https://www.prisma.io) 7.

---

## What is stored

Only **accounts** — what a visitor types at sign-up.

| Table | Holds |
| --- | --- |
| `users` | `id`, `email`, `username`, `passwordHash`, `createdAt`, `updatedAt` |

Sessions and password-reset tokens are still **in process memory**
(`src/server/store/sessionStore.ts`). So an account survives a server restart,
but everyone is signed out by one. Moving those to Postgres is a follow-up; every
function there is already `async`, so no call site would change.

### Constraints that matter

- **`email` is unique** — enforced by a database index, not just application
  code. `createUser` catches Prisma's `P2002` and raises `DuplicateEmailError`,
  so two simultaneous sign-ups cannot both succeed.
- **`username` is not unique** — deliberately. Email identifies the account;
  username is a display name.
- **No password is ever stored.** `passwordHash` holds a scrypt digest — see
  [auth.md](./auth.md).

---

## Setup

1. Create a project at [neon.tech](https://neon.tech). Pick the region closest to
   your users — **Singapore** for the Philippines.
2. In the project's **Connect** panel, copy the connection string.
3. Copy `.env.example` to `.env` and paste it in as `DATABASE_URL`.
4. Apply the schema:

   ```bash
   npx prisma migrate dev
   ```

`.env` is gitignored. `.env.example` is committed as the template — keep it free
of real values.

### Pooled vs direct connections

Neon offers two endpoints for the same database:

| Endpoint | Host | Used by |
| --- | --- | --- |
| Pooled | contains `-pooler` | the running app |
| Direct | no `-pooler` | migrations |

The app uses the pooled endpoint so serverless invocations do not exhaust
Postgres' connection limit. Migrations cannot use it — PgBouncer does not hold
the session-level advisory locks a schema change needs.

You only need to set `DATABASE_URL`: `prisma.config.ts` derives the migration URL
by stripping `-pooler`. Set `DIRECT_URL` explicitly only if your provider does not
follow that convention.

---

## Setting up on a teammate's machine

After cloning or pulling, each person does this **once**:

```bash
npm install
```

That runs `prisma generate` automatically (a `postinstall` hook), which rebuilds
the Prisma Client. The client is generated code and is **gitignored**, so it will
not arrive with the pull — without this step the app fails with
`Cannot find module '@/generated/prisma/client'`.

Then create `.env` in `ruta-website/` containing one line:

```
DATABASE_URL="<the Neon connection string>"
```

Copying the template (`cp .env.example .env`) is just a convenience — it gives
you the variable name and comments to fill in. Creating the file by hand is
equivalent. What matters is that `.env` exists with a valid `DATABASE_URL`.

### Where the connection string comes from

`.env` is gitignored and must never be committed — it holds the database
password. Send it to teammates through a **private** channel (a direct message or
a password manager), never in the repository, an issue, or a screenshot.

Two ways to organise this:

| Approach | How | Trade-off |
| --- | --- | --- |
| **One shared database** (simplest) | Everyone uses the same string from the Neon dashboard | Easiest to set up, but you share data — anyone can delete a teammate's test account |
| **A branch each** | In Neon, **Branches → New branch** per person; each copies their own string | Isolated data, still one project. Free plan allows 10 branches |

For a small team moving quickly, the shared database is usually fine. Switch to
branches if people start tripping over each other's data.

### Do teammates need to run migrations?

**Sharing one database:** no. The schema is already applied. `npm install` and a
`.env` are enough.

**Their own branch or project:** yes, once:

```bash
npx prisma migrate deploy
```

`deploy` applies the committed migrations exactly as they are. Use `migrate dev`
only when *changing* the schema — it can generate new migrations and reset data.

### After someone changes the schema

When a pull brings new files under `prisma/migrations/`:

```bash
npm install
```

```bash
npx prisma migrate deploy
```

The first rebuilds the client to match the new schema; the second applies the
migration if you have your own database.

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `Cannot find module '@/generated/prisma/client'` | Client not generated | `npm install`, or `npx prisma generate` |
| `DATABASE_URL is not set` | No `.env` | `cp .env.example .env`, paste the string |
| `P1001: Can't reach database server` | Wrong or placeholder URL | Check `.env` is the real Neon string, not `localhost` |
| `P3005: database schema is not empty` | Database has tables but no migration history | `npx prisma migrate resolve --applied <migration-name>` |
| Migration hangs or times out | Running through the pooled endpoint | Migrations need the direct URL; `prisma.config.ts` derives it |

## Layout

```
prisma/
  schema.prisma          the models — source of truth for the shape
  migrations/            generated SQL, committed and applied in order
src/
  generated/prisma/      Prisma Client output (gitignored, rebuilt by generate)
  server/db/prisma.ts    the client singleton
  server/store/
    userStore.ts         the ONLY module that touches prisma.user
    sessionStore.ts      in-memory sessions and reset tokens
```

`userStore` maps Prisma rows to a plain `UserRecord` — `Date` becomes an ISO
string — so nothing above it imports a Prisma type. Swapping the database again
would touch that one file.

---

## Common tasks

Change the schema, then create and apply a migration:

```bash
npx prisma migrate dev --name what_changed
```

Regenerate the client after editing the schema without migrating:

```bash
npx prisma generate
```

Browse the data in a GUI:

```bash
npx prisma studio
```

Apply existing migrations in CI or production — never `migrate dev` there:

```bash
npx prisma migrate deploy
```

---

## Prisma 7 notes

Version 7 changed things that older tutorials still describe the old way:

| Change | What it means here |
| --- | --- |
| Connection URL moved out of `schema.prisma` | it lives in `prisma.config.ts` |
| A driver adapter is now **required** | `@prisma/adapter-pg`, wired in `server/db/prisma.ts` |
| Generated model type is `UserModel` | not `User` |
| `prisma init` writes AI-assistant skill folders | `.agents/`, `.windsurf/`, `skills-lock.json` — deleted and gitignored |

---

## Testing

Unit tests do **not** touch Neon. `prisma.user` is replaced with an in-memory
double (`src/server/testing/prismaDouble.ts`) that reproduces the two error codes
the store depends on — `P2002` for a duplicate email, `P2025` for a missing row.

That keeps the suite fast and runnable offline. Integration tests against a real
Neon branch would be a sensible addition; Neon's branching makes a disposable
test database cheap.
