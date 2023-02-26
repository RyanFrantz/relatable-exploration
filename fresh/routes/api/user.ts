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

interface User {
  name: string;
  employmentStatus: string;
}

// Inserts a user into the database.
// Returns a number representing the HTTP response and a helpful string message.
const insertUser = async (user: User): [number, string] => {
  // `name` should be unique. Do nothing when a name already exists.
  const stmt = `
    INSERT INTO user (name, employmentStatus)
    VALUES(:name, :employmentStatus)
    ON DUPLICATE KEY UPDATE id=id
  `;

  const results = await conn.execute(stmt, user);
  if (results.insertId) {
    // Created
    return [201, `Created record for ${user.name}!`];
  } else {
    // Conflict
    return [409, `${user.name} already exists.`];
  }
};

export const handler: Handlers = {
  GET(req) {
    return new Response('N/A');
  },
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
    const [responseCode, msg] = await insertUser(body);
    return new Response(
      JSON.stringify({message: msg}), {
        status: responseCode
      }
    );
  }
};
