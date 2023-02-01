import { serve } from 'https://deno.land/std@0.155.0/http/server.ts'
import mysql from 'npm:mysql2@^2.3.3/promise';

// Kastner: I ran this as:
// DATABASE_URL=mysql://j2zi60vl5robjixlngfe:pscale_pw_PDrp8X9RTqSz01JEqsGwfnUxK1e48ESp7sqKTXOj6Yi@us-east.connect.psdb.cloud/relatable?ssl={'"rejectUnauthorized":true}' deno run -A chuck.ts

// TODO: Replace with discrete components (e.g. DB_USER, DB_PASS...)?
const dbUrl = Deno.env.get('DATABASE_URL');

serve(async (req) => {
  console.log('Before connection...');
  const conn = await mysql.createConnection(dbUrl);
  // Try breaking the connection details apart...
  /*
  const conn = await mysql.createConnection({
    host: 'us-east.connect.psdb.cloud',
    user: 'j2zi60vl5robjixlngfe',
    password: 'pscale_pw_PDrp8X9RTqSz01JEqsGwfnUxK1e48ESp7sqKTXOj6Yi',
    database: 'relatable'
  });
 */
  console.log('Connected: ', conn);
  const results = await conn.query(`SELECT handle, handleType from handles AS h WHERE h.user_id = 1`);
  await conn.end();
  console.log('Results: ', results);
  return new Response(JSON.stringify({ results }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
});
