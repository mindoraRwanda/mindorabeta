import 'dotenv/config';
import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL!;

async function check() {
  const sql = postgres(DATABASE_URL);
  try {
    const email = 'test11@example.com';
    const res = await sql`
      select "id" from "users" where "users"."email" = ${email} limit 1
    `;
    console.log('QUERY_RESULT:', res);
  } catch (err) {
    console.error('QUERY_ERROR:', err);
  } finally {
    await sql.end();
  }
}

check();
