import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Configuration for the Prisma CLI — migrations, introspection, seeding.
 * The running app never reads this file; it builds its own client in
 * `src/server/db/prisma.ts`.
 */

/**
 * Migrations cannot run through Neon's pooled endpoint: PgBouncer does not hold
 * the session-level advisory locks a schema change needs. Neon's direct host is
 * the pooled host without the `-pooler` suffix, so the migration URL is derived
 * rather than requiring a second copy-paste that is easy to get wrong.
 *
 * An explicit DIRECT_URL still wins, for providers where the rule differs.
 */
function migrationUrl(): string | undefined {
  const explicit = process.env.DIRECT_URL;
  const pooled = process.env.DATABASE_URL;

  if (explicit && !explicit.includes('-pooler')) return explicit;
  if (!pooled) return explicit;

  return pooled.replace('-pooler', '');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: migrationUrl(),
  },
});
