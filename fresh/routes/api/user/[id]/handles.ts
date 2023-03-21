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

interface Handle {
  handle: string;
  handleType: string;
}

// Test that a user exists.
// Planetscale/Vitess don't support foreign key constraints so this check must
// live in the app.
const userExists = async (id: number) => {
  const stmt = `SELECT id FROM user WHERE id = :id`;
  const result = await conn.execute(stmt, {id: id});
  if (result.rows?.length > 0) {
    return true;
  }
  return false; // Sane default.
};

// Inserts a user handle into the database.
// Returns the HTTP response and a helpful string message.
const insertHandle = async (userId: number, handle: Handle): [number, string] => {
  if (!userExists(userId)) {
    return [404, `User ID ${userId} not found.`];
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
    return [201, `Created handle ${handle.handle} of type ${handle.handleType} for user ID ${handle.userId}!`];
  } else {
    // Conflict
    return [409, `Handle ${handle.handle} of type ${handle.handleType} already exists for user ID ${handle.userId}.`];
  }
};

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
  // Given the following request body, create a handle record for a user:
  // { "handle": "FairyGodmother", handleType: "twitter" }
  async POST(req) {
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

    let body: Handle;
    try {
      // TODO: Validate the body structure meets our expectation.
      body = await req.json();
    } catch (err) {
      console.log('Error: ', err.message);
      return new Response(JSON.stringify({message: 'Invalid input!'}), { status: 400 });
    }
    // TODO: De-taint input.
    const [responseCode, msg] = await insertHandle(userId, body);
    return new Response(
      JSON.stringify({message: msg}), {
        status: responseCode
      }
    );
  }
};

