import { Handlers } from "$fresh/server.ts";
import { connect } from 'https://esm.sh/*@planetscale/database@1.4.0';

// Insert a single user.
// curl -v -X POST localhost:5000/api/user \
//   -d '{"name": "Betty White", "employmentStatus": "fulltime"}'

// Planetscale config.
// Env vars are expected to be defined in the Deno Deploy project.
const pConfig = {
  host: Deno.env.get('DB_HOST') || '',
  username: Deno.env.get('DB_USER') || '',
  password: Deno.env.get('DB_PASS') || ''
};

const conn = connect(pConfig);

// Look up a user.
// Returns a number representing the HTTP response and an object with helpful
// context.
const getUsername = async (userId: number): [number, object] => {
  const stmt = `SELECT name FROM user WHERE id = :userId LIMIT 1`;
  const result = await conn.execute(stmt, {userId: userId});
  if (result.rows.length > 0) {
    const username = result.rows[0].name;
    return [200, {id: userId, name: username}];
  } else {
    return [404, {message: 'User not found'}];
  }
};

// Inserts a user into the database.
// Returns a number representing the HTTP response and an object with helpful
// context.
const insertUser = async (user: User): [number, object] => {
  // `name` should be unique. Do nothing when a name already exists.
  const stmt = `
    INSERT INTO user (name, employmentStatus)
    VALUES(:name, :employmentStatus)
    ON DUPLICATE KEY UPDATE id=id
  `;

  const results = await conn.execute(stmt, user);
  if (results.insertId) {
    // Created
    return [201, {message: `Created record for ${user.name}!`, userId: results.insertId}];
  } else {
    // Conflict
    return [409, {message: `${user.name} already exists.`}];
  }
};

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    // Helps ensure we only match numeric IDs, not all strings.
    const re = /\/api\/user\/(?<userId>\d+)/;
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

    const [responseCode, msg] = await getUsername(userId);
    return new Response(
      JSON.stringify(msg), {
        status: responseCode
      }
    );
  },
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
    const [responseCode, msg] = await insertUser(body);
    return new Response(
      JSON.stringify(msg), {
        status: responseCode
      }
    );
  }
};

