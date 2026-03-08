import 'dotenv/config';
import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL!;

async function check() {
  const sql = postgres(DATABASE_URL);
  try {
    const cols = await sql`
      SELECT column_name
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `;
    console.log('USER_COLUMNS:', cols.map(c => c.column_name).join(','));

  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await sql.end();
  }
}

check();
