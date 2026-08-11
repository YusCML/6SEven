import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

/**
 * The application's database client.
 *
 * Two things matter here:
 *
 * 1. **One instance.** Next.js hot-reloads modules in development, which would
 *    otherwise create a new client — and a new connection pool — on every edit
 *    until Neon refuses further connections. Pinning it to `globalThis` keeps a
 *    single client across reloads. In production the module is evaluated once,
 *    so the global is not used.
 *
 * 2. **A driver adapter.** Prisma 7 no longer connects on its own; it needs an
 *    adapter, and `PrismaPg` is the Postgres one. It takes the *pooled* Neon URL
 *    — migrations use the direct URL instead, via prisma.config.ts.
 */

declare global {
  var __rutaPrisma: PrismaClient | undefined;
}

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured.');
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma = globalThis.__rutaPrisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__rutaPrisma = prisma;
}