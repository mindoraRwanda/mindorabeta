import 'dotenv/config';
import { db } from '../src/config/database';
import { users } from '../src/database/schema';
import { eq } from 'drizzle-orm';

async function check() {
  try {
    console.log('Running drizzle query...');
    const res = await db.select({ id: users.id }).from(users).where(eq(users.email, 'test11@example.com')).limit(1);
    console.log('Result:', res);
  } catch (err) {
    console.error('Drizzle Error:', err);
  } finally {
    process.exit();
  }
}

check();
