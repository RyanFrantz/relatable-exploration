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

// Return all handles for a given username.
const getHandles = async (userId: number) => {
  const stmt = `SELECT handle, handleType from handles WHERE user_id = :userId`;
  const result = await conn.execute(stmt, {userId: userId});
  return result.rows;
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
  async GET(req) {
    const url = new URL(req.url);
    const username = url.searchParams.get('username');
    if (!username) {
      const msg = "Missing or invalid 'username' query parameter";
      return new Response(
        JSON.stringify(msg), {
          status: 400
        }
      );
    }
    const userId = await getUserId(username);
    // Sane default.
    let [responseCode, msg] = [
      404,
      {message: `User ${username} not found`}
    ];

    if (userId) {
      const handles = await getHandles(userId);
      responseCode = 200;
      msg = {username: username, handles: handles}
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

