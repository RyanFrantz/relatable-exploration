import { Handlers } from "$fresh/server.ts";
import { connect } from 'https://esm.sh/*@planetscale/database@1.4.0';

// Insert a single user handle.
// curl -v -X POST localhost:5000/api/handle \
//   -d '{}'

// Planetscale config.
// Env vars are expected to be defined in the Deno Deploy project.
const pConfig = {
  host: Deno.env.get('DB_HOST') || '',
  username: Deno.env.get('DB_USER') || '',
  password: Deno.env.get('DB_PASS') || ''
};

const conn = connect(pConfig);

interface Handle {
  username: string;
  userId: number;
  handle: string;
  handleType: string;
}

// Given a handle, return the related user.
const getUserByHandle = async (handle: string) => {
  const stmt = `SELECT user.id, user.name FROM user
    INNER JOIN handles ON handles.user_id = user.id
    WHERE handle = :handle LIMIT 1`
  const result = await conn.execute(stmt, {handle: handle});
  const user = result.rows[0] || {};
  return user;
};

// Test that a user exists.
// Planetscale/Vitess don't support foreign key constraints so this check must
// live in the app.
const getUserId = async (name: string) => {
  const stmt = `SELECT id FROM user WHERE name = :name LIMIT 1`;
  const result = await conn.execute(stmt, {name: name});
  if (result.rows?.length > 0) {
    console.log(result);
    return result.rows[0].id;
  }
  return false; // Sane default.
};

// Inserts a user handle into the database.
// Returns the HTTP response and a helpful string message.
const insertHandle = async (handle: Handle): [number, string] => {
  const userId = await getUserId(handle.username);
  if (!userId) {
    return [404, `User ${handle.username} not found.`];
  }
  handle.userId = userId;
  // The combination of user_id, handle, and handleType is unique.
  // Do nothing when a handle already exists.
  const stmt = `
    INSERT INTO handles (user_id, handle, handleType)
    VALUES(:userId, :handle, :handleType)
    ON DUPLICATE KEY UPDATE id=id
  `;

  const results = await conn.execute(stmt, handle);
  if (results.insertId) {
    // Created
    return [201, `Created handle ${handle.handle} of type ${handle.handleType} for user ${handle.username}!`];
  } else {
    // Conflict
    return [409, `Handle ${handle.handle} of type ${handle.handleType} already exists for user ${handle.username}.`];
  }
};

export const handler: Handlers = {
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
  // TODO: Enforce the expected shape of the body in this request.
  async POST(req) {
    let body;
    try {
      // TODO: Validate the body structure meets our expectation.
      body = await req.json();
    } catch (err) {
      console.log('Error: ', err.message);
      return new Response(JSON.stringify({message: 'Invalid input!'}), { status: 400 });
    }
    // TODO: De-taint input.
    const [responseCode, msg] = await insertHandle(body);
    return new Response(
      JSON.stringify({message: msg}), {
        status: responseCode
      }
    );
  }
};

