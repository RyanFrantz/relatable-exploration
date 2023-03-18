// Will replace/consume https://safe-badger-75.deno.dev
import { Handlers } from "$fresh/server.ts";
import { connect } from 'https://esm.sh/*@planetscale/database@1.4.0';

// Planetscale config.
// Env vars are expected to be defined in the Deno Deploy project.
const pConfig = {
  host: Deno.env.get('DB_HOST') || '',
  username: Deno.env.get('DB_USER') || '',
  password: Deno.env.get('DB_PASS') || ''
};

const conn = connect(pConfig);

// Return all handles for a given user ID.
const getHandles = async (userId: number) => {
  const stmt = `SELECT handle, handleType from handles WHERE user_id = :userId`;
  const result = await conn.execute(stmt, {userId: userId});
  return result.rows;
}

export const handler: Handlers = {
  // curl -sv http://localhost:5000/api/user/7/handles
  async GET(req) {
    const url = new URL(req.url);
    // Helps ensure we only match numeric IDs, not all strings.
    const re = /\/api\/user\/(?<userId>\d+)\/handles/;
    const match = url.pathname.match(re);
    if (!match) {
      return new Response(
        JSON.stringify({message: 'Invalid user ID'}),
        {
          status: 400
        }
      );
    }
    const userId = match.groups.userId;

    const handles = await getHandles(userId);
    return new Response(
      JSON.stringify({handles: handles}), {
        status: 200
      }
    );
  },
};
