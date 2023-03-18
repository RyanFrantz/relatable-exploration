import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import Footer from "../../components/Footer.tsx";
import UserHandleRow from "../../islands/UserHandleRow.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    // Grab the first part of the pathname to use as input for a user ID.
    // NOTE: No checks for numberness, here.
    const userId = url.pathname.split('/user/')[1];
    // Call ourselves. Add our origin, since we're running in a server context.
    const userUrl = `${url.origin}/api/user/${userId}`;
    const userResp = await fetch(userUrl);
    const user = await userResp.json();
    const userHandleUrl = `${url.origin}/api/user/${userId}/handles`;
    const handleResp = await fetch(userHandleUrl);
    const userHandles = await handleResp.json();
    // This will be available at props.data in the page component.
    const userAndHandles = {
      user: user,
      ...userHandles
    };
    return ctx.render(userAndHandles);
  }
}

export default function User({data}: PageProps) {
  const username = data.user.name;
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
      <section>
      {username || "No handles found."}
      </section>
      <table>
        <thead>
          <tr>
            <th>Handle</th>
            <th>Handle Type</th>
          </tr>
        </thead>
        <tbody>
        {data.handles.map((userHandle) => (
          <UserHandleRow userHandle={userHandle}/>
        ))}
        </tbody>
      </table>
      </article>
    </main>
    <Footer/>
    </>
  );
}
