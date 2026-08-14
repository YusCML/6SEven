import 'dotenv/config';
import { defineConfig } from 'prisma/config';

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
