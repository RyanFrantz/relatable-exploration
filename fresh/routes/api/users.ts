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

interface User {
  name: string;
  employmentStatus: string;
}

interface Users extends Array<User>{};

// TODO: Add optional 'drop first' support so we can load a fresh batch of
// users, rather than appending to the table.
const insertUsers = async (users: Users) => {
  const stmt = `
    INSERT INTO user (name, employmentStatus) VALUES(:name, :employmentStatus)
  `;

  // TODO: Support a single INSERT with multiple values.
  users.forEach(async (user) => {
    const results = await conn.execute(stmt, user);
    console.log(results.insertId);
  });
};

export const handler: Handlers = {
  GET(req) {
    return new Response('N/A');
  },
  async POST(req) {
    let body;
    try {
      body = await req.json();
    } catch (err) {
      console.log('Error: ', err.message);
      return new Response('Invalid input!', { status: 400 });
    }
    // TODO: De-taint input.
    await insertUsers(body);
    return new Response(JSON.stringify(body));
  }
};

