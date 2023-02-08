import { Handlers, PageProps } from "$fresh/server.ts";

// The function URL for my toy AWS Lambda.
const lambdaUrl = 'https://safe-badger-75.deno.dev';

interface UserHandle {
  employmentStatus: string;
  handleType: string;
  handle: string;
  user: string;
}

// TODO: Understand this TS construct.
// I generally understand it, but I'm parroting an example I found.
interface UserHandles extends Array<UserHandle>{};

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    // Grab the first part of the pathname to use as input for a user ID.
    // NOTE: No checks for numberness, here.
    const user_id = url.pathname.split('/user/')[1];
    // NOTE: There is no support for failed requests here.
    const userUrl = `${lambdaUrl}/${user_id}`;
    const resp = await fetch(`${lambdaUrl}/${user_id}`);
    const userHandles: UserHandles[] = await resp.json();
    //console.log(userHandles);
    // This will be available at props.data in the page component.
    return ctx.render(userHandles);
  }
}

export default function User({data}: PageProps<UserHandles>) {
  return (
    <main>
      {data.map((userHandle) => (
        <div key={userHandle.handle}>
          <p>User: {userHandle.user}</p>
          {userHandle.employmentStatus &&
          <p>Employment: {userHandle.employmentStatus}</p>
          }
          <p>Handle Type: {userHandle.handleType}</p>
          <p>Handle: {userHandle.handle}</p>
          <hr/>
        </div>
      ))}
    </main>
  );
}
