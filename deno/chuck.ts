/* Deployed via
 *  DENO_DEPLOY_TOKEN=... deployctl deploy --project=safe-badger-75 --prod chuck.ts
 */
import { serve } from 'https://deno.land/std@0.155.0/http/server.ts'
import { connect } from 'https://esm.sh/*@planetscale/database@1.4.0';

// Planetscale config.
// Env vars are expected to be defined in the Deno Deploy project.
const pConfig = {
  host: Deno.env.get('DB_HOST') || '',
  username: Deno.env.get('DB_USER') || '',
  password: Deno.env.get('DB_PASS') || ''
};

const conn = connect(pConfig);

serve(async (req) => {
  const url = new URL(req.url);
  const stmt_params = { id: 0 }; // Sane default.
  // Grab the first part of the pathname to use as input for a user ID.
  // NOTE: No checks for numberness, here.
  const user_id = url.pathname.split('/')[1];
  if (user_id) {
    stmt_params.id = user_id;
  }
  const stmt = `
    SELECT u.name AS user, h.handle, h.handleType
    FROM user AS u
    INNER JOIN handles AS h
    ON h.user_id = u.id
    WHERE u.id = :id;
  `;
  const results = await conn.execute(stmt, stmt_params);
  const rows = results.rows;
  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
});
