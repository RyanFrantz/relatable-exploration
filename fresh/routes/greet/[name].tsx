import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    console.log(ctx.params);
    const resp = ctx.render();
    // To grab query parameters, create a URL object from the req.url property.
    const u = new URL(req.url);
    console.log('dogs:', u.searchParams.get('dogs'));
    console.log('not exist:', u.searchParams.get('nada'));
    return resp;
  }
}

export default function Greet(props: PageProps) {
  return <div>Hello {props.params.name}</div>;
}
