import 'dotenv/config';
import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL!;

async function check() {
  const sql = postgres(DATABASE_URL);
  try {
    const tables = await sql`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `;
    console.log('TABLES_START');
    console.log(JSON.stringify(tables.map(t => t.tablename)));
    console.log('TABLES_END');

    const usersDesc = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `;
    console.log('COLUMNS_START');
    console.log(JSON.stringify(usersDesc));
    console.log('COLUMNS_END');

  } catch (err) {
    console.error('DB_ERROR_START');
    console.error(err);
    console.error('DB_ERROR_END');
  } finally {
    await sql.end();
  }
}

check();
