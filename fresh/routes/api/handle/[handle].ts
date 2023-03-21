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

// Given a handle, return the related user.
const getUserByHandle = async (handle: string) => {
  const stmt = `SELECT user.id, user.name FROM user
    INNER JOIN handles ON handles.user_id = user.id
    WHERE handle = :handle LIMIT 1`
  const result = await conn.execute(stmt, {handle: handle});
  const user = result.rows[0] || {};
  return user;
};

export const handler: Handlers = {
  // Given a handle, look up the related user.
  // /api/handle/foo, /api/handle/fancy%pants
  async GET(req) {
    const url = new URL(req.url);
    // Expect URL-escaped strings.
    const re = /\/api\/handle\/(?<handle>\S+)/;
    const match = url.pathname.match(re);
    if (!match) {
      return new Response(
        JSON.stringify({message: 'Invalid handle'}),
        {
          status: 400
        }
      );
    }
    const handle = match.groups.handle;
    const user = await getUserByHandle(handle);

    // Sane default.
    let [responseCode, msg] = [
      404,
      {message: `No user found for handle ${handle}`}
    ];

    if (Object.keys(user).length > 0) {
      responseCode = 200;
      // {"id":6,"name":"Thibaud Reedman"}
      msg = user;
    }
    return new Response(
      JSON.stringify(msg), {
        status: responseCode
      }
    );
  },
};

