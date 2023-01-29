import { Handlers, PageProps } from "$fresh/server.ts";

// The function URL for my toy AWS Lambda.
const lambdaUrl = 'https://7dsgyi7ncu7tn6gzrzzgiobzoq0pykmb.lambda-url.us-east-2.on.aws';

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
  // Guess we don't need the req argument.
  async GET(_, ctx) {
    // NOTE: There is no support for failed requests here.
    const resp = await fetch(lambdaUrl);
    const userHandles: UserHandles[] = await resp.json();
    console.log(userHandles);
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
