import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './shared/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL,
  },
});
