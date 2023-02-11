//import { Handlers, PageProps } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { connect } from 'https://esm.sh/*@planetscale/database@1.4.0';

// Planetscale config.
// Env vars are expected to be defined in the Deno Deploy project.
const pConfig = {
  host: Deno.env.get('DB_HOST') || '',
  username: Deno.env.get('DB_USER') || '',
  password: Deno.env.get('DB_PASS') || ''
};

const conn = connect(pConfig);

const getUsers = async () => {
  const stmt = `
    SELECT u.id, u.name, u.employmentStatus 
    FROM user AS u
  `;
  const results = await conn.execute(stmt);
  return results.rows;
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const users = await getUsers();
    // This will be available at props.data in the page component.
    return ctx.render(users);
  }
}

export default function Users({data}) {
  //console.log(data);
  return (
    <>
    <Head>
      <meta name="author" content="frantz"/>
      <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css"/>
    </Head>
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/users">Users</a>
      </nav>
    </header>
    <main>
      <article>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Employment Status</th>
          </tr>
        </thead>
        <tbody>
        {data.map((user) => (
          <tr key={user.id}>
            <td><a href={`/user/${user.id}`}>{user.name}</a></td>
            <td>{user.employmentStatus}</td>
          </tr>
        ))}
        </tbody>
      </table>
      </article>
    </main>
    </>
  );
}
