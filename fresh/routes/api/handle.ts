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
  userId: number;
  handle: string;
  handleType: string;
}

// Test that a user exists.
// Planetscale/Vitess don't support foreign key constraints so this check must
// live in the app.
const userExists = async (userId: number): boolean => {
  const stmt = `SELECT id FROM user WHERE id = :userId`;
  const result = await conn.execute(stmt, {userId: userId});
  if (result.rows?.length > 0) {
    return true;
  }
  return false; // Sane default.
};

// Inserts a user handle into the database.
// Returns a number representing the HTTP response and a helpful string message.
const insertHandle = async (handle: Handle): [number, string] => {
  if (! await userExists(handle.userId)) {
    return [404, `User ID ${handle.userId} not found.`];
  }
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
    return [201, `Created handle ${handle.handle} of type ${handle.handleType} for user ID ${handle.userId}!`];
  } else {
    // Conflict
    return [409, `Handle ${handle.handle} of type ${handle.handleType} already exists for user ID ${handle.userId}.`];
  }
};

export const handler: Handlers = {
  GET(req) {
    return new Response('N/A');
  },
  // TODO: Enforce the expected shape of the body in this request.
  async POST(req) {
    let body;
    try {
      // TODO: Validate the body structure meets our expectation.
      body = await req.json();
    } catch (err) {
      console.log('Error: ', err.message);
      return new Response('Invalid input!', { status: 400 });
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

