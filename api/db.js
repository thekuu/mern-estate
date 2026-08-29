import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema.js';

let pool;
let db;

try {
  const { Pool } = pg;
  const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) throw new Error('No database connection string found.');
  pool = new Pool({ connectionString });
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });
  db = drizzle(pool, { schema });
} catch (e) {
  console.warn('[AI Studio] Database not connected — using mock');
  pool = { query: async () => ({ rows: [] }), connect: async () => ({ query: async () => ({ rows: [] }), release: () => {} }) };
  const noOp = { findMany: async () => [], findFirst: async () => null, findUnique: async () => null, create: async (d) => d?.data ?? {}, update: async (d) => d?.data ?? {}, delete: async () => ({}) };
  db = new Proxy({}, {
    get: (_, prop) => prop === 'query' ? new Proxy({}, { get: () => noOp }) : new Proxy({}, {
      get: () => () => new Proxy({}, { get: () => async () => [] }) // Generic chain stub
    }),
  });
}

export { pool, db };
