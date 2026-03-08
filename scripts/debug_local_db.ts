import postgres from 'postgres';

async function check() {
  // Try default credentials from docker-compose
  const urls = [
    'postgres://postgres:password@localhost:5432/mindora_db',
    'postgres://postgres:password@127.0.0.1:5432/mindora_db'
  ];

  for (const url of urls) {
    console.log('Trying:', url);
    const sql = postgres(url, { connect_timeout: 2 });
    try {
      await sql`SELECT 1`;
      console.log('SUCCESS connecting to:', url);
      const tables = await sql`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`;
      console.log('Tables:', tables.map(t => t.tablename));
    } catch (err: any) {
      console.log('FAIL:', url, err.message);
    } finally {
      await sql.end();
    }
  }
}

check();
