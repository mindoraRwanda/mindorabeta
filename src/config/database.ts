import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../database/schema';

const dbUrl = process.env.DATABASE_URL!;
const dbHost = dbUrl.split('@')[1] || 'local (hidden)';
console.log(`[Database] Connecting to: ${dbHost}`);

const queryClient = postgres(dbUrl, { prepare: false });
export const db = drizzle(queryClient, { schema });
